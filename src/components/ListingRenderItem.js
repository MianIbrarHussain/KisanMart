import React from 'react';
import {
  TouchableOpacity,
  Text,
  Image,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';

import {Colors} from '../theme/theme';
import {getFontSize} from '../utils/utils';
import {BaseUrl} from '../utils/constans';
import {Icon} from '@rneui/base';

const {width} = Dimensions.get('window');

const ListingRenderItem = ({item, onPress, i18n}) => {
  return (
    <TouchableOpacity style={styles.renderTab} onPress={onPress}>
      <Image
        style={styles.image}
        source={{
          uri: `http://${BaseUrl}:3000/media/${item.productImage}`,
        }}
      />
      <Text
        style={[
          {textAlign: i18n.language === 'en' ? 'left' : 'right'},
          styles.name,
        ]}>
        {item.productName}
      </Text>
      <Text
        style={[
          {
            textAlign: i18n.language === 'en' ? 'left' : 'right',
          },
          styles.quant,
        ]}>
        {item.pricePerUnit}/{item.unit}
      </Text>
      <View
        style={{
          flexDirection: i18n.language === 'en' ? 'row' : 'row-reverse',
          width: '100%',
          marginTop: 5,
        }}>
        <Icon name="star" size={15} color={Colors.primary} />
        <Text style={styles.reviews}> 4.7{'  '}(102 Reviews)</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  renderTab: {
    width: width / 2.2,
    // height: width / 2,
    borderWidth: 0.5,
    marginLeft: 5,
    borderColor: Colors.complimantory,
    borderRadius: 10,
    alignItems: 'center',
    padding: 10,
    marginTop: 10,
  },
  image: {
    height: width / 3.5,
    width: '100%',
    resizeMode: 'cover',
  },
  name: {
    fontFamily: 'Poppins-Medium',
    fontSize: getFontSize(13),
    color: Colors.dark,
    marginTop: 5,
    width: '100%',
  },
  quant: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: getFontSize(13),
    color: Colors.secondary,
    marginTop: 5,
    width: '100%',
  },
  reviews: {
    fontSize: 12,
    color: Colors.dark,
    fontFamily: 'Poppins-Regular',
  },
});

export {ListingRenderItem};
