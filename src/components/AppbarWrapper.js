import React, {useState} from 'react';
import {StatusBar, ToastAndroid, View} from 'react-native';
import {Appbar, Menu} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {AuthKey} from '../constants/storage_keys';
import {logout} from '../redux/auth/authSlice';
import {removeData} from '../utils/storage';

function AppbarWrapper({title, children}) {
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useDispatch();
  const openMenu = () => setShowMenu(true);
  const closeMenu = () => setShowMenu(false);
  const handleLogout = () => {
    removeData(AuthKey)
      .then(() => {
        dispatch(logout());
        ToastAndroid.show('Log out successfull', 1400);
      })
      .catch(err => {
        console.log(err);
      });
  };
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar backgroundColor={'#6200EE'} barStyle="light-content" />
      <Appbar.Header>
        <Appbar.Content title={title} />
        <Menu
          visible={showMenu}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action
              icon="account-circle-outline"
              onPress={openMenu}
              color="white"
              size={28}
            />
          }>
          <Menu.Item
            icon="account"
            onPress={() => {
              console.log('my profile');
            }}
            title="My Profile"
          />
          <Menu.Item icon="logout" onPress={handleLogout} title="Log out" />
        </Menu>
      </Appbar.Header>
      {children}
    </View>
  );
}

export default AppbarWrapper;
