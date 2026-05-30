'use client';
import { useState } from 'react';
import { useBudget } from '@/context/BudgetContext';
import TransactionItem from '@/components/TransactionItem';
import AlertBanner from '@/components/AlertBanner';
import { Plus, X, Check, Filter } from 'lucide-react';

const MERCHANTS = ['Uber Eats', 'Deliveroo', 'Carrefour', 'Delhaize', 'STIB', 'SNCB', 'Netflix', 'Spotify', 'Amazon', 'H&M', 'Nike', 'Zara', 'Autre'];

export default function TransactionsPage() {
  const { transactions, categories, addTransaction } = useBudget();
  const [showForm, setShowForm] = useState(false);
  const [filterCat, setFilterCat] = useState('all');
  const [form, setForm] = useState({
    description: '',
    merchant: '',
    amount: '',
    categoryId: '',
    date: new Date().toISOString().slice(0, 10),
  });

  const filtered = filterCat === 'all'
    ? transactions
    : transactions.filter(t => t.categoryId === filterCat);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.description || !form.amount || !form.categoryId) return;
    addTransaction({
      description: form.description,
      merchant: form.merchant || form.description,
      amount: parseFloat(form.amount),
      categoryId: form.categoryId,
      date: form.date,
    });
    setForm({ description: '', merchant: '', amount: '', categoryId: '', date: new Date().toISOString().slice(0, 10) });
    setShowForm(false);
  }

  return (
    <div>
      <AlertBanner />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#FF6200] text-white px-4 py-2 rounded-xl font-medium hover:bg-orange-600 transition-colors"
        >
          <Plus size={18} /> Ajouter
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
        <Filter size={15} className="text-gray-400 shrink-0" />
        <button
          onClick={() => setFilterCat('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors
            ${filterCat === 'all' ? 'bg-[#FF6200] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Toutes
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilterCat(cat.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors
              ${filterCat === cat.id ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            style={filterCat === cat.id ? { backgroundColor: cat.color } : {}}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg text-gray-900">Nouvelle transaction</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6200]"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Ex: Commande Uber Eats"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Marchand</label>
                <select
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6200]"
                  value={form.merchant}
                  onChange={e => setForm(f => ({ ...f, merchant: e.target.value }))}
                >
                  <option value="">Sélectionner...</option>
                  {MERCHANTS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Montant (€)</label>
                  <input
                    type="number" min="0.01" step="0.01"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6200]"
                    value={form.amount}
                    onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6200]"
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Catégorie</label>
                <select
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6200]"
                  value={form.categoryId}
                  onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                  required
                >
                  <option value="">Choisir une catégorie...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-[#FF6200] text-white py-2.5 rounded-xl font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                <Check size={18} /> Enregistrer
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        {filtered.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">Aucune transaction à afficher</p>
        ) : (
          filtered.map(t => <TransactionItem key={t.id} transaction={t} />)
        )}
      </div>
    </div>
  );
}
