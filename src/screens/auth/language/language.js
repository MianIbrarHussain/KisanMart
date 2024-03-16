import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {Image, View} from 'react-native';
import {Colors, CustomStyles} from '../../../theme/theme';
import Button from '../../../components/Button';
import {useTranslation} from 'react-i18next';
import i18next from './../../../i18n/i18n';

const ChooseLanguage = ({navigation}) => {
  const {t, i18n} = useTranslation();

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Image
        style={{
          height: 200,
          width: '100%',
          resizeMode: 'contain',
        }}
        source={require('../../../assets/images/language.png')}
      />
      <Text style={{...CustomStyles.heading3, marginVertical: 20}}>
        {t('chooseLanguage')}
      </Text>
      <Button
        title={'اردو'}
        onPress={() => {
          i18n.changeLanguage('urd');
          navigation.replace('Login');
        }}
        backgroundColor={'white'}
        titleColor={Colors.complimantory}
        borderColor={Colors.complimantory}
        round={5}
      />
      <Button
        title={'English'}
        onPress={() => {
          i18n.changeLanguage('en');
          navigation.replace('Login');
        }}
        backgroundColor={Colors.primary}
        titleColor={'white'}
        borderColor={Colors.primary}
        round={5}
      />
    </View>
  );
};
export default ChooseLanguage;
