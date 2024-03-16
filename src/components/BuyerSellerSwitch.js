import React, {useRef, useState, useEffect} from 'react';
import {View, Text, Animated, TouchableOpacity, StyleSheet} from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';

import {Colors} from '../theme/theme';

const BuyerSellerSwitch = ({leftTag, RightTag, onPress, type}) => {
  const {i18n} = useTranslation();
  const SwitchPosition = useRef(
    new Animated.Value(
      type === 'mode' ? (isSeller && i18n.language === 'en' ? 55 : 75) : 0,
    ),
  ).current;
  const [currentSwitchPostion, setCurrentSwitchPosition] = useState(0);
  const {isSeller} = useSelector(state => state.auth);

  useEffect(() => {
    if (type === 'mode') {
      Animated.timing(SwitchPosition, {
        toValue: isSeller ? (i18n.language === 'en' ? 55 : 75) : 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [isSeller, i18n.language]);

  const currentWidth = position => {
    if (type === 'mode' && i18n.language !== 'en') {
      if (position === 'move') return 75;
      else if (position === 'mainWrapper') return 160;
      else if (position === 'movingContainer') return 85;
    } else {
      if (position === 'move') return 55;
      else if (position === 'mainWrapper') return 120;
      else if (position === 'movingContainer') return 65;
    }
  };

  const currentMargin = (position, location) => {
    if (type === 'mode') {
      if (position === 'back') {
        if (location === 'left') return {marginLeft: 0};
        else return {marginRight: 0};
      } else if (location === 'left') return {marginLeft: 10};
      else if (i18n.language === 'en') return {marginRight: 12};
      else return {marginRight: 15};
    } else {
      if (position === 'back') {
        if (location === 'left') return {marginLeft: 10};
        else return {marginRight: 10};
      } else if (position === 'front') {
        if (location === 'left') return {marginLeft: 18};
        else return {marginRight: 16};
      }
    }
  };

  useEffect(() => {
    SwitchPosition.addListener(({value}) => setCurrentSwitchPosition(value));
  }, []);

  const moveSwitch = () => {
    if (type !== 'mode') {
      if (currentSwitchPostion === 0) {
        Animated.timing(SwitchPosition, {
          toValue: currentWidth('move'),
          duration: 100,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(SwitchPosition, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }).start();
      }
    }
    onPress();
  };
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => moveSwitch()}
      style={[
        styles.sellBuySwitch,
        {
          width: currentWidth('mainWrapper'),
        },
      ]}>
      <Text style={[styles.switchText, currentMargin('back', 'left')]}>
        {leftTag}
      </Text>
      <Text style={[styles.switchText, currentMargin('back', 'right')]}>
        {RightTag}
      </Text>
      <Animated.View
        style={{
          ...styles.animatedSwitch,
          transform: [
            {
              translateX: SwitchPosition,
            },
          ],
          width: currentWidth('movingContainer'),
        }}
      />
      <View
        style={{
          position: 'absolute',
        }}>
        <MaskedView
          style={{
            height: 30,
            borderRadius: 1000,
            width: currentWidth('mainWrapper'),
          }}
          maskElement={
            <View
              style={[
                styles.maskElementWrapper,
                {
                  width: currentWidth('mainWrapper'),
                },
              ]}>
              <Text style={[styles.switchText, currentMargin('front', 'left')]}>
                {leftTag}
              </Text>
              <Text
                style={[styles.switchText, currentMargin('front', 'right')]}>
                {RightTag}
              </Text>
            </View>
          }>
          <Animated.View
            style={{
              ...styles.animatedSwitch,
              backgroundColor: 'white',
              transform: [
                {
                  translateX: SwitchPosition,
                },
              ],
              width: currentWidth('movingContainer'),
            }}
          />
        </MaskedView>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  sellBuySwitch: {
    height: 30,
    borderRadius: 1000,
    alignSelf: 'flex-end',
    width: 120,
    backgroundColor: Colors.grey,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 7,
    marginVertical: 10,
  },
  switchText: {
    color: Colors.primary,
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  animatedSwitch: {
    width: 65,
    backgroundColor: Colors.primary,
    height: '100%',
    borderRadius: 1000,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maskElementWrapper: {
    height: 30,
    borderRadius: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default BuyerSellerSwitch;
