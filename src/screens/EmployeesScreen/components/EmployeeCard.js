import React from 'react';
import {useState} from 'react';
import {View, StyleSheet, ToastAndroid} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Chip,
  Portal,
  Text,
} from 'react-native-paper';
import DeleteDialog from '../../../components/DeleteDialog';
import {
  deleteEmployeesById,
  updateEmployeesById,
} from '../../../services/user.services';
import FormModal from './FormModal';

function EmployeeCard({token, employee, refreshData, handleError}) {
  const {name, email, phoneNumber, designation, technologies, id} = employee;
  const [showDeleteDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <View style={[styles.container]}>
      <View>
        <View>
          <Text style={[styles.name]}>{name}</Text>
          <Text>{designation?.name}</Text>
          <View style={[styles.contactInfo]}>
            <Text>{email}</Text>
            <Text>{phoneNumber}</Text>
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
        <Button onPress={openEditModal}>Edit</Button>
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
  contactInfo: {marginVertical: 4},
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
});
export default EmployeeCard;
