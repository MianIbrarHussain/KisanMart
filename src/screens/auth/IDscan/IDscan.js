import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Colors, CustomStyles} from '../../../theme/theme';
import {Icon} from '@rneui/base';
import Button from '../../../components/Button';

const IDscan = ({navigation}) => {
  const {t, i18n} = useTranslation();

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
        <Text style={{...CustomStyles.subTitle}}>{t('scanID')}</Text>
        <Icon name={'arrowright'} type="ant-design" color={'transparent'} />
      </View>
      <View style={{justifyContent: 'space-evenly', flexGrow: 1}}>
        <Text style={styles.scanDes}>{t('scanDes')}</Text>
        <Image
          source={require('../../../assets/images/idPlaceHolder.png')}
          style={styles.placeHolder}
        />
        <View style={styles.cautionWrap}>
          <Icon name="lock" type="feather" />
          <Text style={{width: '85%', color: 'black'}}>{t('IDNote')}</Text>
        </View>
        <Button
          backgroundColor={Colors.primary}
          borderColor={Colors.primary}
          round={50}
          style={{marginTop: 30}}
          title={t('submit')}
          titleColor={'white'}
          onPress={() => {
            navigation.navigate('Scan');
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topCont: lang => {
    return {
      flexDirection: lang === 'en' ? 'row' : 'row-reverse',
      width: '95%',
      alignSelf: 'center',
      height: 50,
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 0.5,
      borderColor: Colors.complimantory,
      marginBottom: 10,
    };
  },
  placeHolderWrap: {
    height: 200,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.grey,
    marginVertical: 10,
    borderRadius: 10,
  },
  renderImageWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.grey,
    height: 65,
    width: 65,
    borderRadius: 5,
    marginRight: 10,
  },
  scanDes: {
    ...CustomStyles.paragraph,
    textAlign: 'center',
    fontSize: 12,
    width: '70%',
    alignSelf: 'center',
  },
  placeHolder: {
    width: '95%',
    height: 170,
    resizeMode: 'contain',
  },
  cautionWrap: {
    width: '90%',
    alignSelf: 'center',
    padding: 10,
    backgroundColor: Colors.grey,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
  },
});
export default IDscan;
