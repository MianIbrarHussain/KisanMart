import {StyleSheet, Dimensions} from 'react-native';
import {getFontSize} from '../../../utils/utils';
import {Colors, CustomStyles} from '../../../theme/theme';

const {width} = Dimensions.get('screen');

const styles = StyleSheet.create({
  topCont: language => {
    return {
      width: '95%',
      alignSelf: 'center',
      marginTop: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexDirection: language === 'en' ? 'row' : 'row-reverse',
    };
  },
  menuIconWrapper: {
    backgroundColor: Colors.grey,
    width: 35,
    height: 35,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: language => {
    return {
      width: 18,
      height: 18,
      resizeMode: 'contain',
      transform: [{rotate: language === 'en' ? '0deg' : '180deg'}],
    };
  },
  searchWrapper: language => {
    return {
      width: '85%',
      borderWidth: 0.5,
      borderColor: Colors.complimantory,
      height: 35,
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
      flexDirection: language === 'en' ? 'row' : 'row-reverse',
    };
  },
  searchInput: language => {
    return {
      width: '90%',
      textAlign: language === 'en' ? 'left' : 'right',
      padding: 0,
    };
  },
  categoryWrapper: (category, item) => {
    return {
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
      height: 25,
      paddingHorizontal: 20,
      borderColor: Colors.complimantory,
      marginRight: 5,
      backgroundColor: category === item ? Colors.primary : 'white',
      borderWidth: category === item ? 0 : 0.5,
    };
  },
  categoryLabel: (category, item) => {
    return {
      ...CustomStyles.paragraph,
      color: category === item ? 'white' : Colors.secondary,
    };
  },
  categoryWrapperFlat: {
    alignSelf: 'center',
    width: '95%',
    marginVertical: 15,
  },
  headerCont: language => {
    return {
      flexDirection: language === 'en' ? 'row' : 'row-reverse',
      alignItems: 'center',
      marginVertical: 10,
    };
  },
  headerIcon: language => {
    return {
      marginLeft: language === 'en' ? 10 : 0,
      marginRight: language === 'en' ? 0 : 10,
      width: 28,
      height: 28,
      resizeMode: 'contain',
      transform: [{rotate: language === 'en' ? '0deg' : '180deg'}],
    };
  },
  renderWrap: {
    width: width / 2.5,
    borderWidth: 0.5,
    marginLeft: 5,
    marginRight: 10,
    borderColor: Colors.complimantory,
    borderRadius: 10,
    alignItems: 'center',
    padding: 10,
  },
  productImage: {
    height: width / 4,
    width: '100%',
    resizeMode: 'contain',
  },
  productName: language => {
    return {
      fontFamily: 'Poppins-Medium',
      fontSize: getFontSize(13),
      color: Colors.dark,
      marginTop: 5,
      width: '100%',
      textAlign: language === 'en' ? 'left' : 'right',
    };
  },
  productQuant: language => {
    return {
      fontFamily: 'Poppins-SemiBold',
      fontSize: getFontSize(13),
      color: Colors.secondary,
      marginTop: 5,
      width: '100%',
      textAlign: language === 'en' ? 'left' : 'right',
    };
  },
  ratingCont: language => {
    return {
      flexDirection: language === 'en' ? 'row' : 'row-reverse',
      width: '100%',
      marginTop: 5,
    };
  },
  rating: {
    fontSize: 12,
    color: Colors.dark,
    fontFamily: 'Poppins-Regular',
  },
  sectionStyles: {
    flexGrow: 1,
    paddingHorizontal: 10,
  },
});

export default styles;
