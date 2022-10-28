import {View, StyleSheet} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Headline, TextInput} from 'react-native-paper';
import AppbarWrapper from '../../components/AppbarWrapper';
import globalStyles from './../../styles/globalStyles';
import * as yup from 'yup';
import {useRef, useState} from 'react';
import {RichEditor, RichToolbar, actions} from 'react-native-pell-rich-editor';
import {useForm, Controller} from 'react-hook-form';

const schema = yup.object().shape({
  title: yup.string().required('Required'),
  expInMonths: yup.number().integer().required('Required'),
  heading: yup.string().required('Required'),
});
function AddRequistionScreen({navigation}) {
  const richText = useRef();
  const [desc, setDesc] = useState('');
  const handleDescInput = text => {
    console.log(text);
    setDesc(text);
  };
  const {
    control,
    handlSubmit,
    formState: {errors},
  } = useForm({});

  return (
    <KeyboardAwareScrollView>
      <AppbarWrapper title="Requisitions">
        <View style={[globalStyles.container]}>
          <Headline>Create Requisition</Headline>
          <View style={styles.form}>
            <ControllerInput control={control} name="title" label={'Title'} />
            <ControllerInput
              control={control}
              name="expInMonths"
              label={'Experience in Months'}
            />
            <ControllerInput
              control={control}
              name="heading"
              label={'Heading'}
            />
            <View>
              <RichEditor
                ref={richText}
                onChange={handleDescInput}
                style={{borderWidth: 1, height: 60, borderColor: 'lightgrey'}}
              />
              <RichToolbar editor={richText} />
            </View>
          </View>
        </View>
      </AppbarWrapper>
    </KeyboardAwareScrollView>
  );
}
const ControllerInput = ({name, label, control}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({field: {onChange, onBlur, value}}) => (
        <TextInput
          onChangeText={onChange}
          mode="outlined"
          value={value}
          label={label}
          style={globalStyles.textInput}
          outlineColor="lightgrey"
        />
      )}
    />
  );
};
const styles = StyleSheet.create({});
export default AddRequistionScreen;
