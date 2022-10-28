import React from 'react';
import {FlatList, Text} from 'react-native';

function ListItems({data, renderItem, keyExtractor, onEndReached}) {
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListEmptyComponent={() => (
        <Text style={{textAlign: 'center'}}>No results found</Text>
      )}
      onEndReachedThreshold={0.4}
      onEndReached={onEndReached}
    />
  );
}

export default ListItems;
