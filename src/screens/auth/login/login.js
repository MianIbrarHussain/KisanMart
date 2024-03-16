import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Image} from 'react-native';
import {View} from 'react-native';
import {Colors, FontSize, FontFamily, CustomStyles} from '../../../theme/theme';
import {useTranslation} from 'react-i18next';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import i18next from './../../../i18n/i18n';
import {CustomActivityIndicator} from '../../../components/CustomActivityIndicator';
import Toast from 'react-native-toast-message/lib';
import {useDispatch} from 'react-redux';
import {userLogin} from '../../../redux/actions/auth';

var emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const {width, height} = Dimensions.get('screen');
const Login = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [hidePass, setHidePass] = useState(true);

  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [data, setData] = useState('');

  useEffect(() => {}, []);

  const IconWrapper = ({image, title}) => {
    return (
      <TouchableOpacity style={styles.socialIcon}>
        <Image style={styles.icon} source={image} />
        <Text style={styles.iconText}>{title}</Text>
      </TouchableOpacity>
    );
  };

  const handleLogin = () => {
    if (email.length === 0 || password.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'please Fill All Fields!',
        position: 'top',
      });
    } else if (email.match(emailRegex)) {
      const qs = require('qs');
      let data = qs.stringify({
        email: email,
        password: password,
      });
      setData({
        heading1: 'Processing!',
        heading2: 'Please wait, validating credentials...',
      });
      dispatch(userLogin(data, onSuccessLogin, onErrorLogin));
    } else {
      Toast.show({
        type: 'error',
        text1: 'Email Error!',
        text2: 'please enter valid email address...',
        position: 'top',
      });
    }
  };

  const onSuccessLogin = res => {
    if (res) {
      navigation.replace('HomeStack');
    }
  };

  const onErrorLogin = err => {
    setData('');
    Toast.show({
      type: 'error',
      text1: 'Error!',
      text2: 'Email or Password is incorrect...',
      position: 'top',
    });
    setEmail('');
    setPassword('');
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView
        style={{
          flex: 1,
        }}>
        <View>
          <Image
            source={require('../../../assets/images/logo.png')}
            style={styles.topLogo}
          />
          <Text style={{...CustomStyles.heading3, alignSelf: 'center'}}>
            {t('signInToAccounts')}
          </Text>

          <InputField
            keyboardType={'email-address'}
            placeholder={t('enterEmail')}
            style={{marginVertical: 10}}
            value={email}
            onChangeText={setEmail}
          />
          <InputField
            placeholder={t('enterPass')}
            style={{marginVertical: 10}}
            eye
            secureTextEntry={hidePass}
            hidePass={hidePass}
            value={password}
            onChangeText={setPassword}
            onEyePress={() => {
              setHidePass(!hidePass);
            }}
          />
          <Text
            style={styles.forgetText(i18n.language)}
            onPress={() => {
              navigation.navigate('ForgetPassword');
            }}>
            {t('forgetPass')}
          </Text>
        </View>
        <View style={{justifyContent: 'space-evenly', flexGrow: 1}}>
          <Button
            backgroundColor={Colors.primary}
            borderColor={Colors.primary}
            round={100}
            title={t('login')}
            titleColor={'white'}
            onPress={handleLogin}
          />
          <Text style={styles.orContinue}>
            {t('donthave')}{' '}
            <Text
              style={{color: Colors.primary}}
              onPress={() => {
                navigation.navigate('Signup');
              }}>
              {t('signup')}
            </Text>
          </Text>
          <Text style={styles.orContinue}>{t('orContinue')}</Text>

          <View style={styles.iconCont}>
            <IconWrapper
              image={require('../../../assets/icons/facebook.png')}
              title={t('facebook')}
            />
            <IconWrapper
              image={require('../../../assets/icons/google.png')}
              title={t('google')}
            />
            <IconWrapper
              image={require('../../../assets/icons/apple.png')}
              title={t('apple')}
            />
          </View>
        </View>
      </ScrollView>
      <CustomActivityIndicator data={data} />
    </View>
  );
};

const styles = StyleSheet.create({
  topLogo: {
    width: 180,
    height: 150,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 50,
  },
  socialIcon: {
    width: width / 3.5,
    height: width / 4.5,
    borderWidth: 0.5,
    borderColor: Colors.complimantory,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orContinue: {
    ...CustomStyles.paragraph,
    alignSelf: 'flex-end',
    marginVertical: 10,
    alignSelf: 'center',
    color: 'black',
  },
  iconCont: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  icon: {width: '30%', height: '30%', resizeMode: 'contain'},
  iconText: {...CustomStyles.paragraph, color: 'black', marginTop: 5},
  forgetText: language => {
    return {
      ...CustomStyles.paragraph,
      alignSelf: 'flex-end',
      marginVertical: 10,
      marginRight: language === 'en' ? 25 : 0,
      marginLeft: language === 'urd' ? 25 : 0,
      alignSelf: language === 'en' ? 'flex-end' : 'flex-start',
    };
  },
});

export default Login;
