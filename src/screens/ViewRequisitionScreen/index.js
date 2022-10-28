import {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import AppbarWrapper from '../../components/AppbarWrapper';
import {getRequisitionById} from '../../services/user.services';
import {Text} from 'react-native-paper';
import {WebView} from 'react-native-webview';
import globalStyles from '../../styles/globalStyles';
function ViewRequisitionScreen({navigation, route}) {
  const {accessToken} = useSelector(store => store.auth);
  const [content, setContent] = useState('');

  const {id} = route.params;
  useEffect(() => {
    getRequisitionById(accessToken, id)
      .then(res => {
        setContent(res.data.requisition);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
  console.log(content?.description);
  return (
    <AppbarWrapper title="Requisitions">
      <View style={[globalStyles.container]}>
        <Text style={[styles.title]}>{content?.title}</Text>
        <Text style={[styles.heading]}>{content?.heading}</Text>
        <WebView
          originWhitelist={['*']}
          source={{
            html: `
            <html>
                <style>
                    p{
                        font-size:3rem
                    }
                </style>
                <body>
                    ${content?.description}
                </body
            </html>
        `,
          }}
          style={{}}
        />
      </View>
    </AppbarWrapper>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 16,
  },
  heading: {
    fontSize: 28,
  },
});
export default ViewRequisitionScreen;
