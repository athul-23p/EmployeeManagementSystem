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
import {addTechnology, getTechnologies} from '../../services/user.services';
import {useDispatch, useSelector} from 'react-redux';
import TechnologyCard from './components/TechnologyCard';
import Loader from '../../components/Loader';
import Error from '../../components/Error';
import ListItems from '../../components/ListItems';
import {setUpdateDashboard} from '../../redux/user/userSlice';
import ControllerWrappedInput from '../../components/ControllerWrappedInput';

const schema = yup.object().shape({
  technology: yup.string().required('Required'),
});

const firstPage = 0;
function TechnologiesScreen({navigation}) {
  const [searchQuery, setSearchQuery] = useState('');

  const [pagination, setPagination] = useState({});
  const [technologies, setTechnologies] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const dispatch = useDispatch();
  const {accessToken} = useSelector(store => store.auth);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      technology: '',
    },
    resolver: yupResolver(schema),
  });
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const handleAddTechnology = data => {
    setIsLoading(true);
    addTechnology(accessToken, {name: data.technology})
      .then(res => {
        console.log(res);
        setIsLoading(false);
        closeModal();
        ToastAndroid.show(`Added ${res.data.name} to technologies`, 1500);
        fetchTechnologies(firstPage, true);
        dispatch(setUpdateDashboard());
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const handleSearch = () => {
    fetchTechnologies(firstPage, true);
  };

  const fetchTechnologies = (_page = 0, clearPrevData = false) => {
    setIsLoading(true);
    getTechnologies(accessToken, _page, searchQuery)
      .then(res => {
        setIsLoading(false);
        console.log(res);
        let {pagination, technologies} = res.data;
        console.log(technologies);
        setPagination(pagination);
        if (clearPrevData) {
          setTechnologies(technologies);
        } else {
          setTechnologies(prev => [...prev, ...technologies]);
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
    fetchTechnologies(firstPage, true);
  };

  const nextPage = () => {
    if (pagination.curretPage < pagination?.totalPage - 1) {
      fetchTechnologies(pagination.curretPage + 1);
    } else {
      ToastAndroid.show('End of list', 1500);
    }
  };

  const renderItem = ({item}) => (
    <TechnologyCard item={item} token={accessToken} refresh={refreshData} />
  );
  useEffect(() => {
    fetchTechnologies(firstPage);
  }, []);

  return (
    <AppbarWrapper title="Technologies">
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
              data={technologies}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              onEndReached={nextPage}
            />
          )}
        </View>
      </View>
      <Portal>
        {/* Technology modal */}
        <Modal
          visible={showModal}
          onDismiss={closeModal}
          contentContainerStyle={[globalStyles.modal]}>
          <Headline style={{marginVertical: 10}}>Add Technology</Headline>
          <ControllerWrappedInput
            control={control}
            name="technology"
            label={'Technology'}
            errors={errors}
          />

          <View style={[styles.modalButtonGroup]}>
            <Button onPress={closeModal}>Close</Button>
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <Button onPress={handleSubmit(handleAddTechnology)}>Add</Button>
            )}
          </View>
        </Modal>
      </Portal>
      <FAB
        style={[globalStyles.fab]}
        icon="plus"
        label="Add Technology"
        uppercase={false}
        onPress={openModal}
      />
    </AppbarWrapper>
  );
}
const styles = StyleSheet.create({
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
export default TechnologiesScreen;
