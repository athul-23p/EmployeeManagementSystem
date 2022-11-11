import React, {useEffect, useReducer, useState} from 'react';
import {View, StyleSheet, ToastAndroid} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {Button, FAB, Portal, Searchbar, Switch, Text} from 'react-native-paper';
import {useSelector} from 'react-redux';
import AppbarWrapper from '../../components/AppbarWrapper';
import ListItems from '../../components/ListItems';
import {
  addEmployee,
  getDesignations,
  getDesignationsCount,
  getEmployees,
  getTechnologies,
  getTechnologiesCount,
} from '../../services/user.services';
import globalStyles from '../../styles/globalStyles';
import EmployeeCard from './components/EmployeeCard';
import Loader from '../../components/Loader';
import Error from '../../components/Error';
import FormModal from './components/FormModal';

const badgeDotColors = [
  '#e76f51',
  '#00b4d8',
  '#e9c46a',
  '#e76f51',
  '#8ac926',
  '#00b4d8',
  '#e9c46a',
];
const actions = {
  setLoading: 'setLoading',
  setDesignationItems: 'setDesignationItems',
  setDesignationValue: 'setDesignationValue',
  setTechnologiesItems: 'setTechnologiesItems',
  setTechnologyValues: 'setTechnologyValues',
  setError: 'setError',
  dismissError: 'dismissError',
  setSearchQuery: 'setSearchQuery',
  toggleDesignationsDropDown: 'toggleDesignationsDropDown',
  toggleTechnologiesDropDown: 'toggleTechnologiesDropDown',
  fetchEmployees: 'fetchEmployees',
  searchEmployees: 'searchEmployees',
};

const initialState = {
  isLoading: false,
  error: null,
  searchQuery: '',
  pagination: {},
  employees: [],
  designationValue: null,
  designationItems: [],
  technologyValues: [],
  technologyItems: [],
  openDesignations: false,
  openTechnologies: false,
  dropdownLoading: false,
};

const reducer = (state, {type, payload}) => {
  console.log(type, payload);
  switch (type) {
    case actions.setDesignationItems:
      return {...state, designationItems: payload};

    case actions.setDesignationValue:
      return {...state, designationValue: payload};

    case actions.setTechnologiesItems:
      return {...state, technologyItems: payload};

    case actions.setTechnologyValues:
      return {...state, technologyValues: payload};

    case actions.toggleDesignationsDropDown:
      return {
        ...state,
        openDesignations: !state.openDesignations,
        openTechnologies: false,
      };

    case actions.toggleTechnologiesDropDown:
      return {
        ...state,
        openTechnologies: !state.openTechnologies,
        openDesignations: false,
      };

    case actions.fetchEmployees:
      return {
        ...state,
        isLoading: false,
        employees: [...state.employees, ...payload.employees],
        pagination: payload.pagination,
      };

    case actions.searchEmployees:
      return {
        ...state,
        isLoading: false,
        employees: payload.employees,
        pagination: payload.pagination,
      };
    case actions.setError:
      return {...state, isLoading: false, error: payload};
    case actions.dismissError:
      return {...state, error: null};
    case actions.setLoading:
      return {...state, isLoading: true};
    case actions.setSearchQuery:
      return {...state, searchQuery: payload};
    default:
      return state;
  }
};

function EmployeesScreen() {
  const [
    {
      isLoading,
      error,
      searchQuery,
      pagination,
      employees,
      openDesignations,
      openTechnologies,
      dropdownLoading,
      designationItems,
      technologyItems,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const [designationValue, setDesignationValue] = useState(null);
  const [technologyValues, setTechnologyValues] = useState([]);

  const [showAllEmployees, setShowAllEmployees] = useState(false);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);

  const {accessToken} = useSelector(store => store.auth);

  const toggleShowAllEmployees = () => setShowAllEmployees(prev => !prev);
  const openAddEmployeeModal = () => setShowAddEmployeeModal(true);
  const closeAddEmployeeModal = () => setShowAddEmployeeModal(false);

  const onError = error => dispatch({type: actions.setError, payload: error});
  const fetchDesignations = async () => {
    try {
      let count = await getDesignationsCount(accessToken);
      let {
        data: {designations},
      } = await getDesignations(accessToken, 0, '', count);
      let desigs = designations.map(item => ({
        label: item.name,
        value: item.id,
      }));

      dispatch({type: actions.setDesignationItems, payload: desigs});
    } catch (error) {
      console.log(error);
      dispatch({type: actions.setError, error});
    }
  };

  const fetchTechnologies = async () => {
    try {
      let count = await getTechnologiesCount(accessToken);
      let {
        data: {technologies},
      } = await getTechnologies(accessToken, 0, '', count);
      let techs = technologies.map(item => ({
        label: item.name,
        value: item.id,
      }));
      dispatch({type: actions.setTechnologiesItems, payload: techs});
    } catch (error) {
      console.log(error);
      dispatch({type: actions.setError, error});
    }
  };

  const fetchEmployees = async (page = 1, action) => {
    try {
      let {
        data: {employees, pagination},
      } = await getEmployees(
        accessToken,
        showAllEmployees,
        page,
        searchQuery,
        designationValue,
        technologyValues,
      );
      // console.log(data);

      dispatch({
        type: action,
        payload: {employees, pagination},
      });
    } catch (error) {
      console.log('fe', error);
      dispatch({type: actions.setError, payload: error});
    }
  };

  const renderItem = ({item}) => (
    <EmployeeCard
      employee={item}
      token={accessToken}
      refreshData={refresh}
      handleError={onError}
    />
  );

  const nextPage = () => {
    if (pagination && pagination.currentPage + 1 <= pagination?.totalPage) {
      dispatch({type: actions.setLoading});
      fetchEmployees(pagination.currentPage + 1);
      return;
    }
    ToastAndroid.show('End reached', 1500);
  };

  const clearAll = () => {
    setDesignationValue('');
    setTechnologyValues([]);
    dispatch({type: actions.setSearchQuery, payload: ''});
  };

  const handleAddEmployee = async employee => {
    let data = await addEmployee(accessToken, employee);
    return data;
  };
  const refresh = () => {
    dispatch({type: actions.setLoading});
    fetchEmployees(undefined, actions.searchEmployees);
  };

  useEffect(() => {
    fetchDesignations();
    fetchTechnologies();
  }, []);

  useEffect(() => {
    dispatch({type: actions.setLoading});
    fetchEmployees(undefined, actions.searchEmployees);
  }, [designationValue, technologyValues, showAllEmployees]);
  // console.log('tech dd', openTechnologies);
  return (
    <AppbarWrapper title="Employees">
      <View style={[globalStyles.container]}>
        <View style={[globalStyles.searchBarContainer]}>
          <Searchbar
            placeholder="Search by name or email"
            style={[globalStyles.searchBar]}
            onChangeText={text =>
              dispatch({type: actions.setSearchQuery, payload: text})
            }
            onSubmitEditing={() => fetchEmployees(1, actions.searchEmployees)}
            value={searchQuery}
            inputStyle={[globalStyles.searchBarInput]}
          />
        </View>
        <View style={[styles.row, {zIndex: 9991}]}>
          <DropDownPicker
            loading={dropdownLoading}
            placeholder="Designation"
            open={openDesignations}
            value={designationValue}
            items={designationItems}
            setOpen={() => dispatch({type: actions.toggleDesignationsDropDown})}
            setValue={setDesignationValue}
            setItems={fetchDesignations}
            containerStyle={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />
          <DropDownPicker
            loading={dropdownLoading}
            placeholder="Technology"
            multiple={true}
            mode="BADGE"
            min={0}
            max={5}
            open={openTechnologies}
            value={technologyValues}
            items={technologyItems}
            setOpen={() => dispatch({type: actions.toggleTechnologiesDropDown})}
            setItems={fetchTechnologies}
            setValue={setTechnologyValues}
            containerStyle={styles.dropdown}
            badgeDotColors={badgeDotColors}
            dropDownContainerStyle={styles.dropdownContainer}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Button onPress={clearAll}>Clear all</Button>
          <View style={[styles.flexRowEnd]}>
            <Text style={[styles.flexItem, {color: 'grey'}]}>
              Show all employees
            </Text>
            <Switch
              onValueChange={toggleShowAllEmployees}
              value={showAllEmployees}
              style={[styles.flexItem]}
            />
          </View>
        </View>
        <View style={{marginTop: 5, flex: 1}}>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Error handleError={() => dispatch({type: actions.dismissError})} />
          ) : (
            <ListItems
              data={employees}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              onEndReached={nextPage}
            />
          )}
        </View>
        <FAB
          style={[globalStyles.fab]}
          label="Add Employee"
          icon="plus"
          uppercase={false}
          onPress={openAddEmployeeModal}
        />
        <Portal>
          <FormModal
            visible={showAddEmployeeModal}
            hideModal={closeAddEmployeeModal}
            title="Add Employee"
            buttonLabel="Submit"
            token={accessToken}
            onSave={handleAddEmployee}
            refresh={refresh}
          />
        </Portal>
      </View>
    </AppbarWrapper>
  );
}

const styles = StyleSheet.create({
  flexRowEnd: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  flexItem: {
    marginHorizontal: 10,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdown: {
    width: '47%',
  },
  dropdownContainer: {
    borderWidth: 0,
    elevation: 10,
    zIndex: 6000,
    backgroundColor: '#eeeeff',
  },
});
export default EmployeesScreen;
