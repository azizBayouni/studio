import {
  Utensils,
  ShoppingBag,
  Home,
  Car,
  TrendingUp,
  Receipt,
  Shirt,
  Laptop,
  Building,
  Fuel,
  Landmark,
  PiggyBank,
} from 'lucide-react';

export type Category = {
  id: string;
  name: string;
  type: 'income' | 'expense';
  parentId: string | null;
  icon?: React.ComponentType<{ className?: string }>;
};

export type Transaction = {
  id: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  subCategory?: string;
  wallet: string;
  description: string;
  currency: string;
};

export type Wallet = {
  id: string;
  name: string;
  currency: string;
  balance: number;
};

export type Debt = {
  id: string;
  type: 'payable' | 'receivable';
  person: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'unpaid';
};

export const categories: Category[] = [
  { id: '1', name: 'Food & Drink', type: 'expense', parentId: null, icon: Utensils },
  { id: '2', name: 'Restaurants', type: 'expense', parentId: '1', icon: Receipt },
  { id: '3', name: 'Groceries', type: 'expense', parentId: '1', icon: ShoppingBag },
  { id: '4', name: 'Shopping', type: 'expense', parentId: null, icon: ShoppingBag },
  { id: '5', name: 'Clothing', type: 'expense', parentId: '4', icon: Shirt },
  { id: '6', name: 'Electronics', type: 'expense', parentId: '4', icon: Laptop },
  { id: '7', name: 'Housing', type: 'expense', parentId: null, icon: Home },
  { id: '8', name: 'Rent', type: 'expense', parentId: '7', icon: Building },
  { id: '9', name: 'Utilities', type: 'expense', parentId: '7', icon: Receipt },
  { id: '10', name: 'Transportation', type: 'expense', parentId: null, icon: Car },
  { id: '11', name: 'Public Transport', type: 'expense', parentId: '10', icon: Car },
  { id: '12', name: 'Fuel', type: 'expense', parentId: '10', icon: Fuel },
  { id: '13', name: 'Income', type: 'income', parentId: null, icon: TrendingUp },
  { id: '14', name: 'Salary', type: 'income', parentId: '13', icon: Landmark },
  { id: '15', name: 'Freelance', type: 'income', parentId: '13', icon: PiggyBank },
];

export const transactions: Transaction[] = [
  { id: 't1', date: '2024-07-20', amount: 15.50, type: 'expense', category: 'Restaurants', wallet: 'Main Wallet', description: 'Lunch with colleagues', currency: 'USD' },
  { id: 't2', date: '2024-07-20', amount: 80.00, type: 'expense', category: 'Groceries', wallet: 'Main Wallet', description: 'Weekly grocery shopping', currency: 'USD' },
  { id: 't3', date: '2024-07-19', amount: 2500, type: 'income', category: 'Salary', wallet: 'Main Wallet', description: 'Monthly salary', currency: 'USD' },
  { id: 't4', date: '2024-07-18', amount: 120.00, type: 'expense', category: 'Clothing', wallet: 'Credit Card', description: 'New shoes', currency: 'USD' },
  { id: 't5', date: '2024-07-17', amount: 45.00, type: 'expense', category: 'Fuel', wallet: 'Main Wallet', description: 'Gas for the car', currency: 'USD' },
  { id: 't6', date: '2024-07-15', amount: 1200.00, type: 'expense', category: 'Rent', wallet: 'Main Wallet', description: 'Monthly rent', currency: 'USD' },
  { id: 't7', date: '2024-07-12', amount: 550.00, type: 'income', category: 'Freelance', wallet: 'PayPal', description: 'Project payment', currency: 'USD' },
  { id: 't8', date: '2024-07-10', amount: 800.00, type: 'expense', category: 'Electronics', wallet: 'Credit Card', description: 'New monitor', currency: 'USD' },
];

export const wallets: Wallet[] = [
  { id: 'w1', name: 'Main Wallet', currency: 'USD', balance: 3450.75 },
  { id: 'w2', name: 'Credit Card', currency: 'USD', balance: -1240.20 },
  { id: 'w3', name: 'Savings', currency: 'USD', balance: 15800.00 },
  { id: 'w4', name: 'Travel Fund (EUR)', currency: 'EUR', balance: 2500.00 },
];

export const debts: Debt[] = [
  { id: 'd1', type: 'payable', person: 'John Doe', amount: 500, dueDate: '2024-08-01', status: 'unpaid' },
  { id: 'd2', type: 'receivable', person: 'Jane Smith', amount: 250, dueDate: '2024-08-15', status: 'unpaid' },
  { id: 'd3', type: 'payable', person: 'Car Loan', amount: 350, dueDate: '2024-07-30', status: 'unpaid' },
  { id: 'd4', type: 'payable', person: 'Alice', amount: 100, dueDate: '2024-07-25', status: 'paid' },
];

export const currencies = [
  'USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'HKD', 'NZD', 
  'SEK', 'KRW', 'SGD', 'NOK', 'MXN', 'INR', 'RUB', 'ZAR', 'TRY', 'BRL',
  'AED', 'SAR', 'QAR', 'KWD', 'BHD', 'OMR'
];

export const events = [
  { id: 'e1', name: 'Europe Trip 2024' },
  { id: 'e2', name: 'Client Project in Dubai' },
  { id: 'e3', name: 'Family Vacation Japan' },
];
