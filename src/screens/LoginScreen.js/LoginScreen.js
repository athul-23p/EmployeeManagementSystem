import React, {useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {Button, Text, TextInput} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import globalStyle from '../../styles/globalStyles';
import {useDispatch} from 'react-redux';
import {API_BASE_URL} from '../../config/api';
import {login} from '../../redux/auth/authSlice';
import axios from 'axios';

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
  const [isLoading, setIsLoading] = useState(false);
  //   const url = 'https://reqres.in/api/login';
  const dispatch = useDispatch();
  const handleLogin = data => {
    console.log('log in', data);
    // setIsLoading(true);
    // fetch(`${API_BASE_URL}/users/login`, {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: data,
    // })
    //   .then(res => res.json())
    //   .then(data => {
    //     console.log('data', data);
    //     // const {token} = data;
    //     // dispatch(login({token:{}}))
    //     setIsLoading(false);
    //   })
    //   .catch(err => {
    //     console.log('err', err);
    //     setIsLoading(false);
    //   });
    axios
      .post(`${API_BASE_URL}/users/login`, data)
      .then(res => {
        console.log(res);
      })
      .catch(err => console.log(err));
  };
  return (
    <KeyboardAwareScrollView contentContainerStyle={globalStyle.conatiner}>
      <Text
        style={[
          globalStyle.heading,
          {textAlign: 'center', marginVertical: 20},
        ]}>
        Log In
      </Text>
      {isLoading && <Text>Loading...</Text>}
      <View style={styles.loginForm}>
        <Controller
          control={control}
          name="email"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              label={'Email'}
              value={value}
              onChangeText={onChange}
              mode="outlined"
              style={globalStyle.textInput}
            />
          )}
        />
        {errors.email && <Text>{errors.email.message}</Text>}
        <Controller
          control={control}
          name="password"
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              label={'Password'}
              value={value}
              onChangeText={onChange}
              mode="outlined"
              secureTextEntry
              style={globalStyle.textInput}
            />
          )}
        />
        {errors.password && <Text>{errors.password.message}</Text>}
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
    padding: 20,
    paddingVertical: 50,
    backgroundColor: 'white',
    elevation: 10,
    borderRadius: 10,
  },
});
export default LoginScreen;
