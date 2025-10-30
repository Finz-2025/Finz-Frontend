import { colors } from '@/theme/colors';
import { moderateScale, moderateVerticalScale } from '@/theme/scale';
import { FONT_FAMILY, FONT_WEIGHT } from '@/theme/typography';
import { Image, StyleSheet, Text, View } from 'react-native';

type HighlightRow = {
  icon: any;
  label: string;
  value: string;
};

interface Props {
  title?: string;
  badge?: string;
  rows?: HighlightRow[];
}

const thumbsUp = require('~assets/icons/highlight_thumbs_up.png');
const thumbsDown = require('~assets/icons/highlight_thumbs_down.png');
const smile = require('~assets/icons/highlight_smile.png');

// 데모 데이터
const DEMO_ROWS: HighlightRow[] = [
  { icon: thumbsUp, label: '식비', value: '-18%' },
  { icon: thumbsDown, label: '배달', value: '1회 증가' },
  { icon: smile, label: '오늘 권장 지출', value: '12,900원' },
];

export default function WeeklyHighlights({
  title = '이번주 하이라이트',
  badge = '지난주 대비',
  rows = DEMO_ROWS,
}: Props) {
  return (
    <View style={s.card}>
      {/* 헤더 */}
      <View style={s.header}>
        <Text style={s.title}>{title}</Text>
        <View style={s.badge}>
          <Text style={s.badgeText}>{badge}</Text>
        </View>
      </View>

      {/* 내용 */}
      <View style={s.body}>
        {rows.map((r, idx) => (
          <View key={idx} style={s.row}>
            <View style={s.rowLeft}>
              <Image source={r.icon} style={s.rowIcon} resizeMode="contain" />
              <Text>{r.label}</Text>
            </View>

            {/* 구분선 */}
            <View style={s.divider} />

            {/* 값 */}
            <Text>{r.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: moderateScale(10),
    borderWidth: 0.5,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    paddingVertical: moderateVerticalScale(18),
    paddingHorizontal: moderateScale(15),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateVerticalScale(14),
  },
  title: {
    color: colors.primary,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(15),
    fontWeight: FONT_WEIGHT.semibold,
  },
  badge: {
    borderRadius: moderateScale(5),
    backgroundColor: colors.primary,
    marginLeft: moderateScale(7),
    paddingVertical: moderateVerticalScale(2),
    paddingHorizontal: moderateScale(5),
  },
  badgeText: {
    color: colors.white,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(9),
    fontWeight: FONT_WEIGHT.semibold,
  },
  body: {
    gap: moderateVerticalScale(12),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(7),
    color: colors.darkText,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(12),
    fontWeight: FONT_WEIGHT.semibold,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(7),
  },
  rowIcon: {
    width: moderateScale(20),
    height: moderateVerticalScale(20),
  },
  divider: {
    width: 0.5,
    height: '90%',
    backgroundColor: colors.darkText,
  },
});
