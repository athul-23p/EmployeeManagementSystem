import {useState} from 'react';
import {ToastAndroid, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button, Headline, Text} from 'react-native-paper';
import AppbarWrapper from '../../components/AppbarWrapper';
import RichtextEditor from '../../components/RichtextEditor';
import globalStyles from './../../styles/globalStyles';
import Loader from './../../components/Loader';
import Error from './../../components/Error';
import {addRequisition} from '../../services/user.services';
import {useDispatch, useSelector} from 'react-redux';
import {setShouldRefresh} from '../../redux/user/userSlice';

function AddRequistionScreen({navigation}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const {accessToken} = useSelector(store => store.auth);
  const dispatch = useDispatch();

  const submitData = data => {
    console.log('ar', data);
    setIsLoading(true);
    addRequisition(accessToken, data)
      .then(() => {
        setIsLoading(false);
        ToastAndroid.show('Requisition added', 1500);
        dispatch(setShouldRefresh());
        navigation.goBack();
      })
      .catch(err => {
        setIsLoading(false);
        setError(err);
      });
  };
  return (
    <AppbarWrapper title="Requisitions">
      <KeyboardAwareScrollView>
        <View style={[globalStyles.container]}>
          <Headline>Add Requisition</Headline>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Error error={error} handleError={() => setError(null)} />
          ) : (
            <RichtextEditor
              defaultValues={{
                title: '',
                minExpInMonths: '0',
                heading: '',
              }}
              buttonLabel="Add"
              onSave={submitData}
            />
          )}
        </View>
      </KeyboardAwareScrollView>
    </AppbarWrapper>
  );
}

export default AddRequistionScreen;
