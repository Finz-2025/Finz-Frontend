import { colors } from '@/theme/colors';
import { moderateScale, moderateVerticalScale } from '@/theme/scale';
import { FONT_FAMILY, FONT_WEIGHT } from '@/theme/typography';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

const actionIcon = require('~assets/icons/action_icon.png');
const chevDown = require('~assets/icons/chev_down.png');

export default function QuickActionsBar({
  open,
  onToggle,
  onPick,
}: {
  open: boolean;
  onToggle(): void;
  onPick(type: 'goal' | 'counsel'): void;
}) {
  return (
    <>
      {open && (
        <View style={s.wrap}>
          <View style={s.titleArea}>
            <Image source={actionIcon} style={s.sparkles} />
            <Text style={s.title}>빠른 액션</Text>
          </View>
          <View style={s.rightSide}>
            <View style={s.actions}>
              <Pressable style={s.action} onPress={() => onPick('goal')}>
                <Text style={s.actionText}>목표 추천</Text>
              </Pressable>
              <Pressable style={s.action} onPress={() => onPick('counsel')}>
                <Text style={s.actionText}>지출 상담</Text>
              </Pressable>
            </View>
          </View>
          <Pressable onPress={onToggle}>
            <Image source={chevDown} style={s.accordion} />
          </Pressable>
        </View>
      )}
    </>
  );
}

const s = StyleSheet.create({
  wrap: {
    paddingHorizontal: moderateScale(11),
    paddingVertical: moderateVerticalScale(7),
    marginBottom: moderateVerticalScale(9),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: moderateScale(10),
    borderWidth: 0.5,
    borderColor: colors.primary,
  },
  titleArea: {
    marginRight: moderateScale(11),
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(4),
  },
  sparkles: {
    width: moderateScale(15),
    height: moderateVerticalScale(15),
  },
  title: {
    color: colors.primary,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(12),
    fontWeight: FONT_WEIGHT.medium,
  },
  rightSide: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(5),
  },
  action: {
    borderRadius: moderateScale(10),
    backgroundColor: colors.mediumPrimary,
    width: moderateScale(70),
    height: moderateVerticalScale(25),
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  actionText: {
    color: colors.white,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(10),
    fontWeight: FONT_WEIGHT.semibold,
  },
  accordion: {
    marginLeft: moderateScale(60),
    width: moderateScale(20),
    height: moderateVerticalScale(20),
  },
});
