import React from 'react';
import {View, Text} from 'react-native';
import {Button} from 'react-native-paper';
import globalStyles from '../styles/globalStyles';

/**
 *
 * @param {* }
 * error : {message : string}
 * handleError : callback dismiss error
 * @returns
 */
function Error({error, handleError}) {
  console.log(error);
  return (
    <View style={globalStyles.center}>
      <View>
        <Text style={{marginVertical: 10}}>
          {error?.message ? error.message : 'Oops, Something went wrong'}
        </Text>
        <Button mode="contained" onPress={handleError}>
          Retry
        </Button>
      </View>
    </View>
  );
}

export default Error;
