import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    padding: 10,
    backgroundColor: 'white',
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
