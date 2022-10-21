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
import {Provider as StoreProvider} from 'react-redux';
import AuthNavigator from './src/navigators/AuthNavigator';
import store from './src/redux/store';
const App = () => {
  return (
    <PaperProvider>
      <StoreProvider store={store}>
        <NavigationContainer>
          <AuthNavigator />
        </NavigationContainer>
      </StoreProvider>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({});

export default App;
