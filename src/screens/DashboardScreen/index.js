import {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import AppbarWrapper from '../../components/AppbarWrapper';
import {ROLES} from '../../constants/roles';
import {
  getAllAdminsCount,
  getDesignationsCount,
  getEmployeesCount,
  getRequisitionsCount,
  getTechnologiesCount,
} from '../../services/user.services';
import StatisticsCard from './components/StatisticsCard';

function DashBoardScreen({navigation}) {
  const {user, accessToken} = useSelector(store => store.auth);
  const Cards = [
    'users',
    'designations',
    'technologies',
    'employees',
    'requisitions',
  ];
  const [counts, setCounts] = useState({
    designations: 0,
    technologies: 0,
    employees: 0,
    requisitions: 0,
  });

  if (user?.role != ROLES.SUPER_ADMIN) {
    Cards.shift();
  }
  useEffect(() => {
    async function getStats() {
      let stats = {...counts};
      try {
        stats.designations = await getDesignationsCount(accessToken);
        stats.employees = await getEmployeesCount(accessToken);
        stats.requisitions = await getRequisitionsCount(accessToken);
        stats.technologies = await getTechnologiesCount(accessToken);
        if (user?.role == ROLES.SUPER_ADMIN) {
          stats.users = await getAllAdminsCount(accessToken);
        }
        setCounts(stats);
      } catch (error) {
        console.log(error);
      }
    }
    getStats();
  }, []);
  return (
    <AppbarWrapper title={'Dashboard'}>
      {/* <Text>dashboard</Text> */}
      <View style={{width: '100%', alignItems: 'center'}}>
        <ScrollView contentContainerStyle={[styles.cardsContainer]}>
          {Cards.map(title => (
            <StatisticsCard
              title={title}
              stats={counts[title]}
              key={Math.random().toString()}
            />
          ))}
        </ScrollView>
      </View>
    </AppbarWrapper>
  );
}

const styles = StyleSheet.create({
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'center',
    paddingBottom: 10,
    height: '100%',
    width: '99%',
    // borderWidth: 1,
    // flex: 1,
  },
});
export default DashBoardScreen;
