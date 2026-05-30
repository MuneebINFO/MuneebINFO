'use client';
import { useBudget } from '@/context/BudgetContext';

type Category = { id: string; name: string; icon: string; color: string; limit: number; allocated: number };
export default function CategoryCard({ category }: { category: Category }) {
  const { spentByCategory } = useBudget();
  const spent = spentByCategory[category.id] || 0;
  const pct = Math.min(100, (spent / category.limit) * 100);
  const over = spent > category.limit;
  const remaining = category.limit - spent;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{category.icon}</span>
          <span className="font-semibold text-gray-800">{category.name}</span>
        </div>
        {over && (
          <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Dépassé !</span>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-3">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: over ? '#ef4444' : category.color }}
        />
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-gray-500">
          Dépensé : <strong className={over ? 'text-red-500' : 'text-gray-800'}>{spent.toFixed(2)}€</strong>
        </span>
        <span className="text-gray-500">
          Budget : <strong className="text-gray-800">{category.limit}€</strong>
        </span>
      </div>
      <p className={`text-xs mt-1 font-medium ${over ? 'text-red-500' : 'text-green-600'}`}>
        {over ? `Dépassé de ${Math.abs(remaining).toFixed(2)}€` : `Reste ${remaining.toFixed(2)}€`}
      </p>
    </div>
  );
}
