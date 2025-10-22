import { colors } from '@/theme/colors';
import { moderateScale, moderateVerticalScale } from '@/theme/scale';
import { FONT_FAMILY, FONT_WEIGHT } from '@/theme/typography';
import { StyleSheet, Text, View } from 'react-native';

export default function MonthlySummaryEmpty() {
  return (
    <View style={s.card}>
      <Text style={s.title}>이번달 진행률</Text>
      <View style={s.emptyBox}>
        <Text style={s.emptyText}>아직 저장된 데이터가 없어요</Text>
      </View>
      <Text style={s.helper}>
        데이터를 추가하면 목표에 따른 진행 상황을 볼 수 있어요
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    marginTop: moderateVerticalScale(30),
    marginHorizontal: moderateScale(20),
    paddingVertical: moderateVerticalScale(18),
    paddingHorizontal: moderateScale(15),
    borderRadius: moderateScale(10),
    borderColor: colors.primary,
    borderWidth: 0.5,
    backgroundColor: colors.white,
  },
  title: {
    color: colors.primary,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(15),
    fontWeight: FONT_WEIGHT.semibold,
    letterSpacing: 0.45,
  },
  emptyBox: {
    marginTop: moderateVerticalScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(11),
    height: moderateVerticalScale(60),
    borderRadius: moderateScale(10),
    backgroundColor: colors.primary,
  },
  emptyText: {
    color: colors.white,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(18),
    fontWeight: FONT_WEIGHT.semibold,
    letterSpacing: 0.54,
  },
  helper: {
    marginTop: moderateVerticalScale(11),
    color: colors.primary,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(12),
    fontWeight: FONT_WEIGHT.medium,
    letterSpacing: 0.36,
    alignSelf: 'center',
  },
});
