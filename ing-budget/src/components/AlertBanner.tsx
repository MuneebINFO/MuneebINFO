'use client';
import { X, AlertTriangle } from 'lucide-react';
import { useBudget } from '@/context/BudgetContext';

export default function AlertBanner() {
  const { alerts, dismissAlert } = useBudget();
  if (!alerts.length) return null;

  return (
    <div className="space-y-2 mb-6">
      {alerts.map(alert => (
        <div key={alert.id} className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertTriangle size={18} className="text-red-500 shrink-0" />
          <p className="text-sm text-red-700 flex-1">
            <strong>{alert.icon} {alert.categoryName}</strong> : limite dépassée de{' '}
            <strong>{alert.over}€</strong> ce mois-ci !
          </p>
          <button onClick={() => dismissAlert(alert.id)} className="text-red-400 hover:text-red-600">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
