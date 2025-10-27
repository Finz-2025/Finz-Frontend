import { colors } from '@/theme/colors';
import { moderateScale, moderateVerticalScale } from '@/theme/scale';
import { FONT_FAMILY, FONT_WEIGHT } from '@/theme/typography';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

const closeIcon = require('~assets/icons/close_icon.png');

export default function AttachReceiptModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose(): void;
}) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={s.backdrop}>
        <View style={s.sheet}>
          <View style={s.titleArea}>
            <Text style={s.title}>영수증 이미지 첨부하기</Text>
            <Pressable onPress={onClose}>
              <Image source={closeIcon} style={s.close} />
            </Pressable>
          </View>
          <View style={s.btnGroup}>
            <Pressable style={s.btn}>
              <Text style={s.btnText}>사진첩에서 추가하기</Text>
            </Pressable>
            <Pressable style={s.btn}>
              <Text style={s.btnText}>영수증 촬영하기</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    padding: moderateScale(20),
  },
  sheet: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(10),
    paddingTop: moderateVerticalScale(14),
    paddingBottom: moderateVerticalScale(28),
    justifyContent: 'space-between',
  },
  titleArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: moderateScale(11),
    marginBottom: moderateVerticalScale(26),
    alignItems: 'center',
  },
  title: {
    color: colors.primary,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(15),
    fontWeight: FONT_WEIGHT.semibold,
  },
  close: {
    width: moderateScale(20),
    height: moderateVerticalScale(20),
  },
  btnGroup: {
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: moderateVerticalScale(12),
  },
  btn: {
    width: moderateScale(320),
    textAlign: 'center',
    paddingVertical: moderateVerticalScale(18),
    borderRadius: moderateScale(10),
    borderColor: colors.primary,
    boxShadow: '0 1px 2px 0 #9B5DE0',
    alignItems: 'center',
  },
  btnText: {
    color: colors.primary,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(18),
    fontWeight: FONT_WEIGHT.bold,
  },
});
