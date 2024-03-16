import React, {useState, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity, Dimensions} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';

import {Colors, FontFamily} from '../theme/theme';
import {BaseUrl} from '../utils/constans';
import {handleDealDetails} from '../redux/actions/home';

const {width} = Dimensions.get('window');

const TextField = ({tag, value, route}) => {
  return (
    <Text
      style={{
        fontSize: route === 'ChatScreen' ? 11 : 13,
        fontFamily: FontFamily.title,
        color: 'rgba(51, 51, 51, 1)',
      }}>
      {tag} :{' '}
      <Text
        style={{
          fontFamily: FontFamily.paragraph,
          color: 'rgba(130, 130, 130, 1)',
        }}>
        {value}
      </Text>
    </Text>
  );
};

const OfferCard = ({OfferID}) => {
  const {userData} = useSelector(state => state.auth);
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [dealData, setDealData] = useState({});

  useEffect(() => {
    handleFetchingDetails();
  }, []);

  const handleFetchingDetails = () => {
    setLoading(true);
    const data = {
      offerID: OfferID,
      userID: userData.userID,
    };
    dispatch(handleDealDetails(data, onSuccess, onError));
  };

  const onSuccess = res => {
    setDealData(res);
    setLoading(false);
  };

  const onError = err => {};

  if (Object.keys(dealData).length === 0 && !loading) return null;
  else if (loading)
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: width - 20,
          marginHorizontal: 10,
        }}>
        <View
          style={{
            width: '30%',
            backgroundColor: Colors.grey,
            height: route.name === 'ChatScreen' ? 70 : 100,
            borderRadius: 10,
          }}
        />
        <View
          style={{
            width: '68%',
            justifyContent: 'center',
            paddingLeft: '2%',
          }}>
          <View
            style={{
              width: '80%',
              height: 15,
              borderRadius: 100,
              backgroundColor: Colors.grey,
              borderRadius: 100,
            }}
          />
          <View
            style={{
              width: '40%',
              height: 15,
              borderRadius: 100,
              backgroundColor: Colors.grey,
              marginVertical: 5,
              borderRadius: 100,
            }}
          />
          <View
            style={{
              width: '65%',
              height: 15,
              borderRadius: 100,
              backgroundColor: Colors.grey,
              borderRadius: 100,
            }}
          />
        </View>
      </View>
    );
  else
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => navigation.navigate('DealDetail', {dealData: dealData})}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: route.name === 'ChatScreen' ? width * 0.8 : width - 20,
          borderWidth: 1,
          borderColor: Colors.grey,
          borderRadius: 10,
          padding: 5,
          marginHorizontal: 10,
          alignSelf: dealData.user.isSeller ? 'flex-end' : 'flex-start',
        }}>
        <Image
          source={{
            uri: `http://${BaseUrl}:3000/media/${dealData.product.productImages[0]}`,
          }}
          style={{
            width: '30%',
            backgroundColor: Colors.grey,
            resizeMode: 'contain',
            borderRadius: 10,
            height: route.name === 'ChatScreen' ? 90 : 100,
          }}
        />
        <View
          style={{
            width: '70%',
            paddingHorizontal: 5,
          }}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: route.name === 'ChatScreen' ? 12 : 16,
              fontFamily: FontFamily.headerSemiBold,
              color: 'black',
            }}>
            {dealData.product.productName}
          </Text>
          {route.name === 'ChatScreen' ? (
            <Text
              numberOfLines={2}
              style={{
                fontSize: 10,
                fontFamily: FontFamily.paragraph,
                color: 'rgba(130, 130, 130, 1)',
              }}>
              {dealData.product.description}
            </Text>
          ) : (
            <TextField
              route={route.name}
              tag={dealData.user.isSeller ? 'Seller' : 'Buyer'}
              value={`${dealData.user.name} (${dealData.user.city})`}
            />
          )}
          <TextField
            route={route.name}
            tag={'Offered Price'}
            value={`Rs ${dealData.offer.offeredPrice} / 40 kg`}
          />
          <TextField
            route={route.name}
            tag={'Required Quantity'}
            value={`${dealData.offer.requiredQuantity} kg`}
          />
        </View>
      </TouchableOpacity>
    );
};

export default OfferCard;
