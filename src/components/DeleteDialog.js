import React from 'react';
import {Dialog, Paragraph, Button} from 'react-native-paper';

function DeleteDialog({showDeleteDialog, handleDelete, closeDialog}) {
  return (
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
  );
}

export default DeleteDialog;
