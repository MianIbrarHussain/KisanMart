import {Icon} from '@rneui/base';
import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {Colors, FontFamily} from '../../../theme/theme';
import {CustomStyles} from '../../../theme/theme';
import {FlatList} from 'react-native';
import {handleFetchMyDeals} from '../../../redux/actions/home';
import Toast from 'react-native-toast-message';
import OfferCard from '../../../components/OfferCard';

const {width, height} = Dimensions.get('screen');
const MyDeals = ({navigation}) => {
  const dispatch = useDispatch();
  const {userData} = useSelector(state => state.auth);

  const [tab, setTab] = useState('pending');
  const {t, i18n} = useTranslation();

  const [deals, setDeals] = useState([]);

  const handleGetMyDeals = () => {
    dispatch(handleFetchMyDeals(userData.userID, onSuccess, onError));
  };

  const onSuccess = res => {
    setDeals(res);
  };

  const onError = err => {
    Toast.show({
      type: 'error',
      text1: 'Error : Something went wrong!',
    });
  };

  useEffect(() => {
    handleGetMyDeals();
  }, []);

  const renderItem = ({item}) => {
    return <OfferCard OfferID={item.offerID} />;
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
        <Text style={{...CustomStyles.subTitle}}>{t('myDeals')}</Text>
        <Icon name={'arrowright'} type="ant-design" color={'transparent'} />
      </View>
      <View style={styles.buttonCont}>
        <TouchableOpacity
          style={styles.button(tab)}
          onPress={() => {
            setTab('pending');
          }}>
          <Text style={styles.buttonTitle(tab)}>{t('pendingDeals')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button1(tab)}
          onPress={() => {
            setTab('completed');
          }}>
          <Text style={styles.buttonTitle1(tab)}>{t('completeDeals')}</Text>
        </TouchableOpacity>
      </View>

      <View style={{height: height / 1.2}}>
        <FlatList
          renderItem={renderItem}
          data={tab === 'pending' ? deals : []}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text
              style={{
                color: Colors.primary,
                fontSize: 16,
                fontFamily: FontFamily.subTitle,
                textAlign: 'center',
                marginTop: 40,
              }}>
              no data to show
            </Text>
          }
          contentContainerStyle={{
            paddingVertical: 10,
          }}
          ListFooterComponent={() => {
            return <View style={{height: 50}}></View>;
          }}
          ItemSeparatorComponent={
            <View
              style={{
                height: 10,
              }}
            />
          }
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
  buttonCont: {
    width: '95%',
    alignSelf: 'center',
    height: 40,
    borderWidth: 0.5,
    borderColor: Colors.complimantory,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 3,
  },
  button: tab => {
    return {
      backgroundColor: tab === 'pending' ? Colors.primary : 'transparent',
      height: '90%',
      width: '49%',
      alignItems: 'center',
      borderRadius: 10,
      justifyContent: 'center',
    };
  },
  buttonTitle: tab => {
    return {
      fontFamily: FontFamily.subTitle,
      color: tab === 'pending' ? 'white' : 'black',
    };
  },
  button1: tab => {
    return {
      backgroundColor: tab === 'completed' ? Colors.primary : 'transparent',
      height: '90%',
      width: '49%',
      alignItems: 'center',
      borderRadius: 10,
      justifyContent: 'center',
    };
  },
  buttonTitle1: tab => {
    return {
      fontFamily: FontFamily.subTitle,
      color: tab === 'completed' ? 'white' : 'black',
    };
  },
  paginationWrapper: {
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
  offerProductWrap: language => {
    return {
      width: '95%',
      alignSelf: 'center',
      height: 120,
      borderWidth: 0.5,
      borderColor: Colors.complimantory,
      borderRadius: 10,
      marginTop: 10,
      alignItems: 'center',
      paddingHorizontal: 5,
      justifyContent: 'space-between',
      flexDirection: language === 'en' ? 'row' : 'row-reverse',
    };
  },
  detailCont: language => {
    return {
      width: '67%',
      alignItems: language === 'en' ? 'flex-start' : 'flex-end',
      justifyContent: 'space-evenly',
      height: '90%',
    };
  },
  seller: language => {
    return {
      fontFamily: FontFamily.paragraph,
      fontSize: 12,
      textAlign: language === 'en' ? 'left' : 'right',
      color: Colors.secondary,
    };
  },
  val: {
    fontFamily: FontFamily.subTitle,
    fontSize: 12,
    color: Colors.complimantory,
  },
  offerProductImage: {
    backgroundColor: Colors.grey,
    width: 110,
    height: 110,
    borderRadius: 5,
    resizeMode: 'contain',
  },
  offerProductName: {fontFamily: FontFamily.headerSemiBold, fontSize: 14},
});
export default MyDeals;
