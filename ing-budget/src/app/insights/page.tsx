'use client';
import { useMemo } from 'react';
import { useBudget } from '@/context/BudgetContext';
import { computeInsights } from '@/lib/aiInsights';
import AlertBanner from '@/components/AlertBanner';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from 'recharts';
import { Sparkles, TrendingUp, PiggyBank, AlertCircle, CheckCircle2, Info } from 'lucide-react';

export default function InsightsPage() {
  const { transactions, categories, monthlyIncome, setMonthlyIncome } = useBudget();

  const insights = useMemo(
    () => computeInsights({ transactions, monthlyIncome, categories }),
    [transactions, monthlyIncome, categories]
  );

  const suggestionIcon = (type: string) => {
    if (type === 'warning') return <AlertCircle size={16} className="text-orange-500 shrink-0 mt-0.5" />;
    if (type === 'success') return <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />;
    return <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />;
  };

  const suggestionBg = (type: string) =>
    type === 'warning' ? 'bg-orange-50 border-orange-100' :
    type === 'success' ? 'bg-green-50 border-green-100' :
    'bg-blue-50 border-blue-100';

  return (
    <div>
      <AlertBanner />

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#FF6200] rounded-xl flex items-center justify-center">
          <Sparkles size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">IA Épargne</h1>
          <p className="text-gray-500 text-sm">Projections basées sur vos habitudes de dépenses</p>
        </div>
      </div>

      {/* Income input */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6 flex items-center gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 block mb-1">Revenu mensuel net (€)</label>
          <input
            type="number" min="0" step="50"
            className="w-full max-w-xs border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6200]"
            value={monthlyIncome}
            onChange={e => setMonthlyIncome(Number(e.target.value))}
          />
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 mb-1">Dépenses moyennes/mois</p>
          <p className="font-bold text-gray-900 text-lg">{insights.avgMonthlySpend.toFixed(2)} €</p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <PiggyBank size={20} className="text-green-600" />
            <p className="text-sm font-medium text-green-700">Épargne mensuelle</p>
          </div>
          <p className={`text-3xl font-bold ${insights.monthlySaving >= 0 ? 'text-green-700' : 'text-red-500'}`}>
            {insights.monthlySaving.toFixed(2)} €
          </p>
          <p className="text-xs text-green-600 mt-1">si vous continuez ainsi</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-blue-600" />
            <p className="text-sm font-medium text-blue-700">Épargne en 1 an</p>
          </div>
          <p className={`text-3xl font-bold ${insights.yearlySaving >= 0 ? 'text-blue-700' : 'text-red-500'}`}>
            {insights.yearlySaving.toFixed(0)} €
          </p>
          <p className="text-xs text-blue-600 mt-1">projection sur 12 mois</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 border border-orange-100">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={20} className="text-[#FF6200]" />
            <p className="text-sm font-medium text-orange-700">Potentiel d&apos;optimisation</p>
          </div>
          <p className="text-3xl font-bold text-[#FF6200]">
            {insights.categoryInsights.reduce((s, c) => s + c.potentialSaving, 0).toFixed(0)} €/an
          </p>
          <p className="text-xs text-orange-600 mt-1">en respectant vos budgets</p>
        </div>
      </div>

      {/* Spending vs income chart */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">Revenus vs Dépenses (6 derniers mois)</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={insights.chartData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', fontSize: '13px' }}
              formatter={(v: any) => `${Number(v).toFixed(2)} €`}
            />
            <Legend />
            <Bar dataKey="revenus" fill="#d1d5db" radius={[4, 4, 0, 0]} name="Revenus" />
            <Bar dataKey="dépenses" fill="#FF6200" radius={[4, 4, 0, 0]} name="Dépenses" />
            <Bar dataKey="épargne" fill="#22c55e" radius={[4, 4, 0, 0]} name="Épargne" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Per-category projection */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">Projection annuelle par catégorie</h2>
        <div className="space-y-3">
          {insights.categoryInsights.map(c => (
            <div key={c.id} className="flex items-center gap-3">
              <span className="text-xl w-7 shrink-0">{c.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-800 truncate">{c.name}</span>
                  <span className="text-gray-500 shrink-0 ml-2">{c.yearlyProjection.toFixed(0)} €/an</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, (c.avgMonthlySpend / (c.limit || 1)) * 100)}%`,
                      backgroundColor: c.avgMonthlySpend > c.limit ? '#ef4444' : c.color,
                    }}
                  />
                </div>
              </div>
              {c.potentialSaving > 0 && (
                <span className="text-xs text-red-500 font-medium shrink-0">
                  -{c.potentialSaving.toFixed(0)} €
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* AI Suggestions */}
      {insights.suggestions.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-[#FF6200]" />
            Recommandations IA
          </h2>
          <div className="space-y-3">
            {insights.suggestions.map((s, i) => (
              <div key={i} className={`flex items-start gap-2.5 rounded-xl p-3 border ${suggestionBg(s.type)}`}>
                {suggestionIcon(s.type)}
                <p className="text-sm text-gray-700">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
