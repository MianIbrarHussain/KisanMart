import {useTranslation} from 'react-i18next';
import {PixelRatio} from 'react-native';

const fontScale = PixelRatio.getFontScale();
export const getFontSize = size => size / fontScale;

export const currentLaguage = () => {
  const {i18n} = useTranslation();

  return i18n.language;
};
