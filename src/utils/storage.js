import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (key, value) => {
  return await AsyncStorage.setItem(key, JSON.stringify(value));
};

const getData = async key => {
  let val = await AsyncStorage.getItem(key);
  return JSON.parse(val);
};

const removeData = async key => {
  return await AsyncStorage.removeItem(key);
};

export {storeData, getData, removeData};
