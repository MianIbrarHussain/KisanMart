import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, Text} from 'react-native';
import {Image} from 'react-native';
import {View} from 'react-native';
import {Colors, CustomStyles} from '../../../theme/theme';
import {useTranslation} from 'react-i18next';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';
const {width, height} = Dimensions.get('screen');

const ForgetPassword = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [hidePass, setHidePass] = useState(true);
  useEffect(() => {}, []);

  return (
    <View style={{flex: 1}}>
      <View>
        <Image
          source={require('../../../assets/images/logo.png')}
          style={styles.topLogo}
        />
        <Text style={styles.titleText}>{t('signInToAccounts')}</Text>

        <InputField
          placeholder={t('enterPass')}
          style={{marginVertical: 10}}
          eye
          secureTextEntry={hidePass}
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
          hidePass={hidePass}
          onEyePress={() => {
            setHidePass(!hidePass);
          }}
        />
      </View>
      <View style={styles.buttonWrap}>
        <Button
          backgroundColor={Colors.primary}
          borderColor={Colors.primary}
          round={100}
          title={t('save')}
          titleColor={'white'}
          onPress={() => {
            navigation.navigate('Login');
          }}
        />
      </View>
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
  titleText: {
    ...CustomStyles.heading3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  buttonWrap: {justifyContent: 'space-evenly', flexGrow: 1},
});

export default ForgetPassword;
