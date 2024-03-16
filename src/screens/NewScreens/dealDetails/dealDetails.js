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
  TextInput,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {Colors, CustomStyles, FontFamily, FontSize} from '../../../theme/theme';
import Button from '../../../components/Button';
import Animated, {
  useSharedValue,
  interpolate,
  useAnimatedScrollHandler,
  Extrapolation,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {BottomSheet} from '@rneui/themed';
import {BaseUrl} from '../../../utils/constans';
import {handleDealDetails, updateDealStatus} from '../../../redux/actions/home';
import socketService from '../../../utils/socketservice';

const {width, height} = Dimensions.get('screen');

const BuyerOptions = {
  0: {
    tag: 'Waiting for seller response',
    buttons: 1,
    title: 'Withdraw Request',
    status: 1,
  },
  1: {
    tag: 'You withdrew request',
    buttons: '',
  },
  2: {
    tag: 'Seller accepted your request',
    buttons: 1,
    title: 'Request to Cancel',
    status: 5,
  },
  3: {
    tag: 'Seller Declined your request',
    buttons: '',
  },
  4: {
    tag: 'Seller asked to cancel request',
    buttons: 2,
    decline: {
      title: 'Decline',
      status: 10,
    },
    accept: {
      title: 'Accept',
      status: 8,
    },
  },
  5: {
    tag: 'You requested to cancel the deal',
    buttons: '',
  },
  6: {
    tag: 'Seller completed the deal',
    buttons: 1,
    title: 'Complete Deal',
    status: 7,
  },
  7: {
    tag: 'Deal is Closed',
    buttons: '',
  },
  8: {
    tag: 'You Accepted to cancel the request',
    buttons: '',
  },
  9: {
    tag: 'Seller Accepted to cancel',
    buttons: '',
  },
  10: {
    tag: 'You Declined to cancel',
    buttons: '',
  },
  11: {
    tag: 'Seller Declined to cancel',
    buttons: '',
  },
};

const sellerOptions = {
  0: {
    tag: '',
    buttons: 2,
    decline: {
      title: 'Reject',
      status: 3,
    },
    accept: {
      title: 'Accept',
      status: 2,
    },
  },
  1: {
    tag: 'Buyer withdrew request',
    buttons: '',
  },

  2: {
    tag: 'You accepted the offer',
    buttons: 2,
    decline: {
      title: 'Request to Cancel',
      status: 4,
    },
    accept: {
      title: 'Complete Deal',
      status: 6,
    },
  },

  3: {
    tag: 'You declined the request',
    buttons: '',
  },
  4: {
    tag: 'You requested to cancel the deal',
    buttons: '',
  },
  5: {
    tag: 'Buyer requested to cancel the deal',
    buttons: 2,
    decline: {
      title: 'Decline',
      status: 11,
    },
    accept: {
      title: 'Accept',
      status: 9,
    },
  },
  6: {
    tag: 'You completed the Deal',
    buttons: '',
  },
  7: {
    tag: 'Deal is Closed',
    buttons: '',
  },
  8: {
    tag: 'Buyer accepted to cancel',
    buttons: '',
  },
  9: {
    tag: 'You accepted to cancel',
    buttons: '',
  },
  10: {
    tag: 'Buyer declined to cancel',
    buttons: 1,
    title: 'Complete Deal',
    status: 6,
  },
  11: {
    tag: 'You declined to cancel',
    buttons: 1,
    title: 'Complete Deal',
    status: 6,
  },
};

const DealDetail = ({navigation, route}) => {
  const {dealData} = route.params;
  const dispatch = useDispatch();
  const {userData} = useSelector(state => state.auth);

  const {t, i18n} = useTranslation();
  const [sliderState, setSliderState] = useState({currentPage: 0});
  const [bottom, setBottom] = useState(false);
  const [review, setReview] = useState(true);
  const {currentPage} = sliderState;

  const imageHeight = useSharedValue(0);

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
        <Image
          source={image}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'contain',
          }}
        />
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

  const handleStatusUpdate = status => {
    const data = {
      offerID: dealData.offer.offerID,
      userID: userData.userID,
      status: status,
    };
    dispatch(
      updateDealStatus(
        data,
        () => {
          socketService.emit('dealUpdated', dealData.offer.offerID);
        },
        onError,
      ),
    );
  };

  const onSuccess = res => {
    navigation.setParams({dealData: res});
  };

  const onError = err => {};

  const updateDealData = () => {
    const data = {
      offerID: dealData.offer.offerID,
      userID: userData.userID,
    };
    dispatch(handleDealDetails(data, onSuccess, onError));
  };

  useEffect(() => {
    const dealUpdated = offerID => {
      if (offerID === dealData.offer.offerID) {
        updateDealData();
      }
    };

    socketService.on('dealUpdated', dealUpdated);
    return () => {
      socketService.removeListener('dealUpdated', dealUpdated);
    };
  }, []);

  useEffect(() => {
    updateDealData();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          ...styles.topCont,
          flexDirection: i18n.language === 'en' ? 'row' : 'row-reverse',
        }}>
        <Icon
          name={i18n.language === 'en' ? 'arrowleft' : 'arrowright'}
          type="ant-design"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Text style={{...CustomStyles.subTitle}}>
          {dealData.product.productName}
        </Text>
        <Icon name={'arrowright'} type="ant-design" color={'transparent'} />
      </View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        contentContainerStyle={{
          paddingTop: height / 4,
        }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.productInfoWrap}>
          <Text
            style={{
              ...CustomStyles.heading3,
              fontSize: 16,
              width: '95%',
              alignSelf: 'center',
              marginVertical: 10,
              textAlign: i18n.language === 'en' ? 'left' : 'right',
            }}>
            Product Description
          </Text>
          <Text
            style={{
              ...CustomStyles.paragraph,
              width: '100%',
              padding: 10,
              textAlign: i18n.language === 'en' ? 'left' : 'right',
            }}>
            {dealData.product.description}
          </Text>
          <Text
            style={{
              ...CustomStyles.heading3,
              fontSize: 16,
              width: '95%',
              alignSelf: 'center',
              textAlign: i18n.language === 'en' ? 'left' : 'right',

              marginVertical: 10,
            }}>
            {dealData.user.isSeller ? 'Seller' : 'Buyer'} Info
          </Text>
        </View>

        {/* user Info */}
        <View
          style={{
            borderWidth: 0.5,
            borderColor: Colors.complimantory,
            width: '95%',
            alignSelf: 'center',
          }}>
          <View
            style={{
              flexDirection: i18n.language === 'en' ? 'row' : 'row-reverse',
              width: '95%',
              alignSelf: 'center',
              height: 60,
              alignItems: 'center',
              marginTop: 10,
            }}>
            <View
              style={{
                flexDirection: i18n.language === 'en' ? 'row' : 'row-reverse',
                width: '75%',
                alignItems: 'center',
              }}>
              <Image
                source={{
                  uri: `http://${BaseUrl}:3000/media/${dealData.user.profilePicture}`,
                }}
                style={{width: 50, height: 50, borderRadius: 100}}
              />
              <View
                style={{
                  height: 35,
                  marginLeft: i18n.language === 'en' ? 15 : 0,
                  marginRight: i18n.language === 'urd' ? 15 : 0,
                  alignItems:
                    i18n.language === 'en' ? 'flex-start' : 'flex-end',
                }}>
                <Text style={{...CustomStyles.heading3, fontSize: 16}}>
                  {dealData.user.name}
                  {'    '}
                  <Text style={{...CustomStyles.paragraph, fontSize: 12}}>
                    {dealData.user.city}
                  </Text>
                </Text>
                <View
                  style={{
                    flexDirection:
                      i18n.language === 'en' ? 'row' : 'row-reverse',
                    width: '95%',
                    alignSelf: 'center',
                  }}>
                  <Icon name="star" size={15} color={Colors.primary} />
                  <Text
                    style={{
                      fontSize: 12,
                      color: Colors.dark,
                      fontFamily: 'Poppins-Regular',
                    }}>
                    {' '}
                    4.7{'  '}(102 Reviews)
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              width: '95%',
              flexDirection: i18n.language === 'en' ? 'row' : 'row-reverse',
              justifyContent: 'space-between',
              alignSelf: 'center',
              marginVertical: 20,
            }}>
            <TouchableOpacity
              style={styles.contactTab}
              onPress={() => {
                copyToClipboard(dealData.user.phone);
              }}>
              <Text style={{...CustomStyles.paragraph}}>
                {dealData.user.phone}
              </Text>
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
                {dealData.user.whatsapp}
              </Text>
              <Image
                source={require('../../../assets/icons/whatsapp.png')}
                style={{width: 15, height: 15, resizeMode: 'contain'}}
              />
            </View>
          </View>
        </View>
        {/* deal info */}
        <Text
          style={{
            ...CustomStyles.heading3,
            fontSize: 16,
            textAlign: i18n.language === 'en' ? 'left' : 'right',
            marginVertical: 10,
            width: '95%',
            alignSelf: 'center',
          }}>
          {t('agreementInfo')}
        </Text>
        <View
          style={{
            borderWidth: 0.5,
            borderColor: Colors.complimantory,
            width: '95%',
            alignSelf: 'center',
            marginTop: 10,
          }}>
          <DetailTabs
            title={t('agreedAmount')}
            value={`Rs ${dealData.offer.offeredPrice} / 40 kg`}
          />
          <DetailTabs
            title={t('agreedQuantity')}
            value={`${dealData.offer.requiredQuantity} kg`}
          />
          <DetailTabs
            title={t('agreedDate')}
            value={dealData.offer.estimatedDate}
          />
        </View>

        <Text
          style={{
            ...CustomStyles.heading3,
            fontSize: 16,
            width: '95%',
            alignSelf: 'center',
            marginVertical: 10,
            textAlign: i18n.language === 'en' ? 'left' : 'right',
          }}>
          {t('terms&Conditions')}
        </Text>
        <View
          style={{
            borderWidth: 0.5,
            borderColor: Colors.complimantory,
            width: '95%',
            alignSelf: 'center',
            marginTop: 10,
          }}>
          {JSON.parse(dealData.offer.terms).map(k => {
            return (
              <Text
                style={{
                  ...CustomStyles.paragraph,
                  width: '95%',
                  padding: 10,
                  textAlign: i18n.language === 'en' ? 'left' : 'right',
                }}>
                <Text style={{color: 'black'}}>•</Text> {k}
              </Text>
            );
          })}
        </View>

        {dealData.user.isSeller ? (
          <View>
            <Text
              style={{
                color: Colors.primary,
                fontSize: 14,
                fontWeight: '500',
                textAlign: 'center',
                marginVertical: 15,
              }}>
              {BuyerOptions[dealData.offer.status].tag}
            </Text>
            {BuyerOptions[dealData.offer.status].buttons !== '' &&
              (BuyerOptions[dealData.offer.status].buttons === 1 ? (
                <Button
                  title={BuyerOptions[dealData.offer.status].title}
                  titleColor={'white'}
                  borderColor={Colors.primary}
                  backgroundColor={Colors.primary}
                  round={10}
                  width="95%"
                  onPress={() =>
                    handleStatusUpdate(
                      BuyerOptions[dealData.offer.status].status,
                    )
                  }
                />
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                  }}>
                  <Button
                    title={BuyerOptions[dealData.offer.status].decline.title}
                    titleColor={Colors.primary}
                    borderColor={Colors.primary}
                    backgroundColor={'white'}
                    round={10}
                    width="46.75%"
                    onPress={() =>
                      handleStatusUpdate(
                        BuyerOptions[dealData.offer.status].decline.status,
                      )
                    }
                  />
                  <Button
                    title={BuyerOptions[dealData.offer.status].accept.title}
                    titleColor={'white'}
                    borderColor={Colors.primary}
                    backgroundColor={Colors.primary}
                    round={10}
                    width="46.75%"
                    onPress={() =>
                      handleStatusUpdate(
                        BuyerOptions[dealData.offer.status].accept.status,
                      )
                    }
                  />
                </View>
              ))}
          </View>
        ) : (
          <View>
            <Text
              style={{
                color: Colors.primary,
                fontSize: 14,
                fontWeight: '500',
                textAlign: 'center',
                marginVertical: 15,
              }}>
              {sellerOptions[dealData.offer.status].tag}
            </Text>
            {sellerOptions[dealData.offer.status].buttons !== '' &&
              (sellerOptions[dealData.offer.status].buttons === 1 ? (
                <Button
                  title={sellerOptions[dealData.offer.status].title}
                  titleColor={'white'}
                  borderColor={Colors.primary}
                  backgroundColor={Colors.primary}
                  round={10}
                  width="95%"
                  onPress={() =>
                    handleStatusUpdate(
                      sellerOptions[dealData.offer.status].status,
                    )
                  }
                />
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                  }}>
                  <Button
                    title={sellerOptions[dealData.offer.status].decline.title}
                    titleColor={Colors.primary}
                    borderColor={Colors.primary}
                    backgroundColor={'white'}
                    round={10}
                    width="46.75%"
                    onPress={() =>
                      handleStatusUpdate(
                        sellerOptions[dealData.offer.status].decline.status,
                      )
                    }
                  />
                  <Button
                    title={sellerOptions[dealData.offer.status].accept.title}
                    titleColor={'white'}
                    borderColor={Colors.primary}
                    backgroundColor={Colors.primary}
                    round={10}
                    width="46.75%"
                    onPress={() =>
                      handleStatusUpdate(
                        sellerOptions[dealData.offer.status].accept.status,
                      )
                    }
                  />
                </View>
              ))}
          </View>
        )}
        <View style={{height: 50}} />
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
            {dealData.product.productImages.map(k => {
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
            {dealData.product.productImages.map((key, index) => (
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
      <BottomSheet
        modalProps={{}}
        isVisible={bottom}
        containerStyle={{
          height: height / 2,
          backgroundColor: 'rgba(0,0,0,0.30)',
        }}>
        <View style={styles.bottomCont}>
          <View
            style={{
              ...styles.topBar,
            }}>
            <Text style={{fontFamily: FontFamily.title}}>
              {t('sellerFeedback')}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: FontFamily.title,
              width: '95%',
              alignSelf: 'center',
              textAlign: i18n.language === 'en' ? 'left' : 'right',
              marginTop: 10,
            }}>
            {t('sellerFeedback')}
          </Text>
          <View
            style={{
              width: '95%',
              alignSelf: 'center',
              flexDirection: i18n.language === 'en' ? 'row' : 'row-reverse',
              justifyContent: 'space-between',
            }}>
            <Button
              backgroundColor={review === t('bad') ? Colors.primary : 'white'}
              borderColor={Colors.primary}
              round={10}
              width="30%"
              title={t('bad')}
              titleColor={review === t('bad') ? 'white' : Colors.secondary}
              titleStyle={{
                fontFamily: FontFamily.subTitle,
                fontSize: FontSize.paragraph,
              }}
              style={{marginVertical: 20}}
              onPress={() => {
                setReview(t('bad'));
              }}
            />
            <Button
              backgroundColor={
                review === t('normal') ? Colors.primary : 'white'
              }
              borderColor={Colors.primary}
              round={10}
              width="30%"
              title={t('normal')}
              titleColor={review === t('normal') ? 'white' : Colors.secondary}
              titleStyle={{
                fontFamily: FontFamily.subTitle,
                fontSize: FontSize.paragraph,
              }}
              style={{marginVertical: 20}}
              onPress={() => {
                setReview(t('normal'));
              }}
            />
            <Button
              backgroundColor={review === t('good') ? Colors.primary : 'white'}
              borderColor={Colors.primary}
              round={10}
              width="30%"
              title={t('good')}
              titleColor={review === t('good') ? 'white' : Colors.secondary}
              titleStyle={{
                fontFamily: FontFamily.subTitle,
                fontSize: FontSize.paragraph,
              }}
              style={{marginVertical: 20}}
              onPress={() => {
                setReview(t('good'));
              }}
            />
          </View>
          <TextInput
            placeholder={t('reviewDes')}
            multiline
            style={{
              width: '95%',
              borderWidth: 1,
              borderColor: Colors.complimantory,
              alignSelf: 'center',
              padding: 5,
              height: 130,
              textAlign: i18n.language === 'en' ? 'left' : 'right',
            }}
          />
          <Button
            backgroundColor={Colors.primary}
            borderColor={Colors.primary}
            round={50}
            title={t('submit')}
            titleColor={'white'}
            style={{marginVertical: 20}}
            onPress={() => {
              setBottom(!bottom);
            }}
          />
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  topCont: {
    width: '95%',
    alignSelf: 'center',
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
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
  productInfoWrap: {},
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
  bottomCont: {
    height: 500,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  topBar: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.complimantory,
  },
});

export default DealDetail;
