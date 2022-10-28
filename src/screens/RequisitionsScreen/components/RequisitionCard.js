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
} from 'react-native-paper';
import {deleteDesignationById} from '../../../services/user.services';

function RequisitionCard({
  requisition: {title, minExpInMonths, heading, id},
  token,
  requestRefresh,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const handleDelete = () => {
    setIsLoading(true);
    deleteDesignationById(token, id)
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
        <Button>Edit</Button>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Button onPress={handleDelete}>Delete</Button>
        )}
      </View>
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
