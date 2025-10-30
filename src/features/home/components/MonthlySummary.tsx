import { useEffect, useMemo, useRef } from 'react';
import { MonthBudget } from '../model/types';
import {
  Animated,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '@/theme/colors';
import { moderateScale, moderateVerticalScale } from '@/theme/scale';
import { FONT_FAMILY, FONT_WEIGHT } from '@/theme/typography';

interface Props {
  month: MonthBudget;
  keptIcon?: ImageSourcePropType;
  overIcon?: ImageSourcePropType;
}

export default function MonthlySummary({ month, keptIcon, overIcon }: Props) {
  // 전체 예산 대비 사용률
  const percent = Math.min(
    100,
    Math.round((month.totalSpent / month.totalBudget) * 100),
  );

  // 이번 달 일수/오늘 일자
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const day = now.getDate();

  // 오늘까지 사용 가능 금액(1/N 누적 허용치)
  const allowedUntilToday = Math.floor((month.totalBudget * day) / daysInMonth);

  // 상태(유지/초과)
  const isKept = month.totalSpent <= allowedUntilToday;

  // 테마 색상 (배경/텍스트 계열)
  const theme = isKept ? colors.keptDark : colors.overDark;

  // 진행 바 애니메이션
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

  // 배지 텍스트(남은 %는 전체 예산 기준)
  const badgeText = `남은 금액 ${Math.max(0, 100 - percent)}%`;

  // 금일 사용 가능 금액(남은 예산 / 남은 일수)
  const todayAvailable = useMemo(() => {
    const remainDays = Math.max(1, daysInMonth - day + 1);
    const remainBudget = Math.max(0, month.totalBudget - month.totalSpent);
    return Math.floor(remainBudget / remainDays);
  }, [month.totalBudget, month.totalSpent, day, daysInMonth]);

  const icon = isKept ? keptIcon : overIcon;

  return (
    <View style={[s.card, { borderColor: theme }]}>
      <View style={s.content}>
        {/* 상단 */}
        <View style={s.top}>
          <Text style={[s.title, { color: theme }]}>이번달 진행률</Text>
        </View>

        {/* 중앙 */}
        <View style={s.center}>
          <View style={[s.badge, { backgroundColor: theme }]}>
            <Text style={s.badgeText}>{badgeText}</Text>
          </View>

          <View style={s.progressWrap}>
            <Animated.View
              style={[
                s.progressFill,
                {
                  width,
                  backgroundColor: theme,
                },
              ]}
            />
          </View>

          {/* 사용 / 오늘까지 가능 / 총예산 */}
          <View style={s.row}>
            <Text style={s.spent}>
              사용 {month.totalSpent.toLocaleString()}원{' '}
              <Text style={s.gray}>
                {' '}
                / 사용 가능 금액: {allowedUntilToday.toLocaleString()}원
              </Text>
            </Text>
            <Text style={s.total}>{month.totalBudget.toLocaleString()}원</Text>
          </View>
        </View>

        {/* 하단 안내 */}
        <View style={s.bottom}>
          <Text style={[s.todayInfo, { color: theme }]}>
            금일 사용 가능 금액 {todayAvailable.toLocaleString()}원
          </Text>
        </View>

        {/* 우하단 아이콘 */}
        {icon ? (
          <Image source={icon} style={s.cornerIcon} resizeMode="contain" />
        ) : null}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    marginTop: moderateVerticalScale(30),
    marginHorizontal: moderateScale(20),
    borderRadius: moderateScale(10),
    borderWidth: 0.5,
    backgroundColor: colors.white,
  },
  content: {
    padding: moderateScale(18),
    minHeight: moderateVerticalScale(120),
    justifyContent: 'space-between',
  },

  top: { minHeight: moderateVerticalScale(18), justifyContent: 'flex-start' },
  center: { minHeight: moderateVerticalScale(72), justifyContent: 'center' },
  bottom: { minHeight: moderateVerticalScale(18), justifyContent: 'flex-end' },

  title: {
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
  gray: {
    color: colors.grayShadow,
    fontWeight: FONT_WEIGHT.medium,
    fontSize: moderateScale(10),
  },
  total: {
    color: colors.darkText,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(10),
    fontWeight: FONT_WEIGHT.semibold,
    letterSpacing: 0.3,
  },
  todayInfo: {
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(11),
    fontWeight: FONT_WEIGHT.semibold,
    letterSpacing: 0.3,
  },
  cornerIcon: {
    position: 'absolute',
    right: moderateScale(21),
    bottom: moderateVerticalScale(16),
    width: moderateScale(20),
    height: moderateVerticalScale(20),
  },
});
