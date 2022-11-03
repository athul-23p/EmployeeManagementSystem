import {Controller} from 'react-hook-form';
import {View} from 'react-native';
import {TextInput, Text} from 'react-native-paper';
import globalStyles from '../styles/globalStyles';

const ControllerWrappedInput = ({
  name,
  label,
  control,
  errors,
  keyboardType,
  secureTextEntry,
  disabled
}) => {
  return (
    <View>
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
            keyboardType={keyboardType || 'default'}
            secureTextEntry={secureTextEntry}
            disabled={disabled}
          />
        )}
      />
      {errors[name] && (
        <Text style={globalStyles.errroMessage}>{errors[name].message}</Text>
      )}
    </View>
  );
};

export default ControllerWrappedInput;
