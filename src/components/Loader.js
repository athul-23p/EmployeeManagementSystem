import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import globalStyles from '../styles/globalStyles';
function Loader(props) {
  return (
    <View>
      <ActivityIndicator size={'large'} style={globalStyles.loader} />
    </View>
  );
}

export default Loader;
