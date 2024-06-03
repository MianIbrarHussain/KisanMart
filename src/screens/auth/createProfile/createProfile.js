import React, {useState, useRef, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  DimensionValue,
  useWindowDimensions,
} from 'react-native';
import {Colors, CustomStyles} from '../../../theme/theme';
import InputField from '../../../components/InputField';
import {Icon} from '@rneui/base';
import Button from '../../../components/Button';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Picker} from 'react-native-wheel-pick';
import {currentLaguage} from '../../../utils/utils';
import {useDispatch, useSelector} from 'react-redux';
import ImageCropPicker from 'react-native-image-crop-picker';
import Toast from 'react-native-toast-message';
import {userVerification} from '../../../redux/actions/auth';
import {CustomActivityIndicator} from '../../../components/CustomActivityIndicator';
import Sample from '../../NewScreens/scan';

const pakistanCities = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Bahawalpur',
  'Sargodha',
  'Larkana',
  'Sukkur',
  'Sheikhupura',
  'Jhang',
  'Rahim Yar Khan',
  'Gujrat',
  'Kasur',
  'Mardan',
  'Mingora',
  'Dera Ghazi Khan',
  'Nawabshah',
  'Sahiwal',
  'Mirpur Khas',
  'Okara',
  'Mandi Bahauddin',
  'Jacobabad',
  'Jhelum',
  'Sadiqabad',
  'Khanewal',
  'Hafizabad',
  'Kohat',
  'Kamoke',
  'Loralai',
  'Pakpattan',
  'Dera Ismail Khan',
  'Chiniot',
  'Charsadda',
  'Kandhkot',
  'Hasilpur',
  'Arifwala',
  'Attock',
  'Chakwal',
  'Khuzdar',
  'Abbottabad',
  'Mansehra',
  'Jaranwala',
  'Burewala',
  'Swabi',
  'Nowshera',
  'Korangi',
  'Sadiqabad',
];

const CreateProfile = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const {userID} = route.params;
  const {loggedIn} = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const regionPicker = useRef();

  const width = useWindowDimensions().width;
  const [loading, setLoading] = useState('');
  const [cardData, setCardData] = useState({});

  //FormData
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [region, setRegion] = useState('');

  const handleValidation = () => {
    if (
      phoneNumber.length === 0 ||
      whatsAppNumber.length === 0 ||
      region.length === 0
    ) {
      Toast.show({
        type: 'error',
        text1: 'Error!',
        text2: 'Please fill all fields...',
      });
    } else {
      setLoading({
        heading1: 'Verifying User',
        heading2: 'Please wait while we review data...',
      });
      const FormData = require('form-data');
      let data = new FormData();
      data.append('name', cardData?.fullName);
      data.append('cnic', cardData?.personalIdNumber);

      data.append('phone', phoneNumber);
      data.append('whatsapp', whatsAppNumber);
      data.append('city', region);
      // data.append('profilePicture', {
      //   name: userImage.name,
      //   uri: userImage.uri,
      //   type: userImage.type,
      // });
      data.append('profilePicture', cardData.resultImageFace);
      data.append('cnicFront', cardData.resultFrontImageDocument);
      data.append('cnicBack', cardData.resultBackImageDocument);
      data.append('userID', userID);
      dispatch(
        userVerification(data, onSuccessVerification, onErrorVerification),
      );
    }
  };

  const onSuccessVerification = () => {
    setLoading('');
    Toast.show({
      type: 'success',
      text1: 'Success!',
      text2: 'User Verification Successfull...',
    });
    navigation.goBack();
  };

  const onErrorVerification = error => {
    setLoading('');
    Toast.show({
      type: 'error',
      text1: 'Error!',
      text2: 'CNIC already registered...',
    });
  };

  useEffect(() => {
    console.log('sdfsdfsdfsddfsdfsdfsdf');
    console.log(cardData);
    console.log('sdfsfsfsdfsdfsfsdfsdfsdf');
  }, [cardData]);

  if (Object.keys(cardData).length === 0)
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
        }}>
        {loggedIn === false && (
          <Text
            style={styles.skip}
            onPress={() => {
              navigation.navigate('Login');
            }}>
            {t('skip')}
          </Text>
        )}
        <Text style={styles.welcome}>{t('welcome')}</Text>
        <Text style={styles.complete}>{t('completeProfile')}</Text>
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            marginTop: 20,
          }}>
          <Sample data={cardData} setData={setCardData} />
        </View>
      </View>
    );

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      {loggedIn === false && (
        <Text
          style={styles.skip}
          onPress={() => {
            navigation.navigate('Login');
          }}>
          {t('skip')}
        </Text>
      )}
      <Text style={styles.welcome}>{t('welcome')}</Text>
      <Text style={styles.complete}>{t('completeProfile')}</Text>
      <View style={{marginTop: 20}}>
        <TouchableOpacity activeOpacity={1} style={styles.imageWrap}>
          <Image
            source={
              cardData?.resultImageFace
                ? {uri: cardData.resultImageFace}
                : require('../../../assets/images/placeholder.png')
            }
            style={[
              styles.placeholder,
              cardData?.resultImageFace && {
                width: '100%',
                height: '100%',
                resizeMode: 'cover',
                borderRadius: 100,
              },
            ]}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          marginTop: 20,
        }}>
        <View
          style={{
            borderWidth: 1,
            borderColor: 'grey',
            width: '40%',
            height: 100,
          }}>
          <Image
            source={{
              uri: cardData?.resultFrontImageDocument,
            }}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'contain',
            }}
          />
        </View>
        <View
          style={{
            borderWidth: 1,
            borderColor: 'grey',
            width: '40%',
            height: 100,
          }}>
          <Image
            source={{
              uri: cardData?.resultBackImageDocument,
            }}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'contain',
            }}
          />
        </View>
      </View>
      <InputField
        placeholder={t('enterName')}
        style={{marginTop: 30}}
        value={cardData?.fullName}
        editable={false}
      />
      <InputField
        placeholder={t('verifyCard')}
        style={{marginTop: 10}}
        value={cardData?.personalIdNumber}
        editable={false}
      />
      <InputField
        placeholder={t('number')}
        style={{marginTop: 10}}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <InputField
        placeholder={t('whatappNum')}
        style={{marginTop: 10}}
        value={whatsAppNumber}
        onChangeText={setWhatsAppNumber}
      />

      <TouchableOpacity
        onPress={() => regionPicker.current.open()}
        style={{
          flexDirection: i18n.language === 'en' ? 'row' : 'row-reverse',
          ...styles.cardButton,
        }}>
        <Text style={{color: region === '' ? Colors.complimantory : 'black'}}>
          {region === '' ? t('selectRegion') : region}
        </Text>
        <Icon
          name="caretdown"
          type="ant-design"
          size={16}
          color={Colors.primary}
        />
      </TouchableOpacity>
      <Button
        backgroundColor={Colors.primary}
        borderColor={Colors.primary}
        round={50}
        style={{marginTop: 30}}
        title={t('next')}
        titleColor={'white'}
        onPress={handleValidation}
      />

      <RBSheet
        ref={regionPicker}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          container: {
            borderWidth: 1,
            width: '90%',
            borderRadius: 10,
            alignSelf: 'center',
            marginBottom: 10,
            borderColor: Colors.primary,
          },
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => regionPicker.current.close()}
          style={{
            alignSelf: 'flex-end',
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderWidth: 1,
            borderRadius: 5,
            borderColor: Colors.primary,
            marginRight: width * 0.025,
            marginTop: width * 0.025,
          }}>
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              fontSize: 14,
              color: Colors.primary,
            }}>
            Done
          </Text>
        </TouchableOpacity>
        <Picker
          textSize={16}
          style={{backgroundColor: 'white', width: '100%', height: 215}}
          selectedValue={region}
          pickerData={pakistanCities}
          onValueChange={setRegion}
          selectTextColor={Colors.primary}
          isShowSelectLine={false}
          selectLineColor="black"
          selectLineSize={6}
        />
      </RBSheet>
      <CustomActivityIndicator data={loading} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  skip: {
    alignSelf: 'center',
    position: 'absolute',
    right: 10,
    top: 4,
    color: Colors.primary,
    ...CustomStyles.paragraph,
  },
  welcome: {...CustomStyles.title, alignSelf: 'center', marginTop: 10},
  complete: {...CustomStyles.paragraph, alignSelf: 'center'},
  imageWrap: {
    width: 120,
    height: 120,
    borderRadius: 100,
    backgroundColor: Colors.grey,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {width: '50%', height: '50%', resizeMode: 'contain'},
  uploadPic: {
    ...CustomStyles.paragraph,
    alignSelf: 'center',
    marginTop: 10,
  },
  cardButton: {
    borderWidth: 0.5,
    height: 50,
    width: '90%',
    alignSelf: 'center',
    borderColor: Colors.complimantory,
    borderRadius: 100,
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
    justifyContent: 'space-between',
  },
});
export default CreateProfile;
