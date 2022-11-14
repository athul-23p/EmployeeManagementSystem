import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {Text} from 'react-native-paper';

function StatisticsCard({route, title, stats}) {
  const navigation = useNavigation();
  const navigate = () => navigation.navigate(route);
  return (
    <Pressable
      style={[styles.container]}
      android_ripple={{color: 'lightgray'}}
      onPress={navigate}>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.stats}>{stats}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '44%',
    // maxWidth: 300,
    height: 130,
    padding: 10,
    paddingHorizontal: 15,
    marginTop: 20,
    marginHorizontal: 10,
    elevation: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  title: {
    fontSize: 22,
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  stats: {
    fontSize: 48,
    textAlign: 'right',
  },
});
export default StatisticsCard;
