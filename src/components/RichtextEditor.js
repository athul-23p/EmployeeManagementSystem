import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {RichEditor, RichToolbar, actions} from 'react-native-pell-rich-editor';
import {useForm} from 'react-hook-form';
import ControllerWrappedInput from './ControllerWrappedInput';
import {StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import globalStyles from '../styles/globalStyles';

const schema = yup.object().shape({
  title: yup.string().required('Required'),
  minExpInMonths: yup
    .number()
    .integer()
    .required('required')
    .min(0, 'must be positive'),
  heading: yup.string().required('Required'),
});

function RichtextEditor({onSave, defaultValues, buttonLabel}) {
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
    setValue,
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const richText = useRef();
  const [description, setDescription] = useState(
    defaultValues?.description || '',
  );
  const handleDescriptionInput = text => setDescription(text);
  const [editorAttached, setEditorAttached] = useState(false);
  console.log('default values', defaultValues);

  const editorIntializedCallback = useCallback(() => {
    richText.current.registerToolbar(item => {
      // console.log('editor initialzed');
      setEditorAttached(true);
    });
  });

  const submit = formData => {
    console.log(description);
    if (description && description.length > 0) {
      onSave({...formData, description});
    }
  };
  useEffect(() => {
    reset(defaultValues);
    setValue('minExpInMonths', defaultValues.minExpInMonths);
    setDescription(defaultValues.description);
    // console.log(richText);
  }, [defaultValues]);

  console.log('editor attached', editorAttached);
  return (
    <View style={styles.form}>
      <ControllerWrappedInput
        control={control}
        name="title"
        label={'Title'}
        errors={errors}
      />
      <ControllerWrappedInput
        control={control}
        name="minExpInMonths"
        label={'Experience in Months'}
        errors={errors}
        keyboardType="number-pad"
      />
      <ControllerWrappedInput
        control={control}
        name="heading"
        label={'Heading'}
        errors={errors}
      />
      <Text style={[styles.label]}>Description</Text>
      <View styles={[styles.richTextContainer]}>
        <RichEditor
          ref={richText}
          onChange={handleDescriptionInput}
          style={{borderWidth: 1, height: 60, borderColor: 'lightgrey'}}
          initialHeight={200}
          initialContentHTML={defaultValues.description}
          androidHardwareAccelerationDisabled={true}
          useContainer={true}
          editorInitializedCallback={editorIntializedCallback}
        />

        {editorAttached && (
          <RichToolbar
            editor={richText}
            actions={[
              actions.setBold,
              actions.setItalic,
              actions.heading1,
              actions.heading2,
              actions.heading3,
              actions.insertBulletsList,
              actions.insertOrderedList,
              actions.insertLink,
              actions.setStrikethrough,
              actions.setUnderline,
              actions.checkboxList,
              actions.removeFormat,
              actions.undo,
              actions.redo,
            ]}
            iconTint={'gray'}
            selectedIconTint="#6200EE"
            iconMap={{
              [actions.heading1]: ({tintColor}) => (
                <Text style={[{color: tintColor}]}>H1</Text>
              ),
              [actions.heading2]: ({tintColor}) => (
                <Text style={[{color: tintColor}]}>H2</Text>
              ),
              [actions.heading3]: ({tintColor}) => (
                <Text style={[{color: tintColor}]}>H3</Text>
              ),
            }}
          />
        )}
      </View>
      <Button onPress={handleSubmit(submit)} style={globalStyles.button}>
        {buttonLabel}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  richTextContainer: {
    display: 'flex',
    flexDirection: 'column-reverse',
  },
  label: {
    marginVertical: 5,
  },
});
export default RichtextEditor;
