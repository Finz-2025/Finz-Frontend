import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { BudgetStatus, DailyStatusMap } from '../model/types';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import { CalendarList, DateData, LocaleConfig } from 'react-native-calendars';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  LayoutChangeEvent,
} from 'react-native';
import { moderateScale, moderateVerticalScale } from '@/theme/scale';
import { colors } from '@/theme/colors';
import DayCell from './DayCell';
import { FONT_FAMILY, FONT_WEIGHT } from '@/theme/typography';

// 한글 locale
LocaleConfig.locales.ko = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

// Assets
const sharePurple = require('~assets/icons/ic_share_purple.png');
const chevronLeft = require('~assets/icons/ic_chevron_left_purple.png');
const chevronRight = require('~assets/icons/ic_chevron_right_purple.png');

export interface CalendarPanelRef {
  share: () => void;
}

interface Props {
  monthKey: string;
  dailyStatus: DailyStatusMap;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  onShare?: () => void;
  onMonthChange?: (year: number, month: number) => void;
}

const addMonths = (base: Date, delta: number) =>
  new Date(base.getFullYear(), base.getMonth() + delta, 1);

const ymStr = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;

function CalendarPanelInner(
  { monthKey, dailyStatus, selectedDate, onSelectDate, onMonthChange }: Props,
  ref: React.Ref<CalendarPanelRef>,
) {
  const shotRef = useRef<ViewShot>(null);
  const calRef = useRef<any>(null);

  const initial = useMemo(
    () => (monthKey ? new Date(`${monthKey}-01T00:00:00`) : new Date()),
    [monthKey],
  );
  const [visibleMonth, setVisibleMonth] = useState<Date>(initial);

  // 최초 마운트/초기 monthKey 반영 시 콜백 1회 알려주기
  React.useEffect(() => {
    onMonthChange?.(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 실제 렌더 너비 측정 → calendarWidth 전달
  const [calWidth, setCalWidth] = useState<number>(0);
  const onCalendarLayout = (e: LayoutChangeEvent) => {
    const w = Math.round(e.nativeEvent.layout.width);
    if (w && w !== calWidth) setCalWidth(w);
  };

  useImperativeHandle(ref, () => ({
    share: async () => {
      const uri = await shotRef.current?.capture?.();
      if (!uri) return;
      await Share.open({ url: uri });
    },
  }));

  const dayComponent = ({ date, state }: { date: DateData; state: string }) => {
    const key = date.dateString;
    const status: BudgetStatus = dailyStatus[key] ?? 'none';
    const selected = selectedDate === key;

    const isDisabled = state === 'disabled';
    return (
      <Pressable
        onPress={() => {
          if (!isDisabled) onSelectDate(key);
        }}
        disabled={isDisabled}
        hitSlop={8}
      >
        <DayCell
          date={date}
          state={state}
          status={status}
          selected={selected}
        />
      </Pressable>
    );
  };

  const handleArrow = (dir: -1 | 1) => {
    setVisibleMonth(prev => {
      const next = addMonths(prev, dir);
      onMonthChange?.(next.getFullYear(), next.getMonth() + 1);
      return next;
    });
  };

  return (
    <ViewShot
      ref={shotRef}
      style={s.card}
      options={{ format: 'png', quality: 0.9 }}
    >
      {/* 커스텀 헤더 */}
      <View style={s.header}>
        <View style={s.headerRow}>
          <Pressable
            onPress={() => handleArrow(-1)}
            hitSlop={10}
            style={s.arrowLeft}
          >
            <Image source={chevronLeft} style={s.arrowIcon} />
          </Pressable>
          <Text style={s.headerTitle}>
            {visibleMonth.getMonth() + 1}월 {visibleMonth.getFullYear()}년
          </Text>
          <Pressable
            onPress={() => handleArrow(1)}
            hitSlop={10}
            style={s.arrowRight}
          >
            <Image source={chevronRight} style={s.arrowIcon} />
          </Pressable>
        </View>
        <View style={s.titleSep} />
      </View>

      {/* 캘린더 영역: onLayout으로 실제 너비 측정 */}
      <View style={s.calendarWrap} onLayout={onCalendarLayout}>
        {calWidth > 0 && (
          <CalendarList
            ref={calRef}
            current={ymStr(visibleMonth)}
            calendarWidth={calWidth}
            horizontal
            pagingEnabled
            showScrollIndicator={false}
            hideExtraDays={false}
            renderHeader={() => null}
            style={s.calendar}
            pastScrollRange={12}
            futureScrollRange={12}
            dayComponent={dayComponent as any}
            hideArrows
            onMonthChange={m => {
              const next = new Date(m.year, m.month - 1, 1);
              setVisibleMonth(next);
              onMonthChange?.(next.getFullYear(), next.getMonth() + 1);
            }}
          />
        )}
      </View>

      {/* 좌하단: 공유 버튼 */}
      <Pressable
        style={s.shareBtn}
        onPress={async () => {
          const uri = await shotRef.current?.capture?.();
          if (uri) Share.open({ url: uri });
        }}
        hitSlop={10}
      >
        <Image source={sharePurple} style={s.shareIcon} />
      </Pressable>

      {/* 우하단: 범례 */}
      <View style={s.legendWrap}>
        <LegendPill color={colors.keptBg} label="예산 준수" />
        <LegendPill color={colors.overBg} label="예산 초과" />
        <LegendPill color={colors.noSpendBg} label="무지출" />
      </View>
    </ViewShot>
  );
}

function LegendPill({ color, label }: { color: string; label: string }) {
  return (
    <View style={[s.legendPill, { backgroundColor: color }]}>
      <Text style={s.legendText}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    marginHorizontal: moderateScale(20),
    marginTop: moderateVerticalScale(8),
    paddingBottom: moderateVerticalScale(28),
    borderRadius: moderateScale(12),
    borderColor: colors.primary,
    borderWidth: 1,
    backgroundColor: colors.white,
  },
  header: {
    marginTop: moderateVerticalScale(3),
    height: moderateVerticalScale(48),
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontFamily: FONT_FAMILY,
    fontWeight: FONT_WEIGHT.semibold,
    fontSize: moderateScale(15),
    color: colors.primary,
  },
  arrowLeft: { left: moderateScale(12) },
  arrowRight: { right: moderateScale(12) },
  arrowIcon: {
    width: moderateScale(18),
    height: moderateScale(18),
    resizeMode: 'contain',
  },
  titleSep: {
    width: '90%',
    height: 0.5,
    backgroundColor: colors.primary,
    marginTop: moderateVerticalScale(8),
    alignSelf: 'center',
  },

  calendarWrap: {},
  calendar: {
    height: moderateVerticalScale(240),
    marginTop: moderateVerticalScale(-10),
    marginBottom: moderateVerticalScale(10),
  },

  shareBtn: {
    position: 'absolute',
    left: moderateScale(10),
    bottom: moderateVerticalScale(8),
  },
  shareIcon: {
    width: moderateScale(30),
    height: moderateScale(30),
    resizeMode: 'contain',
  },
  legendWrap: {
    position: 'absolute',
    right: moderateScale(10),
    bottom: moderateVerticalScale(8),
    flexDirection: 'row',
    gap: moderateScale(8),
  },
  legendPill: {
    borderRadius: moderateScale(5),
    paddingHorizontal: moderateScale(5),
    paddingVertical: moderateVerticalScale(2),
    justifyContent: 'center',
  },
  legendText: {
    color: colors.white,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(11),
    fontWeight: FONT_WEIGHT.medium,
  },
});

export default forwardRef(CalendarPanelInner);
