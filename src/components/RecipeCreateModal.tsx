import React, { useState } from 'react';
import { X, Plus, Trash2, ChefHat, Sparkles, Image, Check } from 'lucide-react';
import { Recipe, RecipeCategory, RecipeIngredient, User } from '../types';
import { db } from '../db/storage';

interface RecipeCreateModalProps {
  isOpen: boolean;
  currentUser: User;
  onClose: () => void;
  onRecipeCreated: () => void;
}

const AVAILABLE_CATEGORIES: RecipeCategory[] = [
  'Healthy',
  'Budget-Friendly',
  'Quick Meals',
  'Vegetarian',
  'High-Protein',
  'Comfort Food',
  'Dessert'
];

const PRESET_IMAGES = [
  { label: 'Fish Curry', url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Kadala Curry', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Mutta Roast', url: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Avial / Sadya', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Kozhi Roast', url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Moru Curry', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Malabar Biryani', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Dosa / Appam', url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1000&q=80' },
];

export const RecipeCreateModal: React.FC<RecipeCreateModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onRecipeCreated,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(15);
  const [cookTimeMinutes, setCookTimeMinutes] = useState(20);
  const [servings, setServings] = useState(2);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [selectedCategories, setSelectedCategories] = useState<RecipeCategory[]>(['Quick Meals']);
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);

  // Ingredients builder
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([
    { ingredientId: 'ing_1', ingredientName: 'Coconut Oil (Velichenna)', quantity: 2, unit: 'tbsp' },
    { ingredientId: 'ing_2', ingredientName: 'Shallots (Kunjulli)', quantity: 10, unit: 'pcs' },
    { ingredientId: 'ing_3', ingredientName: 'Curry Leaves (Kariveppila)', quantity: 2, unit: 'sprigs' },
  ]);

  // Instructions builder
  const [instructions, setInstructions] = useState<string[]>([
    'Heat pure coconut oil in a pan or clay pot and splutter mustard seeds and curry leaves.',
    'Add sliced shallots, ginger, garlic, and sauté until fragrant and golden brown.',
  ]);

  const [influencerScore, setInfluencerScore] = useState(4.8);
  const [error, setError] = useState<string | null>(null);

  const toggleCategory = (cat: RecipeCategory) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter(c => c !== cat));
      }
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients,
      {
        ingredientId: 'ing_' + Date.now(),
        ingredientName: '',
        quantity: 1,
        unit: 'pcs',
      },
    ]);
  };

  const handleUpdateIngredient = (index: number, field: keyof RecipeIngredient, value: any) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const handleRemoveIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const handleUpdateInstruction = (index: number, val: string) => {
    const updated = [...instructions];
    updated[index] = val;
    setInstructions(updated);
  };

  const handleRemoveInstruction = (index: number) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Recipe title is required.');
      return;
    }

    const cleanIngredients = ingredients.filter(i => i.ingredientName.trim().length > 0);
    if (cleanIngredients.length === 0) {
      setError('Please provide at least one ingredient with a name.');
      return;
    }

    const cleanInstructions = instructions.filter(i => i.trim().length > 0);
    if (cleanInstructions.length === 0) {
      setError('Please provide at least one cooking instruction step.');
      return;
    }

    db.createRecipe({
      title: title.trim(),
      description: description.trim() || 'A delicious, wholesome recipe crafted for smart pantry cooking.',
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorHandle: currentUser.handle,
      authorAvatar: currentUser.avatarUrl,
      imageUrl,
      prepTimeMinutes,
      cookTimeMinutes,
      servings,
      difficulty,
      categories: selectedCategories,
      ingredients: cleanIngredients,
      instructions: cleanInstructions,
      influencerRatingScore: currentUser.role === 'INFLUENCER' ? influencerScore : undefined,
    });

    onRecipeCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FFFDF9] border border-[#E8DFD1] rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#F4EFE6] flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#3D6B50]/15 text-[#3D6B50]">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-[#2D2A26]">
                Publish New Recipe
              </h3>
              <p className="text-xs text-[#7A7469]">
                Authoring as <span className="font-bold text-[#2D2A26]">{currentUser.name}</span> ({currentUser.role})
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl hover:bg-[#EAE2D3] text-[#7A7469] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Basic Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-[#2D2A26]">Recipe Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 15-Minute Creamy Avocado Pasta"
                className="w-full p-2.5 rounded-xl bg-white border border-[#DDD3C2] text-xs font-medium focus:ring-2 focus:ring-[#3D6B50] focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-[#2D2A26]">Short Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of flavors, meal type, and pantry hacks..."
                rows={2}
                className="w-full p-2.5 rounded-xl bg-white border border-[#DDD3C2] text-xs focus:ring-2 focus:ring-[#3D6B50] focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2D2A26]">Prep Time (Minutes)</label>
              <input
                type="number"
                min="1"
                value={prepTimeMinutes}
                onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-white border border-[#DDD3C2] text-xs focus:ring-2 focus:ring-[#3D6B50] focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2D2A26]">Cook Time (Minutes)</label>
              <input
                type="number"
                min="0"
                value={cookTimeMinutes}
                onChange={(e) => setCookTimeMinutes(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-white border border-[#DDD3C2] text-xs focus:ring-2 focus:ring-[#3D6B50] focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2D2A26]">Servings</label>
              <input
                type="number"
                min="1"
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-white border border-[#DDD3C2] text-xs focus:ring-2 focus:ring-[#3D6B50] focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2D2A26]">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-white border border-[#DDD3C2] text-xs focus:ring-2 focus:ring-[#3D6B50] focus:outline-hidden"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Influencer Endorsement Rating Score */}
          {currentUser.role === 'INFLUENCER' && (
            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-900 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Influencer Signature Endorsement Score</span>
                </span>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded-lg bg-purple-200 text-purple-800">
                  {influencerScore} / 5.0 ★
                </span>
              </div>
              <input
                type="range"
                min="3.0"
                max="5.0"
                step="0.1"
                value={influencerScore}
                onChange={(e) => setInfluencerScore(Number(e.target.value))}
                className="w-full accent-purple-600"
              />
              <p className="text-[11px] text-purple-700">
                This weight feeds into the 3-signal recommendation engine for student & home cook discovery.
              </p>
            </div>
          )}

          {/* Category Tags */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#2D2A26]">Recipe Categories / Tags</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_CATEGORIES.map((cat) => {
                const isSelected = selectedCategories.includes(cat);
                return (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#3D6B50] text-white shadow-xs'
                        : 'bg-[#F4EFE6] text-[#5C564C] hover:bg-[#EAE2D3]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Food Image Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#2D2A26] flex items-center space-x-1.5">
              <Image className="w-4 h-4 text-[#3D6B50]" />
              <span>Select Food Photography</span>
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {PRESET_IMAGES.map((img) => (
                <div
                  key={img.url}
                  onClick={() => setImageUrl(img.url)}
                  className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    imageUrl === img.url
                      ? 'border-[#3D6B50] ring-2 ring-[#3D6B50]/30 scale-105'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                  {imageUrl === img.url && (
                    <div className="absolute inset-0 bg-[#3D6B50]/30 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white drop-shadow-md" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Ingredients Builder */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#2D2A26]">Ingredients List *</label>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="flex items-center space-x-1 text-xs font-bold text-[#3D6B50] hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Ingredient</span>
              </button>
            </div>

            <div className="space-y-2">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Ingredient Name (e.g. Pasta, Garlic)"
                    value={ing.ingredientName}
                    onChange={(e) => handleUpdateIngredient(idx, 'ingredientName', e.target.value)}
                    className="flex-1 p-2 rounded-xl bg-white border border-[#DDD3C2] text-xs focus:ring-2 focus:ring-[#3D6B50] focus:outline-hidden"
                  />
                  <input
                    type="number"
                    min="0.1"
                    step="0.5"
                    placeholder="Qty"
                    value={ing.quantity}
                    onChange={(e) => handleUpdateIngredient(idx, 'quantity', Number(e.target.value))}
                    className="w-20 p-2 rounded-xl bg-white border border-[#DDD3C2] text-xs focus:ring-2 focus:ring-[#3D6B50] focus:outline-hidden"
                  />
                  <input
                    type="text"
                    placeholder="Unit (g, tbsp, pcs)"
                    value={ing.unit}
                    onChange={(e) => handleUpdateIngredient(idx, 'unit', e.target.value)}
                    className="w-24 p-2 rounded-xl bg-white border border-[#DDD3C2] text-xs focus:ring-2 focus:ring-[#3D6B50] focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(idx)}
                    className="p-2 text-stone-400 hover:text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions Builder */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#2D2A26]">Step-by-Step Instructions *</label>
              <button
                type="button"
                onClick={handleAddInstruction}
                className="flex items-center space-x-1 text-xs font-bold text-[#3D6B50] hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Step</span>
              </button>
            </div>

            <div className="space-y-2">
              {instructions.map((step, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <span className="w-6 h-6 rounded-full bg-[#F4EFE6] text-[#5C564C] flex items-center justify-center text-xs font-bold mt-1 shrink-0">
                    {idx + 1}
                  </span>
                  <textarea
                    rows={2}
                    value={step}
                    onChange={(e) => handleUpdateInstruction(idx, e.target.value)}
                    placeholder={`Step ${idx + 1} instructions...`}
                    className="flex-1 p-2 rounded-xl bg-white border border-[#DDD3C2] text-xs focus:ring-2 focus:ring-[#3D6B50] focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveInstruction(idx)}
                    className="p-2 text-stone-400 hover:text-red-600 rounded-lg transition-colors mt-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-[#F4EFE6] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#5C564C] hover:bg-[#EAE2D3] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-[#3D6B50] hover:bg-[#2E523D] rounded-xl shadow-md shadow-[#3D6B50]/20 transition-all"
            >
              Publish to Database
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
