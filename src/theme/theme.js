import {getFontSize} from '../utils/utils';

export const FontSize = {
  headerBold1: getFontSize(24),
  headerBold2: getFontSize(20),
  headerSemiBold: getFontSize(18),
  title: getFontSize(18),
  subTitle: getFontSize(16),
  paragraph: getFontSize(14),
  short: getFontSize(12),
};

export const Colors = {
  primary: '#00B79E',
  secondary: '#181B18',
  complimantory: '#C9C9C9',
  grey: '#F5F5F5',
  dark: '#828282',
};

export const FontFamily = {
  headerBold1: 'Poppins-Bold',
  headerBold2: 'Poppins-Bold',
  headerSemiBold: 'Poppins-SemiBold',
  title: 'Poppins-Medium',
  subTitle: 'Poppins-Regular',
  paragraph: 'Poppins-Regular',
};

export const CustomStyles = {
  heading: {
    fontSize: getFontSize(20),
    color: '#181B18',
    fontFamily: 'Poppins-Bold',
  },
  heading2: {
    fontSize: getFontSize(20),
    color: '#181B18',
    fontFamily: 'Poppins-Bold',
  },
  heading3: {
    fontSize: getFontSize(16),
    color: '#181B18',
    fontFamily: 'Poppins-SemiBold',
  },
  paragraph: {
    fontSize: getFontSize(14),
    color: '#828282',
    fontFamily: 'Poppins-Regular',
  },
  title: {
    fontSize: getFontSize(18),
    color: '#181B18',
    fontFamily: 'Poppins-Medium',
  },
  subTitle: {
    fontSize: getFontSize(14),
    color: '#181B18',
    fontFamily: 'Poppins-Regular',
  },
};
