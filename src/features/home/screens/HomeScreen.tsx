import { useCallback, useMemo, useRef, useState } from 'react';
import type { HomeState } from '../model/types';
import { Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
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
import EntrySheet, { EntrySheetRef } from '../components/EntrySheet';
import CenterConfirmModal from '@/features/commons/components/modals/CenterConfirmModal';
import CenterToast from '@/features/commons/components/modals/CenterToast';

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

  const sheetRef = useRef<EntrySheetRef>(null);

  const [exitAskOpen, setExitAskOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [pendingMode, setPendingMode] = useState<'none' | 'expense' | 'income'>(
    'none',
  ); // 전환 예약

  const requestCloseSheet = (
    reason: 'close' | 'switch-to-expense' | 'switch-to-income',
  ) => {
    const dirty = sheetRef.current?.isDirty?.() ?? false;
    if (dirty) {
      // 모달을 띄우고 나중에 실제 행동은 onConfirm에서 처리
      setExitAskOpen(true);
      // 다음 행동을 기억
      if (reason === 'close') setPendingMode('none');
      if (reason === 'switch-to-expense') setPendingMode('expense');
      if (reason === 'switch-to-income') setPendingMode('income');
    } else {
      // 바로 실행
      if (reason === 'close') setEntryMode('none');
      if (reason === 'switch-to-expense') setEntryMode('expense');
      if (reason === 'switch-to-income') setEntryMode('income');
    }
  };

  const handleOnSaved = () => {
    // 저장 성공 → 토스트 → 시트 닫기
    setToastOpen(true);
    setTimeout(() => {
      setToastOpen(false);
      setEntryMode('none');
    }, 1000);
  };

  // // InOutButtons 이벤트: 누르면 현재 시트 상태 확인 후 전환
  // const onPressExpense = () => {
  //   if (entryMode === 'expense') setEntryMode('none');
  //   else if (entryMode === 'income') requestCloseSheet('switch-to-expense');
  //   else setEntryMode('expense');
  // };
  // const onPressIncome = () => {
  //   if (entryMode === 'income') setEntryMode('none');
  //   else if (entryMode === 'expense') requestCloseSheet('switch-to-income');
  //   else setEntryMode('income');
  // };

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <View
        style={[
          s.content,
          {
            paddingTop:
              Platform.OS === 'ios'
                ? moderateVerticalScale(18)
                : moderateVerticalScale(8),
            paddingBottom: TAB_H + moderateVerticalScale(12),
          },
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
              ref={sheetRef}
              mode={entryMode === 'expense' ? 'expense' : 'income'}
              selectedDate={selectedKey ?? undefined}
              onSaved={handleOnSaved}
              onRequestClose={() => requestCloseSheet('close')}
            />
          </View>
        )}

        {/* 입력 중단 확인 모달 (공통) */}
        <CenterConfirmModal
          visible={exitAskOpen}
          title="입력을 중단하시겠어요?"
          cancelText="취소"
          confirmText="중단하기"
          onCancel={() => setExitAskOpen(false)}
          onConfirm={() => {
            setExitAskOpen(false);
            setEntryMode(pendingMode);
          }}
        />

        {/* 저장 확인 토스트 (공통) */}
        <CenterToast visible={toastOpen} onHide={() => setToastOpen(false)} />

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
