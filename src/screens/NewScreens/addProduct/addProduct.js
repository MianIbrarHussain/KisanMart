import {Icon} from '@rneui/base';
import React, {useState, useRef, useEffect} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import {View} from 'react-native';
import Toast from 'react-native-toast-message/lib';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Picker} from 'react-native-wheel-pick';

import {useDispatch, useSelector} from 'react-redux';

import {Colors, FontFamily, FontSize} from '../../../theme/theme';
import {CustomStyles} from '../../../theme/theme';
import {useTranslation} from 'react-i18next';
import InputField from '../../../components/InputField';
import ImagePicker from 'react-native-image-crop-picker';
import {FlatList} from 'react-native';
import Button from '../../../components/Button';
import {CustomActivityIndicator} from '../../../components/CustomActivityIndicator';
import {handlePostProduct} from '../../../redux/actions/home';
import BuyerSellerSwitch from '../../../components/BuyerSellerSwitch';

const InfoFields = ({title, placeholder, value, onChangeText, i18n}) => {
  return (
    <View
      style={{
        width: '100%',
        flexDirection: i18n.language === 'en' ? 'row' : 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
      }}>
      <Text
        style={{
          width: '48%',
          textAlign: i18n.language === 'en' ? 'left' : 'right',
          fontFamily: FontFamily.paragraph,
          fontSize: FontSize.paragraph,
        }}>
        {title}
      </Text>
      <InputField
        placeholder={placeholder}
        style={{
          borderRadius: 10,
          width: '48%',
        }}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const AddProduct = ({navigation}) => {
  const {userData} = useSelector(state => state.auth);
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();

  const width = useWindowDimensions().width;

  //temporary data handelers
  const [terms, setTerms] = useState(false);
  const [curretTerms, setCurretTerm] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const category = useRef();

  //state to handle loading animation
  const [data, setData] = useState('');

  const CategoryData = {
    select: t('selectCategory'),
    WHEAT: t('wheat'),
    RICE: t('rice'),
    COTTON: t('cotton'),
    SUGERCANE: t('sugercane'),
    MAIZE: t('maize'),
    FRUITS_OR_VEGETABLES: t('fruitsOrVegetables'),
  };

  //Form Data
  const [arrImages, setArrImages] = useState([]);
  const [termss, setTermss] = useState([]);
  const [productName, setProductName] = useState('Bohat Achi Product');
  const [unit, setUnit] = useState('Kg');
  const [pricePerUnit, setPricePerUnit] = useState('5000');
  const [region, setRegion] = useState('Beautiful Region');
  const [description, setDescription] = useState(
    'Bohat achi product ha pata ni kehri ha par bohat achi ha bohat faida mand ha mere waaste tusi lavo taake mainu dher ton dher faida hovy...',
  );
  const [productCategory, setProductCategory] = useState('select');
  const [wannaExport, setWannaExport] = useState(false);

  const gallery = () => {
    ImagePicker.openPicker({
      multiple: true,
    }).then(images => {
      let temp = images.map(k => {
        return {
          name: k.path.split('/').pop(),
          type: k.mime,
          uri: k.path,
        };
      });
      console.log(temp);
      let arr = [];
      arr = arrImages.concat(temp);
      setArrImages(arr);
      setPreviewImage(images[0]?.path);
    });
  };

  const handleAddProduct = () => {
    if (
      productName.length === 0 ||
      arrImages.length === 0 ||
      unit.length === 0 ||
      pricePerUnit.length === 0 ||
      region.length === 0 ||
      description.length === 0 ||
      productCategory === 'select'
    ) {
      Toast.show({
        type: 'error',
        text1: 'Incomplete Information!',
        text2: 'Please give all product related data...',
      });
    } else {
      var formdata = new FormData();
      formdata.append('productName', productName);
      formdata.append('unit', unit);
      formdata.append('pricePerUnit', pricePerUnit);
      arrImages.forEach(image => {
        formdata.append('productImages', {
          name: image.name,
          uri: image.uri,
          type: image.type,
        });
      });
      formdata.append('region', region);
      formdata.append('description', description);
      formdata.append('supplierID', userData.userID);
      formdata.append('terms', JSON.stringify(termss));
      formdata.append('Category', productCategory);
      formdata.append('quality', wannaExport);

      setData({
        heading1: 'Posting Product!',
        heading2: 'please wait product data is being posted to server...',
      });
      dispatch(handlePostProduct(formdata, onSuccess, onError));
    }
  };

  const onSuccess = res => {
    setData('');
    Toast.show({
      type: 'success',
      text1: 'SUCCESS!',
      text2: 'Your Product has been published...',
    });
    navigation.goBack();
  };

  const onError = err => {
    setData('');
    Toast.show({
      type: 'error',
      text1: 'Error!',
      text2: 'There was some error please try later',
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
        <Text style={{...CustomStyles.subTitle}}>{t('addNew')}</Text>
        <Icon name={'arrowright'} type="ant-design" color={'transparent'} />
      </View>
      <ScrollView>
        <View style={styles.wrapper(i18n.language)}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => category.current.open()}
            style={{
              marginBottom: 10,
              width: '100%',
              height: 45,
            }}>
            <Text
              style={[
                styles.nameInput(i18n.language),
                {
                  color:
                    productCategory === 'select'
                      ? Colors.complimantory
                      : 'black',
                },
              ]}>
              {CategoryData[productCategory]}
            </Text>
          </TouchableOpacity>
          <TextInput
            placeholder={t('enterProdName')}
            style={styles.nameInput(i18n.language)}
            value={productName}
            onChangeText={setProductName}
            placeholderTextColor={Colors.complimantory}
          />
          <TouchableOpacity
            activeOpacity={0}
            style={styles.placeHolderWrap}
            onPress={() => {
              gallery();
            }}>
            {arrImages.length === 0 ? (
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Image
                  source={require('../../../assets/images/placeholder.png')}
                  style={{width: 90, height: 90}}
                />
                <Text style={styles.placeholderText}>{t('addImage')}</Text>
              </View>
            ) : (
              <Image
                source={{uri: previewImage}}
                style={{height: '100%', width: '100%', borderRadius: 5}}
              />
            )}
          </TouchableOpacity>
          {arrImages.length !== 0 && (
            <FlatList
              data={arrImages}
              showsHorizontalScrollIndicator={false}
              ListFooterComponent={() => {
                return (
                  <TouchableOpacity
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: Colors.grey,
                      height: 65,
                      width: 65,
                      borderRadius: 5,
                    }}
                    onPress={() => {
                      gallery();
                    }}>
                    <Image
                      source={require('../../../assets/images/placeholder.png')}
                      style={{width: 30, height: 30}}
                    />
                    <Text
                      style={{
                        fontSize: 10,
                        fontFamily: FontFamily.paragraph,
                      }}>
                      {t('addmore')}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              horizontal
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    style={styles.renderImageWrap}
                    onPress={() => {
                      setPreviewImage(item.uri);
                    }}>
                    <TouchableOpacity
                      style={{
                        position: 'absolute',
                        zIndex: 12,
                        backgroundColor: 'white',
                        borderRadius: 100,
                        top: 3,
                        right: 3,
                      }}
                      onPress={() => {
                        setArrImages(arrImages.filter(ite => ite !== item));
                      }}>
                      <Icon name={'close'} size={16} />
                    </TouchableOpacity>
                    <Image
                      source={{uri: item.uri}}
                      style={{height: '100%', width: '100%', borderRadius: 5}}
                    />
                  </TouchableOpacity>
                );
              }}
            />
          )}

          <InfoFields
            title={t('enterUnits')}
            placeholder={t('enterUnits')}
            value={unit}
            onChangeText={setUnit}
            i18n={i18n}
          />
          <InfoFields
            title={t('pricePerUnit')}
            placeholder={t('enterPricePerUnit')}
            value={pricePerUnit}
            onChangeText={setPricePerUnit}
            i18n={i18n}
          />
          <InfoFields
            title={t('enterRegion')}
            placeholder={t('enterRegion')}
            value={region}
            onChangeText={setRegion}
            i18n={i18n}
          />
          <InputField
            placeholder={t('writeDes')}
            height={40}
            style={{
              borderRadius: 10,
              width: '100%',
              marginTop: 10,
              height: 120,
            }}
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <View
            style={{
              width: '100%',
              flexDirection: i18n.language === 'en' ? 'row' : 'row-reverse',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <Text
              style={{
                width: '48%',
                textAlign: i18n.language === 'en' ? 'left' : 'right',
                fontFamily: FontFamily.paragraph,
                fontSize: FontSize.paragraph,
              }}>
              {t('wannaExport')}
            </Text>
            <BuyerSellerSwitch
              onPress={() => setWannaExport(!wannaExport)}
              leftTag={t('no')}
              RightTag={t('yes')}
            />
          </View>

          <View style={{width: '100%', alignSelf: 'center'}}>
            <Text style={styles.descipTerms(i18n.language)}>
              {t('describeTerms')}
            </Text>
            <View style={styles.termsCont(termss)}>
              {termss?.map((item, index) => {
                return (
                  <View style={styles.termsWrap(i18n.language)}>
                    <View style={styles.textWrap(i18n.language)}>
                      <Text style={{color: Colors.secondary}}>
                        {index + 1}{' '}
                      </Text>
                      <Text style={styles.term(i18n.language)}>. {item} .</Text>
                    </View>
                    <Icon
                      name="minuscircle"
                      type="ant-design"
                      size={16}
                      color={Colors.primary}
                      onPress={() => {
                        setTermss(
                          termss.filter(ite => {
                            return ite !== item;
                          }),
                        );
                      }}
                      style={{
                        transform: [
                          {rotate: i18n.language === 'en' ? '0deg' : '180deg'},
                        ],
                      }}
                    />
                  </View>
                );
              })}
            </View>
            {terms && (
              <View style={styles.termsInputCont(i18n.language)}>
                <InputField
                  placeholder={''}
                  height={40}
                  onChangeText={val => {
                    setCurretTerm(val);
                  }}
                  value={curretTerms}
                  style={styles.termsInput(i18n.language)}
                  multiline
                />
                <Icon
                  name="send"
                  color={Colors.primary}
                  onPress={() => {
                    curretTerms !== '' &&
                      (termss.push(curretTerms),
                      setCurretTerm(''),
                      setTerms(false));
                  }}
                  style={{
                    transform: [
                      {rotate: i18n.language === 'en' ? '0deg' : '180deg'},
                    ],
                  }}
                />
              </View>
            )}
            <Button
              width="100%"
              backgroundColor={Colors.complimantory}
              borderColor={Colors.complimantory}
              round={10}
              title={t('addewTerms')}
              titleStyle={{
                fontSize: 14,
              }}
              onPress={() => {
                setTerms(true);
              }}
            />
          </View>
          <Button
            width="100%"
            backgroundColor={Colors.primary}
            borderColor={Colors.primary}
            round={10}
            title={'Add'}
            titleColor={'white'}
            onPress={handleAddProduct}
          />
        </View>
      </ScrollView>
      <RBSheet
        ref={category}
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
          onPress={() => category.current.close()}
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
          selectedValue={CategoryData[productCategory]}
          pickerData={Object.keys(CategoryData).map(k => {
            return CategoryData[k];
          })}
          onValueChange={value => {
            setProductCategory(
              Object.keys(CategoryData).find(key => {
                return CategoryData[key] === value;
              }),
            );
          }}
          selectTextColor={Colors.primary}
          isShowSelectLine={false}
          selectLineColor="black"
          selectLineSize={6}
        />
      </RBSheet>
      <CustomActivityIndicator data={data} />
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
  wrapper: language => {
    return {
      width: '95%',
      alignSelf: 'center',
      alignItems: language === 'en' ? 'flex-start' : 'flex-end',
    };
  },
  nameInput: language => {
    return {
      width: '100%',
      padding: 5,
      height: 45,
      borderWidth: 1,
      borderColor: Colors.complimantory,
      borderRadius: 10,
      textAlign: language === 'en' ? 'left' : 'right',
      textAlignVertical: 'center',
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
  placeholderText: {
    fontSize: FontSize.paragraph,
    fontFamily: FontFamily.paragraph,
    color: Colors.secondary,
  },
  descipTerms: language => {
    return {
      fontFamily: FontFamily.title,
      fontSize: FontSize.title,
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
      borderRadius: 10,
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
});
export default AddProduct;
