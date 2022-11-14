import {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, ToastAndroid} from 'react-native';
import {
  ActivityIndicator,
  Button,
  FAB,
  Headline,
  Modal,
  Portal,
  Searchbar,
  TextInput,
} from 'react-native-paper';
import * as yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

import AppbarWrapper from '../../components/AppbarWrapper';
import globalStyles from './../../styles/globalStyles';
import {addDesignation, getDesignations} from '../../services/user.services';
import {useDispatch, useSelector} from 'react-redux';
import DesignationCard from './components/DesignationCard';
import Loader from '../../components/Loader';
import Error from '../../components/Error';
import ListItems from '../../components/ListItems';
import {setUpdateDashboard} from '../../redux/user/userSlice';
import ControllerWrappedInput from '../../components/ControllerWrappedInput';

const designationSchema = yup.object().shape({
  designation: yup.string().required('Required'),
});

const firstPage = 0;

function DesignationsScreen({navigation}) {
  const [searchQuery, setSearchQuery] = useState('');

  const [pagination, setPagination] = useState({});
  const [designations, setDesignations] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const {accessToken} = useSelector(store => store.auth);
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      designation: '',
    },
    resolver: yupResolver(designationSchema),
  });
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleAddDesignation = data => {
    setIsLoading(true);
    addDesignation(accessToken, {name: data.designation})
      .then(res => {
        console.log(res);
        setIsLoading(false);
        closeModal();
        ToastAndroid.show(`Added ${res.data.name} to Designations`, 1500);
        dispatch(setUpdateDashboard());
        fetchData(firstPage, true);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const handleSearch = () => {
    setPage(0);
    fetchData(firstPage, true);
  };

  const fetchData = (page = firstPage, clearData = false) => {
    setIsLoading(true);
    getDesignations(accessToken, page, searchQuery)
      .then(res => {
        setIsLoading(false);
        let {pagination, designations} = res.data;

        setPagination(pagination);
        if (clearData) {
          setDesignations(designations);
        } else {
          setDesignations(prev => [...prev, ...designations]);
        }
        // console.log(res);
      })
      .catch(err => {
        setIsLoading(false);
        setIsError(true);
        console.log(err);
      });
  };

  const refreshData = () => {
    fetchData(firstPage, true);
  };

  const nextPage = () => {
    if (pagination?.currentPage < pagination?.totalPage - 1) {
      fetchData(pagination?.currentPage + 1);
    } else {
      ToastAndroid.show('End of list', 1500);
    }
  };

  const renderItem = ({item}) => (
    <DesignationCard item={item} token={accessToken} refresh={refreshData} />
  );
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AppbarWrapper title="Designations">
      <View style={[globalStyles.container]}>
        <View style={[globalStyles.searchBarContainer]}>
          <Searchbar
            placeholder="Search by name"
            onChangeText={setSearchQuery}
            value={searchQuery}
            onSubmitEditing={handleSearch}
            style={[globalStyles.searchBar]}
            inputStyle={[globalStyles.searchBarInput]}
          />
          {/* <View style={[styles.rowEnd]}>
            <Button onPress={clearAll}>Clear All</Button>
          </View> */}
        </View>
        <View style={{minHeight: 200}}>
          {isLoading ? (
            <Loader />
          ) : isError ? (
            <Error handleError={() => setIsError(false)} />
          ) : (
            <ListItems
              data={designations}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              onEndReached={nextPage}
            />
          )}
        </View>
      </View>
      <Portal>
        {/* add designation modal */}
        <Modal
          visible={showModal}
          onDismiss={closeModal}
          contentContainerStyle={[globalStyles.modal]}>
          <Headline style={{marginVertical: 10}}>Add Designation</Headline>
          <ControllerWrappedInput
            control={control}
            name="designation"
            errors={errors}
            label="Designation"
          />
          <View style={[styles.modalButtonGroup]}>
            <Button onPress={closeModal}>Close</Button>
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <Button onPress={handleSubmit(handleAddDesignation)}>Add</Button>
            )}
          </View>
        </Modal>
      </Portal>
      <FAB
        style={[globalStyles.fab]}
        icon="plus"
        label="Add Designation"
        uppercase={false}
        onPress={openModal}
      />
    </AppbarWrapper>
  );
}

const styles = StyleSheet.create({
  searchbarContainer: {
    marginVertical: 10,
    borderWidth: 1,
  },
  rowEnd: {
    marginTop: 5,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  modalButtonGroup: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
export default DesignationsScreen;
