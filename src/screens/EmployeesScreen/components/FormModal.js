import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {ScrollView, StyleSheet, ToastAndroid, View} from 'react-native';
import {
  Button,
  Headline,
  Modal,
  TextInput,
  Text,
  ActivityIndicator,
} from 'react-native-paper';
import * as yup from 'yup';
import ControllerWrappedInput from '../../../components/ControllerWrappedInput';
import globalStyles from '../../../styles/globalStyles';
import {yupResolver} from '@hookform/resolvers/yup';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import {useState} from 'react';
import {
  getAllAdmins,
  getDesignations,
  getDesignationsCount,
  getTechnologies,
  getTechnologiesCount,
} from '../../../services/user.services';
import {useEffect} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

const schema = yup.object().shape({
  name: yup.string().required('Required'),
  email: yup.string().required('Required').email('Must be a valid email'),
  phoneNumber: yup
    .string()
    .required('Required')
    .length(10, 'Must be a valid number'),
  //   joiningDate: yup.string().required('Required'),
  //   reportsTo: yup.string().required('Required'),
  //   designation: yup.string().required('Required'),
  //   technologies: yup.array().of(yup.string()),
});

function FormModal({
  visible,
  hideModal,
  title,
  buttonLabel,
  token,
  employee,
  onSave,
  refresh,
}) {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      name: employee?.name || '',
      email: employee?.email || '',
      phoneNumber: employee?.phoneNumber || '',
    },
    resolver: yupResolver(schema),
  });
  const [date, setDate] = useState(employee?.joiningDate || new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [designationItems, setDesignationItems] = useState([]);
  const [designationValue, setDesignationValue] = useState(
    employee?.designation?.id || '',
  );
  const [techonologyItems, setTechnologyItems] = useState([]);
  const [technologyValues, setTechnologyValues] = useState(
    employee?.technologies.map(tech => tech.id) || [],
  );

  const [reportsToItems, setReportsToItems] = useState();
  const [reportsToValue, setReportsToValue] = useState(
    employee?.reportsTo?.id || '',
  );

  const [showDesignationsDropDown, setShowDesignationsDropDown] =
    useState(false);
  const [showTechnologiesDropDown, setshowTechnologiesDropDown] =
    useState(false);
  const [showReportsToDropDown, setShowReportsToDropDown] = useState(false);

  const openDesignationsDropDown = () => {
    setShowDesignationsDropDown(true);
    if (showTechnologiesDropDown) setshowTechnologiesDropDown(false);
    if (showReportsToDropDown) setShowReportsToDropDown(false);
  };
  const openTechnologiesDropDown = () => {
    setshowTechnologiesDropDown(true);
    if (showDesignationsDropDown) setShowDesignationsDropDown(false);
    if (showReportsToDropDown) setShowReportsToDropDown(false);
  };

  const openReportsToDropDown = () => {
    setShowReportsToDropDown(true);
    if (showDesignationsDropDown) setShowDesignationsDropDown(false);
    if (showTechnologiesDropDown) setshowTechnologiesDropDown(false);
  };

  const onDateChange = (event, selectDate) => {
    // console.log(selectDate);
    setDate(new Date(selectDate));
  };
  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: new Date(date),
      onChange: onDateChange,
    });
  };

  const fetchDesignations = async () => {
    try {
      let count = await getDesignationsCount(token);
      let {
        data: {designations},
      } = await getDesignations(token, 0, '', count);
      let desigs = designations.map(item => ({
        label: item.name,
        value: item.id,
      }));
      setDesignationItems(desigs);
    } catch (error) {
      setError(error);
    }
  };
  const fetchTechnologies = async () => {
    try {
      let count = await getTechnologiesCount(token);
      let {
        data: {technologies},
      } = await getTechnologies(token, 0, '', count);
      let techs = technologies.map(item => ({
        label: item.name,
        value: item.id,
      }));
      setTechnologyItems(techs);
    } catch (error) {
      setError(error);
    }
  };
  const fetchReportsTo = async () => {
    try {
      let {
        data: {users},
      } = await getAllAdmins(token);
      let adminItems = users?.map(user => ({value: user.id, label: user.name}));
      setReportsToItems(adminItems);
    } catch (error) {
      setError(error);
    }
  };
  const handleClick = () => {
    console.log('rtdd clicked', showReportsToDropDown);
    if (showReportsToDropDown) {
      setShowReportsToDropDown(false);
    }
    console.log('after', showReportsToDropDown);
  };
  const handleSave = data => {
    setIsLoading(true);
    onSave({
      ...data,
      reportsTo: reportsToValue,
      designation: designationValue,
      technologies: technologyValues,
      joiningDate: date,
    })
      .then(() => {
        setIsLoading(false);
        refresh();
        ToastAndroid.show('Added employee details', 1500);
        hideModal();
      })
      .catch(err => {
        console.log('fm', err);
        setIsLoading(false);
        setError(err);
      });
  };
  useEffect(() => {
    fetchDesignations();
    fetchTechnologies();
    fetchReportsTo();
  }, []);

  useEffect(() => {
    setShowDesignationsDropDown(false);
    setShowReportsToDropDown(false);
  }, [designationValue, reportsToValue]);

  console.log('Technology dropdown', showTechnologiesDropDown);
  return (
    <Modal
      visible={visible}
      onDismiss={hideModal}
      contentContainerStyle={[globalStyles.modal]}>
      <Headline>{title}</Headline>
      <ScrollView nestedScrollEnabled style={{height: '80%'}}>
        <ControllerWrappedInput
          name="name"
          label="Employee Name"
          control={control}
          errors={errors}
        />
        <ControllerWrappedInput
          name="email"
          label="Employee Email"
          control={control}
          errors={errors}
          keyboardType="email-address"
        />
        <ControllerWrappedInput
          name="phoneNumber"
          label="Employee phone number"
          control={control}
          errors={errors}
          keyboardType="number-pad"
        />
        <TextInput
          value={new Date(date).toLocaleDateString()}
          right={<TextInput.Icon name="calendar" onPress={showDatePicker} />}
          label="Joining Date"
          mode="outlined"
          editable={false}
        />
        <Text style={styles.label}>Designation</Text>
        <View style={{zIndex: 9999}}>
          <DropDownPicker
            placeholder="Designation"
            open={showDesignationsDropDown}
            setOpen={openDesignationsDropDown}
            value={designationValue}
            items={designationItems}
            setValue={setDesignationValue}
            setItems={fetchDesignations}
            containerStyle={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            listMode="SCROLLVIEW"
            scrollViewProps={{
              nestedScrollEnabled: true,
            }}
            dropDownDirection="BOTTOM"
            closeAfterSelecting
            closeOnBackPressed
            onChangeValue={() => {
              if (showDesignationsDropDown) {
                console.log('desig changed');
              }
            }}
          />
          <Text style={styles.label}>Technologies</Text>
          <DropDownPicker
            placeholder="Technologies"
            multiple
            open={showTechnologiesDropDown}
            setOpen={openTechnologiesDropDown}
            value={technologyValues}
            items={techonologyItems}
            setValue={setTechnologyValues}
            setItems={fetchTechnologies}
            containerStyle={styles.dropdown}
            // onChangeValue={() => console.log('tdd')}
            mode="BADGE"
            listMode="SCROLLVIEW"
            scrollViewProps={{
              nestedScrollEnabled: true,
            }}
            dropDownDirection="BOTTOM"
            dropDownContainerStyle={styles.dropdownContainer}
            // onOpen,onClose probably executes after visible prop is changed and before next re-render
            // onClose={() =>
            //   console.log('dd closed , isVisible', showTechnologiesDropDown)
            // }
            // onOpen={() =>
            //   console.log('dd opened , isVisible', showTechnologiesDropDown)
            // }
          />
          <Text style={styles.label}>Reports to</Text>
          <DropDownPicker
            placeholder="Reports to"
            open={showReportsToDropDown}
            setOpen={openReportsToDropDown}
            value={reportsToValue}
            items={reportsToItems}
            setValue={setReportsToValue}
            setItems={fetchReportsTo}
            containerStyle={[styles.dropdown, {marginBottom: 100}]}
            onChangeValue={() => console.log('rtdd')}
            dropDownDirection="BOTTOM"
            listMode="SCROLLVIEW"
            scrollViewProps={{
              nestedScrollEnabled: true,
            }}
            dropDownContainerStyle={[
              styles.dropdownContainer,
              {maxHeight: 100},
            ]}
            onPress={handleClick}
            closeAfterSelecting
          />
        </View>
      </ScrollView>
      {isLoading ? (
        <ActivityIndicator />
      ) : error ? (
        <View>
          <Text style={[globalStyles.errroMessage, {textAlign: 'center'}]}>
            Something went wrong....
          </Text>
          <Button onPress={() => setError(null)}>Retry</Button>
        </View>
      ) : (
        <Button onPress={handleSubmit(handleSave)}>{buttonLabel}</Button>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    marginTop: 4,
    marginBottom: 20,
    height: 30,
    borderColor: 'dodgerblue',
  },
  dropdownContainer: {
    borderWidth: 0,
    elevation: 10,
    zIndex: 31000,
    backgroundColor: '#eeeeff',
  },
  label: {
    color: 'gray',
    fontSize: 12,
    marginTop: 20,
    zIndex: 0,
  },
});
export default FormModal;
