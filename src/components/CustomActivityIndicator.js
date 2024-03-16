import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import {Colors, CustomStyles} from '../theme/theme';
import {getFontSize} from '../utils/utils';

const CustomActivityIndicator = ({data}) => {
  if (data !== '')
    return (
      <View style={styles.absoluteFull}>
        <View
          style={[
            styles.absoluteFull,
            {
              backgroundColor: 'black',
              opacity: 0.4,
            },
          ]}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 15,
            paddingVertical: 15,
            width: '90%',
            paddingHorizontal: 10,
          }}>
          <ActivityIndicator color={Colors.primary} size={getFontSize(40)} />
          <View
            style={{
              height: '90%',
              borderLeftWidth: 1,
              borderColor: Colors.dark,
              paddingLeft: 15,
              marginLeft: 15,
            }}>
            <Text style={CustomStyles.heading3}>{data?.heading1}</Text>
            <Text style={CustomStyles.subTitle}>{data?.heading2}</Text>
          </View>
        </View>
      </View>
    );
  else return null;
};

const styles = StyleSheet.create({
  absoluteFull: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export {CustomActivityIndicator};
