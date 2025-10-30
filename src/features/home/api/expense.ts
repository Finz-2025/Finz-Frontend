import { api } from '@/lib/api';
import type { ExpenseRequest, ExpenseResponse } from '@/features/home/api/api';

// 지출 입력 API
export async function createExpense(
  payload: ExpenseRequest,
): Promise<ExpenseResponse> {
  const { data } = await api.post<ExpenseResponse>('/api/expense', payload);
  return data;
}
