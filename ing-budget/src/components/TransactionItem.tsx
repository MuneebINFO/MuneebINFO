'use client';
import { useBudget } from '@/context/BudgetContext';

type Transaction = { id: string; categoryId: string; amount: number; description: string; date: string; merchant: string };
export default function TransactionItem({ transaction }: { transaction: Transaction }) {
  const { categories } = useBudget();
  const cat = categories.find(c => c.id === transaction.categoryId);

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-3">
        <span
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
          style={{ backgroundColor: cat ? cat.color + '20' : '#f3f4f6' }}
        >
          {cat?.icon || '💳'}
        </span>
        <div>
          <p className="font-medium text-gray-800 text-sm">{transaction.description}</p>
          <p className="text-xs text-gray-400">{transaction.date} · {cat?.name || 'Inconnu'}</p>
        </div>
      </div>
      <span className="font-semibold text-red-500 text-sm">-{transaction.amount.toFixed(2)}€</span>
    </div>
  );
}
