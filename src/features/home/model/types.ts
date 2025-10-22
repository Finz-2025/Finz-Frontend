export type BudgetStatus = 'kept' | 'over' | 'noSpend' | 'none';

export interface MonthBudget {
  monthKey: string;
  totalBudget: number;
  totalSpent: number;
}

export type ExpenseCategory =
  | 'food'
  | 'cafe'
  | 'daily'
  | 'transport'
  | 'housing'
  | 'saving'
  | 'etc';

export type PaymentMethod = 'card' | 'cash' | 'account';

export type RecordType = 'expense' | 'income';

export interface BaseRecord {
  id: string;
  type: RecordType;
  date: string;
  title: string;
  amount: number;
  memo?: string;
  tags?: string[];
}

export interface ExpenseRecord extends BaseRecord {
  type: 'expense';
  category: ExpenseCategory;
  method: PaymentMethod;
}

export interface IncomeRecord extends BaseRecord {
  type: 'income';
}

export type DailyRecord = ExpenseRecord | IncomeRecord;

export type DailyStatusMap = Record<string, BudgetStatus>;

export interface HomeState {
  month: MonthBudget | null;
  dailyRecords: Record<string, DailyRecord[]>;
  dailyStatus: DailyStatusMap;
}
