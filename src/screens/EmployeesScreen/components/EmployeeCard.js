import React from 'react';
import {useState} from 'react';
import {View, StyleSheet, ToastAndroid} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Chip,
  IconButton,
  Portal,
  Text,
} from 'react-native-paper';
import DeleteDialog from '../../../components/DeleteDialog';
import {
  deleteEmployeesById,
  updateEmployeesById,
  uploadEmployeeCV,
} from '../../../services/user.services';
import DocumentPicker, {
  isInProgress,
  types,
} from 'react-native-document-picker';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FormModal from './FormModal';

function EmployeeCard({token, employee, refreshData, handleError}) {
  const {name, email, phoneNumber, designation, technologies, id, cv} =
    employee;
  const [showDeleteDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);

  /**
   * file:{
   *    uri:content://URI,
   *    fileCopyUri:// points to local copy of picked file ,
   *    type: MIME type,
   *    name: display name of the file,
   *    size
   * }
   */
  const [showEditModal, setShowEditModal] = useState(false);
  const openEditModal = () => setShowEditModal(true);
  const closeEditModal = () => setShowEditModal(false);

  const openDeleteDialog = () => setShowDialog(true);
  const closeDeleteDialog = () => setShowDialog(false);
  const handleDelete = async () => {
    try {
      setIsLoading(true);
      let data = await deleteEmployeesById(token, id);
      setIsLoading(false);
      ToastAndroid.show('Employee details deleted', 1500);
      refreshData();
    } catch (error) {
      console.log(error);
      handleError(error);
    }
  };

  const handleUpdate = async update => {
    let data = await updateEmployeesById(token, id, update);
    return data;
  };

  const handleUpload = async () => {
    console.log('upload clicked');
    try {
      // pick the file
      const result = await DocumentPicker.pick({
        allowMultiSelection: false,
        type: [types.pdf, types.doc],
      });
      console.log(result);
      setFile(result[0]);

      // create formData
      let data = new FormData();
      data.append('cv', result);

      // setIsLoading(true);
      console.log(data);
      let res = await uploadEmployeeCV(token, id, data);
      // ToastAndroid.show('CV uploaded', 1500);
      // setIsLoading(false);
      console.log(file);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={[styles.container]}>
      <View>
        <View>
          <Text style={[styles.name]}>{name}</Text>
          <Text>{designation?.name}</Text>
          <View style={[styles.contactInfo]}>
            <View style={styles.row}>
              <Icon name="email" style={{marginRight: 10}} size={14} />
              <Text>{email}</Text>
            </View>
            <View style={styles.row}>
              <Icon name="cellphone" style={{marginRight: 10}} size={14} />
              <Text>{phoneNumber}</Text>
            </View>
          </View>
          <View style={[styles.techonologies]}>
            {technologies.map(tech => (
              <Chip key={tech.id} style={{marginHorizontal: 5}}>
                {tech.name}
              </Chip>
            ))}
          </View>
        </View>
      </View>
      <View style={[styles.actions]}>
        <Button onPress={handleUpload} disabled={isLoading}>
          Upload CV
        </Button>
        <Button onPress={openEditModal} disabled={isLoading}>
          Edit
        </Button>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Button onPress={openDeleteDialog}>Delete</Button>
        )}
      </View>
      <Portal>
        <FormModal />
        <DeleteDialog
          showDeleteDialog={showDeleteDialog}
          closeDialog={closeDeleteDialog}
          handleDelete={handleDelete}
        />
        <FormModal
          visible={showEditModal}
          title="Edit employee details"
          hideModal={closeEditModal}
          token={token}
          employee={employee}
          buttonLabel="Update"
          onSave={handleUpdate}
          refresh={refreshData}
        />
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    elevation: 4,
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    // borderWidth: 1,
  },
  name: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '700',
  },
  designation: {},
  contactInfo: {marginVertical: 8},
  techonologies: {
    marginVertical: 4,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default EmployeeCard;
