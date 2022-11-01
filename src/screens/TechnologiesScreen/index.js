import {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, ToastAndroid} from 'react-native';
import {
  Button,
  FAB,
  Headline,
  Modal,
  Portal,
  Searchbar,
  TextInput,
} from 'react-native-paper';
import * as yup from 'yup';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

import AppbarWrapper from '../../components/AppbarWrapper';
import globalStyles from './../../styles/globalStyles';
import {addTechnology, getTechnologies} from '../../services/user.services';
import {useSelector} from 'react-redux';
import TechnologyCard from './components/TechnologyCard';
import Loader from '../../components/Loader';
import Error from '../../components/Error';
import ListItems from '../../components/ListItems';

const schema = yup.object().shape({
  technology: yup.string().required('Required'),
});

function TechnologiesScreen({navigation}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [pagination, setPagination] = useState({});
  const [technologies, setTechnologies] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

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
        setTechnologies([]);
        fetchData();
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const handleSearch = () => {
    setTechnologies([]);
    setPage(0);
    fetchData();
  };

  const fetchData = () => {
    setIsLoading(true);
    getTechnologies(accessToken, page, searchQuery)
      .then(res => {
        setIsLoading(false);
        console.log(res);
        let {pagination, technologies} = res.data;
        console.log(technologies);
        setPagination(pagination);
        setTechnologies(prev => [...prev, ...technologies]);
        // console.log(res);
      })
      .catch(err => {
        setIsLoading(false);
        setIsError(true);
        console.log(err);
      });
  };

  const refreshData = () => {
    setTechnologies([]);
    setPage(0);
    fetchData();
  };

  const nextPage = () => {
    if (page < pagination?.totalPage - 1) {
      setPage(page => page + 1);
      fetchData();
    } else {
      ToastAndroid.show('End of list', 1500);
    }
  };

  const clearAll = () => {
    if (searchQuery) {
      setSearchQuery('');
      handleSearch();
    }
  };
  const renderItem = ({item}) => (
    <TechnologyCard item={item} token={accessToken} refresh={refreshData} />
  );
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AppbarWrapper title="Technologies">
      <View styles={[globalStyles.container]}>
        <View styles={[globalStyles.searchBarContainer]}>
          <Searchbar
            placeholder="Search by name"
            onChangeText={setSearchQuery}
            value={searchQuery}
            onSubmitEditing={handleSearch}
            style={[
              globalStyles.searchBar,
              {marginTop: 15, marginHorizontal: 10},
            ]}
          />
          <View style={[styles.rowEnd]}>
            <Button onPress={clearAll}>Clear All</Button>
          </View>
        </View>
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
      <Portal>
        {/* Technology modal */}
        <Modal
          visible={showModal}
          onDismiss={closeModal}
          contentContainerStyle={[globalStyles.modal]}>
          <Headline style={{marginVertical: 10}}>Add Technology</Headline>
          <Controller
            control={control}
            name="technology"
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                onChangeText={onChange}
                value={value}
                mode="outlined"
                label={'Technology'}
              />
            )}
          />
          {errors.technology && <Text>{errors.technology.message}</Text>}
          <View style={[styles.modalButtonGroup]}>
            <Button onPress={closeModal}>Close</Button>
            <Button onPress={handleSubmit(handleAddTechnology)}>Add</Button>
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
