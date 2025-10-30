import { CategoryValue, MethodValue } from '../components/EntrySheet';

export type ExpenseRequest = {
  user_id: number;
  expense_name: string;
  amount: number;
  category: CategoryValue;
  expense_tag: string;
  memo: string;
  payment_method?: MethodValue;
  expense_date: string;
};

export type ExpenseResponse = {
  status: number;
  success: boolean;
  message: string;
  data: { expense_id: number };
};
