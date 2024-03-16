import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from '../screens/splash';

import AuthStack from './stacks/authStack';
import NewHomeStack from './stacks/NewHomeStack';

function MainNav() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="AuthStack" component={AuthStack} />
        <Stack.Screen name="HomeStack" component={NewHomeStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainNav;
