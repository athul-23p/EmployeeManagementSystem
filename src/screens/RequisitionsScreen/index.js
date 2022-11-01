import {useEffect, useReducer, useState} from 'react';
import {FlatList, ToastAndroid, View} from 'react-native';
import {FAB, Searchbar} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import AppbarWrapper from '../../components/AppbarWrapper';
import {getRequisitions} from '../../services/user.services';
import globalStyles from './../../styles/globalStyles';
import RequisitionCard from './components/RequisitionCard';
import Loader from '../../components/Loader';
import Error from '../../components/Error';
import ListItems from '../../components/ListItems';
import {unsetShouldRefresh} from '../../redux/user/userSlice';
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
  incrementPage: 'incrementPage',
};
const reducer = (state, {type, payload}) => {
  switch (type) {
    case actions.setSearchQuery:
      return {...state, searchQuery: payload};
    case actions.fetchRequistions:
      const {requisitions, pagination} = payload;
      console.log('rd', payload);
      return {
        ...state,
        pagination,
        requisitions: [...state.requisitions, ...requisitions],
        isLoading: false,
      };
    case actions.searchRequisitions: {
      const {requisitions, pagination} = payload;
      return {
        ...state,
        pagination,
        requisitions,
        isLoading: false,
      };
    }
    case actions.enableLoading:
      return {...state, isLoading: true};
    case actions.setError:
      return {...state, error: payload, isLoading: false};
    case actions.dismissError:
      return {...state, error: null};

    default:
      return state;
  }
};

function RequisitionsScreen({navigation}) {
  const [{pagination, requisitions, isLoading, error, searchQuery}, dispatch] =
    useReducer(reducer, initialState);

  const {accessToken} = useSelector(store => store.auth);
  const {shouldRefresh} = useSelector(store => store.user);

  const reduxDispatch = useDispatch();

  // console.log(requisitions);

  const handleSearchInput = text =>
    dispatch({type: actions.setSearchQuery, payload: text});

  const search = () => {
    getRequisitions(accessToken, pagination.currentPage, searchQuery)
      .then(res => {
        console.log('fr', res);
        dispatch({type: actions.searchRequisitions, payload: res.data});
        if (shouldRefresh) {
          reduxDispatch(unsetShouldRefresh());
        }
      })
      .catch(err => {
        dispatch({type: actions.setError, payload: err});
      });
  };

  const renderItem = ({item}) => (
    <RequisitionCard
      token={accessToken}
      requisition={item}
      requestRefresh={search}
    />
  );

  const nextPage = () => {
    console.log('nP ', pagination);
    if (pagination.currentPage + 1 > pagination.totalPage) {
      ToastAndroid.show('End', 1500);
      return;
    }
    getRequisitions(accessToken, pagination.currentPage + 1, searchQuery)
      .then(res => {
        dispatch({type: actions.fetchRequistions, payload: res.data});
      })
      .catch(err => {
        dispatch({type: actions.setError, payload: err});
      });
  };

  useEffect(() => {
    search();
  }, []);

  useEffect(() => {
    if (shouldRefresh) {
      search();
    }
  }, [shouldRefresh]);
  return (
    <AppbarWrapper title="Requisitions">
      <View style={[globalStyles.container]}>
        <View style={[globalStyles.searchBarContainer]}>
          <Searchbar
            placeholder="Search by Title, Heading, Description"
            value={searchQuery}
            onChangeText={handleSearchInput}
            onSubmitEditing={search}
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
          label="Add Requisition"
          uppercase={false}
          onPress={() => navigation.navigate('AddRequisition')}
        />
      </View>
    </AppbarWrapper>
  );
}

export default RequisitionsScreen;
