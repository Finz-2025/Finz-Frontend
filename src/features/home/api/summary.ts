import { api } from '@/lib/api';

type SummaryAPIResponse = {
  status: number;
  success: boolean;
  message: string;
  data: {
    total_expense: number; // 이번 달 총 지출
    remaining_budget: number; // 남은 예산
    progress_rate: number; // 진행률(%) - 참고용
  };
};

export type MonthlySummaryDTO = {
  totalExpense: number;
  remainingBudget: number;
  progressRate: number; // 0~100
};

export async function fetchMonthlySummary({
  userId = 1,
} = {}): Promise<MonthlySummaryDTO> {
  const res = await api.get<SummaryAPIResponse>('/api/home/summary', {
    params: { user_id: userId },
  });
  const d = res.data?.data;
  return {
    totalExpense: Number(d?.total_expense ?? 0),
    remainingBudget: Number(d?.remaining_budget ?? 0),
    progressRate: Number(d?.progress_rate ?? 0),
  };
}
