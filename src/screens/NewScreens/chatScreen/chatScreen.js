import {Icon, fonts} from '@rneui/base';
import React, {useState, useCallback, useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import socketService from '../../../utils/socketservice';

import {Colors, CustomStyles, FontFamily, FontSize} from '../../../theme/theme';
import RBSheet from 'react-native-raw-bottom-sheet';
import {ScrollView} from 'react-native';
import {BaseUrl} from '../../../utils/constans';
import {
  handleCreatingOffer,
  handleFetchingProducts,
} from '../../../redux/actions/home';
import Button from '../../../components/Button';
import {CustomActivityIndicator} from '../../../components/CustomActivityIndicator';
import Toast from 'react-native-toast-message';
import CustomScrollView from '../../../components/CustomScrollView';
import OfferCard from '../../../components/OfferCard';

const ProductRenderItem = ({item}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        borderWidth: 1,
        borderColor: 'rgba(189, 189, 189, 1)',
        borderRadius: 10,
        width: width - 20,
        alignSelf: 'center',
        marginVertical: 5,
      }}>
      <Image
        source={{uri: `http://${BaseUrl}:3000/media/${item.productImages}`}}
        style={{
          width: 100,
          height: 100,
          borderRadius: 10,
          backgroundColor: Colors.grey,
          resizeMode: 'contain',
        }}
      />
      <View
        style={{
          paddingLeft: 10,
          width: width - 130,
        }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: '500',
            color: 'black',
          }}>
          {item.productName}
        </Text>
        <Text
          numberOfLines={2}
          style={{
            color: 'rgba(130, 130, 130, 1)',
            fontSize: 13,
            fontWeight: '400',
            marginVertical: 5,
          }}>
          {item.description}
        </Text>
        <Text
          style={{
            color: 'rgba(51, 51, 51, 1)',
            fontSize: 13,
            fontWeight: '500',
          }}>
          Price :{' '}
          <Text
            style={{
              fontWeight: '400',
            }}>
            Rs {item.pricePerUnit}/{item.unit}
          </Text>
        </Text>
      </View>
    </View>
  );
};

const CustomInputField = ({title, value, setValue, placeholder}) => {
  return (
    <View
      style={{
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 5,
      }}>
      <Text
        style={{
          fontSize: 16,
          fontFamily: FontFamily.title,
          color: 'black',
          width: '48%',
        }}>
        {title}
      </Text>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholderTextColor={Colors.dark}
        placeholder={placeholder}
        keyboardType="number-pad"
        style={{
          borderWidth: 1,
          borderRadius: 10,
          width: '50%',
          color: 'black',
          fontSize: 16,
          paddingHorizontal: 10,
          textAlign: 'center',
        }}
      />
    </View>
  );
};

const {width, height} = Dimensions.get('screen');
const ChatScreen = ({route, navigation}) => {
  const dispatch = useDispatch();
  const productsPicker = useRef();
  const refRBSheet = useRef();
  const {chatID} = route.params;
  const {t, i18n} = useTranslation();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const {chats} = useSelector(state => state.home);
  const {userData, isSeller} = useSelector(state => state.auth);
  const [supplierProducts, setSupplierProducts] = useState([]);
  const [term, setTerm] = useState('');
  const [showActivity, setShowActivity] = useState('');
  const scroll_toBottom = useRef();

  const [newMessage, setNewMessage] = useState('');
  const [selectedProductId, setSelectedProductID] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [offerQuantity, setOfferQuantity] = useState('');
  const [offerDate, setOfferDate] = useState('');
  const [offerTerms, setOfferTerms] = useState([]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    scroll_toBottom.current?.scrollToEnd();
    fetchSupplierProducts();
  }, [chats]);

  const renderItem = ({item, index}) => {
    if (item?.isOffer) return <OfferCard OfferID={item.offerID} />;
    else
      return (
        <View
          style={{
            maxWidth: '70%',
            borderRadius: 15,
            padding: 10,
            backgroundColor:
              item.sender === userData.userID
                ? 'rgba(242,153,74,1)'
                : 'rgba(0,183,158,1)',
            alignSelf:
              item.sender === userData.userID ? 'flex-end' : 'flex-start',
            marginHorizontal: 10,
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 16,
              fontWeight: '400',
            }}>
            {item.message}
          </Text>
        </View>
      );
  };

  const handleSendNewMessage = () => {
    socketService.emit('newMessage', {
      chatID: chatID,
      message: {
        sender: userData.userID,
        message: newMessage,
        timestamp: new Date(),
      },
    });
    setNewMessage('');
    scroll_toBottom.current.scrollToEnd();
  };

  const handleGetSupplierProducts = () => {
    productsPicker.current.open();
  };

  const fetchSupplierProducts = () => {
    const qs = require('qs');
    let data = qs.stringify({
      chatID: chatID,
      userID: userData.userID,
    });
    dispatch(handleFetchingProducts(data, onSuccess, onError));
  };

  const onSuccess = res => {
    setSupplierProducts(res);
  };

  const onError = err => {
    console.log(' Error chatScreen handleGetSupplierProducts');
  };

  const handleSendOffer = () => {
    setShowActivity({
      heading1: 'Creating Offer',
      heading2: 'Please wait...',
    });
    const qs = require('qs');
    let data = qs.stringify({
      buyerID: userData.userID,
      requiredQuantity: offerQuantity,
      offeredPrice: offerPrice,
      productID: selectedProductId,
      terms: JSON.stringify(offerTerms),
      estimatedDate: offerDate,
    });
    dispatch(
      handleCreatingOffer(data, onSuccessCreatingOffer, onErrorCreatingOffer),
    );
  };

  const onSuccessCreatingOffer = res => {
    socketService.emit('newOffer', {
      sender: userData.userID,
      chatID: chatID,
      offerID: res,
      timestamp: new Date(),
    });
    setShowActivity('');
    Toast.show({
      type: 'success',
      text1: 'Offer send successfully...',
    });
    refRBSheet.current.close();
    setOfferPrice('');
    setOfferQuantity('');
    setSelectedProductID('');
  };

  const onErrorCreatingOffer = err => {
    console.log(err);
    setShowActivity('');
    Toast.show({
      type: 'error',
      text1: 'Error sending offer...',
    });
  };

  useEffect(() => {
    socketService.emit('lastInChat', {
      chatID: chatID,
      lastInChat: new Date(),
      senderID: userData.userID,
    });
    return () =>
      socketService.emit('lastInChat', {
        chatID: chatID,
        lastInChat: new Date(),
        senderID: userData.userID,
      });
  }, [chatID, userData]);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.topTab(i18n.language)}>
        <View style={styles.topImgCont(i18n.language)}>
          <Icon
            name={i18n.language === 'en' ? 'arrowleft' : 'arrowright'}
            type="ant-design"
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Image
            source={{
              uri: `http://${BaseUrl}:3000/media/${
                chats.filter(f => f.chatID === chatID)[0].profilePicture
              }`,
            }}
            style={styles.topImage(i18n.language)}
          />
          <Text style={styles.topName(i18n.language)}>
            {chats.filter(f => f.chatID === chatID)[0].recipientName}
          </Text>
        </View>
        <Icon
          name="dots-three-vertical"
          type="entypo"
          size={18}
          color={Colors.dark}
        />
      </View>
      <FlatList
        ref={scroll_toBottom}
        data={chats.filter(f => f.chatID === chatID)[0].conversation}
        renderItem={renderItem}
        ItemSeparatorComponent={
          <View
            style={{
              height: 10,
            }}
          />
        }
        style={{
          flex: 1,
        }}
      />
      <View>
        {!isKeyboardVisible && !isSeller && supplierProducts.length !== 0 && (
          <TouchableOpacity
            onPress={() => refRBSheet.current.open()}
            activeOpacity={1}
            style={{
              backgroundColor: 'white',
              width: '100%',
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 16,
                fontWeight: '500',
                textDecorationLine: 'underline',
                textDecorationColor: Colors.primary,
              }}>
              Create an Offer
            </Text>
          </TouchableOpacity>
        )}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
          }}>
          <TextInput
            multiline={true}
            value={newMessage}
            onChangeText={setNewMessage}
            style={{
              color: 'black',
              fontSize: 16,
              fontFamily: FontFamily.paragraph,
              width: '85%',
              paddingVertical: 10,
              maxHeight: 100,
            }}
            placeholder="Write Here..."
            placeholderTextColor={Colors.dark}
          />
          <TouchableOpacity
            style={{
              width: 35,
              height: 35,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 5,
            }}
            activeOpacity={1}
            onPress={handleSendNewMessage}>
            <Feather name="send" color={Colors.primary} size={30} />
          </TouchableOpacity>
        </View>
      </View>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        height={height / 1.055}
        customStyles={{
          container: {
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          },
        }}>
        <CustomScrollView>
          <TouchableOpacity
            onPress={handleGetSupplierProducts}
            style={{
              width: '95%',
              height: 55,
              borderRadius: 10,
              alignSelf: 'center',
              backgroundColor: Colors.grey,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
              marginVertical: 10,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: FontFamily.title,
                color: 'black',
              }}>
              Select Product
            </Text>
            <Entypo name="chevron-down" color="black" size={22} />
          </TouchableOpacity>
          {selectedProductId !== '' && (
            <View
              style={{
                borderBottomWidth: 1,
                paddingBottom: 10,
                marginBottom: 10,
                borderColor: Colors.grey,
              }}>
              <ProductRenderItem
                item={supplierProducts.find(
                  f => f.productID === selectedProductId,
                )}
              />
              <Entypo
                name="circle-with-cross"
                color="rgba(0, 0, 0, 0.3)"
                size={22}
                style={{
                  position: 'absolute',
                  right: 20,
                  top: 10,
                }}
                onPress={() => setSelectedProductID('')}
              />
            </View>
          )}
          <CustomInputField
            title={'Offer Price(Per 40kg):'}
            value={offerPrice}
            setValue={setOfferPrice}
            placeholder="Rupees"
          />
          <CustomInputField
            title={'Required Quantity(kg):'}
            value={offerQuantity}
            setValue={setOfferQuantity}
            placeholder="kilograms"
          />
          <CustomInputField
            title={'Estimated date:'}
            value={offerDate}
            setValue={setOfferDate}
            placeholder="DD/MM/YYYY"
          />
          <Text
            style={{
              fontSize: 16,
              fontFamily: FontFamily.title,
              color: 'black',
              marginLeft: 10,
            }}>
            Describe your terms
          </Text>
          <FlatList
            data={offerTerms}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    width: width - 20,
                    alignSelf: 'center',
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 15,
                      fontWeight: 'normal',
                    }}>
                    <Text
                      style={{
                        fontWeight: '600',
                      }}>
                      {index + 1}-{'\t'}
                    </Text>
                    {item}
                  </Text>
                </View>
              );
            }}
          />
          <TextInput
            multiline
            value={term}
            onChangeText={setTerm}
            placeholder="write your term here"
            style={{
              width: width - 20,
              color: 'black',
              fontSize: 13,
              minHeight: 90,
              borderWidth: 1,
              borderColor: Colors.dark,
              borderRadius: 10,
              alignSelf: 'center',
              textAlignVertical: 'top',
              paddingHorizontal: 10,
            }}
          />
          {term.length !== 0 && (
            <TouchableOpacity
              onPress={() => {
                setOfferTerms(prev => [...prev, term]);
                setTerm('');
              }}
              style={{
                alignSelf: 'flex-end',
                marginRight: 10,
                paddingHorizontal: 10,
                paddingVertical: 5,
                backgroundColor: 'white',
                borderWidth: 1,
                borderColor: Colors.primary,
                borderRadius: 100,
                marginTop: 5,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: Colors.primary,
                }}>
                Add Term
              </Text>
            </TouchableOpacity>
          )}
          <Button
            onPress={handleSendOffer}
            title="Send Offer"
            backgroundColor={Colors.primary}
            titleColor={'white'}
            round={100}
          />
        </CustomScrollView>
        <CustomActivityIndicator data={showActivity} />
      </RBSheet>
      <RBSheet
        ref={productsPicker}
        closeOnDragDown={true}
        closeOnPressMask={false}
        dragFromTopOnly
        customStyles={{
          container: {
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          },
        }}>
        <FlatList
          data={supplierProducts}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  setSelectedProductID(item.productID);
                  productsPicker.current.close();
                }}>
                <ProductRenderItem item={item} />
              </TouchableOpacity>
            );
          }}
        />
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  topTab: language => {
    return {
      height: 40,
      flexDirection: language === 'en' ? 'row' : 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '95%',
      alignSelf: 'center',
    };
  },
  topImgCont: language => {
    return {
      flexDirection: language === 'en' ? 'row' : 'row-reverse',
      alignItems: 'center',
      width: '80%',
    };
  },
  topImage: language => {
    return {
      width: 35,
      height: 35,
      borderRadius: 50,
      marginRight: language === 'en' ? 0 : 15,
      marginLeft: language !== 'en' ? 0 : 15,
    };
  },
  topName: language => {
    return {
      ...CustomStyles.heading3,
      marginLeft: 10,
      marginLeft: language !== 'en' ? 0 : 15,
      marginRight: language === 'en' ? 0 : 10,
    };
  },
  messageAvatar: language => {
    return {
      width: 35,
      height: 35,
      borderRadius: 50,
      marginRight: language === 'en' ? 0 : 15,
      marginLeft: language !== 'en' ? 0 : 15,
    };
  },
  bottomCont: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 8,
    width: '95%',
    alignSelf: 'center',
    backgroundColor: Colors.grey,
    marginTop: 20,
  },
  topBar: language => {
    return {
      flexDirection: 'row',
      paddingHorizontal: 15,
      alignSelf: 'center',
      height: 50,
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      borderBottomWidth: 0.5,
      borderColor: Colors.dark,
      flexDirection: language === 'en' ? 'row' : 'row-reverse',
    };
  },
  offerProductWrap: language => {
    return {
      width: '95%',
      alignSelf: 'center',
      height: 100,
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
  offerProductImage: {
    backgroundColor: Colors.grey,
    width: 90,
    height: 90,
    borderRadius: 5,
    resizeMode: 'contain',
  },
  offeredPriceCont: language => {
    return {
      width: '70%',
      alignItems: language === 'en' ? 'flex-start' : 'flex-end',
    };
  },
  offerProductName: {
    fontFamily: FontFamily.headerSemiBold,
    fontSize: 14,
    color: 'black',
  },
  descipVal: language => {
    return {
      fontFamily: FontFamily.paragraph,
      fontSize: 12,
      color: Colors.complimantory,
      textAlign: language === 'en' ? 'left' : 'right',
    };
  },
  offerProductWithWrap: {
    width: '80%',
    alignSelf: 'center',
    height: 140,
    borderWidth: 0.5,
    borderColor: Colors.complimantory,
    borderRadius: 10,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    justifyContent: 'space-between',
  },
  offerProductWithImage: {
    backgroundColor: Colors.grey,
    width: '30%',
    height: '100%',
    borderRadius: 5,
    resizeMode: 'contain',
  },
  offerProductWithName: {
    fontFamily: FontFamily.headerSemiBold,
    fontSize: 14,
    color: 'black',
  },
  iconDes: {
    fontFamily: FontFamily.paragraph,
    fontSize: 11,
    color: Colors.complimantory,
  },
  inputCont: {
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: Colors.dark,
    marginTop: 30,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  requiredQuanCont: language => {
    return {
      flexDirection: language === 'en' ? 'row' : 'row-reverse',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,
    };
  },
  reqQaunt: language => {
    return {
      fontFamily: FontFamily.title,
      width: '50%',
      textAlign: language === 'en' ? 'left' : 'right',
      color: Colors.secondary,
    };
  },
  input: language => {
    return {
      borderWidth: 0.5,
      height: 35,
      width: '45%',
      borderColor: Colors.complimantory,
      paddingHorizontal: 10,
      textAlign: language === 'en' ? 'left' : 'right',
      color: 'black',
    };
  },
  descipTerms: language => {
    return {
      fontFamily: FontFamily.title,
      marginVertical: 10,
      color: Colors.secondary,
      alignSelf: language === 'en' ? 'flex-start' : 'flex-end',
    };
  },
  termsCont: termss => {
    return {
      borderWidth: termss.length !== 0 ? 1 : 0,
      width: '100%',
      borderColor: Colors.complimantory,
      paddingHorizontal: 5,
    };
  },
  termsWrap: language => {
    return {
      flexDirection: language === 'en' ? 'row' : 'row-reverse',
      alignItems: 'center',
      width: '100%',
      justifyContent: 'space-between',
    };
  },
  textWrap: language => {
    return {
      flexDirection: language === 'en' ? 'row' : 'row-reverse',
      alignItems: 'center',
      width: '90%',
    };
  },
  term: language => {
    return {
      fontFamily: FontFamily.paragraph,
      fontSize: FontSize.paragraph,
      marginVertical: 10,
      color: Colors.complimantory,
      textAlign: language === 'en' ? 'left' : 'right',
    };
  },
  termsInputCont: language => {
    return {
      flexDirection: language === 'en' ? 'row' : 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    };
  },
  termsInput: language => {
    return {
      borderRadius: 10,
      width: '90%',
      marginTop: 10,
      height: 50,
      marginBottom: 10,
      textAlign: language === 'en' ? 'left' : 'right',
    };
  },
  createOfferWrap: offerSent => {
    return {
      backgroundColor: 'white',
      height: offerSent ? 0 : 40,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.5,
      shadowRadius: 2,
      elevation: 2,
      alignItems: 'center',
      justifyContent: 'center',
    };
  },
  createOfferText: {fontFamily: FontFamily.paragraph, color: Colors.dark},
  price: {
    fontFamily: FontFamily.subTitle,
    fontSize: 13,
    color: 'black',
  },
  bubbleText: {
    right: {
      color: 'black',
      fontFamily: FontFamily.paragraph,
      fontSize: 12,
    },
    left: {
      color: 'black',
      fontFamily: FontFamily.paragraph,
      fontSize: 12,
    },
    content: {
      color: 'black',
    },
  },
  bubbleWrapper: {
    left: {
      backgroundColor: 'rgba(160,193,38,0.30)',
    },
    right: {
      backgroundColor: 'rgba(242,153,74,0.30)',
    },
    content: {
      color: 'black',
    },
  },
});
export default ChatScreen;

// import {Icon, fonts} from '@rneui/base';
// import React, {useState, useCallback, useEffect, useRef} from 'react';
// import {useTranslation} from 'react-i18next';
// import {
//   Dimensions,
//   Image,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
//   FlatList,
//   TouchableOpacity,
// } from 'react-native';
// import {useSelector} from 'react-redux';
// import Feather from 'react-native-vector-icons/Feather';
// import socketService from '../../../utils/socketservice';

// import {Colors, CustomStyles, FontFamily, FontSize} from '../../../theme/theme';
// import {Bubble, GiftedChat, Send} from 'react-native-gifted-chat';
// import {Dropdown} from 'react-native-element-dropdown';
// import Button from '../../../components/Button';
// import InputField from '../../../components/InputField';
// import RBSheet from 'react-native-raw-bottom-sheet';
// import {ScrollView} from 'react-native';
// import {BaseUrl} from '../../../utils/constans';

// const {width, height} = Dimensions.get('screen');
// const ChatScreen = ({route, navigation}) => {
//   const [messages, setMessages] = useState([]);
//   const [bottom, setBottom] = useState(false);
//   const [offerSent, setOfferSet] = useState(false);
//   const [offerMessage, setOfferMessage] = useState(null);
//   const [value, setValue] = useState(null);
//   const [isFocus, setIsFocus] = useState(false);
//   const [terms, setTerms] = useState(false);
//   const [termss, setTermss] = useState([]);
//   const [curretTerms, setCurretTerm] = useState('');

//   const refRBSheet = useRef();
//   const {chatID} = route.params;
//   const {t, i18n} = useTranslation();

//   const {chats} = useSelector(state => state.home);
//   const {userData} = useSelector(state => state.auth);

//   const [newMessage, setNewMessage] = useState('');
//   const scroll_toBottom = useRef();

//   useEffect(() => {
//     scroll_toBottom.current?.scrollToEnd();
//   }, [chats]);

//   useEffect(() => {
//     // setOfferSet(false);
//     // setMessages([]);
//     // setMessages([
//     //   {
//     //     _id: item._id,
//     //     text: 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.',
//     //     createdAt: new Date(),
//     //     user: {
//     //       _id: 2,
//     //       name: item.name,
//     //       avatar: item.avatar,
//     //     },
//     //   },
//     // ]);
//   }, []);

//   const onSend = useCallback((messages = []) => {
//     setMessages(previousMessages =>
//       GiftedChat.append(previousMessages, messages),
//     );
//   }, []);

//   const renderFoot = () => {
//     return (
//       <View style={styles.createOfferWrap(offerSent)}>
//         <Text
//           style={styles.createOfferText}
//           onPress={() => {
//             refRBSheet.current.open();
//           }}>
//           {t('createOffer')}
//         </Text>
//       </View>
//     );
//   };
//   const renderBubble = props => {
//     return props.currentMessage.offer ? (
//       <View style={styles.offerProductWithWrap}>
//         <Image
//           style={styles.offerProductWithImage}
//           source={require('../../../assets/images/wheat.png')}
//         />
//         <View style={{width: '70%'}}>
//           <Text style={styles.offerProductWithName}>Purify Yellow Wheat</Text>
//           <Text style={styles.iconDes}>
//             Lorem ipsum is text commonly typeface without relying on content.
//           </Text>
//           <Text style={styles.price}>Price: Rs 5000/40kg</Text>
//           <Button
//             backgroundColor={Colors.primary}
//             borderColor={Colors.primary}
//             title={t('widthDraw')}
//             titleStyle={{fontSize: 14}}
//             titleColor={'white'}
//             round={50}
//             height={35}
//             onPress={() => {
//               setOfferSet(false);
//               arr = messages.filter(item => item._id !== offerMessage._id);
//               setMessages(arr);
//             }}
//           />
//         </View>
//       </View>
//     ) : (
//       <Bubble
//         {...props}
//         textStyle={styles.bubbleText}
//         wrapperStyle={styles.bubbleWrapper}
//       />
//     );
//   };
//   const renderAvatar = () => {
//     return (
//       <Image source={item.avatar} style={styles.messageAvatar(i18n.language)} />
//     );
//   };
//   const RenderOffer = () => {
//     return (
//       <View>
//         <View style={styles.topBar(i18n.language)}>
//           <Text style={{fontFamily: FontFamily.title, color: Colors.primary}}>
//             {t('createOffer')}
//           </Text>
//           <Icon
//             name="close"
//             onPress={() => {
//               refRBSheet.current.close();
//             }}
//           />
//         </View>
//         <Dropdown
//           style={[styles.dropdown]}
//           placeholderStyle={{color: Colors.secondary}}
//           selectedTextStyle={{
//             flexDirection: i18n.language === 'en' ? 'row' : 'row-reverse',
//             color: Colors.secondary,
//           }}
//           itemTextStyle={{
//             flexDirection: i18n.language === 'en' ? 'row' : 'row-reverse',
//             color: Colors.secondary,
//           }}
//           placeholder={t('selectItem')}
//           data={data}
//           labelField="label"
//           valueField="value"
//           onBlur={() => setIsFocus(false)}
//           onChange={item => {
//             setValue(item.value);
//             setIsFocus(false);
//           }}
//           value={value}
//         />
//         {value !== null && (
//           <View style={styles.offerProductWrap(i18n.language)}>
//             <Image
//               style={styles.offerProductImage}
//               source={require('../../../assets/images/wheat.png')}
//             />
//             <View style={styles.offeredPriceCont(i18n.language)}>
//               <Text style={styles.offerProductName}>{t('name')}</Text>
//               <Text style={styles.descipVal(i18n.language)}>
//                 {t('desripVal')}
//               </Text>
//               <Text style={{fontFamily: FontFamily.subTitle, fontSize: 13}}>
//                 {t('pricee')}
//               </Text>
//             </View>
//           </View>
//         )}

//         <View style={styles.inputCont}>
//           <View style={styles.requiredQuanCont(i18n.language)}>
//             <Text style={styles.reqQaunt(i18n.language)}>
//               {t('requiredRs')}
//             </Text>
//             <TextInput placeholder="Kg" style={styles.input(i18n.language)} />
//           </View>
//           <View style={styles.requiredQuanCont(i18n.language)}>
//             <Text style={styles.reqQaunt(i18n.language)}>
//               {t('requiredKg')}
//             </Text>
//             <TextInput placeholder="Rs" style={styles.input(i18n.language)} />
//           </View>
//         </View>
//         <View style={{width: '95%', alignSelf: 'center'}}>
//           <Text style={styles.descipTerms(i18n.language)}>
//             {t('describeTerms')}
//           </Text>
//           <View style={styles.termsCont(termss)}>
//             {termss?.map((item, index) => {
//               return (
//                 <View style={styles.termsWrap(i18n.language)}>
//                   <View style={styles.textWrap(i18n.language)}>
//                     <Text style={{color: Colors.secondary}}>{index + 1} </Text>
//                     <Text style={styles.term(i18n.language)}>. {item} .</Text>
//                   </View>
//                   <Icon
//                     name="minuscircle"
//                     type="ant-design"
//                     size={16}
//                     color={Colors.primary}
//                     onPress={() => {
//                       setTermss(
//                         termss.filter(ite => {
//                           return ite !== item;
//                         }),
//                       );
//                     }}
//                     style={{
//                       transform: [
//                         {rotate: i18n.language === 'en' ? '0deg' : '180deg'},
//                       ],
//                     }}
//                   />
//                 </View>
//               );
//             })}
//           </View>
//           {terms && (
//             <View style={styles.termsInputCont(i18n.language)}>
//               <InputField
//                 placeholder={''}
//                 height={40}
//                 onChangeText={val => {
//                   setCurretTerm(val);
//                 }}
//                 value={curretTerms}
//                 style={styles.termsInput(i18n.language)}
//                 multiline
//               />
//               <Icon
//                 name="send"
//                 color={Colors.primary}
//                 onPress={() => {
//                   curretTerms !== '' &&
//                     (termss.push(curretTerms),
//                     setCurretTerm(''),
//                     setTerms(false));
//                 }}
//                 style={{
//                   transform: [
//                     {rotate: i18n.language === 'en' ? '0deg' : '180deg'},
//                   ],
//                 }}
//               />
//             </View>
//           )}
//           <Button
//             width="100%"
//             backgroundColor={Colors.complimantory}
//             borderColor={Colors.complimantory}
//             round={10}
//             title={t('addewTerms')}
//             titleStyle={{
//               fontSize: 14,
//               color: Colors.secondary,
//             }}
//             onPress={() => {
//               setTerms(true);
//             }}
//           />
//         </View>
//         <Button
//           backgroundColor={Colors.primary}
//           borderColor={Colors.primary}
//           round={50}
//           title={t('sendOffer')}
//           titleColor={'white'}
//           style={{marginVertical: 20}}
//           onPress={() => {
//             refRBSheet.current.close();
//             setOfferSet(true);
//             setOfferMessage({
//               text: 'Sfsdfsdfsd',
//               user: {_id: 1},
//               createdAt: 'Sat Nov 11 2023 03:03:19 GMT+0500',
//               _id: 'd802b71e-2087-4444-8f7b-a58dec',
//               offer: true,
//             });
//             setMessages(previousMessages =>
//               GiftedChat.append(previousMessages, {
//                 text: 'Sfsdfsdfsd',
//                 user: {_id: 1},
//                 createdAt: 'Sat Nov 11 2023 03:03:19 GMT+0500',
//                 _id: 'd802b71e-2087-4444-8f7b-a58dec',
//                 offer: true,
//               }),
//             );
//           }}
//         />
//       </View>
//     );
//   };
//   const data = [
//     {label: t('wheat'), value: t('wheat')},
//     {label: t('cotton'), value: t('cotton')},
//     {label: t('rice'), value: t('rice')},
//   ];

//   const renderSend = props => {
//     return (
//       <Send {...props}>
//         <Image
//           source={require('../../../assets/icons/send.png')}
//           style={{
//             width: 20,
//             height: 20,
//             resizeMode: 'contain',
//             marginRight: 15,
//             marginBottom: 10,
//           }}
//         />
//       </Send>
//     );
//   };

//   const renderItem = ({item, index}) => {
//     return (
//       <View
//         style={{
//           maxWidth: '70%',
//           borderRadius: 15,
//           padding: 10,
//           backgroundColor:
//             item.sender === userData.userID ? '#F2994A' : '#A0C126',
//           alignSelf:
//             item.sender === userData.userID ? 'flex-end' : 'flex-start',
//           marginHorizontal: 10,
//         }}>
//         <Text>{item.message}</Text>
//       </View>
//     );
//   };

//   const handleSendNewMessage = () => {
//     socketService.emit('newMessage', {
//       chatID: chatID,
//       message: {
//         sender: userData.userID,
//         message: newMessage,
//         isOffer: false,
//       },
//     });
//     setNewMessage('');
//     scroll_toBottom.current.scrollToEnd();
//   };

//   return (
//     <View style={{flex: 1, backgroundColor: 'white'}}>
//       <View style={styles.topTab(i18n.language)}>
//         <View style={styles.topImgCont(i18n.language)}>
//           <Icon
//             name={i18n.language === 'en' ? 'arrowleft' : 'arrowright'}
//             type="ant-design"
//             onPress={() => {
//               navigation.goBack();
//             }}
//           />
//           <Image
//             source={{
//               uri: `http://${BaseUrl}:3000/media/${
//                 chats.filter(f => f.chatID === chatID)[0].profilePicture
//               }`,
//             }}
//             style={styles.topImage(i18n.language)}
//           />
//           <Text style={styles.topName(i18n.language)}>
//             {chats.filter(f => f.chatID === chatID)[0].recipientName}
//           </Text>
//         </View>
//         <Icon
//           name="dots-three-vertical"
//           type="entypo"
//           size={18}
//           color={Colors.dark}
//         />
//       </View>
//       <FlatList
//         ref={scroll_toBottom}
//         data={chats.filter(f => f.chatID === chatID)[0].conversation}
//         renderItem={renderItem}
//         ItemSeparatorComponent={
//           <View
//             style={{
//               height: 10,
//             }}
//           />
//         }
//         style={{
//           flex: 1,
//         }}
//       />
//       <View
//         style={{
//           flexDirection: 'row',
//           alignItems: 'flex-end',
//           justifyContent: 'space-between',
//           paddingHorizontal: 10,
//         }}>
//         <TextInput
//           multiline={true}
//           value={newMessage}
//           onChangeText={setNewMessage}
//           style={{
//             color: 'black',
//             fontSize: 16,
//             fontFamily: FontFamily.paragraph,
//             width: '85%',
//             paddingVertical: 10,
//             maxHeight: 100,
//           }}
//           placeholder="Write Here..."
//           placeholderTextColor={Colors.dark}
//         />
//         <TouchableOpacity activeOpacity={1} onPress={handleSendNewMessage}>
//           <Feather name="send" color={Colors.primary} size={30} />
//         </TouchableOpacity>
//       </View>
//       {/* <GiftedChat
//         messages={chats.filter(f => f.chatID === chatID)[0].conversation}
//         onSend={messages => onSend(messages)}
//         alwaysShowSend
//         renderUsernameOnMessage
//         placeholder={t('messagePlaceHolder')}
//         renderBubble={renderBubble}
//         user={item}
//         isCustomViewBottom
//         renderFooter={renderFoot}
//         isTyping
//         renderAvatar={renderAvatar}
//         showAvatarForEveryMessage
//         renderSend={renderSend}
//       /> */}
//       <RBSheet
//         ref={refRBSheet}
//         closeOnDragDown={true}
//         height={height / 1.055}
//         closeOnPressMask={false}
//         dragFromTopOnly
//         customStyles={{
//           container: {
//             borderTopLeftRadius: 30,
//             borderTopRightRadius: 30,
//           },
//         }}>
//         <ScrollView>
//           <RenderOffer />
//           <View style={{height: 50}} />
//         </ScrollView>
//       </RBSheet>
//     </View>
//   );
// };

// export default ChatScreen;
