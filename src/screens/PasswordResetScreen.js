import React, {useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {Button, TextInput} from 'react-native-paper';
import {View, StyleSheet, Text, ToastAndroid} from 'react-native';
import globalStyle from './../styles/globalStyles';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../components/Loader';
import Error from '../components/Error';
import {updateUser} from '../services/auth.services';
import {updateUserData} from '../redux/auth/authSlice';
import ControllerWrappedInput from '../components/ControllerWrappedInput';
import {storeData} from '../utils/storage';
import {AuthKey} from '../constants/storage_keys';

const passwordSchema = yup.object().shape({
  password: yup
    .string()
    .required('Required field')
    .test({
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
        if (!/[!@#$%^&*(),.?":{}|<>]{2,}/.test(value))
          return ctx.createError({
            message: 'Must contain atleast 2 special characters',
          });
        return true;
      },
    }),
});

function PasswordResetScreen({navigation}) {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      password: '',
    },
    resolver: yupResolver(passwordSchema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const {user, accessToken} = useSelector(store => store.auth);
  const dispatch = useDispatch();

  const handlePasswordUpdate = update => {
    setIsLoading(true);
    updateUser(accessToken, update)
      .then(res => {
        setIsLoading(false);
        ToastAndroid.show('Password updated', 1500);
        let user = res.data.data.updatedUser;
        storeData(AuthKey, user)
          .then(() => {
            dispatch(updateUserData(user));
          })
          .catch(err => console.log(err));
        navigation.navigate('Dashboard');
      })
      .catch(err => {
        setIsLoading(false);
        setIsError(true);
        console.log('prs', err);
      });
  };
  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <Error handleError={() => setIsError(false)} />;
  }

  return (
    <KeyboardAwareScrollView contentContainerStyle={globalStyle.container}>
      <Text style={[globalStyle.heading, {color: 'black'}]}>
        Reset Password
      </Text>
      <Text style={{marginVertical: 10, color: 'black'}}>
        Reset generated password
      </Text>
      <View style={{margin: 10, flex: 0.8, justifyContent: 'center'}}>
        <View style={styles.profile}>
          <Text style={styles.letterImage}>{user.name[0]}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
        <ControllerWrappedInput
          control={control}
          name="password"
          secureTextEntry={true}
          errors={errors}
          label="New Password"
        />

        <Button
          style={{marginVertical: 15}}
          onPress={handleSubmit(handlePasswordUpdate)}>
          Update
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
}
const styles = StyleSheet.create({
  profile: {
    marginVertical: 20,
    marginTop: 50,
    alignItems: 'center',
  },
  letterImage: {
    color: 'white',
    backgroundColor: '#6200EE',
    fontSize: 35,
    lineHeight: 61,
    width: 70,
    aspectRatio: 1,
    borderRadius: 25,
    textAlign: 'center',
    elevation: 10,
  },
  email: {
    ...globalStyle.mediumFontSize,
    color: 'black',
    marginTop: 10,
  },
});
export default PasswordResetScreen;
