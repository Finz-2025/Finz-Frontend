import React from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { FONT_FAMILY, FONT_WEIGHT } from '@/theme/typography';
import { moderateScale, moderateVerticalScale } from '@/theme/scale';

import alertIcon from '~assets/icons/alert_icon.png';

type Props = {
  visible: boolean;
  title: string;
  cancelText?: string;
  confirmText?: string;
  onCancel(): void;
  onConfirm(): void;
};

export default function CenterConfirmModal({
  visible,
  title,
  cancelText = '돌아가기',
  confirmText = '취소',
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={s.overlay}>
        <View style={s.card}>
          <View style={s.header}>
            <Image source={alertIcon} style={s.icon} />
            <Text style={s.title}>{title}</Text>
          </View>
          <View style={s.actions}>
            <Pressable onPress={onCancel} style={[s.btn, s.btnGhost]}>
              <Text style={[s.btnTxt, { color: colors.primary }]}>
                {cancelText}
              </Text>
            </Pressable>
            <Pressable onPress={onConfirm} style={[s.btn, s.btnPrimary]}>
              <Text style={[s.btnTxt, { color: colors.white }]}>
                {confirmText}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const R = (n: number) => moderateScale(n);
const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: R(373),
    height: moderateVerticalScale(200),
    display: 'flex',
    justifyContent: 'space-between',
    borderRadius: R(10),
    backgroundColor: colors.white,
    paddingTop: moderateVerticalScale(54),
    paddingBottom: moderateVerticalScale(32.4),
    paddingHorizontal: R(30),
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
  },
  icon: {
    width: R(30),
    height: 'auto',
  },
  title: {
    color: colors.primary,
    fontFamily: FONT_FAMILY,
    fontSize: R(20),
    fontWeight: FONT_WEIGHT.semibold,
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: R(12),
  },
  btn: {
    flex: 1,
    height: moderateVerticalScale(41.56),
    borderRadius: R(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    boxShadow: '0 -3px 3px 0 #7E4AB8 inset',
  },
  btnGhost: {
    backgroundColor: colors.white,
  },
  btnPrimary: { backgroundColor: colors.primary },
  btnTxt: {
    fontFamily: FONT_FAMILY,
    fontSize: R(15),
    fontWeight: FONT_WEIGHT.semibold,
  },
});
