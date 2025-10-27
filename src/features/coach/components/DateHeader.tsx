import { colors } from '@/theme/colors';
import { moderateScale, moderateVerticalScale } from '@/theme/scale';
import { FONT_WEIGHT } from '@/theme/typography';
import { StyleSheet, Text, View } from 'react-native';

export default function DateHeader({ date }: { date: string }) {
  return (
    <View style={s.wrap}>
      <Text style={s.badge}>{date}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginVertical: moderateVerticalScale(8),
  },
  badge: {
    paddingHorizontal: moderateScale(5),
    paddingVertical: moderateScale(2),
    backgroundColor: colors.primary,
    color: colors.white,
    fontSize: moderateScale(9),
    fontWeight: FONT_WEIGHT.semibold,
    borderRadius: moderateScale(10),
  },
});
