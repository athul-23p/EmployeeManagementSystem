import React, {useState} from 'react';
import {View, StyleSheet, ToastAndroid} from 'react-native';
import {Button, Portal, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch} from 'react-redux';
import DeleteDialog from '../../../components/DeleteDialog';
import Error from '../../../components/Error';
import Loader from '../../../components/Loader';
import {setUpdateDashboard} from '../../../redux/user/userSlice';
import {
  deleteAdminById,
  updateAdminById,
} from '../../../services/user.services';
import globalStyles from '../../../styles/globalStyles';
// import UserModal from './UserModal';

const SIZE = 20;
const COLOR = 'darkorchid';

/**
 *
 * @param {user} : object containing user details
 * @param {token}  : access token
 * @param {requestRefresh} : callback used to refetch data from server
 * @returns
 */

function UserCard({user, token, requestRefresh}) {
  const {name, email, phoneNumber} = user;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  // const [showEditModal, setShowEditModal] = useState(false);

  const dispatch = useDispatch();

  // helper function to open & close delete dialog
  const openDeleteDialog = () => setShowDeleteDialog(true);
  const closeDeleteDialog = () => setShowDeleteDialog(false);

  // const openEditModal = () => setShowEditModal(true);
  // const closeEditModal = () => setShowEditModal(false);

  const deleteUser = async () => {
    try {
      setIsLoading(true);
      closeDeleteDialog();
      console.log('dU', user.id);
      let data = await deleteAdminById(token, user.id);
      setIsLoading(false);
      ToastAndroid.show('User deleted sucessfully', 1400);
      dispatch(setUpdateDashboard());
      requestRefresh();
    } catch (error) {
      setIsLoading(false);
      setError(error);
    }
  };

  return (
    <View style={[styles.container]}>
      <Text style={[styles.name]}>{name}</Text>
      <View>
        <View style={[styles.row]}>
          <Icon name="mail" color={COLOR} size={SIZE} style={styles.icon} />
          <Text>{email}</Text>
        </View>
        {phoneNumber && (
          <View style={[styles.row]}>
            <Icon
              name="phone-portrait"
              color={COLOR}
              size={SIZE}
              style={styles.icon}
            />
            <Text>{phoneNumber}</Text>
          </View>
        )}
      </View>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Error error={error} handleError={() => setError(null)} />
      ) : (
        <View style={[styles.actions]}>
          <Button disabled>Edit</Button>
          <Button onPress={openDeleteDialog}>Delete</Button>
        </View>
      )}

      <Portal>
        <DeleteDialog
          showDeleteDialog={showDeleteDialog}
          handleDelete={deleteUser}
          closeDialog={closeDeleteDialog}
        />
        {/* <UserModal
          visible={showEditModal}
          onDismiss={closeEditModal}
          buttonLabel="Update"
          successMsg="User details updated"
          title="Edit User Details"
          requestRefresh={requestRefresh}
          user={user}
          onSave={updateUser}
        /> */}
      </Portal>
    </View>
  );
}
const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    elevation: 4,
    backgroundColor: 'white',
    marginHorizontal: 5,
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  name: {
    ...globalStyles.mediumFontSize,
    fontWeight: '800',
    marginBottom: 15,
  },
});
export default UserCard;
