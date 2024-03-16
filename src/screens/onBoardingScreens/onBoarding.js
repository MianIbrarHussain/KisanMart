import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import {Colors, FontSize, FontFamily, CustomStyles} from '../../theme/theme';
import {Icon} from '@rneui/themed';
import {useTranslation} from 'react-i18next';

const Onboarding = ({navigation}) => {
  const [sliderState, setSliderState] = useState({currentPage: 0});
  const {currentPage} = sliderState;
  const {width, height} = Dimensions.get('window');
  const {t, i18n} = useTranslation();

  useEffect(() => {}, []);
  const setSliderPage = (event: any) => {
    const {x} = event.nativeEvent.contentOffset;
    const indexOfNextScreen = Math.floor(x / width);
    if (indexOfNextScreen !== currentPage) {
      setSliderState({
        ...sliderState,
        currentPage: indexOfNextScreen,
      });

      Animated.parallel([
        Animated.timing(movingValue.x, {
          toValue:
            indexOfNextScreen === 0 ? 29 : indexOfNextScreen === 1 ? 60 : 29,
          duration: 300,
          useNativeDriver: false,
          easing:
            indexOfNextScreen === 0
              ? Easing.circle
              : indexOfNextScreen === 1
              ? Easing.linear
              : Easing.circle,
        }),
        Animated.timing(movingValue.y, {
          toValue:
            indexOfNextScreen === 0 ? -32 : indexOfNextScreen === 1 ? 0 : 32,
          duration: 300,
          useNativeDriver: false,
          easing:
            indexOfNextScreen === 0
              ? Easing.linear
              : indexOfNextScreen === 1
              ? Easing.circle
              : Easing.linear,
        }),
      ]).start();
    }
  };

  const RenderComponent = ({heading, paragraph, image}) => {
    return (
      <View style={{width, height: height / 1.15, justifyContent: 'center'}}>
        <Image source={image} style={styles.imageStyle} />
        <View style={styles.wrapper}>
          <Text style={styles.header}>{heading}</Text>
          <Text style={styles.paragraph}>{paragraph}</Text>
        </View>
      </View>
    );
  };

  const movingValue = useState(new Animated.ValueXY({x: 27, y: -32}))[0];

  const {currentPage: pageIndex} = sliderState;
  return (
    <SafeAreaView style={{flex: 1}}>
      <Text
        style={{
          fontFamily: FontFamily.subTitle,
          color: Colors.primary,
          marginTop: 10,
          position: 'absolute',
          marginLeft: 10,
          zIndex: 10,
        }}
        onPress={() => {
          navigation.replace('ChooseLanguage');
        }}>
        Skip
      </Text>
      <ScrollView
        ref={scrollView => {
          _scrollView = scrollView;
        }}
        style={{flex: 1}}
        horizontal={true}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        onScroll={(event: any) => {
          setSliderPage(event);
        }}>
        <RenderComponent
          heading={t('intro1')}
          paragraph={t('intro1Des')}
          image={require('./../../assets/images/intro1.png')}
        />
        <RenderComponent
          heading={t('intro2')}
          paragraph={t('intro2Des')}
          image={require('./../../assets/images/intro2.png')}
        />
        <RenderComponent
          heading={t('intro3')}
          paragraph={t('intro2Des')}
          image={require('./../../assets/images/intro3.png')}
        />
      </ScrollView>
      <View style={styles.paginationWrapper}>
        {Array.from(Array(3).keys()).map((key, index) => (
          <View
            style={[
              styles.paginationDots,
              {
                opacity: pageIndex === index ? 1 : 0.2,
                width: pageIndex === index ? 20 : 5,
              },
            ]}
            key={index}
          />
        ))}
      </View>
      <View style={styles.buttonCont}>
        <Animated.View style={[movingValue.getLayout(), styles.animatedBall]} />
        <TouchableOpacity
          style={styles.buttonWrapper}
          onPress={() => {
            const {currentPage} = sliderState;
            currentPage >= 2
              ? navigation.replace('ChooseLanguage')
              : _scrollView.scrollTo({x: (currentPage + 1) * width});
          }}>
          <View style={styles.button}>
            <Icon name="arrowright" type="ant-design" color={'white'} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    height: 200,
    width: '100%',
    resizeMode: 'contain',
  },
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
  },
  header: {
    ...CustomStyles.heading3,
  },
  paragraph: {
    ...CustomStyles.paragraph,
    textAlign: 'center',
    width: '85%',
  },
  paginationWrapper: {
    position: 'absolute',
    bottom: 200,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonCont: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  paginationDots: {
    height: 5,
    borderRadius: 10 / 2,
    backgroundColor: Colors.primary,
    marginLeft: 10,
  },
  animatedBall: {
    width: 10,
    height: 10,
    backgroundColor: Colors.primary,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 65,
    height: 65,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.primary,
    borderWidth: 0.5,
  },
  buttonWrapper: {
    width: 45,
    height: 45,
    backgroundColor: Colors.primary,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default Onboarding;
