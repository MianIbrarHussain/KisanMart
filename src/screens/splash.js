import React, {useEffect, useRef} from 'react';
import {Animated, Image, View} from 'react-native';
import {useSelector} from 'react-redux';

const Splash = ({navigation}) => {
  const value = useRef(new Animated.Value(0), [0]);
  const {loggedIn} = useSelector(state => state.auth);

  useEffect(() => {
    setTimeout(() => {
      navigation.replace(loggedIn ? 'HomeStack' : 'AuthStack');
    }, 2000);
  }, []);
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Image
        source={require('../assets/images/logo.png')}
        style={{width: 200, height: 150, resizeMode: 'contain'}}
      />
    </View>
  );
};

export default Splash;
