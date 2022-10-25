import React, {useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {Button, TextInput} from 'react-native-paper';
import {View, StyleSheet, Text, ToastAndroid} from 'react-native';
import globalStyle from './../styles/globalStyles';
import {useSelector} from 'react-redux';
import Loader from '../components/Loader';
import Error from '../components/Error';
import {updateUser} from '../services/auth.services';

const passwordSchema = yup.object().shape({
  password: yup.string().required('this field is required').min(8),
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

  const {user, token} = useSelector(store => store.auth);

  const handlePasswordUpdate = update => {
    setIsLoading(true);
    updateUser(token, update)
      .then(res => {
        console.log(res);
        setIsLoading(false);
        ToastAndroid.show('Password updated', 1500);
        navigation.navigate('Dashboard');
      })
      .catch(err => {
        setIsLoading(false);
        setIsError(true);
        console.log('prs',err);
      });
  };
  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <Error handleError={() => setIsError(false)} />;
  }

  return (
    <KeyboardAwareScrollView contentContainerStyle={globalStyle.conatiner}>
      <Text style={[globalStyle.heading, {color: 'black'}]}>
        Reset Password
      </Text>
      <Text style={{marginVertical: 10, color: 'black'}}>
        Reset generated password
      </Text>
      <View style={styles.profile}>
        <Text style={styles.letterImage}>{user.name[0]}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      <Controller
        control={control}
        name="password"
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            onChangeText={onChange}
            value={value}
            mode="outlined"
            secureTextEntry
            label={'Password'}
          />
        )}
      />
      {errors.password && <Text>{errors.password.message}</Text>}
      <Button
        style={{marginVertical: 15}}
        onPress={handleSubmit(handlePasswordUpdate)}>
        Update
      </Button>
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
