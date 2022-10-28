import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import DashBoardScreen from '../screens/DashboardScreen';
import PasswordResetScreen from './../screens/PasswordResetScreen';
import DesignationsScreen from './../screens/DesignationsScreen';
import TechnologiesScreen from '../screens/TechnologiesScreen';

import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import RequisitionNavigator from './RequisitionNavigator';
const Tab = createMaterialBottomTabNavigator();

function TabNavigator() {
  const {user} = useSelector(store => store.auth);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name == 'PasswordReset') {
            iconName = 'security';
          } else if (route.name == 'Dashboard') {
            iconName = 'view-dashboard';
          } else if (route.name == 'Designations') iconName = 'briefcase';
          else if (route.name == 'Technologies') iconName = 'code-tags';
          else if ((route.name = 'RequisitionNavigator')) iconName = 'domain';
          return <MaterialIcons size={24} name={iconName} color={color} />;
        },
      })}
      shifting={true}
      activeColor="white"
      barStyle={{backgroundColor: '#6200EE'}}>
      <Tab.Screen
        name="Dashboard"
        component={DashBoardScreen}
        options={{title: 'Dashboard'}}
      />
      <Tab.Screen
        name="Designations"
        component={DesignationsScreen}
        options={{title: 'Designations'}}
      />
      <Tab.Screen name="Technologies" component={TechnologiesScreen} />
      {user.generatedPasswordChangeDate === null &&
        user.role !== 'SUPER_ADMIN' && (
          <Tab.Screen name="PasswordReset" component={PasswordResetScreen} />
        )}
      <Tab.Screen
        name="RequisitionNavigator"
        component={RequisitionNavigator}
        options={{title: 'Requisitions'}}
      />
    </Tab.Navigator>
  );
}

export default TabNavigator;
