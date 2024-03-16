import React from 'react';
import {View, Text} from 'react-native';
import {Colors, FontFamily, FontSize} from '../../../theme/theme';
import {ScrollView} from 'react-native';
import {useTranslation} from 'react-i18next';

const TermsConditions = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const Points = ({title, des}) => {
    return (
      <View
        style={{
          width: '95%',
          alignSelf: 'center',
          alignItems: i18n.language === 'en' ? 'flex-start' : 'flex-end',
        }}>
        <Text
          style={{
            fontSize: FontSize.paragraph,
            fontFamily: FontFamily.title,
            width: '95%',
            alignSelf: 'center',
            marginTop: 10,
            color: 'black',
            textAlign: i18n.language === 'en' ? 'left' : 'right',
          }}>
          {title}
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontFamily: FontFamily.paragraph,
            width: '95%',
            alignSelf: 'center',
            marginTop: 10,
            color: 'black',
            textAlign: i18n.language === 'en' ? 'left' : 'right',
          }}>
          {des}
        </Text>
      </View>
    );
  };
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Text
        style={{
          fontSize: FontSize.headerSemiBold,
          fontFamily: FontFamily.subTitle,
          width: '95%',
          alignSelf: 'center',
          marginTop: 10,
          color: 'black',
          textAlign: i18n.language === 'en' ? 'left' : 'right',
        }}>
        {t('agreement')}
      </Text>
      <Text
        style={{
          fontSize: FontSize.headerBold1,
          fontFamily: FontFamily.headerBold1,
          width: '95%',
          alignSelf: 'center',
          color: Colors.primary,
          textAlign: i18n.language === 'en' ? 'left' : 'right',
        }}>
        {t('terms&Conditions')}
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Points title={t('userAgrement')} des={t('userAgrementDes')} />
        <Points title={t('privacypolicy')} des={t('privacyPolicyDes')} />
        <Points title={t('transaction')} des={t('transactionDes')} />
        <Points title={t('intellectual')} des={t('intellectualDes')} />
        <Points title={t('fraudulent')} des={t('fraudulentDes')} />
        <Points title={t('user')} des={t('userDes')} />
        <Points title={t('termination')} des={t('terminationDes')} />
        <Points title={t('limitation')} des={t('limitationDes')} />

        <View style={{height: 50}} />
      </ScrollView>
    </View>
  );
};
export default TermsConditions;
