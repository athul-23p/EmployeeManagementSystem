import {useEffect, useReducer, useState} from 'react';
import {FlatList, View} from 'react-native';
import {FAB, Searchbar} from 'react-native-paper';
import {useSelector} from 'react-redux';
import AppbarWrapper from '../../components/AppbarWrapper';
import {getRequisitions} from '../../services/user.services';
import globalStyles from './../../styles/globalStyles';
import RequisitionCard from './components/RequisitionCard';
import Loader from '../../components/Loader';
import Error from '../../components/Error';
import ListItems from '../../components/ListItems';
const initialState = {
  searchQuery: '',
  isLoading: false,
  error: null,
  requisitions: [],
  pagination: {
    currenPage: 0,
  },
};

const actions = {
  setSearchQuery: 'setSearchQuery',
  fetchRequistions: 'fetchRequistions',
  searchRequisitions: 'searchRequisitions',
  enableLoading: 'enableLoading',
  setError: 'setError',
  dismissError: 'dismissError',
  incrementPage:'incrementPage'

};
const reducer = (state, {type, payload}) => {
  switch (type) {
    case 'setSearchQuery':
      return {...state, searchQuery: payload};
    case 'fetchRequistions':
      const {requisitions, pagination} = payload;
      console.log('rd', payload);
      return {
        ...state,
        pagination,
        requisitions: [...state.requisitions, ...requisitions],
        isLoading: false,
      };
    case 'searchRequisitions': {
      const {requisitions, pagination} = payload;
      return {
        ...state,
        pagination,
        requisitions,
        isLoading: false,
      };
    }
    case 'enableLoading':
      return {...state, isLoading: true};
    case 'setError':
      return {...state, error: payload, isLoading: false};
    case 'dismissError':
      return {...state, error: null};
    
    default:
      return state;
  }
};

function RequisitionsScreen({navigation}) {
  const [{pagination, requisitions, isLoading, error, searchQuery}, dispatch] =
    useReducer(reducer, initialState);
  const {accessToken} = useSelector(store => store.auth);
  console.log(requisitions);

  const handleSearchInput = text =>
    dispatch({type: actions.setSearchQuery, payload: text});

  const renderItem = ({item}) => (
    <RequisitionCard token={accessToken} requisition={item} />
  );

  const nextPage = () => {};
  useEffect(() => {
    getRequisitions(accessToken, pagination.currentPage, searchQuery)
      .then(res => {
        console.log('fr', res);
        dispatch({type: actions.searchRequisitions, payload: res.data});
      })
      .catch(err => {
        dispatch({type: actions.setError, payload: err});
      });
  }, []);

  return (
    <AppbarWrapper title="Requisitions">
      <View style={[globalStyles.container]}>
        <View style={[globalStyles.searchBarContainer]}>
          <Searchbar
            placeholder="Search by Title, Heading, Description"
            value={searchQuery}
            onChangeText={handleSearchInput}
            style={[globalStyles.searchBar]}
          />
        </View>
        <View>
          {isLoading ? (
            <Loader />
          ) : error !== null ? (
            <Error handleError={() => dispatch({type: actions.dismissError})} />
          ) : (
            <ListItems
              data={requisitions}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              onEndReached={nextPage}
            />
          )}
        </View>
        <FAB
          icon="plus"
          style={globalStyles.fab}
          onPress={() => navigation.navigate('AddRequisition')}
        />
      </View>
    </AppbarWrapper>
  );
}

export default RequisitionsScreen;
