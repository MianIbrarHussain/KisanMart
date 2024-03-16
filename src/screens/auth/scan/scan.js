import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, Image, Dimensions} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Colors, CustomStyles} from '../../../theme/theme';
import {Icon} from '@rneui/base';
import {
  Camera,
  useCameraDevice,
  useCameraDevices,
  useCameraPermission,
  useCodeScanner,
  useMicrophonePermission,
} from 'react-native-vision-camera';
import {Linking} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

const {height, width} = Dimensions.get('screen');
const Scan = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const maskRowHeight = Math.round((height - 100) / 20);
  const maskColWidth = width / 1.04;

  const isFocused = useIsFocused();
  useEffect(() => {
    async function getPermission() {
      const permission = await Camera.requestCameraPermission();
      console.log(`Camera permission status: ${permission}`);
      if (permission === 'denied') await Linking.openSettings();
    }
    getPermission();
  }, []);
  const device = useCameraDevice('back');
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-14'],
    onCodeScanned: codes => {
      console.log(`Scanned ${codes.length} codes!`);
      console.log(codes);
    },
  });
  return (
    <View style={{flex: 1, backgroundColor: 'trasnparent'}}>
      {/* <RNCamera
        ref={camera}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.on}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        onGoogleVisionBarcodesDetected={({barcodes}) => {
          console.log(barcodes);
        }}>
        <View style={styles.maskOutter}>
          <View
            style={[{flex: maskRowHeight}, styles.maskRow, styles.maskFrame]}
          />
          <View style={[{flex: 30}, styles.maskCenter]}>
            <View style={[{width: maskColWidth}, styles.maskFrame]} />
            <View style={styles.maskInner} />
            <View style={[{width: maskColWidth}, styles.maskFrame]} />
          </View>
          <View
            style={[{flex: maskRowHeight}, styles.maskRow, styles.maskFrame]}
          />
        </View>
      </RNCamera> */}
      {isFocused && (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          codeScanner={codeScanner}
        />
      )}
      <View style={styles.maskOutter}>
        <View
          style={[{flex: maskRowHeight}, styles.maskRow, styles.maskFrame]}
        />
        <View style={[{flex: 30}, styles.maskCenter]}>
          <View style={[{width: maskColWidth}, styles.maskFrame]} />
          <View style={styles.maskInner} />
          <View style={[{width: maskColWidth}, styles.maskFrame]} />
        </View>
        <View
          style={[{flex: maskRowHeight}, styles.maskRow, styles.maskFrame]}
        />
      </View>
      <View style={{position: 'absolute', width: '100%'}}>
        <View style={styles.topCont(i18n.language)}>
          <Icon
            name={i18n.language === 'en' ? 'arrowleft' : 'arrowright'}
            type="ant-design"
            color={'white'}
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Text style={{...CustomStyles.subTitle, color: 'white'}}>
            {t('scanID')}
          </Text>
          <Icon name={'arrowright'} type="ant-design" color={'transparent'} />
        </View>
        <Text
          style={{
            ...CustomStyles.paragraph,
            textAlign: 'center',
            fontSize: 12,
            width: '70%',
            alignSelf: 'center',
          }}>
          {t('scanDes')}
        </Text>
      </View>
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
      borderBottomWidth: 0.5,
      borderColor: Colors.complimantory,
      marginBottom: 10,
      flexDirection: language === 'en' ? 'row' : 'row-reverse',
    };
  },
  placeHolderWrap: {
    height: 200,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.grey,
    marginVertical: 10,
    borderRadius: 10,
  },
  renderImageWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.grey,
    height: 65,
    width: 65,
    borderRadius: 5,
    marginRight: 10,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  container: {
    flex: 1,
  },
  cameraView: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  maskOutter: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  maskInner: {
    width: 300,
    backgroundColor: 'transparent',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
  },
  maskFrame: {
    backgroundColor: 'rgba(1,1,1,0.6)',
  },
  maskRow: {
    width: '100%',
  },
  maskCenter: {flexDirection: 'row'},
});
export default Scan;
