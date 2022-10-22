import React from 'react';
import {View, Text} from 'react-native';
import {Button} from 'react-native-paper';
import globalStyles from '../styles/globalStyles';
function Error({error, handleError}) {
  return (
    <View style={globalStyles.center}>
      <View>
        <Text>Opps, Something went wrong</Text>
        <Button mode="contained" onPress={handleError}>
          Retry
        </Button>
      </View>
    </View>
  );
}

export default Error;
