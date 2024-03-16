import {DrawerContentScrollView} from '@react-navigation/drawer';
import {Image, Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {Colors, FontFamily} from '../../theme/theme';
import {getFontSize} from '../../utils/utils';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../../components/Button';
import BuyerSellerSwitch from '../../components/BuyerSellerSwitch';
import {toggleMode, userLogout} from '../../redux/actions/auth';

function CustomDrawerContent(props) {
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();
  const {userData} = useSelector(state => state.auth);

  const DrawerItemList = ({icon, title, screen}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.closeDrawer();
          props.navigation.navigate(screen);
        }}
        style={{
          flexDirection: i18n.language === 'en' ? 'row' : 'row-reverse',
          ...styles.drawerTab,
        }}>
        <Image
          style={{width: 19, height: 19, resizeMode: 'contain'}}
          source={icon}
        />
        <Text
          style={{
            color: Colors.secondary,
            fontSize: getFontSize(13),
            fontFamily: FontFamily.title,
            marginLeft: i18n.language === 'en' ? 15 : 0,
            marginRight: i18n.language === 'urd' ? 15 : 0,
          }}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  const DrawerData = [
    {
      icon: require('../../assets/icons/home.png'),
      title: t('home'),
      screen: 'HomeScreen',
    },
    {
      icon: require('../../assets/icons/message.png'),
      title: t('messages'),
      screen: 'Conversion',
    },
    {
      icon: require('../../assets/icons/bell.png'),
      title: t('notification'),
      screen: 'Notification',
    },
    {
      icon: require('../../assets/icons/deal.png'),
      title: t('myDeals'),
      screen: 'MyDeals',
    },
    {
      icon: require('../../assets/icons/terms.png'),
      title: t('terms&Condition'),
      screen: 'TermsConditions',
    },
    {
      icon: require('../../assets/icons/privacy.png'),
      title: t('privacy&Policy'),
      screen: 'PrivacyPolicy',
    },
    {
      icon: require('../../assets/icons/user.png'),
      title: t('myProfile'),
      screen: 'MyProfile',
    },
  ];

  return (
    <DrawerContentScrollView {...props} style={{flex: 1}}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={{
          width: '50%',
          height: 50,
          resizeMode: 'contain',
          alignSelf: 'center',
          marginVertical: 10,
        }}
      />
      <View
        style={{
          width: '90%',
          alignSelf: 'center',
          borderBottomWidth: 0.5,
          borderColor: Colors.complimantory,
          marginVertical: 10,
          marginBottom: 20,
        }}></View>
      {DrawerData.map(k => {
        return (
          <DrawerItemList icon={k.icon} title={k.title} screen={k.screen} />
        );
      })}

      <View style={[styles.line, {marginTop: 20}]} />
      <View
        style={[
          {flexDirection: i18n.language === 'en' ? 'row' : 'row-reverse'},
          styles.switchWrapper,
        ]}>
        <Text style={styles.switchTitle}>{t('language')}</Text>
        <BuyerSellerSwitch
          RightTag={t('اردو')}
          leftTag={'Eng'}
          type="language"
          onPress={() =>
            i18n.changeLanguage(i18n.language === 'en' ? 'urd' : 'en')
          }
        />
      </View>
      <View style={styles.line} />
      <View
        style={[
          {flexDirection: i18n.language === 'en' ? 'row' : 'row-reverse'},
          styles.switchWrapper,
        ]}>
        <Text style={styles.switchTitle}>{t('switchToSelling')}</Text>
        <BuyerSellerSwitch
          type="mode"
          leftTag={t('buyer')}
          RightTag={t('seller')}
          onPress={() => {
            if (userData.isVerified) {
              dispatch(toggleMode());
            } else {
              props.navigation.navigate('AuthStack', {
                screen: 'CreateProfile',
                params: {
                  userID: userData.userID,
                },
              });
            }
          }}
        />
      </View>
      <View style={styles.line} />
      <View style={{position: 'relative', width: '100%'}}>
        <Button
          title={'LOGOUT'}
          backgroundColor={Colors.primary}
          round={50}
          borderColor={Colors.primary}
          titleStyle={{fontSize: 12}}
          titleColor={'white'}
          height={40}
          onPress={() => {
            dispatch(userLogout());
            props.navigation.replace('Splash');
          }}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  line: {
    borderWidth: 0.5,
    borderColor: Colors.dark,
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  switchWrapper: {
    height: 50,
    width: '88%',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  switchTitle: {
    color: Colors.secondary,
    fontFamily: FontFamily.title,
    fontSize: getFontSize(13),
  },
  drawerTab: {
    width: '88%',
    alignSelf: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
});
export default CustomDrawerContent;
