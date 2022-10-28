import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import AddRequistionScreen from '../screens/AddRequisitionScreen';
import RequisitionsScreen from '../screens/RequisitionsScreen';
import ViewRequisitionScreen from '../screens/ViewRequisitionScreen';

const Stack = createNativeStackNavigator();

function RequisitionNavigator(props) {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Requisitions" component={RequisitionsScreen} />
      <Stack.Screen name="AddRequisition" component={AddRequistionScreen} />
      <Stack.Screen name="ViewRequisition" component={ViewRequisitionScreen} />
    </Stack.Navigator>
  );
}

export default RequisitionNavigator;
