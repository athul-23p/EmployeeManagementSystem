import {StyleSheet} from 'react-native';
const support = StyleSheet.create({
  redBorder: {
    borderWidth: 4,
    borderColor: 'red',
  },
  blueBorder: {
    borderWidth: 1,
    borderColor: 'darkblue',
  },
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    padding: 10,

    // borderWidth: 1,
  },
  heading: {
    fontSize: 28,
    fontWeight: '900',
  },
  textInput: {
    marginVertical: 16,
    backgroundColor: 'white',
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
  searchBarContainer: {
    marginVertical: 10,
  },
  searchBar: {padding: 2, borderRadius: 29},
  errroMessage: {
    color: 'darkred',
    fontStyle: 'italic',
  },
  searchBarInput: {
    fontSize: 16,
  },
  button: {
    marginVertical: 5,
  },
  dropdownContainer: {
    borderWidth: 0,
    elevation: 10,
    zIndex: 12000,
  },
  content: {
    flex: 1,
    marginVertical: 10,
  },
});

export default styles;
