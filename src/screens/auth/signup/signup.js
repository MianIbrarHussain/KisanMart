import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Image} from 'react-native';
import {View} from 'react-native';
import {Colors, FontSize, FontFamily, CustomStyles} from '../../../theme/theme';
import {useTranslation} from 'react-i18next';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
import i18next from '../../../i18n/i18n';
import Toast from 'react-native-toast-message';
import {CustomActivityIndicator} from '../../../components/CustomActivityIndicator';
import {useDispatch} from 'react-redux';
import {userRegistration} from '../../../redux/actions/auth';
const {width, height} = Dimensions.get('screen');

var emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const Signup = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [hidePass, setHidePass] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [data, setData] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    i18n.changeLanguage('en');
  }, []);

  const IconWrapper = ({image, title}) => {
    return (
      <TouchableOpacity style={styles.socialIcon}>
        <Image style={styles.icon} source={image} />
        <Text style={styles.iconWrap}>{title}</Text>
      </TouchableOpacity>
    );
  };

  const handleRegistration = () => {
    if (
      email.length === 0 ||
      password.length === 0 ||
      confirmPassword.length === 0
    ) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'please Fill All Fields!',
        position: 'top',
      });
    } else if (email.match(emailRegex)) {
      if (password.length < 8) {
        Toast.show({
          type: 'error',
          text1: 'Password Error',
          text2: 'password length should be at least 8 characters...',
          position: 'top',
        });
      } else if (password !== confirmPassword) {
        Toast.show({
          type: 'error',
          text1: 'Password Error',
          text2: 'password and confirm password do not match...',
          position: 'top',
        });
        setPassword('');
        setConfirmPassword('');
      } else {
        const qs = require('qs');
        let data = qs.stringify({
          email: email,
          password: password,
        });
        setData({
          heading1: 'Processing!',
          heading2: 'please wait...',
        });
        dispatch(
          userRegistration(data, onSuccessRegistration, onErrorRegistraton),
        );
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Email Error',
        text2: 'plese enter valid email address...',
        position: 'top',
      });
      setEmail('');
    }
  };

  const onSuccessRegistration = res => {
    setData('');
    navigation.navigate('CreateProfile', {
      userID: res,
    });
  };

  const onErrorRegistraton = err => {
    setData('');
    Toast.show({
      type: 'error',
      text1: 'Email Error',
      text2: 'email is already registered...',
      position: 'top',
    });
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      <ScrollView style={{flex: 1}}>
        <View>
          <Image
            source={require('../../../assets/images/logo.png')}
            style={styles.topLogo}
          />
          <Text style={{...CustomStyles.heading3, alignSelf: 'center'}}>
            {t('createAccount')}
          </Text>

          {/* <InputField placeholder={t('enterName')} style={{marginVertical: 10}} /> */}

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
            value={password}
            onChangeText={setPassword}
            hidePass={hidePass}
            onEyePress={() => {
              setHidePass(!hidePass);
            }}
          />
          <InputField
            placeholder={t('confirmPass')}
            style={{marginVertical: 10}}
            eye
            secureTextEntry={hidePass}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            hidePass={hidePass}
            onEyePress={() => {
              setHidePass(!hidePass);
            }}
          />
        </View>

        <View style={{justifyContent: 'space-evenly', flexGrow: 1}}>
          <Button
            backgroundColor={Colors.primary}
            borderColor={Colors.primary}
            round={100}
            title={t('signup')}
            titleColor={'white'}
            onPress={handleRegistration}
          />

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
          <Text style={styles.orContinue}>
            {t('already')}{' '}
            <Text
              style={{color: Colors.primary}}
              onPress={() => {
                navigation.goBack();
              }}>
              {t('loginn')}
            </Text>
          </Text>
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
  iconWrap: {...CustomStyles.paragraph, color: 'black', marginTop: 5},
});

export default Signup;
