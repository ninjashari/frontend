import axios from 'axios';
import {
  Account,
  Payee,
  Category,
  Transaction,
  CreateAccountDto,
  CreatePayeeDto,
  CreateCategoryDto,
  CreateTransactionDto,
  ReportSummary,
  CategoryReport,
  PayeeReport,
  AccountReport,
  MonthlyTrend
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Accounts API
export const accountsApi = {
  getAll: (): Promise<Account[]> => api.get('/accounts').then(res => res.data),
  getById: (id: number): Promise<Account> => api.get(`/accounts/${id}`).then(res => res.data),
  create: (data: CreateAccountDto): Promise<Account> => api.post('/accounts', data).then(res => res.data),
  update: (id: number, data: Partial<CreateAccountDto>): Promise<Account> => 
    api.put(`/accounts/${id}`, data).then(res => res.data),
  delete: (id: number): Promise<void> => api.delete(`/accounts/${id}`).then(res => res.data),
};

// Payees API
export const payeesApi = {
  getAll: (search?: string): Promise<Payee[]> => 
    api.get('/payees', { params: { search } }).then(res => res.data),
  getById: (id: number): Promise<Payee> => api.get(`/payees/${id}`).then(res => res.data),
  create: (data: CreatePayeeDto): Promise<Payee> => api.post('/payees', data).then(res => res.data),
  update: (id: number, data: Partial<CreatePayeeDto>): Promise<Payee> => 
    api.put(`/payees/${id}`, data).then(res => res.data),
  delete: (id: number): Promise<void> => api.delete(`/payees/${id}`).then(res => res.data),
};

// Categories API
export const categoriesApi = {
  getAll: (search?: string): Promise<Category[]> => 
    api.get('/categories', { params: { search } }).then(res => res.data),
  getById: (id: number): Promise<Category> => api.get(`/categories/${id}`).then(res => res.data),
  create: (data: CreateCategoryDto): Promise<Category> => api.post('/categories', data).then(res => res.data),
  update: (id: number, data: Partial<CreateCategoryDto>): Promise<Category> => 
    api.put(`/categories/${id}`, data).then(res => res.data),
  delete: (id: number): Promise<void> => api.delete(`/categories/${id}`).then(res => res.data),
};

// Transactions API
export const transactionsApi = {
  getAll: (params?: {
    skip?: number;
    limit?: number;
    account_id?: number;
    category_id?: number;
    payee_id?: number;
    transaction_type?: string;
  }): Promise<Transaction[]> => api.get('/transactions', { params }).then(res => res.data),
  getById: (id: number): Promise<Transaction> => api.get(`/transactions/${id}`).then(res => res.data),
  create: (data: CreateTransactionDto): Promise<Transaction> => 
    api.post('/transactions', data).then(res => res.data),
  update: (id: number, data: Partial<CreateTransactionDto>): Promise<Transaction> => 
    api.put(`/transactions/${id}`, data).then(res => res.data),
  delete: (id: number): Promise<void> => api.delete(`/transactions/${id}`).then(res => res.data),
};

// Reports API
export const reportsApi = {
  getSummary: (params?: {
    start_date?: string;
    end_date?: string;
    account_ids?: number[];
    category_ids?: number[];
    payee_ids?: number[];
  }): Promise<ReportSummary> => api.get('/reports/summary', { params }).then(res => res.data),
  
  getByCategory: (params?: {
    start_date?: string;
    end_date?: string;
    account_ids?: number[];
    transaction_type?: string;
  }): Promise<CategoryReport[]> => api.get('/reports/by-category', { params }).then(res => res.data),
  
  getByPayee: (params?: {
    start_date?: string;
    end_date?: string;
    account_ids?: number[];
    transaction_type?: string;
  }): Promise<PayeeReport[]> => api.get('/reports/by-payee', { params }).then(res => res.data),
  
  getByAccount: (params?: {
    start_date?: string;
    end_date?: string;
    category_ids?: number[];
    payee_ids?: number[];
    transaction_type?: string;
  }): Promise<AccountReport[]> => api.get('/reports/by-account', { params }).then(res => res.data),
  
  getMonthlyTrend: (params?: {
    start_date?: string;
    end_date?: string;
    account_ids?: number[];
  }): Promise<MonthlyTrend[]> => api.get('/reports/monthly-trend', { params }).then(res => res.data),
};

// Import API
export const importApi = {
  importCsv: (formData: FormData): Promise<any> => 
    api.post('/import/csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data),
  
  importExcel: (formData: FormData): Promise<any> => 
    api.post('/import/excel', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data),
  
  importPdfOcr: (formData: FormData): Promise<any> => 
    api.post('/import/pdf-ocr', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data),
  
  getColumnMapping: (formData: FormData, fileType: string): Promise<any> => 
    api.post(`/import/column-mapping/${fileType}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data),
};

export default api;