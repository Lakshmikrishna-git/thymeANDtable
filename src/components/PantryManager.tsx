import React, { useState } from 'react';
import { 
  Refrigerator, 
  Plus, 
  Search, 
  Trash2, 
  AlertTriangle, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { PantryItem, User, IngredientCategory } from '../types';
import { db } from '../db/storage';

interface PantryManagerProps {
  currentUser: User;
  onNavigateToRecipes: () => void;
  onRefreshData: () => void;
}

const PANTRY_CATEGORIES: IngredientCategory[] = [
  'Produce',
  'Dairy & Eggs',
  'Pantry & Grains',
  'Meat & Seafood',
  'Spices & Condiments',
  'Bakery'
];

export const PantryManager: React.FC<PantryManagerProps> = ({
  currentUser,
  onNavigateToRecipes,
  onRefreshData
}) => {
  const pantryItems = db.getPantryItems(currentUser.id);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('pcs');
  const [category, setCategory] = useState<IngredientCategory>('Produce');
  const [expiryDate, setExpiryDate] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState(1);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    db.addPantryItem({
      ingredientId: 'ing_' + name.trim().toLowerCase().replace(/\s+/g, '_'),
      name: name.trim(),
      quantity: Number(quantity),
      unit: unit.trim() || 'pcs',
      category,
      expiryDate: expiryDate || undefined,
      lowStockThreshold: Number(lowStockThreshold),
    }, currentUser.id);

    setName('');
    setQuantity(1);
    setExpiryDate('');
    setShowAddModal(false);
    onRefreshData();
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    const item = pantryItems.find(p => p.id === id);
    if (!item) return;

    const newQty = Math.max(0, item.quantity + delta);
    if (newQty === 0) {
      if (confirm(`Remove ${item.name} from pantry?`)) {
        db.deletePantryItem(id);
      }
    } else {
      db.updatePantryItem(id, { quantity: newQty });
    }
    onRefreshData();
  };

  const handleDeleteItem = (id: string) => {
    db.deletePantryItem(id);
    onRefreshData();
  };

  // Filter items
  const filteredItems = pantryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Expiration helper
  const getExpiryStatus = (dateStr?: string) => {
    if (!dateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exp = new Date(dateStr);
    exp.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: `Expired ${Math.abs(diffDays)}d ago`, color: 'text-red-700 bg-red-100 border-red-200' };
    }
    if (diffDays <= 3) {
      return { label: `Expires in ${diffDays}d`, color: 'text-amber-800 bg-amber-100 border-amber-200' };
    }
    return { label: `Good until ${dateStr}`, color: 'text-emerald-800 bg-emerald-50 border-emerald-200' };
  };

  // Expiring soon items
  const expiringCount = pantryItems.filter(p => {
    if (!p.expiryDate) return false;
    const diff = new Date(p.expiryDate).getTime() - Date.now();
    return diff > 0 && diff < 5 * 24 * 60 * 60 * 1000;
  }).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header and Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#3D6B50] text-xs font-bold uppercase tracking-wider mb-1">
            <Refrigerator className="w-4 h-4" />
            <span>Kitchen Inventory & Expiry Tracker</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2D2A26]">
            {currentUser.name.split(' ')[0]}'s Kitchen Pantry
          </h2>
          <p className="text-xs sm:text-sm text-[#7A7469] mt-1">
            Keep track of what's stocked in your fridge and cabinets to calculate accurate recipe matches.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onNavigateToRecipes}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-white border border-[#E8DFD1] text-xs font-bold text-[#3D6B50] hover:bg-[#FAF7F2] transition-colors shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>Match Recipes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-[#3D6B50] hover:bg-[#2E523D] text-white text-xs font-bold transition-all shadow-md shadow-[#3D6B50]/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Pantry Item</span>
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-3xl bg-white border border-[#E8DFD1] flex items-center space-x-4 shadow-xs">
          <div className="p-3 rounded-2xl bg-[#3D6B50]/15 text-[#3D6B50]">
            <Refrigerator className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-[#7A7469]">Total Stocked Items</p>
            <p className="text-xl font-display font-bold text-[#2D2A26]">{pantryItems.length} ingredients</p>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-[#E8DFD1] flex items-center space-x-4 shadow-xs">
          <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-700">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-[#7A7469]">Expiring Within 5 Days</p>
            <p className="text-xl font-display font-bold text-amber-800">{expiringCount} item{expiringCount === 1 ? '' : 's'}</p>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-[#E8DFD1] flex items-center space-x-4 shadow-xs">
          <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-700">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-[#7A7469]">Database Synchronization</p>
            <p className="text-xl font-display font-bold text-[#2D2A26]">Active (Relational)</p>
          </div>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="bg-white p-4 rounded-3xl border border-[#E8DFD1] shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#7A7469] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search your pantry items (e.g. olive oil, pasta, garlic)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD1] text-xs focus:ring-2 focus:ring-[#3D6B50] focus:outline-hidden"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          {['All', ...PANTRY_CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#3D6B50] text-white shadow-xs'
                  : 'bg-[#F4EFE6] text-[#5C564C] hover:bg-[#EAE2D3]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Pantry Items Table / List */}
      <div className="bg-white rounded-3xl border border-[#E8DFD1] shadow-xs overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="py-16 text-center p-8">
            <Refrigerator className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="font-display text-lg font-bold text-[#2D2A26]">No pantry items found</h3>
            <p className="text-xs text-[#7A7469] mt-1 max-w-sm mx-auto">
              Add your spices, produce, grains, and essentials to receive personalized recipe matches.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-[#3D6B50] text-white text-xs font-bold shadow-sm"
            >
              Add First Item
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#F4EFE6]">
            {filteredItems.map((item) => {
              const expStatus = getExpiryStatus(item.expiryDate);
              const isLowStock = item.lowStockThreshold && item.quantity <= item.lowStockThreshold;

              return (
                <div
                  key={item.id}
                  className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF7F2]/60 transition-colors"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#F4EFE6] text-[#3D6B50] flex items-center justify-center font-bold text-sm shrink-0 border border-[#E8DFD1]">
                      {item.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-[#2D2A26]">{item.name}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#7A7469] border border-[#E8DFD1]">
                          {item.category}
                        </span>
                        {isLowStock && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex items-center space-x-1">
                            <TrendingDown className="w-3 h-3" />
                            <span>Low Stock</span>
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3 text-xs text-[#7A7469] mt-0.5">
                        {expStatus && (
                          <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-md border ${expStatus.color}`}>
                            {expStatus.label}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Controls & Delete */}
                  <div className="flex items-center justify-between sm:justify-end space-x-4">
                    <div className="flex items-center space-x-2 bg-[#FAF7F2] p-1 rounded-2xl border border-[#E8DFD1]">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        className="w-7 h-7 rounded-xl bg-white text-[#2D2A26] font-bold hover:bg-stone-200 flex items-center justify-center shadow-xs text-xs"
                      >
                        -
                      </button>
                      <span className="w-16 text-center text-xs font-bold text-[#2D2A26]">
                        {item.quantity} {item.unit}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        className="w-7 h-7 rounded-xl bg-white text-[#2D2A26] font-bold hover:bg-stone-200 flex items-center justify-center shadow-xs text-xs"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 text-stone-400 hover:text-red-600 transition-colors rounded-xl"
                      title="Remove from pantry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#FFFDF9] border border-[#E8DFD1] rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-5 border-b border-[#F4EFE6] flex items-center justify-between bg-[#FAF7F2]">
              <h3 className="font-display text-lg font-bold text-[#2D2A26]">
                Add Ingredient to Pantry
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#7A7469] hover:text-[#2D2A26]">
                &times;
              </button>
            </div>

            <form onSubmit={handleAddItem} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#2D2A26]">Ingredient Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tomatoes, Olive Oil, Chicken Breast"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#DDD3C2] text-xs focus:ring-2 focus:ring-[#3D6B50] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2D2A26]">Quantity *</label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.5"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#DDD3C2] text-xs focus:ring-2 focus:ring-[#3D6B50] focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2D2A26]">Unit (g, pcs, ml, tbsp)</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#DDD3C2] text-xs focus:ring-2 focus:ring-[#3D6B50] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#2D2A26]">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#DDD3C2] text-xs focus:ring-2 focus:ring-[#3D6B50] focus:outline-hidden"
                >
                  {PANTRY_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2D2A26]">Expiry Date (Optional)</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#DDD3C2] text-xs focus:ring-2 focus:ring-[#3D6B50] focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#2D2A26]">Low Stock Alert Qty</label>
                  <input
                    type="number"
                    min="0"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#DDD3C2] text-xs focus:ring-2 focus:ring-[#3D6B50] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#5C564C] hover:bg-[#EAE2D3] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#3D6B50] hover:bg-[#2E523D] rounded-xl shadow-sm"
                >
                  Save to Pantry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
