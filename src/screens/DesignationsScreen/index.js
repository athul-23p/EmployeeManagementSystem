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

import TabScreenWrapper from '../../components/TabScreenWrapper';
import globalStyles from './../../styles/globalStyles';
import {addDesignation, getDesignations} from '../../services/user.services';
import {useSelector} from 'react-redux';
import DesignationCard from './components/DesignationCard';
import Loader from '../../components/Loader';
import Error from '../../components/Error';

const designationSchema = yup.object().shape({
  designation: yup.string().required('Required'),
});

function DesignationsScreen({navigation}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [data, setData] = useState({});

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
      designation: '',
    },
    resolver: yupResolver(designationSchema),
  });
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleSearchInput = value => {
    setSearchQuery(value);
  };

  const handleSearch = () => {
    console.log('submit', searchQuery);
    setIsLoading(true);
    getDesignations(accessToken, 0, searchQuery)
      .then(res => {
        setIsLoading(false);
        setData(res);
        setPage(0);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const handleAddDesignation = data => {
    setIsLoading(true);
    addDesignation(accessToken, {name: data.designation})
      .then(res => {
        console.log(res);
        setIsLoading(false);
        closeModal();
        ToastAndroid.show(`Added ${res.name} to Designations`, 1500);
        fetchData();
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const fetchData = () => {
    setIsLoading(true);
    getDesignations(accessToken, page, searchQuery)
      .then(res => {
        setIsLoading(false);
        setData(res);
        // console.log(res);
      })
      .catch(err => {
        setIsLoading(false);
        setIsError(true);
        console.log(err);
      });
  };

  const refreshData = () => {
    if (page !== 0) {
      setPage(0);
    } else {
      fetchData();
    }
  };

  const renderItem = ({item}) => (
    <DesignationCard item={item} token={accessToken} refresh={refreshData} />
  );
  useEffect(() => {
    fetchData();
  }, [page]);

  if (isLoading) {
    return <Loader />;
  } else if (isError) {
    return <Error handleError={() => setIsError(false)} />;
  }
  return (
    <TabScreenWrapper title="Designations">
      <View styles={[globalStyles.container]}>
        <View styles={[styles.searchbarContainer]}>
          <Searchbar
            placeholder="Search by name"
            onChangeText={handleSearchInput}
            value={searchQuery}
            onSubmitEditing={handleSearch}
            style={{padding: 5, margin: 10, borderRadius: 29}}
          />
          <View style={[styles.rowEnd]}>
            <Button
              onPress={() => {
                setSearchQuery('');
                setPage(0);
                fetchData();
              }}>
              Clear All
            </Button>
          </View>
        </View>
        <FlatList
          data={data?.designations}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
      <Portal>
        {/* add designation modal */}
        <Modal
          visible={showModal}
          onDismiss={closeModal}
          contentContainerStyle={[globalStyles.modal]}>
          <Headline style={{marginVertical: 10}}>Add Designation</Headline>
          <Controller
            control={control}
            name="designation"
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                onChangeText={onChange}
                value={value}
                mode="outlined"
                label={'Designation'}
              />
            )}
          />
          {errors.designation && <Text>{errors.designation.message}</Text>}
          <View style={[styles.modalButtonGroup]}>
            <Button onPress={closeModal}>Close</Button>
            <Button onPress={handleSubmit(handleAddDesignation)}>Add</Button>
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
    </TabScreenWrapper>
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
