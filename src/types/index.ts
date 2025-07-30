export interface Account {
  id: number;
  name: string;
  account_type: 'checking' | 'savings' | 'credit_card' | 'cash' | 'investment' | 'loan';
  balance: number;
  opening_date: string;
  credit_limit?: number;
  bill_generation_date?: number;
  last_payment_date?: string;
  created_at: string;
  updated_at?: string;
}

export interface Payee {
  id: number;
  name: string;
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  color: string;
  created_at: string;
  updated_at?: string;
}

export interface Transaction {
  id: number;
  date: string;
  amount: number;
  description?: string;
  transaction_type: 'deposit' | 'withdrawal' | 'transfer';
  account_id: number;
  to_account_id?: number;
  payee_id?: number;
  category_id?: number;
  created_at: string;
  updated_at?: string;
  account?: Account;
  to_account?: Account;
  payee?: Payee;
  category?: Category;
}

export interface CreateAccountDto {
  name: string;
  account_type: Account['account_type'];
  balance?: number;
  opening_date: string;
  credit_limit?: number;
  bill_generation_date?: number;
  last_payment_date?: string;
}

export interface CreatePayeeDto {
  name: string;
}

export interface CreateCategoryDto {
  name: string;
  color?: string;
}

export interface CreateTransactionDto {
  date: string;
  amount: number;
  description?: string;
  transaction_type: Transaction['transaction_type'];
  account_id: number;
  to_account_id?: number;
  payee_id?: number;
  category_id?: number;
}

export interface ReportSummary {
  total_income: number;
  total_expenses: number;
  total_transfers: number;
  net_income: number;
  transaction_count: number;
}

export interface CategoryReport {
  category_name: string;
  category_color: string;
  total_amount: number;
  transaction_count: number;
}

export interface PayeeReport {
  payee_name: string;
  total_amount: number;
  transaction_count: number;
}

export interface AccountReport {
  account_name: string;
  account_type: string;
  total_amount: number;
  transaction_count: number;
}

export interface MonthlyTrend {
  month: string;
  transaction_type: string;
  total_amount: number;
}