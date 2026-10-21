import React, { useState } from 'react';
import { 
  UserCheck, 
  Search, 
  Sparkles, 
  Star, 
  BookOpen, 
  Users, 
  CheckCircle2, 
  ArrowLeft, 
  Clock, 
  Filter,
  Flame,
  ChefHat,
  MessageSquare
} from 'lucide-react';
import { User, Recipe, RecipeMatchDetail } from '../types';
import { db } from '../db/storage';
import { RecommendationEngine } from '../services/recommendationEngine';

interface InfluencersPageProps {
  currentUser: User;
  onSelectRecipe: (recipeMatch: RecipeMatchDetail) => void;
  preselectedInfluencerId?: string;
  onClearPreselected?: () => void;
}

export const InfluencersPage: React.FC<InfluencersPageProps> = ({
  currentUser,
  onSelectRecipe,
  preselectedInfluencerId,
  onClearPreselected
}) => {
  const users = db.getUsers();
  const influencers = users.filter(u => u.role === 'INFLUENCER');
  const allRecipes = db.getRecipes();
  const allReviews = db.getReviews();
  const pantryItems = db.getPantryItems(currentUser.id);
  const weights = db.getWeights();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInfluencerId, setSelectedInfluencerId] = useState<string | null>(
    preselectedInfluencerId || null
  );

  // Filter within influencer profile
  const [recipeSearch, setRecipeSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filtered influencer list
  const filteredInfluencers = influencers.filter(inf => {
    const q = searchQuery.toLowerCase();
    return (
      inf.name.toLowerCase().includes(q) ||
      (inf.speciality && inf.speciality.toLowerCase().includes(q)) ||
      (inf.handle && inf.handle.toLowerCase().includes(q))
    );
  });

  const activeInfluencer = selectedInfluencerId 
    ? influencers.find(inf => inf.id === selectedInfluencerId)
    : null;

  // Active influencer's recipes
  const influencerRecipes = activeInfluencer
    ? allRecipes.filter(r => r.authorId === activeInfluencer.id)
    : [];

  // Ranked versions of influencer recipes
  const rankedInfluencerRecipes = RecommendationEngine.rankRecipes(
    influencerRecipes,
    pantryItems,
    allReviews,
    weights
  );

  // Filtered by recipe search or category
  const filteredRankedRecipes = rankedInfluencerRecipes.filter(match => {
    const matchesSearch = 
      match.recipe.title.toLowerCase().includes(recipeSearch.toLowerCase()) ||
      match.recipe.ingredients.some(i => i.ingredientName.toLowerCase().includes(recipeSearch.toLowerCase()));

    const matchesCat = 
      selectedCategory === 'All' || match.recipe.categories.includes(selectedCategory as any);

    return matchesSearch && matchesCat;
  });

  // Calculate influencer average rating across all their recipes
  const getInfluencerStats = (infId: string) => {
    const recs = allRecipes.filter(r => r.authorId === infId);
    let totalRatings = 0;
    let ratingSum = 0;
    let reviewCount = 0;

    for (const r of recs) {
      const revs = allReviews.filter(rev => rev.recipeId === r.id);
      reviewCount += revs.length;
      for (const rev of revs) {
        ratingSum += rev.rating;
        totalRatings++;
      }
    }

    const avgRating = totalRatings > 0 ? (ratingSum / totalRatings).toFixed(1) : '4.8';
    return { recipeCount: recs.length, avgRating, reviewCount };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* If an influencer is selected, show their full Creator Profile */}
      {activeInfluencer ? (
        <div className="space-y-6">
          
          {/* Back button */}
          <button
            onClick={() => {
              setSelectedInfluencerId(null);
              if (onClearPreselected) onClearPreselected();
            }}
            className="flex items-center space-x-2 text-xs font-bold text-[#5C564C] hover:text-[#2D2A26] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Influencer Chefs</span>
          </button>

          {/* Influencer Hero Banner */}
          <div className="relative rounded-3xl bg-gradient-to-br from-[#3D6B50] via-[#2E523D] to-[#1E3A2B] text-white p-6 sm:p-8 overflow-hidden shadow-xl">
            <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
            <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-[#E07A5F]/20 blur-2xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 text-center md:text-left">
              <div className="relative">
                <img
                  src={activeInfluencer.avatarUrl}
                  alt={activeInfluencer.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white/20 shadow-xl"
                />
                <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-[#E07A5F] text-white shadow-md">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold">
                      {activeInfluencer.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-emerald-200 font-semibold font-mono">
                      {activeInfluencer.handle}
                    </p>
                  </div>

                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white backdrop-blur-md self-center sm:self-auto border border-white/20">
                    <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
                    <span>Verified Creator</span>
                  </span>
                </div>

                <div className="inline-block px-3 py-1 rounded-xl text-xs font-bold bg-[#E07A5F]/20 text-orange-200 border border-[#E07A5F]/40">
                  Specialty: {activeInfluencer.speciality}
                </div>

                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed max-w-2xl">
                  {activeInfluencer.bio}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-center md:justify-start space-x-6 pt-2 text-xs">
                  <div>
                    <span className="font-bold text-base block">{activeInfluencer.followerCount?.toLocaleString()}</span>
                    <span className="text-stone-300 text-[11px]">Community Followers</span>
                  </div>
                  <div>
                    <span className="font-bold text-base block">{influencerRecipes.length}</span>
                    <span className="text-stone-300 text-[11px]">Curated Recipes</span>
                  </div>
                  <div>
                    <span className="font-bold text-base block flex items-center space-x-1">
                      <span>{getInfluencerStats(activeInfluencer.id).avgRating}</span>
                      <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    </span>
                    <span className="text-stone-300 text-[11px]">Avg Recipe Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Tag Filter within Influencer's Recipes */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#7A7469] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search chef's recipes or ingredients..."
                value={recipeSearch}
                onChange={(e) => setRecipeSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-[#E8DFD1] text-xs focus:ring-2 focus:ring-[#3D6B50] focus:outline-hidden"
              />
            </div>

            <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1">
              {['All', 'Quick Meals', 'Vegetarian', 'Budget-Friendly', 'Healthy', 'High-Protein'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#3D6B50] text-white'
                      : 'bg-[#F4EFE6] text-[#5C564C] hover:bg-[#EAE2D3]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Influencer Recipes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRankedRecipes.length === 0 ? (
              <div className="col-span-full text-center py-12 rounded-3xl bg-white border border-[#E8DFD1] p-8">
                <ChefHat className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <h4 className="font-display text-lg font-bold text-[#2D2A26]">No recipes found</h4>
                <p className="text-xs text-[#7A7469] mt-1">Try another search term or filter category.</p>
              </div>
            ) : (
              filteredRankedRecipes.map((match) => (
                <div
                  key={match.recipe.id}
                  onClick={() => onSelectRecipe(match)}
                  className="group bg-white rounded-3xl border border-[#E8DFD1] overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                    <img
                      src={match.recipe.imageUrl}
                      alt={match.recipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-black bg-[#3D6B50] text-white shadow-md">
                      {match.pantryMatchScore}% Pantry Match
                    </div>
                    <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                      {match.recipe.categories.slice(0, 2).map((c) => (
                        <span key={c} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 text-[#2D2A26] backdrop-blur-xs">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-display text-base font-bold text-[#2D2A26] group-hover:text-[#3D6B50] transition-colors leading-snug">
                        {match.recipe.title}
                      </h4>
                      <p className="text-xs text-[#7A7469] line-clamp-2 mt-1">
                        {match.recipe.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#F4EFE6] flex items-center justify-between text-xs text-[#7A7469]">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-[#3D6B50]" />
                        <span>{match.recipe.prepTimeMinutes + match.recipe.cookTimeMinutes} mins</span>
                      </span>
                      <span className="flex items-center space-x-1 font-semibold text-amber-700">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{match.averageRating > 0 ? match.averageRating : 'Unrated'}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      ) : (
        /* Influencers Discovery Directory */
        <div className="space-y-6">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-[#3D6B50] text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Core Module • Culinary Creator Hub</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2D2A26]">
                Discover Influencer Chefs
              </h2>
              <p className="text-xs sm:text-sm text-[#7A7469] mt-1">
                Explore signature recipes, food philosophies, and community-endorsed culinary creations.
              </p>
            </div>

            {/* Influencer search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#7A7469] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search influencers or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-[#E8DFD1] text-xs focus:ring-2 focus:ring-[#3D6B50] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Influencer Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInfluencers.map((inf) => {
              const stats = getInfluencerStats(inf.id);
              const signatureRecipes = allRecipes.filter(r => r.authorId === inf.id).slice(0, 2);

              return (
                <div
                  key={inf.id}
                  className="bg-white rounded-3xl border border-[#E8DFD1] p-6 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between space-y-5"
                >
                  {/* Creator Header */}
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <img
                        src={inf.avatarUrl}
                        alt={inf.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-[#E8DFD1]"
                      />
                      <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#3D6B50] text-white shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-base font-bold text-[#2D2A26] truncate">
                        {inf.name}
                      </h3>
                      <p className="text-xs text-[#E07A5F] font-semibold font-mono">
                        {inf.handle}
                      </p>
                      <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#3D6B50]/10 text-[#3D6B50]">
                        {inf.speciality?.split('&')[0]}
                      </span>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-[#5C564C] leading-relaxed line-clamp-3">
                    {inf.bio}
                  </p>

                  {/* Stats Bar */}
                  <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-2xl bg-[#FAF7F2] border border-[#F4EFE6] text-center text-xs">
                    <div>
                      <p className="font-bold text-[#2D2A26]">{inf.followerCount?.toLocaleString()}</p>
                      <p className="text-[10px] text-[#7A7469]">Followers</p>
                    </div>
                    <div>
                      <p className="font-bold text-[#2D2A26]">{stats.recipeCount}</p>
                      <p className="text-[10px] text-[#7A7469]">Recipes</p>
                    </div>
                    <div>
                      <p className="font-bold text-amber-700 flex items-center justify-center space-x-0.5">
                        <span>{stats.avgRating}</span>
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      </p>
                      <p className="text-[10px] text-[#7A7469]">Avg Rating</p>
                    </div>
                  </div>

                  {/* Signature Recipe Preview */}
                  {signatureRecipes.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#7A7469]">
                        Signature Dishes:
                      </p>
                      <div className="space-y-1">
                        {signatureRecipes.map((r) => (
                          <div key={r.id} className="text-xs font-semibold text-[#2D2A26] flex items-center space-x-1.5 truncate">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E07A5F]" />
                            <span className="truncate">{r.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={() => setSelectedInfluencerId(inf.id)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#3D6B50] hover:bg-[#2E523D] shadow-sm transition-colors text-center"
                  >
                    Browse {inf.name.split(' ')[0]}'s Recipes
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
