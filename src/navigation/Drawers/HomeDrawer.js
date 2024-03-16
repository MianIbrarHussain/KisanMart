import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useTranslation} from 'react-i18next';

import CustomDrawerContent from './customDrawer';
import HomeScreen from '../../screens/NewScreens/HomeScreen';

const HomeDrawer = () => {
  const Drawer = createDrawerNavigator();
  const {t, i18n} = useTranslation();

  return (
    <Drawer.Navigator
      initialRouteName={'HomeScreen'}
      screenOptions={{
        headerShown: false,
        drawerPosition: i18n.language === 'urd' ? 'right' : 'left',
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="HomeScreen" component={HomeScreen} />
    </Drawer.Navigator>
  );
};

export default HomeDrawer;
