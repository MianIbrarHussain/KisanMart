import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {Colors} from '../theme/theme';
import {CustomStyles} from '../theme/theme';

const Button = ({
  title,
  onPress,
  backgroundColor,
  titleColor,
  borderColor,
  round,
  style,
  titleStyle,
  height = 50,
  width = '90%',
}) => {
  return (
    <TouchableOpacity
      style={{
        width: width,
        height: height,
        borderWidth: 1,
        borderColor: borderColor,
        borderRadius: 5,
        backgroundColor: backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        borderRadius: round,
        alignSelf: 'center',
        ...style,
      }}
      onPress={onPress}>
      <Text style={{...CustomStyles.title, color: titleColor, ...titleStyle}}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
