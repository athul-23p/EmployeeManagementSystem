import {useEffect, useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import AppbarWrapper from '../../components/AppbarWrapper';
import {getRequisitionById} from '../../services/user.services';
import {Text} from 'react-native-paper';

import globalStyles from '../../styles/globalStyles';
import {RichEditor} from 'react-native-pell-rich-editor';

function ViewRequisitionScreen({navigation, route}) {
  const {accessToken} = useSelector(store => store.auth);
  const richText = useRef();
  const [content, setContent] = useState('');

  const {id} = route.params;
  useEffect(() => {
    getRequisitionById(accessToken, id)
      .then(res => {
        console.log('vreq', res);
        setContent(res?.data?.requisition);
        richText.current.insertHTML(res?.data?.description);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
  console.log(content?.description);
  return (
    <AppbarWrapper title="Requisitions">
      <View
        style={[
          globalStyles.container,
          {justifyContent: 'flex-start', flex: 2},
        ]}>
        <View style={{marginTop: 10}}>
          <Text style={[styles.title]}>{content?.title}</Text>
          <Text style={[styles.heading]}>{content?.heading}</Text>
        </View>

        <RichEditor
          disabled
          initialContentHTML={content?.description}
          ref={richText}
          style={{flex: 8}}
          containerStyle={{
            marginTop: 10,
            paddingVertical: 10,
            flex: 8,
            // borderWidth: 1,
          }}
        />
      </View>
    </AppbarWrapper>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    marginLeft: 10,
  },
  heading: {
    fontSize: 28,
    marginLeft: 10,
  },
});
export default ViewRequisitionScreen;
