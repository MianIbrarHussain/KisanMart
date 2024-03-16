import {Icon} from '@rneui/base';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Colors, CustomStyles, FontFamily} from '../../../theme/theme';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';

const {width, height} = Dimensions.get('screen');
const theme = {
  colors: {
    primary: '#1CB5FD',
    grey: '#9B9B9B',
  },
};

const Notification = ({navigation}) => {
  const [noOfNotifications, setNoOFNotifications] = useState(1);
  const {t, i18n} = useTranslation();
  const Data = [
    {
      id: 4,
      text: t('notificaton4'),
      color: 'rgba(160,83,38,0.30)',
      color1: 'rgba(160,83,38,1)',
      icon: require('../../../assets/icons/wheat.png'),
    },
    {
      id: 1,
      text: t('notificaton1'),
      color: 'rgba(160,193,38,0.30)',
      color1: Colors.primary,
      icon: require('../../../assets/icons/deal.png'),
    },
    {
      id: 3,
      text: t('notificaton2'),
      color: 'rgba(160,83,38,0.30)',
      color1: 'rgba(160,83,38,1)',
      icon: require('../../../assets/icons/deal.png'),
    },
    {
      id: 2,
      text: t('notificaton3'),
      color: 'rgba(160,193,38,0.30)',
      color1: Colors.primary,
      icon: require('../../../assets/icons/wheat.png'),
    },
    {
      id: 1,
      text: t('notificaton1'),
      color: 'rgba(160,193,38,0.30)',
      color1: Colors.primary,
      icon: require('../../../assets/icons/deal.png'),
    },
    {
      id: 2,
      text: t('notificaton3'),
      color: 'rgba(160,193,38,0.30)',
      color1: Colors.primary,
      icon: require('../../../assets/icons/wheat.png'),
    },
    {
      id: 4,
      text: t('notificaton4'),
      color: 'rgba(160,83,38,0.30)',
      color1: 'rgba(160,83,38,1)',
      icon: require('../../../assets/icons/wheat.png'),
    },
  ];

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
        <Text style={{...CustomStyles.subTitle}}>{t('notification')}</Text>
        <Icon name={'arrowright'} type="ant-design" color={'transparent'} />
      </View>
      <View style={{marginTop: 17, height: height / 1.2}}>
        <FlatList
          data={Data}
          renderItem={({item}) => (
            <View style={styles.notificationCont(i18n.language)}>
              <View style={styles.iconCont}>
                <Image
                  source={item.icon}
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: item.color1,
                  }}
                />
              </View>
              <Text style={styles.notification(i18n.language)}>
                {item.text}
              </Text>
              {/* <View style={styles.innerNotification}>
                <Text style={{color: 'white', fontWeight: '600'}}>
                  {noOfNotifications}
                </Text>
              </View> */}
            </View>
          )}
          keyExtractor={item => item.id}
        />
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
      borderBottomWidth: 0.5,
      borderColor: Colors.complimantory,
      flexDirection: language === 'en' ? 'row' : 'row-reverse',
    };
  },
  topBar: {
    width: '95%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  notificationCont: language => {
    return {
      width: '90%',
      alignSelf: 'center',
      borderRadius: 10,
      borderBottomWidth: 0.5,
      borderBottomColor: Colors.primary,
      marginTop: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: 50,
      alignItems: 'center',
      paddingHorizontal: 10,
      backgroundColor: 'white',
      flexDirection: language === 'en' ? 'row' : 'row-reverse',

      // shadowColor: '#000',
      // shadowOffset: {width: 0, height: 2},
      // shadowOpacity: 0.5,
      // shadowRadius: 2,
      // elevation: 2,
    };
  },
  iconCont: {
    backgroundColor: 'white',
    padding: 4,
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  innerNotification: {
    backgroundColor: Colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notification: language => {
    return {
      width: '85%',
      fontFamily: FontFamily.paragraph,
      textAlign: language === 'en' ? 'left' : 'right',
    };
  },
});
export default Notification;
