import { useCallback, useMemo, useRef, useState } from 'react';
import type { HomeState } from '../model/types';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';
import { moderateScale, moderateVerticalScale } from '@/theme/scale';
import { FONT_FAMILY, FONT_WEIGHT } from '@/theme/typography';
import DailyDetailList from '../components/DailyDetailList';
import CalendarPanel, { CalendarPanelRef } from '../components/CalendarPanel';
import InOutButtons from '../components/InOutButtons';
import MonthlySummaryEmpty from '../components/MonthlySummaryEmpty';
import MonthlySummary from '../components/MonthlySummary';
import BottomTabBar, {
  useTabBarHeight,
} from '@/features/commons/components/BottomTabBar';
import EntrySheet from '../components/EntrySheet';

export default function HomeScreen() {
  const [state] = useState<HomeState>(() => ({
    month: { monthKey: '2025-10', totalBudget: 400000, totalSpent: 152000 },
    dailyRecords: {
      '2025-10-04': [
        {
          id: '1',
          type: 'expense',
          date: '2025-10-04',
          title: '맛나제과',
          amount: 3500,
          method: 'card',
          category: 'food',
          tags: ['친구'],
          memo: '쿠키 2개',
        },
        {
          id: '2',
          type: 'income',
          date: '2025-10-04',
          title: '중고판매',
          amount: 12000,
          tags: ['판매'],
          memo: '책 2권',
        },
        {
          id: '3',
          type: 'expense',
          date: '2025-10-04',
          title: '지하철',
          amount: 1450,
          method: 'card',
          category: 'transport',
          tags: ['루틴'],
        },
      ],
    },
    dailyStatus: {
      '2025-10-01': 'kept',
      '2025-10-02': 'over',
      '2025-10-03': 'noSpend',
    },
  }));

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [entryMode, setEntryMode] = useState<'none' | 'expense' | 'income'>(
    'none',
  );
  const calRef = useRef<CalendarPanelRef>(null);

  const handleSelectDate = useCallback((date: string) => {
    setSelectedDate(prev => (prev === date ? null : date));
  }, []);

  const norm = (d?: string | null) => (d ? d.trim().slice(0, 10) : null);
  const selectedKey = norm(selectedDate);

  const records = useMemo(() => {
    if (!selectedKey) return [];
    const byKey = state.dailyRecords[selectedKey];
    if (byKey && byKey.length) return byKey;

    // 포맷 차이 폴백
    const flat = Object.values(state.dailyRecords).flat();
    return flat.filter(r => norm(r.date) === selectedKey);
  }, [selectedKey, state.dailyRecords]);

  const overspent =
    !!state.month && state.month.totalSpent > state.month.totalBudget;

  // 하단바 높이만큼만 바닥 여백을 주어 겹치지 않게
  const TAB_H = useTabBarHeight();

  return (
    <View style={s.container}>
      <View
        style={[
          s.content,
          { paddingBottom: TAB_H + moderateVerticalScale(12) },
        ]}
      >
        {/* 상단 요약 */}
        {state.month ? (
          <MonthlySummary month={state.month} overspent={overspent} />
        ) : (
          <MonthlySummaryEmpty />
        )}

        {/* 지출/수입 입력 버튼 */}
        <InOutButtons
          active={entryMode}
          onPressExpense={() =>
            setEntryMode(m => (m === 'expense' ? 'none' : 'expense'))
          }
          onPressIncome={() =>
            setEntryMode(m => (m === 'income' ? 'none' : 'income'))
          }
        />

        {/* 캘린더 or 지출/수입 입력 뷰 */}
        {entryMode === 'none' ? (
          <CalendarPanel
            ref={calRef}
            monthKey={state.month?.monthKey ?? ''}
            dailyStatus={state.dailyStatus}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            onShare={() => calRef.current?.share()}
          />
        ) : (
          <View style={{ flex: 1 }}>
            <EntrySheet
              mode={entryMode} // 'expense' | 'income'
              onClose={() => setEntryMode('none')}
              selectedDate={selectedKey ?? undefined}
              onSaved={() => setEntryMode('none')}
            />
          </View>
        )}

        {/* 하단: 내역 or 안내 -> 입력 시트 열려 있을 땐 숨김 */}
        {entryMode === 'none' && (
          <View style={s.bottom}>
            {!selectedKey ? (
              <View style={s.guideWrap}>
                <Text style={s.guideText}>
                  날짜를 선택하면 세부 내역을 볼 수 있어요
                </Text>
              </View>
            ) : (
              <DailyDetailList
                key={selectedKey}
                date={selectedKey!}
                items={records}
              />
            )}
          </View>
        )}
      </View>

      {/* 고정 하단바 */}
      <BottomTabBar
        active="home"
        onPressCoach={() => {}}
        onPressHome={() => {}}
        onPressGoals={() => {}}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  content: {
    flex: 1,
    marginTop: moderateVerticalScale(20),
  },
  bottom: {
    marginHorizontal: moderateScale(20),
    marginVertical: moderateVerticalScale(12),
  },
  guideWrap: {
    height: moderateVerticalScale(160),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(10),
    backgroundColor: '#F7F2FF',
  },
  guideText: {
    color: colors.primary,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(16),
    fontWeight: FONT_WEIGHT.medium,
    letterSpacing: 0.5,
  },
});
