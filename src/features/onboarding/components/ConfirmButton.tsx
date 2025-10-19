import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateVerticalScale } from '@/theme/scale';
import { colors } from '@/theme/colors';
import { FONT_WEIGHT } from '@/theme/typography';

import btnActive from '~assets/icons/activeBtn_bg.png';
import btnInactive from '~assets/icons/inactiveBtn_bg.png';

type Props = {
  disabled: boolean;
  onPress: () => void;
  label: string;
};

export default function ConfirmButton({ disabled, onPress, label }: Props) {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.wrapper}
    >
      {/* 버튼 배경 이미지 */}
      <Image
        source={disabled ? btnInactive : btnActive}
        style={styles.image}
        resizeMode="contain"
      />

      {/* 버튼 텍스트 (이미지 위에 오버레이) */}
      <View style={styles.textWrapper}>
        <Text style={styles.text}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateVerticalScale(66),
  },
  image: {
    width: '100%',
    height: moderateVerticalScale(65),
  },
  textWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.white,
    fontSize: 20,
    fontWeight: FONT_WEIGHT.semibold,
  },
});
