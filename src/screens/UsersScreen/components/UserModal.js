import React, {useState} from 'react';
import {ActivityIndicator, Button, Headline, Modal} from 'react-native-paper';
import globalStyles from '../../../styles/globalStyles';
import * as yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import ControllerWrappedInput from '../../../components/ControllerWrappedInput';
import {ToastAndroid, View, Text} from 'react-native';
import Loader from '../../../components/Loader';

const schema = yup.object().shape({
  name: yup.string().required('Required'),
  email: yup.string().required('Required').email('Must be a valid email'),
  phoneNumber: yup.string().length(10, 'Must be a valid number'),
});

function UserModal({
  visible,
  onDismiss,
  title,
  buttonLabel,
  user,
  onSave,
  requestRefresh,
  successMsg,
}) {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
    },
    resolver: yupResolver(schema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = data => {
    console.log(data);
    setIsLoading(true);
    onSave(data)
      .then(res => {
        setIsLoading(false);
        ToastAndroid.show(successMsg, 1500);
        requestRefresh();
        onDismiss();
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err.message);
        setError(err);
      });
  };
  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={[globalStyles.modal, {maxHeight: 480}]}>
      <Headline>{title}</Headline>
      <ControllerWrappedInput
        control={control}
        errors={errors}
        name="name"
        label="Employee Name *"
      />
      <ControllerWrappedInput
        control={control}
        errors={errors}
        name="email"
        label="Employee Email *"
        keyboardType="email-address"
      />
      <ControllerWrappedInput
        control={control}
        errors={errors}
        name="phoneNumber"
        label="Employee Phone no"
        keyboardType="number-pad"
      />
      {isLoading ? (
        <Loader size={'small'} style={{justifyContent: 'center'}} />
      ) : error ? (
        <View style={{alignItems: 'center'}}>
          <Text style={globalStyles.errroMessage}>Something went wrong</Text>
          <Button onPress={() => setError(null)}>Retry</Button>
        </View>
      ) : (
        <Button onPress={handleSubmit(handleSave)}>{buttonLabel}</Button>
      )}
    </Modal>
  );
}

export default UserModal;
