import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Clock, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  PlusCircle, 
  ChefHat,
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import { Recipe, RecipeMatchDetail, User, RecipeCategory } from '../types';
import { RecommendationEngine } from '../services/recommendationEngine';
import { db } from '../db/storage';

interface RecipeCatalogProps {
  currentUser: User;
  onSelectRecipe: (match: RecipeMatchDetail) => void;
  onOpenCreateRecipe: () => void;
  onOpenWeightsModal: () => void;
  onViewInfluencer: (influencerId: string) => void;
}

export const RecipeCatalog: React.FC<RecipeCatalogProps> = ({
  currentUser,
  onSelectRecipe,
  onOpenCreateRecipe,
  onOpenWeightsModal,
  onViewInfluencer
}) => {
  const allRecipes = db.getRecipes();
  const allReviews = db.getReviews();
  const pantryItems = db.getPantryItems(currentUser.id);
  const weights = db.getWeights();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'3-signal' | 'pantry-only' | 'rating' | 'time'>('3-signal');
  const [onlyInfluencerRecipes, setOnlyInfluencerRecipes] = useState(false);

  // Compute 3-signal match for all recipes
  const allRanked = RecommendationEngine.rankRecipes(
    allRecipes,
    pantryItems,
    allReviews,
    weights
  );

  // Filter recipes
  const filteredRecipes = allRanked.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const titleMatch = item.recipe.title.toLowerCase().includes(q);
    const ingredientMatch = item.recipe.ingredients.some(i => 
      i.ingredientName.toLowerCase().includes(q)
    );
    const authorMatch = item.recipe.authorName.toLowerCase().includes(q);
    const matchesSearch = !q || titleMatch || ingredientMatch || authorMatch;

    const matchesCategory = 
      selectedCategory === 'All' || item.recipe.categories.includes(selectedCategory as any);

    const matchesInfluencerOnly = 
      !onlyInfluencerRecipes || item.recipe.authorRole === 'INFLUENCER';

    return matchesSearch && matchesCategory && matchesInfluencerOnly;
  });

  // Sort recipes based on selected strategy
  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    if (sortBy === '3-signal') {
      return b.finalScore - a.finalScore;
    }
    if (sortBy === 'pantry-only') {
      return b.pantryMatchScore - a.pantryMatchScore;
    }
    if (sortBy === 'rating') {
      return b.averageRating - a.averageRating;
    }
    if (sortBy === 'time') {
      const timeA = a.recipe.prepTimeMinutes + a.recipe.cookTimeMinutes;
      const timeB = b.recipe.prepTimeMinutes + b.recipe.cookTimeMinutes;
      return timeA - timeB;
    }
    return 0;
  });

  const categories = [
    'All',
    'Healthy',
    'Budget-Friendly',
    'Quick Meals',
    'Vegetarian',
    'High-Protein',
    'Comfort Food',
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2D2A26]">
            Kerala Recipe Catalog & Kitchen Discovery
          </h2>
          <p className="text-xs sm:text-sm text-[#7A7469] mt-1">
            Search by Kerala delicacies or pantry staples (e.g. "meen", "kadala", "mutta", "coconut oil", "shallots").
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenWeightsModal}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-[#E8DFD1] text-xs font-semibold text-[#5C564C] hover:bg-[#FAF7F2] transition-colors shadow-xs"
            title="Adjust 3-Signal Formula Weights"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#3D6B50]" />
            <span>Tune Formula</span>
          </button>

          <button
            onClick={onOpenCreateRecipe}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-[#3D6B50] hover:bg-[#2E523D] text-white text-xs font-bold transition-all shadow-md shadow-[#3D6B50]/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Recipe</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E8DFD1] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#7A7469] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search recipes by title or ingredient (e.g. Meen Curry, Kadala, Mutta, Coconut Oil)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD1] text-xs focus:ring-2 focus:ring-[#3D6B50] focus:outline-hidden"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center space-x-2">
            <label className="text-xs font-bold text-[#7A7469] whitespace-nowrap">Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-2.5 px-3 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD1] text-xs font-semibold text-[#2D2A26] focus:ring-2 focus:ring-[#3D6B50] focus:outline-hidden"
            >
              <option value="3-signal">3-Signal Recommended</option>
              <option value="pantry-only">Pantry Availability %</option>
              <option value="rating">Highest User Rating</option>
              <option value="time">Fastest Cook Time</option>
            </select>
          </div>
        </div>

        {/* Category Pills & Influencer Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F4EFE6]">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => (
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

          <label className="flex items-center space-x-2 text-xs font-semibold text-[#5C564C] cursor-pointer">
            <input
              type="checkbox"
              checked={onlyInfluencerRecipes}
              onChange={(e) => setOnlyInfluencerRecipes(e.target.checked)}
              className="rounded-md accent-[#3D6B50] w-4 h-4 cursor-pointer"
            />
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
              <span>Influencer Recipes Only</span>
            </span>
          </label>
        </div>
      </div>

      {/* Recipe Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedRecipes.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-[#E8DFD1] p-8">
            <ChefHat className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="font-display text-xl font-bold text-[#2D2A26]">No recipes found</h3>
            <p className="text-xs text-[#7A7469] mt-1 max-w-md mx-auto">
              We couldn't find any recipes matching your search criteria. Try clearing filters or create a brand new recipe!
            </p>
          </div>
        ) : (
          sortedRecipes.map((match) => {
            const r = match.recipe;
            const isFullMatch = match.pantryMatchScore === 100;
            const missingCount = match.missingIngredients.length;

            return (
              <div
                key={r.id}
                onClick={() => onSelectRecipe(match)}
                className="group bg-white rounded-3xl border border-[#E8DFD1] overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
              >
                {/* Photo & Overlays */}
                <div className="relative h-52 w-full overflow-hidden bg-stone-100">
                  <img
                    src={r.imageUrl}
                    alt={r.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* 3-Signal Composite Score Badge */}
                  <div className="absolute top-3 right-3 flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-black bg-[#2E523D] text-white shadow-lg backdrop-blur-xs">
                    <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
                    <span>{match.finalScore}% Match</span>
                  </div>

                  {/* Pantry Readiness Badge */}
                  <div className="absolute bottom-3 left-3">
                    {isFullMatch ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-md">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ready to Cook (100%)</span>
                      </span>
                    ) : match.pantryMatchScore >= 50 ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-600 text-white shadow-md">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{missingCount} missing item{missingCount > 1 ? 's' : ''} ({match.pantryMatchScore}%)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-700 text-white shadow-md">
                        <span>Restock needed ({missingCount} items)</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Categories */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {r.categories.slice(0, 2).map((cat) => (
                        <span
                          key={cat}
                          className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FAF7F2] text-[#7A7469] border border-[#E8DFD1]"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-display text-lg font-bold text-[#2D2A26] group-hover:text-[#3D6B50] transition-colors leading-snug">
                      {r.title}
                    </h3>
                    <p className="text-xs text-[#7A7469] line-clamp-2 mt-1">
                      {r.description}
                    </p>
                  </div>

                  {/* Author / Influencer info */}
                  <div 
                    onClick={(e) => {
                      if (r.authorRole === 'INFLUENCER') {
                        e.stopPropagation();
                        onViewInfluencer(r.authorId);
                      }
                    }}
                    className="flex items-center space-x-2 pt-2 border-t border-[#F4EFE6]"
                  >
                    {r.authorAvatar ? (
                      <img
                        src={r.authorAvatar}
                        alt={r.authorName}
                        className="w-6 h-6 rounded-full object-cover border border-stone-200"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-[#3D6B50] text-white flex items-center justify-center text-[10px] font-bold">
                        {r.authorName[0]}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-[#5C564C] truncate hover:text-[#2D2A26]">
                      {r.authorName}
                    </span>
                    {r.authorRole === 'INFLUENCER' && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-[#E07A5F]/20 text-[#C25630]">
                        Chef
                      </span>
                    )}
                  </div>

                  {/* Bottom Stats */}
                  <div className="flex items-center justify-between text-xs text-[#7A7469] pt-1">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-[#3D6B50]" />
                      <span>{r.prepTimeMinutes + r.cookTimeMinutes} mins</span>
                    </span>

                    <span className="flex items-center space-x-1 font-bold text-amber-700">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{match.averageRating > 0 ? match.averageRating : 'Unrated'}</span>
                      <span className="text-stone-400 font-normal">({match.reviewCount})</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
