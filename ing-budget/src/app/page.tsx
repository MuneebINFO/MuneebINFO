'use client';
import { useBudget } from '@/context/BudgetContext';
import CategoryCard from '@/components/CategoryCard';
import AlertBanner from '@/components/AlertBanner';
import TransactionItem from '@/components/TransactionItem';
import Link from 'next/link';
import { ArrowRight, Wallet, TrendingDown, PiggyBank } from 'lucide-react';

export default function Dashboard() {
  const { categories, transactions, balance, monthlyIncome } = useBudget();

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlySpend = transactions
    .filter(t => t.date.startsWith(currentMonth))
    .reduce((s, t) => s + t.amount, 0);
  const saving = monthlyIncome - monthlySpend;

  const recent = transactions.slice(0, 5);

  return (
    <div>
      <AlertBanner />

      {/* Hero balance card */}
      <div className="bg-[#FF6200] rounded-3xl p-6 text-white mb-8">
        <p className="text-orange-100 text-sm font-medium mb-1">Solde disponible</p>
        <h1 className="text-4xl font-bold mb-4">{balance.toFixed(2)} €</h1>
        <div className="flex gap-6 flex-wrap">
          <div>
            <p className="text-orange-200 text-xs">Dépenses ce mois</p>
            <p className="text-white font-bold text-lg">{monthlySpend.toFixed(2)} €</p>
          </div>
          <div>
            <p className="text-orange-200 text-xs">Revenus</p>
            <p className="text-white font-bold text-lg">{monthlyIncome.toFixed(2)} €</p>
          </div>
          <div>
            <p className="text-orange-200 text-xs">Épargne estimée</p>
            <p className={`font-bold text-lg ${saving >= 0 ? 'text-white' : 'text-red-200'}`}>
              {saving.toFixed(2)} €
            </p>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
            <Wallet size={20} className="text-[#FF6200]" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Catégories</p>
            <p className="font-bold text-gray-900">{categories.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
            <TrendingDown size={20} className="text-red-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Transactions</p>
            <p className="font-bold text-gray-900">{transactions.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
            <PiggyBank size={20} className="text-green-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Épargne/an</p>
            <p className="font-bold text-gray-900">{(saving * 12).toFixed(0)} €</p>
          </div>
        </div>
      </div>

      {/* Categories grid */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Mes catégories</h2>
        <Link href="/categories" className="text-sm text-[#FF6200] hover:underline flex items-center gap-1">
          Voir tout <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {categories.map(cat => <CategoryCard key={cat.id} category={cat} />)}
      </div>

      {/* Recent transactions */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Dernières transactions</h2>
        <Link href="/transactions" className="text-sm text-[#FF6200] hover:underline flex items-center gap-1">
          Voir tout <ArrowRight size={14} />
        </Link>
      </div>
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        {recent.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">Aucune transaction</p>
        ) : (
          recent.map(t => <TransactionItem key={t.id} transaction={t} />)
        )}
      </div>
    </div>
  );
}
