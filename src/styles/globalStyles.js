import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
    borderWidth: 1,
  },
  heading: {
    fontSize: 28,
    fontWeight: '900',
  },
  textInput: {
    marginVertical: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediumFontSize: {
    fontSize: 18,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  modal: {
    marginHorizontal: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
  },
});

export default styles;
