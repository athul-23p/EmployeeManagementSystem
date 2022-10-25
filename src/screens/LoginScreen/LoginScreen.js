import React, {useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {Button, Text, TextInput} from 'react-native-paper';
import {StyleSheet, ToastAndroid, View} from 'react-native';
import globalStyle from '../../styles/globalStyles';
import {useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {login} from '../../redux/auth/authSlice';
import {login as userLogin} from '../../services/auth.services';

import Loader from '../../components/Loader';
import Error from '../../components/Error';

const userSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Enter a valid email address'),
  password: yup.string().required('Password is required'),
});
function LoginScreen({navigation}) {
  // console.log('URL', API_BASE_URL, Config.REACT_APP_BASE_URL);
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
  const [isError, setIsError] = useState(false);
  const dispatch = useDispatch();
  const handleLogin = data => {
    // console.log('log in', data);
    setIsLoading(true);

    userLogin(data)
      .then(res => {
        console.log(res.data);
        setIsLoading(false);
        const {token, user} = res.data.data;
        const payload = {
          user,
          accessToken: token.access_token,
          isAuthenticated: true,
        };
        // console.log(payload);
        dispatch(login(payload));

        // admin logging in for the first time
        // if (
        //   user.generatedPasswordChangeDate === null &&
        //   user.role != ROLES.SUPER_ADMIN
        // ) {
        //   navigation.navigate('PasswordReset');
        // } else {

        // }
        ToastAndroid.show('Log in successfull', 2000);
      })
      .catch(err => {
        console.log(err);
        setIsError(true);
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <Error handleError={() => setIsError(false)} />;
  }
  return (
    <KeyboardAwareScrollView contentContainerStyle={globalStyle.conatiner}>
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
