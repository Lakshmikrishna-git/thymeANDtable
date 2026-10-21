import React from 'react';
import { 
  Sparkles, 
  Refrigerator, 
  UserCheck, 
  Clock, 
  Star, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  BookOpen, 
  Plus, 
  Flame,
  ChefHat
} from 'lucide-react';
import { User, RecipeMatchDetail, RecipeCategory } from '../types';
import { RecommendationEngine } from '../services/recommendationEngine';
import { db } from '../db/storage';

interface HomeDashboardProps {
  currentUser: User;
  onSelectRecipe: (match: RecipeMatchDetail) => void;
  onNavigateTab: (tab: string) => void;
  onOpenWeightsModal: () => void;
  onViewInfluencer: (influencerId: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  currentUser,
  onSelectRecipe,
  onNavigateTab,
  onOpenWeightsModal,
  onViewInfluencer
}) => {
  const allRecipes = db.getRecipes();
  const allReviews = db.getReviews();
  const pantryItems = db.getPantryItems(currentUser.id);
  const weights = db.getWeights();
  const influencers = db.getUsers().filter(u => u.role === 'INFLUENCER');

  // Compute 3-signal match for all recipes
  const rankedRecipes = RecommendationEngine.rankRecipes(
    allRecipes,
    pantryItems,
    allReviews,
    weights
  );

  const topRecommendations = rankedRecipes.slice(0, 4);

  // Pantry summary
  const expiringSoonCount = pantryItems.filter(p => {
    if (!p.expiryDate) return false;
    const diff = new Date(p.expiryDate).getTime() - Date.now();
    return diff > 0 && diff < 5 * 24 * 60 * 60 * 1000;
  }).length;

  return (
    <div className="space-y-10 animate-in fade-in duration-200">
      
      {/* Culinary Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#2D4536] via-[#3D6B50] to-[#4F7E64] text-white p-6 sm:p-10 overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none hidden sm:block">
          <img
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80"
            alt="Kitchen cooking"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-emerald-100 backdrop-blur-md border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Deterministic 3-Signal Matching Active</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight">
            Cook Authentic Kerala Naadan Ruchi with What You Already Own.
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Namaskaram, <strong className="text-white font-bold">{currentUser.name}</strong>! Your pantry currently has <strong className="text-white">{pantryItems.length} ingredients</strong> (Coconut Oil, Curry Leaves, Shallots, Mustard Seeds, Kudampuli). We've scored traditional Kerala recipes using pantry coverage, user ratings, and master chef endorsements.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('pantry')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-white text-[#2D4536] font-bold text-xs hover:bg-[#FAF7F2] transition-colors shadow-sm"
            >
              <Refrigerator className="w-4 h-4 text-[#3D6B50]" />
              <span>Update My Pantry</span>
            </button>

            <button
              onClick={() => onNavigateTab('influencers')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-[#E07A5F] hover:bg-[#c25630] text-white font-bold text-xs transition-colors shadow-sm"
            >
              <UserCheck className="w-4 h-4" />
              <span>Discover Influencer Chefs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recommended For You Section (3-Signal Weighted Engine) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2 text-[#3D6B50] text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-[#E07A5F]" />
              <span>Recommended For You (3-Signal Engine)</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-[#2D2A26]">
              Smart Pantry &amp; Influencer Matches
            </h2>
            <p className="text-xs text-[#7A7469]">
              Scored via: 50% Pantry Availability + 20% Community Ratings + 30% Influencer Endorsement.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenWeightsModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E8DFD1] text-xs font-semibold text-[#5C564C] hover:bg-[#FAF7F2] transition-colors shadow-xs"
            >
              <Sliders className="w-3.5 h-3.5 text-[#3D6B50]" />
              <span>Tune Formula</span>
            </button>

            <button
              onClick={() => onNavigateTab('recipes')}
              className="flex items-center space-x-1 text-xs font-bold text-[#3D6B50] hover:underline"
            >
              <span>View All Recipes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Recipe Cards Carousel / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {topRecommendations.map((match) => {
            const r = match.recipe;
            const isFullMatch = match.pantryMatchScore === 100;
            const missingCount = match.missingIngredients.length;

            return (
              <div
                key={r.id}
                onClick={() => onSelectRecipe(match)}
                className="group bg-white rounded-3xl border border-[#E8DFD1] overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="relative h-44 w-full overflow-hidden bg-stone-100">
                  <img
                    src={r.imageUrl}
                    alt={r.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Final 3-Signal Score */}
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-xs font-black bg-[#2E523D] text-white shadow-md">
                    {match.finalScore}% Match
                  </div>

                  {/* Pantry Readiness */}
                  <div className="absolute bottom-2.5 left-2.5">
                    {isFullMatch ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
                        100% in Pantry
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-600 text-white shadow-xs">
                        {missingCount} missing item{missingCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-display text-sm font-bold text-[#2D2A26] group-hover:text-[#3D6B50] transition-colors line-clamp-1 leading-snug">
                      {r.title}
                    </h3>
                    <p className="text-[11px] text-[#7A7469] line-clamp-2 mt-1">
                      {match.recommendationReason}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#F4EFE6] flex items-center justify-between text-[11px] text-[#7A7469]">
                    <span className="flex items-center space-x-1 font-semibold text-stone-700 truncate max-w-[110px]">
                      {r.authorRole === 'INFLUENCER' && (
                        <ChefHat className="w-3 h-3 text-[#E07A5F] shrink-0" />
                      )}
                      <span className="truncate">{r.authorName}</span>
                    </span>

                    <span className="flex items-center space-x-1 font-bold text-amber-700">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{match.averageRating > 0 ? match.averageRating : 'Unrated'}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Influencer Chefs Spotlight */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-[#2D2A26]">
              Featured Influencer Chefs
            </h2>
            <p className="text-xs text-[#7A7469]">
              Verified culinary creators providing chef endorsements and curated recipes.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('influencers')}
            className="flex items-center space-x-1 text-xs font-bold text-[#3D6B50] hover:underline"
          >
            <span>Explore All Influencers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {influencers.map((inf) => {
            const count = allRecipes.filter(r => r.authorId === inf.id).length;

            return (
              <div
                key={inf.id}
                onClick={() => onViewInfluencer(inf.id)}
                className="bg-white rounded-3xl border border-[#E8DFD1] p-5 shadow-xs hover:shadow-lg transition-all cursor-pointer flex items-center space-x-4 group"
              >
                <img
                  src={inf.avatarUrl}
                  alt={inf.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-[#E8DFD1] group-hover:scale-105 transition-transform shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1">
                    <h3 className="font-display font-bold text-sm text-[#2D2A26] truncate">
                      {inf.name}
                    </h3>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#3D6B50] shrink-0" />
                  </div>
                  <p className="text-[11px] text-[#E07A5F] font-semibold font-mono truncate">
                    {inf.handle}
                  </p>
                  <p className="text-[10px] text-[#7A7469] mt-0.5 truncate">
                    {inf.speciality}
                  </p>
                  <span className="text-[10px] font-bold text-[#3D6B50] mt-1 block">
                    {count} Curated Recipe{count === 1 ? '' : 's'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pantry Status Widget & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 bg-white rounded-3xl border border-[#E8DFD1] p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2.5 rounded-2xl bg-[#3D6B50]/15 text-[#3D6B50]">
                <Refrigerator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-[#2D2A26]">
                  Current Pantry Snapshot
                </h3>
                <p className="text-xs text-[#7A7469]">
                  {currentUser.name.split(' ')[0]}'s active inventory for recipe calculations
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('pantry')}
              className="text-xs font-bold text-[#3D6B50] hover:underline"
            >
              Manage Inventory &rarr;
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {pantryItems.slice(0, 8).map((p) => (
              <span
                key={p.id}
                className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD1] text-xs font-semibold text-[#2D2A26] flex items-center space-x-1.5"
              >
                <span>{p.name}</span>
                <span className="text-[10px] text-[#7A7469]">({p.quantity} {p.unit})</span>
              </span>
            ))}
            {pantryItems.length > 8 && (
              <span className="px-3 py-1.5 rounded-xl bg-stone-100 text-xs font-bold text-stone-600">
                +{pantryItems.length - 8} more
              </span>
            )}
          </div>
        </div>

        {/* Academic OOP Project Callout Banner */}
        <div className="bg-gradient-to-br from-[#FAF7F2] to-[#F4EFE6] rounded-3xl border border-[#E8DFD1] p-6 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#E07A5F]/20 text-[#C25630]">
              Academic Project Review
            </span>
            <h3 className="font-display text-base font-bold text-[#2D2A26] mt-2">
              Java OOP &amp; Viva Voce Hub
            </h3>
            <p className="text-xs text-[#5C564C] mt-1 leading-relaxed">
              Explore the Java source code, class hierarchy, JDBC SQLite schema, and viva defense answers.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('java-hub')}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#3D6B50] hover:bg-[#2E523D] transition-colors text-center shadow-xs"
          >
            Open Java OOP Explorer
          </button>
        </div>
      </div>

    </div>
  );
};
