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
import {Colors, CustomStyles, FontFamily} from '../../../theme/theme';

import styles from './styles';
import {handleGetProducts} from '../../../redux/actions/home';
import Toast from 'react-native-toast-message';
import {ListingRenderItem} from '../../../components/ListingRenderItem';
import translate from 'translate-google-api';
import {CustomActivityIndicator} from '../../../components/CustomActivityIndicator';

const HomeScreen = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [category, setCategory] = useState('');
  const {isSeller, userData} = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [data, setData] = useState('');
  const [load, setLoad] = useState('');
  const [urduData, setUrduData] = useState('');
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
    return item.length === 0 ? (
      <View
        style={{
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={require('../../../assets/images/nodata.png')}
          style={{height: 100, width: 80, resizeMode: 'contain'}}
        />
        <Text style={{fontFamily: FontFamily.headerSemiBold}}>
          Working on it
        </Text>
      </View>
    ) : (
      <FlatList
        data={item}
        horizontal={true}
        style={{flexDirection: i18n.language === 'en' ? 'row' : 'row-reverse'}}
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
    setShowActivity(true);

    setLoad({
      heading1: 'Fetching data',
      heading2: 'Please wait product data is being fetched from server...',
    });
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
  const onSuccess = async res => {
    // translatedData(res);
    setLoad('');

    if (isSeller) {
      setData([
        {
          title: t('newlyAdded'),
          data: [res],
        },
      ]);
    } else {
      setShowActivity(false);

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
  };

  const onError = err => {
    setShowActivity(false);
    Toast.show({
      type: 'info',
      text1: 'Connectivity Issue',
      text2: 'Please Check your internet connection...',
    });
  };

  const translatedData = async res => {
    console.log(res);

    if (isSeller) {
      const array = res.map(item => {
        return item.productName;
      });
      console.log(array);
      const result = await translate(array, {
        tld: 'com',
        to: 'ur',
      });

      console.log(result);
      const translatedArray = res.map((item, index) => {
        return {
          ...item,
          productName: result[index],
        };
      });

      console.log(translatedArray);
      setUrduData([
        {
          title: t('newlyAdded'),
          data: [translatedArray],
        },
      ]);
      setLoad('');
      console.log(urduData);
    } else {
      const topSellingArr = res.topSelling.map(item => {
        return item.productName;
      });
      const topSellingResult = await translate(topSellingArr, {
        tld: 'com',
        to: 'ur',
      });
      const topSellingTrans = res.topSelling.map((item, index) => {
        return {
          ...item,
          productName: topSellingResult[index],
        };
      });
      const fruitsVegesArr = res.fruitsVeges.map(item => {
        return item.productName;
      });
      const fruitsVegesResult = await translate(fruitsVegesArr, {
        tld: 'com',
        to: 'ur',
      });
      const fruitsVegesTrans = res.fruitsVeges.map((item, index) => {
        return {
          ...item,
          productName: fruitsVegesResult[index],
        };
      });

      const exportQualityArr = res.exportQuality.map(item => {
        return item.productName;
      });
      const exportQualityResult = await translate(exportQualityArr, {
        tld: 'com',
        to: 'ur',
      });
      const exportQualityTrans = res.exportQuality.map((item, index) => {
        return {
          ...item,
          productName: exportQualityResult[index],
        };
      });
      setUrduData([
        {
          title: t('topSelling'),
          data: [topSellingTrans],
        },
        {
          title: t('exportQuality'),
          data: [exportQualityTrans],
        },
        {
          title: t('fruits&Vegs'),
          data: [fruitsVegesTrans],
        },
      ]);
      setLoad('');
      console.log('urduData');
      console.log(urduData);
    }
    setShowActivity(false);
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
      {data[0]?.data.length !== 0 &&
      data[1]?.data.length !== 0 &&
      data[2]?.data.length !== 0 ? (
        <SectionList
          sections={i18n.language === 'en' ? data : urduData}
          style={styles.sectionStyles}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          renderSectionHeader={renderSectionHeader}
          renderItem={renderData}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
        />
      ) : (
        <View style={styles.noDataCont}>
          <Image
            source={
              isSeller
                ? require('../../../assets/images/startselling.png')
                : require('../../../assets/images/nothing.png')
            }
            style={{resizeMode: 'contain'}}
          />
          <Text style={styles.noList}>
            {isSeller ? `Welcome ${userData.name}` : 'No Listings Yet!'}
          </Text>
          <View style={{width: '75%'}}>
            <Text style={{alignSelf: 'center', textAlign: 'center'}}>
              {isSeller
                ? `Your products have the power to transform this empty screen into a thriving marketplace. List your items and watch them find happy homes with eager buyers. Let's grow together!`
                : `But don't worry, we're working hard to bring you a wide variety of
              products soon! Stay tuned for updates and be the first to discover
              amazing deals when they arrive.`}
            </Text>
          </View>
        </View>
      )}
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

      <CustomActivityIndicator data={load} />
    </View>
  );
};

export default HomeScreen;
