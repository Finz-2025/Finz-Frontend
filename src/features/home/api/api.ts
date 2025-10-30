export type ExpenseRequest = {
  user_id: number;
  expense_name: string;
  amount: number;
  category: string;
  expense_tag: string;
  memo: string;
  payment_method: string;
  expense_date: string;
};

export type ExpenseResponse = {
  status: number;
  success: boolean;
  message: string;
  data: { expense_id: number };
};
