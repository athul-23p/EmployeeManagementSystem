import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import DashBoardScreen from '../screens/DashboardScreen';
import PasswordResetScreen from './../screens/PasswordResetScreen';
import DesignationScreen from './../screens/DesignationScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
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
          } else if ((route.name = 'Designations')) iconName = 'briefcase';
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
        component={DesignationScreen}
        options={{title: 'Designations'}}
      />
      {user.generatedPasswordChangeDate === null &&
        user.role !== 'SUPER_ADMIN' && (
          <Tab.Screen name="PasswordReset" component={PasswordResetScreen} />
        )}
    </Tab.Navigator>
  );
}

export default TabNavigator;
