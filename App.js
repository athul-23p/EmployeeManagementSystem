import {NavigationContainer} from '@react-navigation/native';
import React from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import {Provider as StoreProvider, useSelector} from 'react-redux';
import AuthNavigator from './src/navigators/AuthNavigator';
import TabNavigator from './src/navigators/TabNavigator';
import store from './src/redux/store';
const App = () => {
  return (
    <StoreProvider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <Content />
        </NavigationContainer>
      </PaperProvider>
    </StoreProvider>
  );
};

const Content = () => {
  const {isAuthenticated} = useSelector(store => store.auth);

  return isAuthenticated ? <TabNavigator /> : <AuthNavigator />;
};

const styles = StyleSheet.create({});

export default App;
