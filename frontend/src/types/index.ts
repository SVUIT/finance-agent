// User related types
export interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
}

// Auth related types
export interface AuthResponse {
  user: User;
  access_token: string;
  message?: string;
}

// Chat related types
export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
}

// Settings related types
export interface SettingsData {
  email: string;
  name: string;
  emailNotifications: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
}

// Health check types
export interface HealthStatus {
  isHealthy: boolean;
  lastChecked: Date | null;
  error: string | null;
}

// Form related types
export interface FormData {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  rememberMe?: boolean;
}

export interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export type AuthMode = 'login' | 'signup';

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Transaction related types
export interface Transaction {
  id: string;
  name: string;
  amount: number;
  currency: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  notes?: string;
}

// Category related types
export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: 'income' | 'expense';
}

// Dashboard stats
export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  topCategories: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  recentTransactions: Transaction[];
}

// Report related types
export interface ReportData {
  period: string;
  income: number;
  expenses: number;
  netSavings: number;
  categories: Array<{
    name: string;
    amount: number;
    percentage: number;
  }>;
  transactions: Transaction[];
}

// Notification types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// API request options
export interface ApiRequestOptions extends RequestInit {
  useAuth?: boolean;
  retries?: number;
  retryDelay?: number;
}
