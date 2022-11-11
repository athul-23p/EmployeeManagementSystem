import React, {useState} from 'react';
import {StatusBar, ToastAndroid, View} from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  Button,
  Headline,
  Menu,
  Modal,
  Portal,
  Text,
  TextInput,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {AuthKey} from '../constants/storage_keys';
import {logout, updateUserData} from '../redux/auth/authSlice';
import {removeData, storeData} from '../utils/storage';
import globalStyles from '../styles/globalStyles';
import * as yup from 'yup';
import {useForm} from 'react-hook-form';
import ControllerWrappedInput from './ControllerWrappedInput';
import {updateUser} from '../services/auth.services';
import {yupResolver} from '@hookform/resolvers/yup';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const schema = yup.object({}).shape(
  {
    name: yup.string().required('Required').min(3),
    phoneNumber: yup.string().when('phoneNumber', {
      is: true,
      then: schema => schema.string().length(10),
      otherwise: schema => schema.nullable(),
    }),
    password: yup.string().when('password', {
      is: val => val !== '',
      then: schema =>
        schema.test({
          name: 'isStrong',
          test(value, ctx) {
            if (!/[a-z]{2,}/.test(value))
              return ctx.createError({
                message: 'Must contain atleast 2 lowercase characters',
              });
            if (!/[A-Z]{2,}/.test(value))
              return ctx.createError({
                message: 'Must contain atleast 2 uppercase characters',
              });
            if (!/\d{2,}/.test(value))
              return ctx.createError({
                message: 'Must contain atleast 2 digits',
              });
            if (!/[!@#$%^&*(),.?":{}|<>\[\]]{2,}/.test(value))
              return ctx.createError({
                message: 'Must contain atleast 2 special characters',
              });
            return true;
          },
        }),
      otherwise: schema => schema.nullable(),
    }),
  },
  [
    ['phoneNumber', 'phoneNumber'],
    ['password', 'password'],
  ],
);

function AppbarWrapper({title, children}) {
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const {accessToken, user} = useSelector(store => store.auth);
  // console.log(user);
  const openProfileModal = () => setShowProfileModal(true);
  const closeProfileModal = () => setShowProfileModal(false);

  const dispatch = useDispatch();
  const openMenu = () => setShowMenu(true);
  const closeMenu = () => setShowMenu(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      name: user?.name,
      phoneNumber: user?.phoneNumber,
      password: '',
    },
    resolver: yupResolver(schema),
  });

  const handleLogout = () => {
    removeData(AuthKey)
      .then(() => {
        dispatch(logout());
        ToastAndroid.show('Log out successfull', 1400);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleUpdate = async data => {
    try {
      closeMenu();
      setIsLoading(true);
      console.log('handleUpdate', data);
      let update = {name: data.name};

      if (data.phoneNumber !== '') update.phoneNumber = data.phoneNumber;
      if (data.password !== '') update.password = data.password;
      let res = await updateUser(accessToken, update);
      let user = res.data.data.updatedUser;
      await storeData(AuthKey, user);
      dispatch(updateUserData(user));
      setIsLoading(false);
      ToastAndroid.show('Updated user details', 1500);
      closeProfileModal();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setError(error);
    }
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <StatusBar backgroundColor={'#6200EE'} barStyle="light-content" />
      <Appbar.Header>
        <Appbar.Content title={title} />
        <Menu
          visible={showMenu}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action
              icon="account-circle-outline"
              onPress={openMenu}
              color="white"
              size={28}
            />
          }>
          <Menu.Item
            icon="account"
            onPress={openProfileModal}
            title="My Profile"
          />
          <Menu.Item icon="logout" onPress={handleLogout} title="Log out" />
        </Menu>
      </Appbar.Header>
      {children}
      <Portal>
        <Modal
          visible={showProfileModal}
          onDismiss={closeProfileModal}
          contentContainerStyle={[
            globalStyles.modal,
            {marginTop: -50, maxHeight: '89%'},
          ]}>
          <Headline style={{textAlign: 'center', marginVertical: 10}}>
            My Profile
          </Headline>

          <KeyboardAwareScrollView>
            <ControllerWrappedInput
              name="name"
              control={control}
              label="Name"
              errors={errors}
            />
            <TextInput
              mode="outlined"
              disabled
              label="Email Address"
              value={user?.email}
              style={[globalStyles.textInput]}
            />
            <ControllerWrappedInput
              name="phoneNumber"
              control={control}
              label="Phone No"
              errors={errors}
              keyboardType="number-pad"
            />
            <ControllerWrappedInput
              name="password"
              control={control}
              label="Change Password"
              errors={errors}
              secureTextEntry={true}
            />
            <TextInput
              mode="outlined"
              label="Role"
              value={user?.role}
              disabled
              style={[globalStyles.textInput]}
            />
            {isLoading ? (
              <ActivityIndicator />
            ) : error ? (
              <View style={{alignItems: 'center'}}>
                <Text>Something went wrong</Text>
                <Button onPress={() => setError(null)}>Dismiss</Button>
              </View>
            ) : (
              <Button onPress={handleSubmit(handleUpdate)}>Update</Button>
            )}
          </KeyboardAwareScrollView>
        </Modal>
      </Portal>
    </View>
  );
}

export default AppbarWrapper;
