import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  SectionList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from '@rneui/base';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';

import {Colors, CustomStyles} from '../../../theme/theme';

import styles from './styles';
import {handleGetProducts} from '../../../redux/actions/home';
import Toast from 'react-native-toast-message';
import {ListingRenderItem} from '../../../components/ListingRenderItem';

const HomeScreen = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [category, setCategory] = useState('');
  const {isSeller, userData} = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [data, setData] = useState('');
  const [showActivity, setShowActivity] = useState(false);

  const categoryData = {
    ALL: t('all'),
    WHEAT: t('wheat'),
    RICE: t('rice'),
    COTTON: t('cotton'),
    SUGERCANE: t('sugercane'),
    MAIZE: t('maize'),
    FRUITS_OR_VEGETABLES: t('fruitsOrVegetables'),
  };

  const renderCategory = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('CategoryListing', {
            category: Object.keys(categoryData).find(
              f => categoryData[f] === item,
            ),
            heading: item,
          });
          // setCategory(
          //   Object.keys(categoryData).find(f => categoryData[f] === item),
          // );
        }}
        style={styles.categoryWrapper(
          category,
          Object.keys(categoryData).find(f => categoryData[f] === item),
        )}>
        <Text
          style={styles.categoryLabel(
            category,
            Object.keys(categoryData).find(f => categoryData[f] === item),
          )}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({section}) => {
    return (
      <View style={styles.headerCont(i18n.language)}>
        <Text style={{...CustomStyles.heading3}}> {section.title}</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('CategoryListing', {});
          }}>
          <Image
            source={require('../../../assets/icons/arrow.png')}
            style={styles.headerIcon(i18n.language)}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderData = ({item, index, section}) => {
    return (
      <FlatList
        data={item}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
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
    );
  };

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
    if (isSeller) {
      setData([
        {
          title: t('newlyAdded'),
          data: [res],
        },
      ]);
      // setData([
      //   {
      //     title: t('newlyAdded'),
      //     data: res.topSelling,
      //   },
      //   {
      //     title: t('myTopSell'),
      //     data: res.exportQuality,
      //   },
      // ]);
    } else {
      setData([
        {
          title: t('topSelling'),
          data: [res.topSelling],
        },
        {
          title: t('exportQuality'),
          data: [res.exportQuality],
        },
        {
          title: t('fruits&Vegs'),
          data: [res.fruitsVeges],
        },
      ]);
    }

    console.log([
      res.topSelling.length !== 0 && {
        title: t('topSelling'),
        data: [res.topSelling],
      },
      {
        title: t('exportQuality'),
        data: [res.exportQuality],
      },
      {
        title: t('fruits&Vegs'),
        data: [res.fruitsVeges],
      },
    ]);

    console.log('res.fruitsVeges.length');
    console.log(res.fruitsVeges.length);
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
      <View style={styles.topCont(i18n.language)}>
        <TouchableOpacity
          style={styles.menuIconWrapper}
          onPress={() => {
            navigation.toggleDrawer();
          }}>
          <Image
            style={styles.icon(i18n.language)}
            tintColor={Colors.secondary}
            source={require('../../../assets/icons/menu.png')}
          />
        </TouchableOpacity>
        <View style={styles.searchWrapper(i18n.language)}>
          <TextInput
            style={styles.searchInput(i18n.language)}
            placeholder={t('searchHere')}
          />
          <Icon
            name="search"
            type="feather"
            size={20}
            color={Colors.complimantory}
          />
        </View>
      </View>
      <View>
        <FlatList
          style={styles.categoryWrapperFlat}
          data={
            i18n.language === 'en'
              ? Object.keys(categoryData).map(k => {
                  return categoryData[k];
                })
              : Object.keys(categoryData)
                  .map(k => {
                    return categoryData[k];
                  })
                  .reverse()
          }
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderCategory}
        />
      </View>
      <SectionList
        sections={data}
        style={styles.sectionStyles}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderData}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
      />
      {isSeller && (
        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary,
            height: 60,
            width: 60,
            borderRadius: 100,
            position: 'absolute',
            bottom: 10,
            left: i18n.language === 'en' ? '80%' : '5%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            navigation.navigate('AddProduct');
          }}>
          <Icon name="add" size={42} color={'white'} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default HomeScreen;