import React, {useEffect, useReducer, useState} from 'react';
import {ToastAndroid, View} from 'react-native';
import {FAB, Portal, Searchbar} from 'react-native-paper';
import {useSelector} from 'react-redux';

import AppbarWrapper from '../../components/AppbarWrapper';
import Error from '../../components/Error';
import ListItems from '../../components/ListItems';
import Loader from '../../components/Loader';
import {addAdmin, getAllAdmins} from '../../services/user.services';
import globalStyles from '../../styles/globalStyles';
import UserModal from './components/UserModal';
import UserCard from './components/UserCard';

const initialState = {
  searchQuery: '',
  pagination: null,
  users: [],
  isLoading: false,
  modalVisible: false,
};

const actions = {
  setIsLoading: 'setIsLoading',
  setError: 'setError',
  dismissError: 'dismissError',
  setSearchQuery: 'setSearchQuery',
  fetchUsers: 'fetchUsers',
  searchUsers: 'searchUsers',
  openModal: 'openModal',
  closeModal: 'closeModal',
};

const reducer = (state, {type, payload}) => {
  switch (type) {
    case actions.setIsLoading:
      return {...state, isLoading: true};
    case actions.setError:
      return {...state, isLoading: false, error: payload};
    case actions.dismissError:
      return {...state, error: null};
    case actions.setSearchQuery:
      return {...state, searchQuery: payload};
    case actions.fetchUsers:
      return {
        ...state,
        isLoading: false,
        users: [...state.users, ...payload.users],
        pagination: payload.pagination,
      };
    case actions.searchUsers:
      return {
        ...state,
        isLoading: false,
        users: payload.users,
        pagination: payload.pagination,
      };
    case actions.openModal:
      return {...state, modalVisible: true};
    case actions.closeModal:
      return {...state, modalVisible: false};
    default:
      return state;
  }
};
function UsersScreen(props) {
  const [
    {searchQuery, pagination, users, isLoading, error, modalVisible},
    dispatch,
  ] = useReducer(reducer, initialState);

  const {accessToken} = useSelector(store => store.auth);

  const openModal = () => dispatch({type: actions.openModal});
  const closeModal = () => dispatch({type: actions.closeModal});
  const loading = () => dispatch({type: actions.setIsLoading});
  const fetchUsers = async (page, action) => {
    try {
      loading();
      let res = await getAllAdmins(accessToken, page, searchQuery);
      let {
        data: {pagination, users},
      } = res;
      dispatch({type: action, payload: {pagination, users}});
    } catch (error) {
      dispatch({type: actions.setError, payload: error});
    }
  };

  const renderItem = ({item}) => (
    <UserCard user={item} requestRefresh={refresh} token={accessToken} />
  );
  const handleInput = value => {
    console.log(value);
    dispatch({type: actions.setSearchQuery, payload: value});
  };
  const nextPage = () => {
    if (pagination?.currentPage + 1 <= pagination?.totalPage) {
      fetchUsers(pagination.currentPage + 1, actions.fetchUsers);
      return;
    }
    ToastAndroid.show('End of list', 1500);
  };

  const refresh = () => {
    fetchUsers(1, actions.searchUsers);
  };
  const addUser = async data => {
    let res = await addAdmin(accessToken, data);
    return res;
  };
  useEffect(() => {
    fetchUsers(1, actions.searchUsers);
  }, []);
  return (
    <AppbarWrapper title="Users">
      <View style={[globalStyles.container]}>
        <Searchbar
          placeholder="Search by name or email"
          style={[globalStyles.searchBar]}
          onChangeText={handleInput}
          onSubmitEditing={() => fetchUsers(1, actions.searchUsers)}
        />
        <View style={{minHeight: 200}}>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Error
              error={error}
              handleError={() => dispatch({type: actions.dismissError})}
            />
          ) : (
            <ListItems
              data={users}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              onEndReached={nextPage}
            />
          )}
        </View>
        <FAB
          icon="plus"
          style={[globalStyles.fab]}
          label="Add User"
          uppercase={false}
          onPress={openModal}
        />
      </View>
      <Portal>
        <UserModal
          visible={modalVisible}
          onDismiss={closeModal}
          title="Add User"
          buttonLabel="Submit"
          onSave={addUser}
          requestRefresh={refresh}
          successMsg="Added User"
        />
      </Portal>
    </AppbarWrapper>
  );
}

export default UsersScreen;
