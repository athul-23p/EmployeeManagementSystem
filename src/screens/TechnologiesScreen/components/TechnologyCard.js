import React, {useState} from 'react';
import {View, StyleSheet, ToastAndroid, Text} from 'react-native';
import {
  Headline,
  IconButton,
  Modal,
  Portal,
  Button,
  TextInput,
  ActivityIndicator,
  Colors,
} from 'react-native-paper';
import * as yup from 'yup';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {
  deleteTechnologyById,
  updateTechnologyById,
} from '../../../services/user.services';
import globalStyles from '../../../styles/globalStyles';
import DeleteDialog from '../../../components/DeleteDialog';
import {useDispatch} from 'react-redux';
import {setUpdateDashboard} from '../../../redux/user/userSlice';
import ControllerWrappedInput from '../../../components/ControllerWrappedInput';
const schema = yup.object().shape({
  technology: yup.string().required('Required'),
});
function TechnologyCard({item, token, refresh}) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const openEditModal = () => setShowEditModal(true);
  const closeEditModal = () => setShowEditModal(false);
  const openDialog = () => setShowDeleteDialog(true);
  const closeDialog = () => setShowDeleteDialog(false);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      technology: item.name,
    },
    resolver: yupResolver(schema),
  });

  const handleUpdate = data => {
    setIsLoading(true);
    console.log('update', data);
    updateTechnologyById(token, item.id, {name: data.technology})
      .then(res => {
        // console.log(res);
        ToastAndroid.show('Update Successfull', 1000);
        setIsLoading(false);
        closeEditModal();
        refresh();
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const handleDelete = () => {
    setIsLoading(true);
    deleteTechnologyById(token, item.id)
      .then(res => {
        // console.log(res);
        ToastAndroid.show('Delete Successfull', 1000);
        setIsLoading(false);
        closeDialog();
        dispatch(setUpdateDashboard());
        refresh();
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{item.name}</Text>
      <View style={styles.actions}>
        <IconButton
          icon="square-edit-outline"
          onPress={openEditModal}
          color={Colors.blue800}
        />
        <IconButton icon="delete" onPress={openDialog} color={Colors.red700} />
      </View>
      <Portal>
        <Modal
          visible={showEditModal}
          onDismiss={closeEditModal}
          contentContainerStyle={[globalStyles.modal]}>
          <Headline style={{marginVertical: 10}}>Edit Technology</Headline>
          <ControllerWrappedInput
            control={control}
            name="technology"
            label={'Technology'}
            errors={errors}
          />

          <View style={[styles.modalButtonGroup]}>
            <Button onPress={closeEditModal}>Close</Button>
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <Button onPress={handleSubmit(handleUpdate)}>Update</Button>
            )}
          </View>
        </Modal>
        <DeleteDialog
          showDeleteDialog={showDeleteDialog}
          closeDialog={closeDialog}
          handleDelete={handleDelete}
        />
      </Portal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: 'white',
  },
  actions: {
    flexDirection: 'row',
  },
  modalButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    color: 'black',
  },
});
export default TechnologyCard;
