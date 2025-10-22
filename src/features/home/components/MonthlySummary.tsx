import { useEffect, useMemo, useRef } from 'react';
import { MonthBudget } from '../model/types';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { moderateScale, moderateVerticalScale } from '@/theme/scale';
import { FONT_FAMILY, FONT_WEIGHT } from '@/theme/typography';

interface Props {
  month: MonthBudget;
  overspent?: boolean;
}

export default function MonthlySummary({ month, overspent }: Props) {
  const percent = Math.min(
    100,
    Math.round((month.totalSpent / month.totalBudget) * 100),
  );

  const bar = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(bar, {
      toValue: percent,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [percent, bar]);

  const width = bar.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  // 오늘 사용 가능 금액
  const todayAvailable = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const monthIdx = now.getMonth();
    const lastDate = new Date(year, monthIdx + 1, 0).getDate();
    const day = now.getDate();
    const remainDays = Math.max(1, lastDate - day + 1);
    const remain = Math.max(0, month.totalBudget - month.totalSpent);
    return Math.floor(remain / remainDays);
  }, [month.totalBudget, month.totalSpent]);

  const badgeText = overspent
    ? `남은 금액 -${100 - percent}%`
    : `남은 금액 ${100 - percent}%`;

  return (
    <View style={s.card}>
      {/* padding 안에서 3영역이 space-between으로 배치 */}
      <View style={s.content}>
        {/* 상단 */}
        <View style={s.top}>
          <Text style={s.title}>이번달 진행률</Text>
        </View>

        {/* 중앙 */}
        <View style={s.center}>
          <View
            style={[
              s.badge,
              { backgroundColor: overspent ? colors.red : colors.primary },
            ]}
          >
            <Text style={s.badgeText}>{badgeText}</Text>
          </View>

          <View style={s.progressWrap}>
            <Animated.View
              style={[
                s.progressFill,
                {
                  width,
                  backgroundColor: overspent ? colors.red : colors.primary,
                },
              ]}
            />
          </View>

          <View style={s.row}>
            <Text style={s.spent}>
              사용 {month.totalSpent.toLocaleString()}원
            </Text>
            <Text style={s.total}>{month.totalBudget.toLocaleString()}원</Text>
          </View>
        </View>

        {/* 하단 */}
        <View style={s.bottom}>
          {!overspent ? (
            <Text style={s.todayInfo}>
              금일 사용 가능 금액 {todayAvailable.toLocaleString()}원
            </Text>
          ) : (
            <Text style={s.warnText}>
              이번달의 사용 가능 금액이 초과되었어요!
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    marginTop: moderateVerticalScale(30),
    marginHorizontal: moderateScale(20),
    borderRadius: moderateScale(10),
    borderColor: colors.primary,
    borderWidth: 0.5,
    backgroundColor: colors.white,
    // 내부 패딩은 content에 모아줌 (공간 분배가 깔끔)
  },
  content: {
    padding: moderateScale(18),
    // 3영역이 카드 안에서 위-중간-아래로 분배되도록
    minHeight: moderateVerticalScale(120), // 필요 시 조절
    justifyContent: 'space-between',
  },

  // 각 영역은 필요한 최소 높이만 갖고, 나머지는 space-between이 해결
  top: { minHeight: moderateVerticalScale(18), justifyContent: 'flex-start' },
  center: { minHeight: moderateVerticalScale(72), justifyContent: 'center' },
  bottom: { minHeight: moderateVerticalScale(18), justifyContent: 'flex-end' },

  title: {
    color: colors.primary,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(15),
    fontWeight: FONT_WEIGHT.semibold,
    letterSpacing: 0.45,
  },
  badge: {
    alignSelf: 'flex-end',
    marginBottom: moderateVerticalScale(6),
    borderRadius: moderateScale(6),
    paddingVertical: moderateVerticalScale(3),
    paddingHorizontal: moderateScale(6),
  },
  badgeText: {
    color: colors.white,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(10),
    fontWeight: FONT_WEIGHT.semibold,
    letterSpacing: 0.2,
  },
  progressWrap: {
    height: moderateVerticalScale(14),
    backgroundColor: colors.lightGray,
    borderRadius: moderateScale(10),
    shadowColor: colors.grayShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
  progressFill: {
    height: '100%',
    borderRadius: moderateScale(10),
    shadowColor: colors.primaryShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
  row: {
    marginTop: moderateVerticalScale(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spent: {
    color: colors.darkText,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(12),
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 0.36,
  },
  total: {
    color: colors.darkText,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(10),
    fontWeight: FONT_WEIGHT.semibold,
    letterSpacing: 0.3,
  },
  todayInfo: {
    color: colors.primary,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(11),
    fontWeight: FONT_WEIGHT.semibold,
    letterSpacing: 0.3,
  },
  warnText: {
    color: colors.red,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(11),
    fontWeight: FONT_WEIGHT.semibold,
    letterSpacing: 0.3,
  },
});
