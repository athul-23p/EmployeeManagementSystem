import React, {useEffect, useState} from 'react';
import {ToastAndroid, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Headline, Subheading, Text} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import AppbarWrapper from '../../components/AppbarWrapper';
import Error from '../../components/Error';
import Loader from '../../components/Loader';
import RichtextEditor from '../../components/RichtextEditor';
import {setShouldRefresh} from '../../redux/user/userSlice';
import {
  getRequisitionById,
  updateRequisitionById,
} from '../../services/user.services';
import globalStyles from './../../styles/globalStyles';
function UpdateRequisitionScreen({navigation, route}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(undefined);
  const {accessToken} = useSelector(store => store.auth);
  const {id} = route.params;

  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    getRequisitionById(accessToken, id)
      .then(res => {
        setIsLoading(false);
        setData(res.data.requisition);
        console.log(res.data);
      })
      .catch(err => {
        setIsLoading(false);
        setError(err);
      });
  }, []);

  const update = data => {
    setIsLoading(true);
    console.log('update screen', data);
    updateRequisitionById(accessToken, id, data)
      .then(() => {
        setIsLoading(false);
        ToastAndroid.show('Requistion updated', 1500);
        dispatch(setShouldRefresh());
        navigation.goBack();
      })
      .catch(err => {
        setIsLoading(false);
        setError(err);
      });
  };
  return (
    <AppbarWrapper title={'Requistions'}>
      <KeyboardAwareScrollView>
        <View style={globalStyles.container}>
          <Headline>Edit Requisition</Headline>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Error error={error} handleError={() => setError(null)} />
          ) : (
            <RichtextEditor
              defaultValues={{
                title: data?.title,
                minExpInMonths: `${data?.minExpInMonths}`,
                heading: data?.heading,
                description: data?.description,
              }}
              buttonLabel="update"
              onSave={update}
            />
          )}
        </View>
      </KeyboardAwareScrollView>
    </AppbarWrapper>
  );
}

export default UpdateRequisitionScreen;
