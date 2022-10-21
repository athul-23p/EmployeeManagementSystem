import React from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {Button, TextInput} from 'react-native-paper';
import {View, Image, StyleSheet, Text} from 'react-native';

const passwordSchema = yup.object().shape({
  password: yup.string().required('this field is required').min(8),
});
function PasswordResetScreen(props) {
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
  return (
    <KeyboardAwareScrollView>
      <Text>Reset Password</Text>
      <View>
        <Image />
        <Text>User name</Text>
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
      <Button>Update</Button>
    </KeyboardAwareScrollView>
  );
}
const styles = StyleSheet.create({});
export default PasswordResetScreen;
