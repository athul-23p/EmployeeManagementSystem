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
  ActivityIndicator,
  Colors,
} from 'react-native-paper';
import * as yup from 'yup';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {
  deleteDesignationById,
  updateDesignationById,
} from '../../../services/user.services';
import globalStyles from '../../../styles/globalStyles';
const schema = yup.object().shape({
  designation: yup.string().required('Required'),
});
function DesignationCard({item, token, refresh}) {
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

  const handleUpdate = data => {
    setIsLoading(true);
    updateDesignationById(token, item.id, {name: data.designation})
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
    deleteDesignationById(token, item.id)
      .then(res => {
        // console.log(res);
        ToastAndroid.show('Delete Successfull', 1000);
        setIsLoading(false);
        closeDialog();
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
          <Headline style={{marginVertical: 10}}>Edit Designation</Headline>
          <Controller
            control={control}
            name="designation"
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                onChangeText={onChange}
                value={value}
                mode="outlined"
                label={'Designation'}
                style={globalStyles.textInput}
              />
            )}
          />
          {errors.designation && <Text>{errors.designation.message}</Text>}
          <View style={[styles.modalButtonGroup]}>
            <Button onPress={closeEditModal}>Close</Button>
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <Button onPress={handleSubmit(handleUpdate)}>Update</Button>
            )}
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
export default DesignationCard;
