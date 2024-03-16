import React, {useEffect, useState} from 'react';
import {Dimensions, FlatList, StyleSheet, Text, View} from 'react-native';
import {Icon} from '@rneui/base';
import {useDispatch, useSelector} from 'react-redux';

import {Colors} from '../../../theme/theme';
import {useTranslation} from 'react-i18next';
import {CustomStyles} from '../../../theme/theme';

import {getFontSize} from '../../../utils/utils';
import {handleGetProducts} from '../../../redux/actions/home';
import {ListingRenderItem} from '../../../components/ListingRenderItem';

const {width, height} = Dimensions.get('screen');

const CategoryListing = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {t, i18n} = useTranslation();
  const {isSeller, userData} = useSelector(state => state.auth);
  const {category, heading} = route.params;

  const [showActivity, setShowActivity] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    handleGetData();
  }, [isSeller, category]);

  const handleGetData = () => {
    setShowActivity(true);
    dispatch(
      handleGetProducts(
        userData.userID,
        category,
        isSeller,
        onSuccess,
        onError,
      ),
    );
  };

  const onSuccess = res => {
    setShowActivity(false);
    setData(res);
  };

  const onError = err => {
    setShowActivity(false);
    Toast.show({
      type: 'info',
      text1: 'Connectivity Issue',
      text2: 'Please Check your internet connection...',
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {/* <View
        style={[
          styles.topCont,
          {
            flexDirection: i18n.language === 'en' ? 'row' : 'row-reverse',
          },
        ]}>
        <TouchableOpacity
          style={styles.menuIconWrapper}
          onPress={() => {
            navigation.toggleDrawer();
          }}>
          <Image
            style={[
              styles.icon,
              {
                transform: [
                  {rotate: i18n.language === 'en' ? '0deg' : '180deg'},
                ],
              },
            ]}
            tintColor={Colors.secondary}
            source={require('../../../assets/icons/menu.png')}
          />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: i18n.language === 'en' ? 'row' : 'row-reverse',
            ...styles.searchWrapper,
          }}>
          <TextInput
            style={{
              width: '90%',
              textAlign: i18n.language === 'en' ? 'left' : 'right',
            }}
            placeholder={t('searchHere')}
          />
          <Icon
            name="search"
            type="feather"
            size={20}
            color={Colors.complimantory}
          />
        </View>
      </View> */}
      <View
        style={{
          flexDirection: i18n.language === 'en' ? 'row' : 'row-reverse',
          ...styles.topCont,
        }}>
        <Icon
          name={i18n.language === 'en' ? 'arrowleft' : 'arrowright'}
          type="ant-design"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Text style={{...CustomStyles.subTitle}}> {heading}</Text>
        <Icon name={'arrowright'} type="ant-design" color={'transparent'} />
      </View>

      <View
        style={{
          width: '95%',
          alignSelf: 'center',
          alignItems: i18n.language === 'en' ? 'flex-start' : 'flex-end',
        }}>
        <Text style={{...CustomStyles.heading3, marginTop: 20, fontSize: 14}}>
          {heading}
        </Text>
      </View>
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        style={{width: '95%', alignSelf: 'center'}}
        columnWrapperStyle={{justifyContent: 'space-between'}}
        renderItem={({item}) => (
          <ListingRenderItem
            item={item}
            i18n={i18n}
            onPress={() => {
              navigation.navigate('ProductDetail', {
                productID: item.productID,
              });
            }}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  topCont: {
    width: '95%',
    alignSelf: 'center',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  menuIconWrapper: {
    backgroundColor: Colors.grey,
    width: 35,
    height: 35,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {width: 18, height: 18, resizeMode: 'contain'},
  searchWrapper: {
    width: '85%',
    borderWidth: 0.5,
    borderColor: Colors.complimantory,
    height: 35,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  categoryWrapper: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    height: 25,
    paddingHorizontal: 20,
    borderColor: Colors.complimantory,
    marginRight: 5,
  },
});
export default CategoryListing;
