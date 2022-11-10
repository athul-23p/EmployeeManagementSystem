import React, {useEffect, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {Button, Text} from 'react-native-paper';
import {StyleSheet, ToastAndroid, View} from 'react-native';
import globalStyle from '../../styles/globalStyles';
import {useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {login} from '../../redux/auth/authSlice';
import {login as userLogin} from '../../services/auth.services';

import Loader from '../../components/Loader';
import Error from '../../components/Error';
import {getData, storeData} from '../../utils/storage';
import {AuthKey} from '../../constants/storage_keys';
import ControllerWrappedInput from '../../components/ControllerWrappedInput';

const userSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Enter a valid email address'),
  password: yup.string().required('Password is required'),
});
function LoginScreen({navigation}) {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(userSchema),
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const handleLogin = async data => {
    // console.log('log in', data);
    setIsLoading(true);
    try {
      let res = await userLogin(data);
      const {token, user} = res.data.data;
      const payload = {
        user,
        accessToken: token.access_token,
        isAuthenticated: true,
      };
      await storeData(AuthKey, payload);
      dispatch(login(payload));
      ToastAndroid.show('Log in successfull', 2000);

      setIsLoading(false);
    } catch (error) {
      const {
        response: {status, data},
      } = error;
      console.log(error);

      console.log('err', status, data);
      if (status === 400) {
        setError(data);
      } else {
        setError({message: 'Something went wrong'});
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // load auth data from async storage
    getData(AuthKey)
      .then(val => {
        if (val !== null) dispatch(login(val));
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
        setError({message: 'Error : Async storage get failed'});
      });
  }, []);

  if (isLoading) {
    return <Loader />;
  } else if (error) {
    return <Error error={error} handleError={() => setError(null)} />;
  }
  return (
    <KeyboardAwareScrollView contentContainerStyle={globalStyle.container}>
      <Text
        style={[
          globalStyle.heading,
          {textAlign: 'center', marginVertical: 20},
        ]}>
        Log In
      </Text>
      <View style={styles.loginForm}>
        <View style={styles.imageContainer}>
          <Icon name="account-circle" color="#6200EE" size={50} />
        </View>
        <ControllerWrappedInput
          control={control}
          name="email"
          label="Email"
          errors={errors}
          keyboardType="email-address"
        />

        <ControllerWrappedInput
          control={control}
          name="password"
          label="Password"
          errors={errors}
          secureTextEntry={true}
        />

        <Button onPress={handleSubmit(handleLogin)} loading={isLoading}>
          Log in
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  loginForm: {
    margin: 10,
    padding: 25,
    paddingVertical: 50,
    backgroundColor: 'white',
    elevation: 10,
    borderRadius: 10,
  },
  imageContainer: {
    marginVertical: 15,
    alignItems: 'center',
  },
});
export default LoginScreen;
