'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Category = { id: string; name: string; icon: string; color: string; limit: number; allocated: number };
type Transaction = { id: string; categoryId: string; amount: number; description: string; date: string; merchant: string };
type Alert = { id: number; categoryId: string; categoryName: string; icon: string; over: string };
type BudgetContextType = {
  categories: Category[];
  transactions: Transaction[];
  balance: number;
  monthlyIncome: number;
  spentByCategory: Record<string, number>;
  alerts: Alert[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  addCategory: (cat: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  setBalance: (v: number) => void;
  setMonthlyIncome: (v: number) => void;
  dismissAlert: (id: number) => void;
  hydrated: boolean;
};

const DEFAULT_CATEGORIES = [
  { id: '1', name: 'Alimentation', icon: '🍔', color: '#FF6200', limit: 400, allocated: 400 },
  { id: '2', name: 'Rêves', icon: '✨', color: '#9333ea', limit: 200, allocated: 200 },
  { id: '3', name: 'Transport', icon: '🚗', color: '#2563eb', limit: 150, allocated: 150 },
  { id: '4', name: 'Loisirs', icon: '🎮', color: '#16a34a', limit: 100, allocated: 100 },
  { id: '5', name: 'Santé', icon: '💊', color: '#dc2626', limit: 80, allocated: 80 },
];

const DEFAULT_TRANSACTIONS = [
  { id: 't1', categoryId: '1', amount: 35.5, description: 'Uber Eats', date: '2026-05-28', merchant: 'Uber Eats' },
  { id: 't2', categoryId: '3', amount: 50, description: 'STIB mensuel', date: '2026-05-01', merchant: 'STIB' },
  { id: 't3', categoryId: '1', amount: 120, description: 'Carrefour', date: '2026-05-15', merchant: 'Carrefour' },
  { id: 't4', categoryId: '4', amount: 15, description: 'Netflix', date: '2026-05-10', merchant: 'Netflix' },
  { id: 't5', categoryId: '2', amount: 60, description: 'Sneakers Nike', date: '2026-05-20', merchant: 'Nike' },
  { id: 't6', categoryId: '1', amount: 22, description: 'Delhaize', date: '2026-05-22', merchant: 'Delhaize' },
  { id: 't7', categoryId: '5', amount: 40, description: 'Pharmacie', date: '2026-05-18', merchant: 'Pharmacie' },
  { id: 't8', categoryId: '4', amount: 30, description: 'Spotify + Cinema', date: '2026-05-25', merchant: 'Divers' },
];

const BudgetContext = createContext<BudgetContextType | null>(null);

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [transactions, setTransactions] = useState<Transaction[]>(DEFAULT_TRANSACTIONS);
  const [balance, setBalance] = useState(2450);
  const [monthlyIncome, setMonthlyIncome] = useState(1800);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ing_budget');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.categories) setCategories(data.categories);
        if (data.transactions) setTransactions(data.transactions);
        if (data.balance) setBalance(data.balance);
        if (data.monthlyIncome) setMonthlyIncome(data.monthlyIncome);
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem('ing_budget', JSON.stringify({ categories, transactions, balance, monthlyIncome }));
  }, [categories, transactions, balance, monthlyIncome, hydrated]);

  // Compute spent per category this month
  const currentMonth = new Date().toISOString().slice(0, 7);
  const spentByCategory: Record<string, number> = {};
  transactions
    .filter(t => t.date.startsWith(currentMonth))
    .forEach(t => {
      spentByCategory[t.categoryId] = (spentByCategory[t.categoryId] || 0) + t.amount;
    });

  function addTransaction(tx: Omit<Transaction, 'id'>) {
    const newTx: Transaction = { ...tx, id: 't' + Date.now(), date: tx.date || new Date().toISOString().slice(0, 10) };
    const cat = categories.find(c => c.id === tx.categoryId);
    if (cat) {
      const alreadySpent = spentByCategory[cat.id] || 0;
      const newSpent = alreadySpent + tx.amount;
      if (newSpent > cat.limit) {
        setAlerts(prev => [
          ...prev.filter(a => a.categoryId !== cat.id),
          {
            id: Date.now(),
            categoryId: cat.id,
            categoryName: cat.name,
            icon: cat.icon,
            over: (newSpent - cat.limit).toFixed(2),
          }
        ]);
      }
    }
    setTransactions(prev => [newTx, ...prev]);
    setBalance(prev => prev - tx.amount);
  }

  function addCategory(cat: Omit<Category, 'id'>) {
    const newCat = { ...cat, id: 'c' + Date.now() };
    setCategories(prev => [...prev, newCat]);
  }

  function updateCategory(id: string, updates: Partial<Category>) {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }

  function deleteCategory(id: string) {
    setCategories(prev => prev.filter(c => c.id !== id));
  }

  function dismissAlert(alertId: number) {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  }

  return (
    <BudgetContext.Provider value={{
      categories, transactions, balance, monthlyIncome,
      spentByCategory, alerts,
      addTransaction, addCategory, updateCategory, deleteCategory,
      setBalance, setMonthlyIncome, dismissAlert, hydrated,
    }}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error('useBudget must be inside BudgetProvider');
  return ctx;
}
