import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { HomeState } from '../model/types';
import {
  ActivityIndicator,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
import EntrySheet, {
  EntrySheetRef,
  SavedEntry,
} from '../components/EntrySheet';
import CenterConfirmModal from '@/features/commons/components/modals/CenterConfirmModal';
import CenterToast from '@/features/commons/components/modals/CenterToast';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/app/navigation/MainNavigator';
import WeeklyHighlights from '@/features/commons/components/WeeklyHighlights';
import { createExpense } from '@/features/home/api/expense';
import { fetchCalendarStatus } from '../api/calendar';
import { fetchDailyDetails } from '../api/details';
import { fetchWeeklyHighlight, WeeklyHighlightRow } from '../api/highlight';
import { fetchMonthlySummary } from '../api/summary';

const thumbsUp = require('~assets/icons/progress_good.png');
const thumbsDown = require('~assets/icons/progress_bad.png');

export default function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  // 지출 등록 로딩 상태
  const [isSaving, setIsSaving] = useState(false);

  const [state, setState] = useState<HomeState>(() => ({
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
    dailyStatus: {},
  }));
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [calLoading, setCalLoading] = useState(false);
  const currentYMRef = useRef<{ year: number; month: number } | null>(null);

  const loadCalendar = useCallback(async (year: number, month: number) => {
    try {
      setCalLoading(true);
      const map = await fetchCalendarStatus({ year, month });
      setState(prev => ({
        ...prev,
        dailyStatus: map,
      }));
    } catch (e) {
      console.warn('캘린더 상태 조회 실패:', e);
      // 실패 시 이전 상태 유지
    } finally {
      setCalLoading(false);
    }
  }, []);

  // CalendarPanel에서 전달해주는 월 변경 콜백
  const handleMonthChange = useCallback(
    (year: number, month: number) => {
      const last = currentYMRef.current;
      // 같은 달 중복 호출 방지
      if (!last || last.year !== year || last.month !== month) {
        currentYMRef.current = { year, month };
        loadCalendar(year, month);
      }
    },
    [loadCalendar],
  );

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

  const hasData = useMemo(() => {
    if (!selectedKey) return false;
    return !!state.dailyRecords[selectedKey]?.length;
  }, [selectedKey, state.dailyRecords]);

  // 날짜 선택 시 상세 내역 없으면 조회
  useEffect(() => {
    if (!selectedKey || hasData) return; // 데이터 있으면 호출 안 함
    let cancelled = false;
    (async () => {
      try {
        setDetailsLoading(true);
        const items = await fetchDailyDetails({ date: selectedKey });
        if (cancelled) return;
        setState(prev => ({
          ...prev,
          dailyRecords: {
            ...prev.dailyRecords,
            [selectedKey]: items,
          },
        }));
      } catch (e) {
        console.warn('일일 세부 내역 조회 실패:', e);
        // 실패 시 빈 배열로라도 표시는 가능
        setState(prev => ({
          ...prev,
          dailyRecords: {
            ...prev.dailyRecords,
            [selectedKey]: prev.dailyRecords[selectedKey] ?? [],
          },
        }));
      } finally {
        setDetailsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedKey, hasData]);

  const records = useMemo(() => {
    if (!selectedKey) return [];
    const byKey = state.dailyRecords[selectedKey];
    if (byKey && byKey.length) return byKey;

    // 포맷 차이 폴백
    const flat = Object.values(state.dailyRecords).flat();
    return flat.filter(r => norm(r.date) === selectedKey);
  }, [selectedKey, state.dailyRecords]);

  const [hlLoading, setHlLoading] = useState(false);
  const [hlRows, setHlRows] = useState<WeeklyHighlightRow[] | null>(null);

  const [summaryLoading, setSummaryLoading] = useState(false);

  // 하이라이트: 첫 마운트 시 1회 조회
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setHlLoading(true);
        const rows = await fetchWeeklyHighlight({ userId: 1 });
        if (!cancelled) setHlRows(rows);
      } catch {
        // 실패 시 데모 유지(아무 것도 안 함)
      } finally {
        setHlLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 요약: 첫 마운트 시 1회 조회
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setSummaryLoading(true);
        const { totalExpense, remainingBudget } = await fetchMonthlySummary({
          userId: 1,
        });
        if (cancelled) return;
        const now = new Date();
        const monthKey = `${now.getFullYear()}-${String(
          now.getMonth() + 1,
        ).padStart(2, '0')}`;
        const totalBudget = totalExpense + remainingBudget;
        setState(prev => ({
          ...prev,
          month: {
            monthKey,
            totalBudget,
            totalSpent: totalExpense,
          },
        }));
      } catch {
        // 실패 시 기존 데모 month 유지
      } finally {
        setSummaryLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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

  // SavedEntry -> 서버 요청 바디로 매핑
  const mapSavedEntryToExpenseRequest = (entry: SavedEntry) => {
    const stripHash = (t?: string) => (t ? t.replace(/^#/, '') : '');
    const base = {
      user_id: 1,
      expense_name: entry.title || '지출',
      amount: entry.amount,
      category: entry.category ?? '기타',
      expense_tag: stripHash(entry.tags?.[0]),
      memo: entry.memo ?? '',
      expense_date: entry.date,
    } as const;
    // 결제수단이 있으면만 추가 (없으면 필드 생략)
    return entry.method ? { ...base, payment_method: entry.method } : base;
  };

  // 기존 handleOnSaved 교체
  const handleOnSaved = async (entry: SavedEntry) => {
    try {
      setIsSaving(true);
      const req = mapSavedEntryToExpenseRequest(entry);
      const res = await createExpense(req);

      if (!res.success) {
        console.warn('지출 등록 실패:', res.message);
        setToastOpen(true);
        setIsSaving(false);
        return;
      }

      setToastOpen(true);
      setEntryMode('none');

      // 코치탭 이동
      setIsSaving(false);
      navigation.navigate('Coach');
    } catch (e: any) {
      console.error('지출 등록 에러:', e?.message || e);
      setToastOpen(true);
      setIsSaving(false);
    }
  };

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
            paddingBottom: TAB_H,
          },
        ]}
      >
        {/* 상단 요약 */}
        {state.month ? (
          <>
            {summaryLoading && (
              <View
                style={{
                  alignItems: 'center',
                  marginTop: moderateVerticalScale(6),
                }}
              >
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            )}
            <MonthlySummary
              month={state.month}
              keptIcon={thumbsUp}
              overIcon={thumbsDown}
            />
          </>
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
            onMonthChange={handleMonthChange}
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
              <>
                {hlLoading && (
                  <View
                    style={{
                      alignItems: 'center',
                      marginBottom: moderateVerticalScale(6),
                    }}
                  >
                    <ActivityIndicator size="small" color={colors.primary} />
                  </View>
                )}
                <WeeklyHighlights
                  title="이번주 하이라이트"
                  badge="지난주 대비"
                  rows={hlRows ?? undefined} // 없으면 컴포넌트의 데모 rows 사용
                />
              </>
            ) : (
              <>
                {detailsLoading && (
                  <View
                    style={{
                      alignItems: 'center',
                      marginBottom: moderateVerticalScale(6),
                    }}
                  >
                    <ActivityIndicator size="small" color={colors.primary} />
                  </View>
                )}
                <DailyDetailList
                  key={selectedKey}
                  date={selectedKey!}
                  items={records}
                />
              </>
            )}
          </View>
        )}
      </View>

      {/* 지출 등록 로딩 오버레이 */}
      {isSaving && (
        <View style={s.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={s.loadingText}>지출을 등록하고 있어요…</Text>
        </View>
      )}

      {/* 캘린더 상태 로딩 오버레이 (작게) */}
      {calLoading && (
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingTop: moderateVerticalScale(90),
            },
          ]}
        >
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}

      {/* 고정 하단바 */}
      <BottomTabBar
        active="home"
        onPressCoach={() => navigation.navigate('Coach')}
        onPressHome={() => navigation.navigate('Home')}
        onPressGoals={() => navigation.navigate('Goals')}
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(16),
    zIndex: 10,
  },
  loadingText: {
    marginTop: moderateVerticalScale(8),
    color: colors.primary,
    fontFamily: FONT_FAMILY,
    fontSize: moderateScale(12),
    fontWeight: FONT_WEIGHT.semibold,
    textAlign: 'center',
  },
});
