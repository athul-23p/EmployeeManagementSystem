import React, {useEffect, useReducer, useState} from 'react';
import {View, StyleSheet, ToastAndroid} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {FAB, Searchbar, Switch, Text} from 'react-native-paper';
import {useSelector} from 'react-redux';
import AppbarWrapper from '../../components/AppbarWrapper';
import ListItems from '../../components/ListItems';
import {
  getDesignations,
  getDesignationsCount,
  getEmployees,
  getTechnologies,
  getTechnologiesCount,
} from '../../services/user.services';
import globalStyles from '../../styles/globalStyles';
import EmployeeCard from './components/EmployeeCard';

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
      // designationValue,
      // technologyValues,
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

  const [showAllEmployees, setShowAllEmployees] = useState(true);
  
  const {accessToken} = useSelector(store => store.auth);
  
  const toggleShowAllEmployees = () => setShowAllEmployees(prev => !prev);
  
  

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
  // const setDesignationValue = value => {
  //   let [val] = value();
  //   console.log('sdvalue', value);
  //   dispatch({type: actions.setDesignationValue, payload: val});
  // };

  // const setTechnologyValues = value => {
  //   console.log('set tech value', value());
  //   let val = value();
  //   // dispatch({type: actions.setTechnologyValues, payload: val});
  // };
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

  const refresh = () => {
    dispatch({type: actions.setLoading});
    fetchDesignations(undefined, actions.searchEmployees);
  };

  useEffect(() => {
    fetchDesignations();
    fetchTechnologies();
  }, []);

  useEffect(() => {
    fetchEmployees(undefined, actions.searchEmployees);
  }, [designationValue, technologyValues, showAllEmployees]);

  return (
    <AppbarWrapper title="Employees">
      <View style={[globalStyles.container]}>
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
        <View style={[globalStyles.searchBarContainer]}>
          <Searchbar
            placeholder="Search by name or email"
            style={[globalStyles.searchBar]}
            onChangeText={text =>
              dispatch({type: actions.setSearchQuery, payload: text})
            }
            onSubmitEditing={() => fetchEmployees(1, actions.searchEmployees)}
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
            containerStyle={styles.dropdownContainer}
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
            containerStyle={styles.dropdownContainer}
            badgeDotColors={badgeDotColors}
          />
        </View>
        <View style={{marginVertical: 5}}>
          <ListItems
            data={employees}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            onEndReached={nextPage}
          />
        </View>
        <FAB
          style={[globalStyles.fab]}
          label="Add Employee"
          icon="plus"
          uppercase={false}
        />
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
  dropdownContainer: {
    width: '47%',
  },
});
export default EmployeesScreen;
