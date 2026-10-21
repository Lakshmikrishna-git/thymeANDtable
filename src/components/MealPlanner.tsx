import React, { useState } from 'react';
import { 
  CalendarDays, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  CheckCircle2, 
  Sparkles, 
  Utensils, 
  ArrowRight,
  Check,
  ChefHat
} from 'lucide-react';
import { User, DayOfWeek, MealTime, MealPlanEntry, Recipe } from '../types';
import { db } from '../db/storage';
import { RecommendationEngine } from '../services/recommendationEngine';

interface MealPlannerProps {
  currentUser: User;
  onRefreshData: () => void;
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TIMES: MealTime[] = ['Breakfast', 'Lunch', 'Dinner'];

export const MealPlanner: React.FC<MealPlannerProps> = ({
  currentUser,
  onRefreshData
}) => {
  const mealPlans = db.getMealPlans(currentUser.id);
  const allRecipes = db.getRecipes();
  const pantryItems = db.getPantryItems(currentUser.id);

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');
  const [selectedMealTime, setSelectedMealTime] = useState<MealTime>('Dinner');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(allRecipes[0]?.id || '');

  // Grocery list generated state
  const [purchasedIngredients, setPurchasedIngredients] = useState<string[]>([]);

  const handleAssignMeal = (e: React.FormEvent) => {
    e.preventDefault();
    const recipe = allRecipes.find(r => r.id === selectedRecipeId);
    if (!recipe) return;

    db.addMealPlanEntry({
      day: selectedDay,
      mealTime: selectedMealTime,
      recipeId: recipe.id,
      recipeTitle: recipe.title,
      recipeImage: recipe.imageUrl,
      servings: recipe.servings,
    }, currentUser.id);

    setShowAddModal(false);
    onRefreshData();
  };

  const handleRemoveMeal = (id: string) => {
    db.removeMealPlanEntry(id);
    onRefreshData();
  };

  // Calculate Grocery Checklist across all planned meals
  const groceryItemsMap = new Map<string, { required: number; unit: string; inPantry: number; deficit: number }>();

  for (const plan of mealPlans) {
    const rec = allRecipes.find(r => r.id === plan.recipeId);
    if (!rec) continue;

    for (const ing of rec.ingredients) {
      const key = ing.ingredientName.trim().toLowerCase();
      const current = groceryItemsMap.get(key) || {
        required: 0,
        unit: ing.unit,
        inPantry: 0,
        deficit: 0,
      };

      current.required += ing.quantity;

      // Find in pantry
      const normKey = RecommendationEngine.normalizeIngredientName(ing.ingredientName);
      const foundInPantry = pantryItems.find(p => {
        const pNorm = RecommendationEngine.normalizeIngredientName(p.name);
        return pNorm.includes(normKey) || normKey.includes(pNorm);
      });

      current.inPantry = foundInPantry ? foundInPantry.quantity : 0;
      current.deficit = Math.max(0, current.required - current.inPantry);

      groceryItemsMap.set(key, current);
    }
  }

  const groceryList = Array.from(groceryItemsMap.entries()).map(([name, data]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    ...data,
  }));

  const missingGroceryItems = groceryList.filter(g => g.deficit > 0);

  const handleRestockMissingToPantry = (item: typeof missingGroceryItems[0]) => {
    db.addPantryItem({
      ingredientId: 'ing_' + item.name.toLowerCase().replace(/\s+/g, '_'),
      name: item.name,
      quantity: item.deficit,
      unit: item.unit,
      category: 'Pantry & Grains',
      expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lowStockThreshold: 1,
    }, currentUser.id);

    setPurchasedIngredients([...purchasedIngredients, item.name]);
    onRefreshData();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#3D6B50] text-xs font-bold uppercase tracking-wider mb-1">
            <CalendarDays className="w-4 h-4" />
            <span>Weekly Kitchen Scheduler</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2D2A26]">
            Weekly Meal Planner
          </h2>
          <p className="text-xs sm:text-sm text-[#7A7469] mt-1">
            Schedule recipes for your week. We automatically generate a synchronized grocery list based on what's in your pantry.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-[#3D6B50] hover:bg-[#2E523D] text-white text-xs font-bold transition-all shadow-md shadow-[#3D6B50]/20"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule a Meal</span>
        </button>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {DAYS.map((day) => {
          const dayPlans = mealPlans.filter(m => m.day === day);

          return (
            <div
              key={day}
              className="bg-white rounded-3xl border border-[#E8DFD1] p-4 flex flex-col justify-between space-y-3 shadow-xs"
            >
              <div className="border-b border-[#F4EFE6] pb-2 flex items-center justify-between">
                <span className="font-display font-bold text-sm text-[#2D2A26]">{day}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#FAF7F2] text-[#7A7469]">
                  {dayPlans.length} meal{dayPlans.length === 1 ? '' : 's'}
                </span>
              </div>

              <div className="space-y-2 flex-1 min-h-[140px]">
                {dayPlans.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-6 text-stone-300">
                    <Utensils className="w-5 h-5 mb-1" />
                    <span className="text-[11px] text-[#A69E8F]">No meals set</span>
                  </div>
                ) : (
                  dayPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="p-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD1] text-xs relative group flex flex-col justify-between space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-[#E07A5F]">
                          {plan.mealTime}
                        </span>
                        <button
                          onClick={() => handleRemoveMeal(plan.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-red-600 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <p className="font-bold text-[#2D2A26] text-xs line-clamp-2 leading-tight">
                        {plan.recipeTitle}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={() => {
                  setSelectedDay(day);
                  setShowAddModal(true);
                }}
                className="w-full py-1.5 rounded-xl border border-dashed border-[#DDD3C2] hover:border-[#3D6B50] hover:bg-[#FAF7F2] text-[11px] font-bold text-[#7A7469] hover:text-[#3D6B50] transition-colors flex items-center justify-center space-x-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Auto Synchronized Grocery Checklist */}
      <div className="bg-white rounded-3xl border border-[#E8DFD1] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F4EFE6] pb-4">
          <div>
            <h3 className="font-display text-xl font-bold text-[#2D2A26] flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#3D6B50]" />
              <span>Smart Weekly Grocery Checklist</span>
            </h3>
            <p className="text-xs text-[#7A7469] mt-0.5">
              Automatically compares ingredients needed across your planned meals against what is already in your pantry.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-[#2D2A26] px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
              {missingGroceryItems.length} items to purchase
            </span>
          </div>
        </div>

        {missingGroceryItems.length === 0 ? (
          <div className="py-8 text-center bg-[#FAF7F2] rounded-2xl border border-[#E8DFD1] p-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <h4 className="font-display text-base font-bold text-[#2D2A26]">All Weekly Meals Covered!</h4>
            <p className="text-xs text-[#7A7469] mt-1">
              Your current pantry inventory has enough ingredients to cook all meals planned this week.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {missingGroceryItems.map((item) => {
              const isPurchased = purchasedIngredients.includes(item.name);

              return (
                <div
                  key={item.name}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs transition-colors ${
                    isPurchased
                      ? 'bg-emerald-50/70 border-emerald-200 opacity-60'
                      : 'bg-[#FAF7F2] border-[#E8DFD1]'
                  }`}
                >
                  <div>
                    <p className={`font-bold text-sm ${isPurchased ? 'line-through text-stone-500' : 'text-[#2D2A26]'}`}>
                      {item.name}
                    </p>
                    <p className="text-[11px] text-[#7A7469]">
                      Need: <span className="font-bold text-stone-800">{item.required} {item.unit}</span>
                      {item.inPantry > 0 && ` (Have: ${item.inPantry})`}
                    </p>
                    <span className="text-[10px] font-black text-amber-700">
                      Deficit: +{item.deficit} {item.unit}
                    </span>
                  </div>

                  {!isPurchased && (
                    <button
                      onClick={() => handleRestockMissingToPantry(item)}
                      className="px-3 py-1.5 rounded-xl bg-[#3D6B50] hover:bg-[#2E523D] text-white text-[11px] font-bold shadow-xs transition-colors flex items-center space-x-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Restock</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Meal Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#FFFDF9] border border-[#E8DFD1] rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-5 border-b border-[#F4EFE6] flex items-center justify-between bg-[#FAF7F2]">
              <h3 className="font-display text-lg font-bold text-[#2D2A26]">
                Schedule a Recipe
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#7A7469] hover:text-[#2D2A26]">
                &times;
              </button>
            </div>

            <form onSubmit={handleAssignMeal} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#2D2A26]">Select Day</label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#DDD3C2] text-xs focus:ring-2 focus:ring-[#3D6B50] focus:outline-hidden"
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#2D2A26]">Meal Slot</label>
                <select
                  value={selectedMealTime}
                  onChange={(e) => setSelectedMealTime(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#DDD3C2] text-xs focus:ring-2 focus:ring-[#3D6B50] focus:outline-hidden"
                >
                  {MEAL_TIMES.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#2D2A26]">Select Recipe from Catalog</label>
                <select
                  value={selectedRecipeId}
                  onChange={(e) => setSelectedRecipeId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#DDD3C2] text-xs focus:ring-2 focus:ring-[#3D6B50] focus:outline-hidden"
                >
                  {allRecipes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.prepTimeMinutes + r.cookTimeMinutes}m) - by {r.authorName}
                    </option>
                  ))}
                </select>
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
                  Add to Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
