import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import DashBoardScreen from '../screens/DashboardScreen';
import PasswordResetScreen from './../screens/PasswordResetScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const Tab = createMaterialBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name == 'PasswordReset') iconName = 'security';
          else if (route.name == 'Dashboard') {
            iconName = 'view-dashboard';
          }

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
      <Tab.Screen name="PasswordReset" component={PasswordResetScreen} />
    </Tab.Navigator>
  );
}

export default TabNavigator;
