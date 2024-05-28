import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Onboarding from '../../screens/onBoardingScreens/onBoarding';
import ChooseLanguage from '../../screens/auth/language/language';
import Login from '../../screens/auth/login/login';
import Signup from '../../screens/auth/signup/signup';
import ForgetPassword from '../../screens/auth/forgetPassword/forgetPassword';
import CreateProfile from '../../screens/auth/createProfile/createProfile';
import IDscan from '../../screens/auth/IDscan/IDscan';
import Scan from '../../screens/auth/scan/scan';
import Sample from '../../screens/NewScreens/scan';

const AuthStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="OnBoarding"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="OnBoarding" component={Onboarding} />
      <Stack.Screen name="ChooseLanguage" component={ChooseLanguage} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="CreateProfile" component={CreateProfile} />
      <Stack.Screen name="IDscan" component={IDscan} />
      <Stack.Screen name="Scan" component={Sample} />
    </Stack.Navigator>
  );
};

export default AuthStack;
