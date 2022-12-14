import {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AppbarWrapper from '../../components/AppbarWrapper';
import {ROLES} from '../../constants/roles';
import {unsetUpdateDashboard} from '../../redux/user/userSlice';
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
  const {updateDashboard} = useSelector(store => store.user);
  const dispatch = useDispatch();
  const Cards = [
    {title: 'users', route: 'Users'},
    {title: 'designations', route: 'Designations'},
    {title: 'technologies', route: 'Technologies'},
    {title: 'employees', route: 'Employees'},
    {title: 'requisitions', route: 'RequisitionNavigator'},
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

  const getStats = async () => {
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
  };
  useEffect(() => {
    if (updateDashboard) {
      getStats();
      dispatch(unsetUpdateDashboard());
    }
  }, [updateDashboard]);

  return (
    <AppbarWrapper title={'Dashboard'}>
      {/* <View style={{width: '100%', alignItems: 'center'}}> */}
      <ScrollView contentContainerStyle={[{alignItems: 'center'}]}>
        <View style={[styles.cardsContainer, {width: '100%'}]}>
          {Cards.map(({title, route}) => (
            <StatisticsCard
              title={title}
              stats={counts[title]}
              key={Math.random().toString()}
              route={route}
            />
          ))}
        </View>
      </ScrollView>
    </AppbarWrapper>
  );
}

const styles = StyleSheet.create({
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'center',
    paddingBottom: 20,
    width: '99%',
  },
});
export default DashBoardScreen;
