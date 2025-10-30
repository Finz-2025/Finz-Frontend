import { api } from '@/lib/api';
import { DailyRecord } from '../model/types';
import { koCategoryToInternal, koMethodToInternal, stripHash } from './mappers';

type ExpenseAPI = {
  amount: number;
  category: string;
  memo?: string;
  expense_id: number;
  expense_name: string;
  expense_tag?: string;
  payment_method?: string;
};

type IncomeAPI = {
  amount?: number;
  memo?: string;
  income_id?: number;
  income_name?: string;
  income_tag?: string;
};

interface DetailsAPIResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    incomes: IncomeAPI[];
    expenses: ExpenseAPI[];
  };
}

export async function fetchDailyDetails({
  userId = 1,
  date, // 'YYYY-MM-DD'
}: {
  userId?: number;
  date: string;
}): Promise<DailyRecord[]> {
  const res = await api.get<DetailsAPIResponse>('/api/home/details', {
    params: { user_id: userId, date },
  });

  const { expenses = [], incomes = [] } = res.data?.data ?? {};

  const expenseRecords: DailyRecord[] = expenses.map(e => ({
    id: `exp-${e.expense_id}`,
    type: 'expense',
    date,
    title: e.expense_name || '지출',
    amount: e.amount ?? 0,
    category: koCategoryToInternal(e.category),
    ...(koMethodToInternal(e.payment_method)
      ? { method: koMethodToInternal(e.payment_method) }
      : {}),
    memo: e.memo || '',
    tags: e.expense_tag ? [stripHash(e.expense_tag)] : [],
  }));

  const incomeRecords: DailyRecord[] = incomes.map((i, idx) => ({
    id: `inc-${i.income_id ?? idx}`, // 안전한 키
    type: 'income',
    date,
    title: i.income_name || '수입',
    amount: i.amount ?? 0,
    memo: i.memo || '',
    tags: i.income_tag ? [stripHash(i.income_tag)] : [],
  }));

  return [...incomeRecords, ...expenseRecords];
}
