import React from 'react';
import {FlatList, Text} from 'react-native';
import {useDimensions} from '@react-native-community/hooks';

function ListItems({data, renderItem, keyExtractor, onEndReached}) {
  // const {width, height} = useDimensions().window;
  // console.log(`dimensions h:${height} , w : ${width}`);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListEmptyComponent={() => (
        <Text style={{textAlign: 'center', marginVertical: 20}}>
          No results found
        </Text>
      )}
      onEndReachedThreshold={0.4}
      onEndReached={onEndReached}
      // contentContainerStyle={{height: 800, borderWidth: 1}}
    />
  );
}

export default ListItems;
