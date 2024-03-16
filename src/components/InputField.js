import React from 'react';
import {TextInput, View} from 'react-native';
import {Colors} from '../theme/theme';
import {Icon} from '@rneui/base';
import {useTranslation} from 'react-i18next';

const InputField = ({
  keyboardType,
  placeholder,
  style,
  secureTextEntry,
  eye,
  onEyePress,
  hidePass,
  multiline,
  height = 50,
  onEndEditing,
  onChangeText,
  width = '90%',
  value,
}) => {
  const {t, i18n} = useTranslation();

  return (
    <View
      style={{
        flexDirection: i18n.language === 'en' ? 'row' : 'row-reverse',
        borderWidth: 0.5,
        height: height,
        width: width,
        alignSelf: 'center',
        borderColor: Colors.complimantory,
        borderRadius: 100,
        justifyContent: 'space-between',
        alignItems: 'center',
        ...style,
        paddingHorizontal: 10,
      }}>
      <TextInput
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        onEndEditing={onEndEditing}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        value={value}
        placeholderTextColor={Colors.complimantory}
        style={{
          width: eye ? '85%' : '95%',
          alignSelf: 'center',
          textAlign: i18n.language === 'en' ? 'left' : 'right',
          textAlignVertical: 'top',
          height: '100%',
          color: 'black',
        }}
      />
      {eye && (
        <Icon
          name={hidePass ? 'eye' : 'eye-off'}
          type="feather"
          onPress={onEyePress}
        />
      )}
    </View>
  );
};

export default InputField;
