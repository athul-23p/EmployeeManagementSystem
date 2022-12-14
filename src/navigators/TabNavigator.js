import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import DashBoardScreen from '../screens/DashboardScreen';
import PasswordResetScreen from './../screens/PasswordResetScreen';
import DesignationsScreen from './../screens/DesignationsScreen';
import TechnologiesScreen from '../screens/TechnologiesScreen';

import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import RequisitionNavigator from './RequisitionNavigator';
import EmployeesScreen from '../screens/EmployeesScreen';
import UsersScreen from '../screens/UsersScreen';
import {ROLES} from '../constants/roles';
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
          else if (route.name == 'RequisitionNavigator') iconName = 'domain';
          else if (route.name == 'Employees')
            iconName = 'badge-account-horizontal';
          else if (route.name == 'Users') iconName = 'account-group';
          return <MaterialIcons size={24} name={iconName} color={color} />;
        },
      })}
      shifting={true}
      activeColor="white"
      barStyle={{backgroundColor: '#6200EE'}}
      initialRouteName={
        user?.role !== ROLES.SUPER_ADMIN &&
        user?.generatedPasswordChangeDate === null
          ? 'PasswordReset'
          : 'Dashboard'
      }>
      <Tab.Screen
        name="Dashboard"
        component={DashBoardScreen}
        options={{title: 'Dashboard'}}
      />
      {user.role === 'SUPER_ADMIN' && (
        <Tab.Screen
          name="Users"
          component={UsersScreen}
          options={{title: 'Users'}}
        />
      )}
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
      <Tab.Screen
        name="Employees"
        component={EmployeesScreen}
        options={{title: 'Employees'}}
      />
    </Tab.Navigator>
  );
}

export default TabNavigator;
