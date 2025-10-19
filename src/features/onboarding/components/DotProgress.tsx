import { View, StyleSheet } from 'react-native';
import { moderateScale, moderateVerticalScale } from '../../../theme/scale';
import { colors } from '../../../theme/colors';

export default function DotProgress({
  activeIndex,
  total,
}: {
  activeIndex: number;
  total: number;
}) {
  return (
    <View style={s.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[s.dot, i === activeIndex ? s.purple : s.gray]} />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: moderateScale(6),
    marginBottom: moderateVerticalScale(58),
  },
  dot: {
    width: moderateScale(12),
    height: moderateVerticalScale(12),
    borderRadius: moderateScale(12),
  },
  purple: { backgroundColor: colors.primary },
  gray: { backgroundColor: colors.gray },
});
