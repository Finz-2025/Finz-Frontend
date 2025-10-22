import { colors } from '@/theme/colors';
import { BudgetStatus } from '../model/types';
import { DateData } from 'react-native-calendars';
import { StyleSheet, Text, View } from 'react-native';
import { moderateScale, moderateVerticalScale } from '@/theme/scale';
import { FONT_FAMILY, FONT_WEIGHT } from '@/theme/typography';

const palette: Record<BudgetStatus, { bg?: string }> = {
  kept: { bg: colors.keptBg },
  over: { bg: colors.overBg },
  noSpend: { bg: colors.noSpendBg },
  none: {},
};

export default function DayCell({
  date,
  state,
  status,
  selected,
}: {
  date: DateData;
  state?: string;
  status: BudgetStatus;
  selected: boolean;
}) {
  const p = palette[status] ?? {};
  const isDisabled = state === 'disabled';
  const textColor = selected
    ? colors.primary
    : isDisabled
    ? colors.gray
    : colors.darkText;

  return (
    <View style={[s.box, selected && s.selected]}>
      {p.bg && <View style={[s.overlay, { backgroundColor: p.bg }]} />}
      <Text style={[s.text, { color: textColor }]}>{date.day}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  box: {
    width: moderateScale(30),
    height: moderateVerticalScale(30),
    marginVertical: moderateVerticalScale(-2),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(8),
    overflow: 'hidden',
  },
  selected: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: moderateScale(8),
  },
  text: {
    color: colors.darkText,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(15),
    fontWeight: FONT_WEIGHT.light,
    letterSpacing: 0.45,
  },
});
