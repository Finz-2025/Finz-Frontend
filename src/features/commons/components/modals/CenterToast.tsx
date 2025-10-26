import React, { useEffect } from 'react';
import { Image, Modal, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { FONT_FAMILY, FONT_WEIGHT } from '@/theme/typography';
import { moderateScale, moderateVerticalScale } from '@/theme/scale';

import checkmarkIcon from '~assets/icons/checkmark_icon.png';

type Props = {
  visible: boolean;
  message?: string;
  duration?: number;
  onHide?: () => void;
};
export default function CenterToast({
  visible,
  message = '내역이 추가되었습니다!',
  duration = 1000,
  onHide,
}: Props) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => onHide?.(), duration);
    return () => clearTimeout(t);
  }, [visible, duration, onHide]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={s.overlay}>
        <View style={s.card}>
          <Image source={checkmarkIcon} style={s.icon} />
          <Text style={s.txt}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
}

const R = (n: number) => moderateScale(n);
const s = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: colors.white,
    borderRadius: R(10),
    paddingVertical: moderateVerticalScale(45),
    paddingHorizontal: R(72),
    flexDirection: 'row',
    gap: R(7),
    shadowColor: colors.primaryShadow,
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 6,
  },
  icon: {
    width: R(30),
    height: 'auto',
  },
  txt: {
    color: colors.primary,
    fontFamily: FONT_FAMILY,
    fontSize: R(20),
    fontWeight: FONT_WEIGHT.semibold,
  },
});
