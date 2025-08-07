

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

export type User = {
  name: string;
  email: string;
  avatar: string;
};

export type Category = {
  id: string;
  name: string;
  type: 'income' | 'expense';
  parentId: string | null;
  icon?: string;
};

export type Transaction = {
  id: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  subCategory?: string; // This will now represent the leaf category name
  wallet: string;
  description?: string;
  currency: string;
  attachments?: File[];
  eventId?: string;
  excludeFromReport?: boolean;
};

export type Wallet = {
  id: string;
  name: string;
  currency: string;
  balance: number;
  icon?: string;
  linkedCategoryIds?: string[];
};

export type Payment = {
    id: string;
    date: string;
    amount: number;
};

export type Debt = {
  id: string;
  type: 'payable' | 'receivable';
  person: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: 'paid' | 'unpaid' | 'partial';
  note?: string;
  payments: Payment[];
};

export type Event = {
  id: string;
  name: string;
  icon: string;
  status: 'active' | 'inactive';
};

export const user: User = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://placehold.co/100x100.png',
};

export const categories: Category[] = [
  { id: '1', name: 'Food & Drink', type: 'expense', parentId: null, icon: '🍔' },
  { id: '2', name: 'Restaurants', type: 'expense', parentId: '1', icon: '🧾' },
  { id: '3', name: 'Groceries', type: 'expense', parentId: '1', icon: '🛒' },
  { id: '4', name: 'Shopping', type: 'expense', parentId: null, icon: '🛍️' },
  { id: '5', name: 'Clothing', type: 'expense', parentId: '4', icon: '👕' },
  { id: '6', name: 'Electronics', type: 'expense', parentId: '4', icon: '💻' },
  { id: '7', name: 'Housing', type: 'expense', parentId: null, icon: '🏠' },
  { id: '8', name: 'Rent', type: 'expense', parentId: '7', icon: '🏢' },
  { id: '9', name: 'Utilities', type: 'expense', parentId: '7', icon: '🧾' },
  { id: '10', name: 'Transportation', type: 'expense', parentId: null, icon: '🚗' },
  { id: '11', name: 'Public Transport', type: 'expense', parentId: '10', icon: '🚌' },
  { id: '12', name: 'Fuel', type: 'expense', parentId: '10', icon: '⛽' },
  { id: '13', name: 'Income', type: 'income', parentId: null, icon: '📈' },
  { id: '14', name: 'Salary', type: 'income', parentId: '13', icon: '🏛️' },
  { id: '15', name: 'Freelance', type: 'income', parentId: '13', icon: '🐷' },
  { id: '16', name: 'Coffee Shops', type: 'expense', parentId: '2', icon: '☕' },
  { id: '17', name: 'Fast Food', type: 'expense', parentId: '2', icon: '🍟' },
];

export const transactions: Transaction[] = [
  { id: 't1', date: '2024-07-20', amount: 15.50, type: 'expense', category: 'Coffee Shops', wallet: 'Main Wallet', description: 'Lunch with colleagues', currency: 'USD', attachments: [], eventId: 'e1' },
  { id: 't2', date: '2024-07-20', amount: 80.00, type: 'expense', category: 'Groceries', wallet: 'Main Wallet', description: 'Weekly grocery shopping', currency: 'USD' },
  { id: 't3', date: '2024-07-19', amount: 2500, type: 'income', category: 'Salary', wallet: 'Main Wallet', description: 'Monthly salary', currency: 'USD' },
  { id: 't4', date: '2024-07-18', amount: 120.00, type: 'expense', category: 'Clothing', wallet: 'Credit Card', description: 'New shoes', currency: 'USD', eventId: 'e1', excludeFromReport: true },
  { id: 't5', date: '2024-07-17', amount: 45.00, type: 'expense', category: 'Fuel', wallet: 'Main Wallet', description: 'Gas for the car', currency: 'USD' },
  { id: 't6', date: '2024-07-15', amount: 1200.00, type: 'expense', category: 'Rent', wallet: 'Main Wallet', description: 'Monthly rent', currency: 'USD' },
  { id: 't7', date: '2024-07-12', amount: 550.00, type: 'income', category: 'Freelance', wallet: 'PayPal', description: 'Project payment', currency: 'USD' },
  { id: 't8', date: '2024-07-10', amount: 800.00, type: 'expense', category: 'Electronics', wallet: 'Credit Card', description: 'New monitor', currency: 'USD' },
];

export const wallets: Wallet[] = [
  { id: 'w1', name: 'Main Wallet', currency: 'USD', balance: 0, icon: '🏦', linkedCategoryIds: [] },
  { id: 'w2', name: 'Credit Card', currency: 'USD', balance: 0, icon: '💳', linkedCategoryIds: [] },
  { id: 'w3', name: 'Savings', currency: 'USD', balance: 15800.00, icon: '🐷', linkedCategoryIds: [] },
  { id: 'w4', name: 'PayPal', currency: 'USD', balance: 0, icon: '🅿️', linkedCategoryIds: [] },
];

export const debts: Debt[] = [
  { id: 'd1', type: 'payable', person: 'John Doe', amount: 500, currency: 'USD', dueDate: '2024-08-01', status: 'unpaid', note: 'For concert tickets', payments: [] },
  { id: 'd2', type: 'receivable', person: 'Jane Smith', amount: 250, currency: 'USD', dueDate: '2024-08-15', status: 'unpaid', payments: [] },
  { id: 'd3', type: 'payable', person: 'Car Loan', amount: 350, currency: 'USD', dueDate: '2024-07-30', status: 'unpaid', payments: [] },
  { id: 'd4', type: 'payable', person: 'Alice', amount: 100, currency: 'USD', dueDate: '2024-07-25', status: 'paid', payments: [{id: 'p1', date: '2024-07-20', amount: 100}] },
];

export const currencies = [
  "USD", "EUR", "JPY", "GBP", "CNY", "AUD", "CAD", "CHF", "HKD", "SGD", 
  "KRW", "INR", "RUB", "BRL", "MXN", "ZAR", "NZD", "SEK", "NOK", "DKK", 
  "TRY", "THB", "MYR", "IDR", "PHP", "SAR", "AED", "ILS", "ARS", "CLP", 
  "COP", "EGP", "NGN", "VND", "PLN", "CZK", "HUF", "RON", "BGN", "HRK", 
  "ISK", "UAH", "KWD", "QAR", "OMR", "BHD", "JOD", "TWD", "TND", "MAD", 
  "DZD", "PEN", "VES", "GTQ", "CRC", "HNL", "NIO", "PAB", "BOB", "UYU", 
  "PYG", "JMD", "TTD", "BBD", "BSD", "AWG", "ANG", "KYD", "XCD", "FJD", 
  "PGK", "WST", "TOP", "VUV", "SBD", "MOP", "BND", "MMK", "KHR", "LAK", 
  "MNT", "KZT", "UZS", "TJS", "TMT", "AZN", "GEL", "AMD", "BYN", "KGS", 
  "MZN", "ZMW", "MWK", "GHS", "ETB", "KES", "UGX", "RWF", "BWP", "NAD"
];

export const events: Event[] = [
  { id: 'e1', name: 'Europe Trip 2024', icon: '✈️', status: 'active' },
  { id: 'e2', name: 'Client Project in Dubai', icon: '💼', status: 'active' },
  { id: 'e3', name: 'Family Vacation Japan', icon: '🗾', status: 'inactive' },
];

export const emojiIcons = [
  // Income & Finance
  '💰', '💵', '💴', '💶', '💷', '💸', '💳', '📈', '💼', '🏦', '🏛️', '🐷', '🤑', '🎁', '🏆', '🥇', '👑', '🧾', '🤔',
  // Food & Drink
  '🍔', '🍟', '🍕', '☕', '🍺', '🍷', '🍸', '🥡', '🛒', '🍎', '🥕', '🍞', '🧀',
  // Shopping & Goods
  '🛍️', '🏷️', '🏬', '👕', '👗', '💻', '📱', '⌚', '📚', '💊', '🎁',
  // Housing & Utilities
  '🏠', '🏡', '🏢', '🛋️', '💡', '💧', '🔑', '🛠️',
  // Transportation
  '🚗', '🚕', '🚌', '🚆', '✈️', '⛽', '🚲', '🛴',
  // Health & Wellness
  '🏥', '💪', '🏃', '🏋️', '🧘', '❤️',
  // Entertainment & Leisure
  '🎬', '🎤', '🎧', '🎮', '🎭', '🎨', '🎟️', '🎫', '⚽', '🏀', '🏖️', '🎉',
  // Personal Care
  '💈', '💅', '✂️', '💄',
  // Education
  '🎓', '🏫', '📝',
  // Miscellaneous
  '❓', '💡', '🌍', '🛠️', '⚙️', '🖇️',
];

// Helper to calculate wallet balance
export const getWalletBalance = (walletName: string) => {
    const wallet = wallets.find(w => w.name === walletName);
    if (!wallet) return 0;

    // Start with the wallet's initial balance
    const initialBalance = wallet.balance || 0;

    const relevantTransactions = transactions.filter(t => t.wallet === walletName);
    
    // Calculate the net effect of transactions
    const transactionNet = relevantTransactions.reduce((acc, t) => {
        if (t.type === 'income') {
            return acc + t.amount;
        }
        return acc - t.amount;
    }, 0);

    // Return initial balance + transaction effect.
    return initialBalance + transactionNet;
}
