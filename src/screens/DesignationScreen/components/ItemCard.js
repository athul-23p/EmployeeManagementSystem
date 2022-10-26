import React, {useState} from 'react';
import {View, StyleSheet, ToastAndroid, Text} from 'react-native';
import {
  Headline,
  IconButton,
  Modal,
  Portal,
  Button,
  TextInput,
  Dialog,
  Paragraph,
} from 'react-native-paper';
import * as yup from 'yup';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {
  deleteDesignationById,
  updateDesignationById,
} from '../../../services/user.services';
import globalStyles from './../../../styles/globalStyles';
const schema = yup.object().shape({
  designation: yup.string().required('Required'),
});
function ItemCard({item, token, refresh}) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
      designation: item.name,
    },
    resolver: yupResolver(schema),
  });

  const handleUpdate = designation => {
    setIsLoading(true);
    updateDesignationById(token, item.id, {name: designation})
      .then(res => {
        console.log(res);
        ToastAndroid.show('Update Successfull', 1000);
        setIsLoading(false);
        closeEditModal();
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const handleDelete = () => {
    setIsLoading(true);
    deleteDesignationById(token, item.id)
      .then(res => {
        console.log(res);
        ToastAndroid.show('Delete Successfull', 1000);
        setIsLoading(false);
        closeDialog();
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  return (
    <View style={styles.container}>
      <Text>{item.name}</Text>
      <View style={styles.actions}>
        <IconButton icon="square-edit-outline" onPress={openEditModal} />
        <IconButton icon="delete" onPress={openDialog} />
      </View>
      <Portal>
        <Modal
          visible={showEditModal}
          onDismiss={closeEditModal}
          contentContainerStyle={[globalStyles.modal]}>
          <Headline>Edit Designation</Headline>
          <Controller
            control={control}
            name="designation"
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                onChangeText={onChange}
                value={value}
                mode="outlined"
                label={'Designation'}
              />
            )}
          />
          {errors.designation && <Text>{errors.designation.message}</Text>}
          <View style={[styles.modalButtonGroup]}>
            <Button onPress={closeEditModal}>Close</Button>
            <Button onPress={handleSubmit(handleUpdate)} loading={isLoading}>
              Update
            </Button>
          </View>
        </Modal>
        <Dialog visible={showDeleteDialog} onDismiss={closeDialog}>
          <Dialog.Title>Confirm Delete</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Are you sure you want to delete ?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeDialog}>Cancel</Button>
            <Button onPress={handleDelete}>Confirm</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 10,
    elevation: 10,
    backgroundColor: 'white',
  },
  actions: {
    flexDirection: 'row',
  },
  modalButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
export default ItemCard;
