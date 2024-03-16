import {Icon} from '@rneui/base';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Colors, CustomStyles} from '../../../theme/theme';

const SellerInfo = ({navigation}) => {
  const {t, i18n} = useTranslation();

  const DetailTabs = ({title, value}) => {
    return (
      <View style={styles.detailCont(i18n.language)}>
        <Text style={styles.title(i18n.language)}>{title}</Text>
        <View style={{borderLeftWidth: 1, borderColor: Colors.complimantory}} />
        <Text style={styles.val(i18n.language)}>{value}</Text>
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.topCont(i18n.language)}>
        <Icon
          name={i18n.language === 'en' ? 'arrowleft' : 'arrowright'}
          type="ant-design"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Text style={{...CustomStyles.subTitle}}>{t('sellerInfo')}</Text>
        <Icon name={'arrowright'} type="ant-design" color={'transparent'} />
      </View>

      <View style={styles.avatarCont}>
        <Image
          source={require('../../../assets/images/profile.jpeg')}
          style={styles.avatar}
        />
        <Text style={{...CustomStyles.title, marginTop: 5}}>{t('noman')}</Text>
      </View>
      <View style={styles.desWrap}>
        <DetailTabs title={t('region')} value={t('regionVal')} />
        <DetailTabs title={t('joiningDate')} value={t('22.03.2022')} />
        <DetailTabs title={t('succesDeal')} value={t('2')} />
        <DetailTabs title={t('cancelDeals')} value={t('33')} />
        <DetailTabs title={t('rating')} value={t('bad')} />
        <DetailTabs title={t('dealtPrevious')} value={t('2')} />
      </View>
      <Text style={styles.contactTabTitle(i18n.language)}>
        {t('contactInfo')}
      </Text>

      <View style={styles.buttonCont(i18n.language)}>
        <TouchableOpacity
          style={styles.contactTab}
          onPress={() => {
            copyToClipboard('+923245454545');
          }}>
          <Text style={{...CustomStyles.paragraph}}>+923245454545</Text>
          <Image
            source={require('../../../assets/icons/copy.png')}
            style={{width: 15, height: 15, resizeMode: 'contain'}}
          />
        </TouchableOpacity>
        <View style={styles.contactTab}>
          <Text
            style={{
              ...CustomStyles.paragraph,
              width: '90%',
              textAlign: i18n.language === 'en' ? 'left' : 'center',
            }}>
            {t('whatappChat')}
          </Text>
          <Image
            source={require('../../../assets/icons/whatsapp.png')}
            style={{width: 15, height: 15, resizeMode: 'contain'}}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topCont: language => {
    return {
      width: '95%',
      alignSelf: 'center',
      height: 50,
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: language === 'en' ? 'row' : 'row-reverse',
      borderBottomWidth: 0.5,
      borderColor: Colors.complimantory,
    };
  },
  avatarCont: {alignSelf: 'center', marginTop: 20, alignItems: 'center'},
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },
  desWrap: {
    borderWidth: 0.5,
    borderColor: Colors.complimantory,
    width: '95%',
    alignSelf: 'center',
    marginTop: 20,
  },
  contactTabTitle: language => {
    return {
      ...CustomStyles.heading3,
      fontSize: 16,
      width: '95%',
      alignSelf: 'center',
      marginTop: 40,
      marginVertical: 10,
      textAlign: language === 'en' ? 'left' : 'right',
    };
  },
  buttonCont: language => {
    return {
      width: '95%',
      flexDirection: language === 'en' ? 'row' : 'row-reverse',
      justifyContent: 'space-between',
      alignSelf: 'center',
    };
  },
  contactTab: {
    height: 40,
    borderWidth: 1,
    borderColor: Colors.dark,
    width: '48%',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  detailCont: language => {
    return {
      width: '100%',
      flexDirection: language === 'en' ? 'row' : 'row-reverse',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderColor: Colors.complimantory,
    };
  },
  title: language => {
    return {
      fontSize: 14,
      color: Colors.secondary,
      width: '35%',
      padding: 10,
      textAlign: language === 'en' ? 'left' : 'right',
    };
  },
  val: language => {
    return {
      ...CustomStyles.paragraph,
      width: '65%',
      padding: 10,
      textAlign: language === 'en' ? 'left' : 'right',
    };
  },
});

export default SellerInfo;
