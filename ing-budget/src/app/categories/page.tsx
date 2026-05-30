'use client';
import { useState } from 'react';
import { useBudget } from '@/context/BudgetContext';
import CategoryCard from '@/components/CategoryCard';
import AlertBanner from '@/components/AlertBanner';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';

const ICONS = ['🍔','🛒','✈️','✨','🚗','🎮','💊','🏠','👗','📚','🎵','🍷','💪','🐾','🎁','💻'];
const COLORS = ['#FF6200','#9333ea','#2563eb','#16a34a','#dc2626','#d97706','#0891b2','#db2777'];

export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useBudget();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', icon: '🍔', color: '#FF6200', limit: 100, allocated: 100 });

  function openAdd() {
    setEditId(null);
    setForm({ name: '', icon: '🍔', color: '#FF6200', limit: 100, allocated: 100 });
    setShowForm(true);
  }

  function openEdit(cat: { id: string; name: string; icon: string; color: string; limit: number; allocated: number }) {
    setEditId(cat.id);
    setForm({ name: cat.name, icon: cat.icon, color: cat.color, limit: cat.limit, allocated: cat.allocated });
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editId) {
      updateCategory(editId, form);
    } else {
      addCategory(form);
    }
    setShowForm(false);
  }

  return (
    <div>
      <AlertBanner />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Catégories</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#FF6200] text-white px-4 py-2 rounded-xl font-medium hover:bg-orange-600 transition-colors"
        >
          <Plus size={18} /> Nouvelle catégorie
        </button>
      </div>

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg text-gray-900">
                {editId ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Nom</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6200]"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Ex: Alimentation"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Icône</label>
                <div className="flex flex-wrap gap-2">
                  {ICONS.map(icon => (
                    <button
                      key={icon} type="button"
                      onClick={() => setForm(f => ({ ...f, icon }))}
                      className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-colors ${form.icon === icon ? 'bg-[#FF6200] ring-2 ring-orange-300' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >{icon}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Couleur</label>
                <div className="flex gap-2">
                  {COLORS.map(color => (
                    <button
                      key={color} type="button"
                      onClick={() => setForm(f => ({ ...f, color }))}
                      className={`w-7 h-7 rounded-full transition-transform ${form.color === color ? 'scale-125 ring-2 ring-gray-400' : ''}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Budget mensuel (€)</label>
                  <input
                    type="number" min="1"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6200]"
                    value={form.limit}
                    onChange={e => setForm(f => ({ ...f, limit: Number(e.target.value), allocated: Number(e.target.value) }))}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Alloué (€)</label>
                  <input
                    type="number" min="0"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6200]"
                    value={form.allocated}
                    onChange={e => setForm(f => ({ ...f, allocated: Number(e.target.value) }))}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[#FF6200] text-white py-2.5 rounded-xl font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                <Check size={18} /> {editId ? 'Enregistrer' : 'Créer la catégorie'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="relative group">
            <CategoryCard category={cat} />
            <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => openEdit(cat)}
                className="w-7 h-7 bg-white rounded-lg shadow flex items-center justify-center text-gray-500 hover:text-[#FF6200]"
              ><Pencil size={13} /></button>
              <button
                onClick={() => deleteCategory(cat.id)}
                className="w-7 h-7 bg-white rounded-lg shadow flex items-center justify-center text-gray-500 hover:text-red-500"
              ><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📂</p>
          <p className="font-medium">Aucune catégorie — créez-en une !</p>
        </div>
      )}
    </div>
  );
}
