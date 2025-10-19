import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// 피그마 기준 기기 크기
const guidelineBaseWidth = 392;
const guidelineBaseHeight = 852;

// 스케일 함수
export const scale = (size: number) => (width / guidelineBaseWidth) * size;
export const verticalScale = (size: number) =>
  (height / guidelineBaseHeight) * size;

// moderateScale: 스케일 반영 비율 조절
export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export const moderateVerticalScale = (size: number, factor = 0.5) =>
  size + (verticalScale(size) - size) * factor;
