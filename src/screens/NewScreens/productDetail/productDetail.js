import {Icon} from '@rneui/base';
import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Clipboard,
  TouchableOpacity,
  Share,
} from 'react-native';
import Animated, {
  useSharedValue,
  interpolate,
  useAnimatedScrollHandler,
  Extrapolation,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {useDispatch, useSelector} from 'react-redux';
import socketService from '../../../utils/socketservice';
import translate from 'translate-google-api';

import {Colors, CustomStyles, FontFamily} from '../../../theme/theme';
import Button from '../../../components/Button';
import {CustomActivityIndicator} from '../../../components/CustomActivityIndicator';
import {
  handleCreateChatRoom,
  handleGetProductDetails,
} from '../../../redux/actions/home';
import Toast from 'react-native-toast-message';
import {BaseUrl} from '../../../utils/constans';
import i18next from 'i18next';

const {width, height} = Dimensions.get('screen');
const ProductDetail = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {isSeller, userData} = useSelector(state => state.auth);
  const {productID} = route.params;
  const {t, i18n} = useTranslation();
  const [sliderState, setSliderState] = useState({currentPage: 0});
  const {currentPage} = sliderState;
  const [showActivity, setShowActivity] = useState(false);
  const [data, setData] = useState({});
  const [showLoading, setShowLoading] = useState('');
  const imageHeight = useSharedValue(0);

  const categoryData = {
    WHEAT: t('wheat'),
    RICE: t('rice'),
    COTTON: t('cotton'),
    SUGERCANE: t('sugercane'),
    MAIZE: t('maize'),
    FRUITS_OR_VEGETABLES: t('fruitsOrVegetables'),
  };

  const setSliderPage = (event: any) => {
    const {x} = event.nativeEvent.contentOffset;
    const indexOfNextScreen = Math.floor(x / width);
    if (indexOfNextScreen !== currentPage) {
      setSliderState({
        ...sliderState,
        currentPage: indexOfNextScreen,
      });
    }
  };

  const copyToClipboard = ({text}) => {
    Clipboard.setString(text);
  };
  const {currentPage: pageIndex} = sliderState;
  const RenderComponent = ({heading, paragraph, image}) => {
    return (
      <View
        style={{
          width,
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image source={image} style={styles.imageStyle} />
      </View>
    );
  };

  const DetailTabs = ({title, value}) => {
    return (
      <View
        style={{
          width: '100%',
          flexDirection: i18n.language === 'en' ? 'row' : 'row-reverse',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderColor: Colors.complimantory,
        }}>
        <Text
          style={{
            fontSize: 14,
            color: Colors.secondary,
            width: '35%',
            padding: 10,
            textAlign: i18n.language === 'en' ? 'left' : 'right',
          }}>
          {title}
        </Text>
        <View style={{borderLeftWidth: 1, borderColor: Colors.complimantory}} />
        <Text
          style={{
            ...CustomStyles.paragraph,
            width: '65%',
            padding: 10,
            textAlign: i18n.language === 'en' ? 'left' : 'right',
          }}>
          {value}
        </Text>
      </View>
    );
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'React Native | A framework for building native apps using React',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  //scroll animation

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      imageHeight.value = e.contentOffset.y;
    },
  });

  const animatedStyles = useAnimatedStyle(() => {
    const Image_Height = interpolate(
      imageHeight.value,
      [0, height / 4 - 0],
      [height / 4, 0],
      {
        extrapolateRight: Extrapolation.CLAMP,
      },
    );

    return {
      height: Image_Height,
    };
  });

  useEffect(() => {
    handleGetDetails();
  }, []);

  const handleGetDetails = () => {
    setShowLoading({
      heading1: 'Loading!',
      heading2: 'Fetching Details...',
    });
    dispatch(handleGetProductDetails(productID, onSuccess, onError));
  };

  const onSuccess = res => {
    if (i18n.language === 'en') {
      setData(res);
      setShowLoading('');
    } else translateData(res);
  };

  const translateData = async res => {
    console.log(res);
    console.log(JSON.parse(res.productDetails.terms));

    const termi = JSON.parse(res.productDetails.terms);
    console.log(termi);
    const Category = await translate(res.productDetails.Category, {
      tld: 'com',
      to: 'ur',
    });
    const description = await translate(res.productDetails.description, {
      tld: 'com',
      to: 'ur',
    });
    const productName = await translate(res.productDetails.productName, {
      tld: 'com',
      to: 'ur',
    });
    const region = await translate(res.productDetails.region, {
      tld: 'com',
      to: 'ur',
    });
    const terms = await translate(termi, {
      tld: 'com',
      to: 'ur',
    });
    const unit = await translate(res.productDetails.unit, {
      tld: 'com',
      to: 'ur',
    });
    const city = await translate(res.supplierDetails.city, {
      tld: 'com',
      to: 'ur',
    });
    const name = await translate(res.supplierDetails.name, {
      tld: 'com',
      to: 'ur',
    });
    setData({
      productDetails: {
        ...res.productDetails,
        Category: Category[0],
        description: description[0],
        productName: productName[0],
        region: region[0],
        terms: terms[0],
        unit: unit[0],
      },
      supplierDetails: {
        ...res.supplierDetails,
        city: city[0],
        name: name[0],
      },
    });
    console.log('terms');
    console.log(terms[0]);
    setShowLoading('');
  };

  const onError = err => {
    setShowLoading('');
    Toast.show({
      type: 'error',
      text1: 'Error!',
      text2: 'Please check your internet...',
    });
  };

  const handleChat = () => {
    setShowLoading({
      heading1: 'Please Wait!',
      heading2: 'Creating chat room...',
    });
    const qs = require('qs');
    let sendingData = qs.stringify({
      userID: userData.userID,
      recipientID: data.supplierDetails.supplierID,
    });
    dispatch(handleCreateChatRoom(sendingData, onSuccessChat, onErrorChat));
    // navigation.navigate('ChatScreen', {
    //   item: {
    //     _id: 1,
    //     name: t('noman'),
    //     avatar: require('../../../assets/images/profile.jpeg'),
    //   },
    // });
    // if (userData.isVerified) {
    //   setShowLoading({
    //     heading1: 'Please Wait!',
    //     heading2: 'Creating chat room...',
    //   });
    //   const qs = require('qs');
    //   let sendingData = qs.stringify({
    //     userID: userData.userID,
    //     recipientID: data.supplierDetails.supplierID,
    //   });
    //   dispatch(handleCreateChatRoom(sendingData, onSuccessChat, onErrorChat));
    //   // navigation.navigate('ChatScreen', {
    //   //   item: {
    //   //     _id: 1,
    //   //     name: t('noman'),
    //   //     avatar: require('../../../assets/images/profile.jpeg'),
    //   //   },
    //   // });
    // } else {
    //   navigation.navigate('AuthStack', {
    //     screen: 'CreateProfile',
    //     params: {
    //       userID: userData.userID,
    //     },
    //   });
    // }
  };

  const onSuccessChat = (res, status) => {
    if (status === 201) {
      setShowLoading('');
      navigation.navigate('ChatScreen', {chatID: res});
    } else {
      socketService.emit('newChat', {
        userID: userData.userID,
        recipientID: data.supplierDetails.supplierID,
      });
      setTimeout(() => {
        setShowLoading('');
        navigation.navigate('ChatScreen', {chatID: res});
      }, 5000);
    }
  };

  const onErrorChat = err => {
    setShowLoading('');
    Toast.show({
      type: 'error',
      text1: 'Error!',
      text2: 'Please check your internet connection...',
    });
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
        <Text style={{...CustomStyles.subTitle}}>
          {categoryData[data?.productDetails?.Category]}
        </Text>
        <Icon name={'arrowright'} type="ant-design" color={'transparent'} />
      </View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        contentContainerStyle={{
          paddingTop: height / 4,
        }}
        showsVerticalScrollIndicator={false}>
        {isSeller === false && (
          <>
            <View style={styles.sellerInfoCont(i18n.language)}>
              <View style={styles.sellerInfoWrap(i18n.language)}>
                <Image
                  source={{
                    uri: `http://${BaseUrl}:3000/media/${data?.supplierDetails?.profilePicture}`,
                  }}
                  style={styles.avatar}
                />
                <View style={styles.nameCont(i18n.language)}>
                  <Text
                    style={{...CustomStyles.heading3, fontSize: 16}}
                    onPress={() => {
                      navigation.navigate('SellerInfo');
                    }}>
                    {data?.supplierDetails?.name}
                  </Text>
                  <Text style={{...CustomStyles.paragraph, fontSize: 12}}>
                    {data?.supplierDetails?.city}
                  </Text>
                </View>
              </View>
              <View style={styles.shareCont}>
                <TouchableOpacity
                  onPress={() => {
                    onShare();
                  }}>
                  <Image
                    style={styles.shareIcon}
                    source={require('../../../assets/icons/share.png')}
                  />
                </TouchableOpacity>
                <Image
                  style={styles.shareIcon}
                  source={require('../../../assets/icons/favorite.png')}
                />
              </View>
            </View>
            <View style={styles.reviewCont(i18n.language)}>
              <Icon name="star" size={15} color={Colors.primary} />
              <Text style={styles.review}>
                {t('good')} {t('seller')}
              </Text>
            </View>
          </>
        )}
        <Text style={styles.contactTitle(i18n.language)}>
          {t('productInfo')}
        </Text>
        <View style={styles.descripCont}>
          <DetailTabs
            title={t('productName')}
            value={data?.productDetails?.productName}
          />
          <DetailTabs
            title={t('description')}
            value={data?.productDetails?.description}
          />
          {/* <DetailTabs
            title={t('quality&Freshness')}
            value={t('quality&FreshnessVal')}
          /> */}
          <DetailTabs
            title={t('region')}
            value={data?.productDetails?.region}
          />
          {/* <DetailTabs title={t('availability')} value={t('availabilityVal')} /> */}
          <DetailTabs
            title={t('price')}
            value={`${data?.productDetails?.pricePerUnit}/${data?.productDetails?.unit}`}
          />
          <DetailTabs
            title={t('terms&Condition')}
            value={
              i18n.language === 'en'
                ? data?.productDetails?.terms
                  ? JSON.parse(data?.productDetails?.terms)?.map(k => {
                      return `•\t${k}\n`;
                    })
                  : ''
                : data?.productDetails?.terms.replace('[ ]', '\n')
            }
          />
        </View>

        {isSeller === false && (
          <>
            <Text style={styles.contactTitle(i18n.language)}>
              {t('contactInfo')}
            </Text>

            <View style={styles.contactTabCont(i18n.language)}>
              <TouchableOpacity
                style={styles.contactTab}
                onPress={() => {
                  copyToClipboard(data?.supplierDetails?.phone);
                }}>
                <Text style={{...CustomStyles.paragraph}}>
                  {data?.supplierDetails?.phone}
                </Text>
                <Image
                  source={require('../../../assets/icons/copy.png')}
                  style={{width: 15, height: 15, resizeMode: 'contain'}}
                />
              </TouchableOpacity>
              <View style={styles.contactTab}>
                <Text style={styles.buttonTitle}>
                  {t('whatappChat')}
                  {data?.supplierDetails?.whatsapp}
                </Text>
                <Image
                  source={require('../../../assets/icons/whatsapp.png')}
                  style={{width: 15, height: 15, resizeMode: 'contain'}}
                />
              </View>
            </View>
          </>
        )}
        {isSeller === false && (
          <Button
            backgroundColor={userData.isVerified ? Colors.primary : Colors.grey}
            borderColor={Colors.primary}
            round={50}
            titleColor={'white'}
            title={t('chatwithSeller')}
            style={{
              marginTop: 50,
            }}
            onPress={handleChat}
          />
        )}
        <View style={{height: 200}}></View>
      </Animated.ScrollView>

      <Animated.View style={{position: 'absolute', top: 0, marginTop: 40}}>
        <Animated.View
          style={{
            height: height / 4,
            backgroundColor: 'blue',
            width: width,
            resizeMode: 'stretch',
            ...animatedStyles,
          }}>
          <ScrollView
            ref={scrollView => {
              _scrollView = scrollView;
            }}
            horizontal={true}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={true}
            onScroll={(event: any) => {
              setSliderPage(event);
            }}>
            {data?.productDetails?.productImages.map(k => {
              return (
                <RenderComponent
                  image={{
                    uri: `http://${BaseUrl}:3000/media/${k}`,
                  }}
                />
              );
            })}
          </ScrollView>
          <View style={styles.paginationWrapper}>
            {data?.productDetails?.productImages?.map((key, index) => (
              <View
                style={[
                  styles.paginationDots,
                  {
                    opacity: pageIndex === index ? 1 : 0.2,
                    width: pageIndex === index ? 20 : 5,
                  },
                ]}
                key={index}
              />
            ))}
          </View>
        </Animated.View>
      </Animated.View>
      <CustomActivityIndicator data={showLoading} />
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
  buttonTitle: language => {
    return {
      ...CustomStyles.paragraph,
      width: '90%',
      textAlign: language === 'en' ? 'left' : 'center',
    };
  },
  contactTabCont: language => {
    return {
      width: '95%',
      flexDirection: language === 'en' ? 'row' : 'row-reverse',
      justifyContent: 'space-between',
      alignSelf: 'center',
    };
  },
  sellerInfoCont: language => {
    return {
      flexDirection: language === 'en' ? 'row' : 'row-reverse',
      width: '95%',
      alignSelf: 'center',
      height: 60,
      alignItems: 'center',
      marginTop: 10,
    };
  },
  sellerInfoWrap: language => {
    return {
      flexDirection: language === 'en' ? 'row' : 'row-reverse',
      width: '75%',
      alignItems: 'center',
    };
  },
  avatar: {width: 50, height: 50, borderRadius: 100},
  nameCont: language => {
    return {
      height: 35,
      marginLeft: language === 'en' ? 15 : 0,
      marginRight: language === 'urd' ? 15 : 0,
      alignItems: language === 'en' ? 'flex-start' : 'flex-end',
    };
  },
  shareCont: {
    flexDirection: 'row',
    width: '23%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shareIcon: {width: 35, height: 35, resizeMode: 'contain'},
  reviewCont: language => {
    return {
      flexDirection: language === 'en' ? 'row' : 'row-reverse',
      width: '95%',
      marginVertical: 8,
      alignSelf: 'center',
    };
  },
  review: {
    fontSize: 12,
    color: Colors.dark,
    fontFamily: 'Poppins-Regular',
  },
  descripCont: {
    borderWidth: 0.5,
    borderColor: Colors.complimantory,
    width: '95%',
    alignSelf: 'center',
  },
  contactTitle: language => {
    return {
      ...CustomStyles.heading3,
      fontSize: 16,
      width: '95%',
      alignSelf: 'center',
      marginVertical: 10,
      textAlign: language === 'en' ? 'left' : 'right',
    };
  },
  imageStyle: {
    width: width,
    height: '100%',
    resizeMode: 'contain',
  },
});

export default ProductDetail;
