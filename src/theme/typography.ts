import { Platform } from 'react-native';

export const FONT_FAMILY = Platform.select({
  ios: 'PretendardVariable',
  android: 'PretendardVariable',
}) as string;

export const FONT_WEIGHT = {
  thin: '100',
  extraLight: '200',
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const;
