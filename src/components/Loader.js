import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import globalStyles from '../styles/globalStyles';
function Loader({size,style}) {
  return (
    <View style={[globalStyles.center, {flex: 1},style]}>
      <ActivityIndicator size={size ? size : 'large'} />
    </View>
  );
}

export default Loader;
