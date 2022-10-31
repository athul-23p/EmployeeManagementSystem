import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  Button,
  Surface,
  Title,
  Text,
  Colors,
  ActivityIndicator,
  Portal,
} from 'react-native-paper';
import DeleteDialog from '../../../components/DeleteDialog';
import {deleteRequisitionById} from '../../../services/user.services';

function RequisitionCard({
  requisition: {title, minExpInMonths, heading, id},
  token,
  requestRefresh,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const openDialog = () => setShowDeleteDialog(true);
  const closeDialog = () => setShowDeleteDialog(false);

  const handleDelete = () => {
    setIsLoading(true);
    deleteRequisitionById(token, id)
      .then(res => {
        setIsLoading(false);
        requestRefresh();
      })
      .catch(err => {
        setIsLoading(false);
        setError(error);
        console.log(err);
      });
  };
  return (
    <Surface style={styles.container}>
      <View style={styles.content}>
        <Title>{title}</Title>
        <View style={[styles.row]}>
          <Text style={[styles.inlineLabel]}>Heading</Text>
          <Text style={[styles.bold]}>{heading}</Text>
        </View>
        <View style={[styles.row]}>
          <Text style={[styles.inlineLabel]}>Experience</Text>
          <Text>{minExpInMonths}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Button onPress={() => navigation.navigate('ViewRequisition', {id})}>
          View
        </Button>
        <Button onPress={() => navigation.navigate('UpdateRequisition', {id})}>
          Edit
        </Button>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Button onPress={openDialog}>Delete</Button>
        )}
      </View>
      <Portal>
        <DeleteDialog
          showDeleteDialog={showDeleteDialog}
          closeDialog={closeDialog}
          handleDelete={handleDelete}
        />
      </Portal>
    </Surface>
  );
}
const styles = StyleSheet.create({
  container: {
    elevation: 2,
    padding: 10,
    marginVertical: 5,
    backgroundColor: 'white',
    borderBottomColor: 10,
    borderRadius: 20,
  },
  row: {
    // flexDirection: 'row',
    marginBottom: 10,
  },
  inlineLabel: {
    color: Colors.blueGrey700,
    marginRight: 10,
    fontSize: 12,
  },
  bold: {
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {
    marginLeft: 10,
    marginVertical: 10,
  },
});
export default RequisitionCard;
