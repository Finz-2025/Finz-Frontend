import { api } from '@/lib/api';
import { DailyStatusMap } from '../model/types';

type ExpenseStatusAPI = 'over' | 'normal' | 'none';

interface CalendarAPIResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    dates: { date: string; expense_status: ExpenseStatusAPI }[];
  };
}

/** API 응답 → 앱 내부 상태 맵으로 변환 */
const mapExpenseStatus = (s: ExpenseStatusAPI) => {
  // API: over | normal | none
  // 앱: 'over' | 'kept' | 'noSpend' | 'none'
  // - normal(예산 준수) → kept
  // - over(초과) → over
  // - none(지출 없음) → noSpend
  switch (s) {
    case 'over':
      return 'over';
    case 'normal':
      return 'kept';
    case 'none':
    default:
      return 'noSpend';
  }
};

export async function fetchCalendarStatus({
  userId = 1,
  year,
  month,
}: {
  userId?: number;
  year: number;
  month: number; // 1~12
}): Promise<DailyStatusMap> {
  const res = await api.get<CalendarAPIResponse>('/api/home/calendar', {
    params: { user_id: userId, year, month },
  });

  const list = res.data?.data?.dates ?? [];
  const map: DailyStatusMap = {};
  for (const d of list) {
    // d.date는 "YYYY-MM-DD" 형태라고 가정
    map[d.date.slice(0, 10)] = mapExpenseStatus(d.expense_status) as any;
  }
  return map;
}
