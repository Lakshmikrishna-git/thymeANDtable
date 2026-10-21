/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeDashboard } from './components/HomeDashboard';
import { InfluencersPage } from './components/InfluencersPage';
import { RecipeCatalog } from './components/RecipeCatalog';
import { PantryManager } from './components/PantryManager';
import { MealPlanner } from './components/MealPlanner';
import { AdminPanel } from './components/AdminPanel';
import { JavaProjectHub } from './components/JavaProjectHub';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { RecipeCreateModal } from './components/RecipeCreateModal';
import { RecommendationConfigModal } from './components/RecommendationConfigModal';
import { User, RecipeMatchDetail, RecommendationWeights } from './types';
import { db } from './db/storage';
import { RecommendationEngine } from './services/recommendationEngine';
import { UtensilsCrossed, Heart, Code2 } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(db.getCurrentUser());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [dataVersion, setDataVersion] = useState<number>(0);

  // Modals
  const [selectedRecipeMatch, setSelectedRecipeMatch] = useState<RecipeMatchDetail | null>(null);
  const [isWeightsModalOpen, setIsWeightsModalOpen] = useState(false);
  const [isCreateRecipeOpen, setIsCreateRecipeOpen] = useState(false);
  const [preselectedInfluencerId, setPreselectedInfluencerId] = useState<string | undefined>(undefined);

  const refreshData = () => {
    setDataVersion((v) => v + 1);
  };

  const handleResetDatabase = () => {
    db.resetToDefaults();
    setCurrentUser(db.getCurrentUser());
    refreshData();
  };

  const handleOpenInfluencerProfile = (influencerId: string) => {
    setPreselectedInfluencerId(influencerId);
    setActiveTab('influencers');
    if (selectedRecipeMatch) {
      setSelectedRecipeMatch(null);
    }
  };

  const handleSaveWeights = (newWeights: RecommendationWeights) => {
    db.updateWeights(newWeights);
    refreshData();
  };

  // Re-sync current recipe match if open during data updates
  useEffect(() => {
    if (selectedRecipeMatch) {
      const allRecs = db.getRecipes();
      const updatedRecipe = allRecs.find((r) => r.id === selectedRecipeMatch.recipe.id);
      if (updatedRecipe) {
        const pantry = db.getPantryItems(currentUser.id);
        const reviews = db.getReviews();
        const weights = db.getWeights();
        const [match] = RecommendationEngine.rankRecipes([updatedRecipe], pantry, reviews, weights);
        if (match) {
          setSelectedRecipeMatch(match);
        }
      }
    }
  }, [dataVersion, currentUser.id]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D2A26] flex flex-col font-sans selection:bg-[#E07A5F]/20 selection:text-[#C25630]">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onUserChange={(user) => {
          setCurrentUser(user);
          refreshData();
        }}
        onOpenWeightsModal={() => setIsWeightsModalOpen(true)}
        onOpenCreateRecipe={() => setIsCreateRecipeOpen(true)}
        onResetDatabase={handleResetDatabase}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <HomeDashboard
            currentUser={currentUser}
            onSelectRecipe={(match) => setSelectedRecipeMatch(match)}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenWeightsModal={() => setIsWeightsModalOpen(true)}
            onViewInfluencer={handleOpenInfluencerProfile}
          />
        )}

        {activeTab === 'influencers' && (
          <InfluencersPage
            currentUser={currentUser}
            onSelectRecipe={(match) => setSelectedRecipeMatch(match)}
            preselectedInfluencerId={preselectedInfluencerId}
            onClearPreselected={() => setPreselectedInfluencerId(undefined)}
          />
        )}

        {activeTab === 'recipes' && (
          <RecipeCatalog
            currentUser={currentUser}
            onSelectRecipe={(match) => setSelectedRecipeMatch(match)}
            onOpenCreateRecipe={() => setIsCreateRecipeOpen(true)}
            onOpenWeightsModal={() => setIsWeightsModalOpen(true)}
            onViewInfluencer={handleOpenInfluencerProfile}
          />
        )}

        {activeTab === 'pantry' && (
          <PantryManager
            currentUser={currentUser}
            onNavigateToRecipes={() => setActiveTab('recipes')}
            onRefreshData={refreshData}
          />
        )}

        {activeTab === 'planner' && (
          <MealPlanner
            currentUser={currentUser}
            onRefreshData={refreshData}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel
            currentUser={currentUser}
            onRefreshData={refreshData}
            onResetDatabase={handleResetDatabase}
          />
        )}

        {activeTab === 'java-hub' && (
          <JavaProjectHub />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-[#F4EFE6] border-t border-[#E8DFD1] py-10 text-xs text-[#7A7469]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#3D6B50] text-white flex items-center justify-center font-bold">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-[#2D2A26] text-sm">
                Smart Recipe Book &amp; Kitchen Pantry Planning System
              </p>
              <p className="text-[11px] text-[#A69E8F]">
                College-Level Java OOP Project • Influencer Discovery &amp; 3-Signal Recommendation Engine
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs font-semibold">
            <button onClick={() => setActiveTab('dashboard')} className="hover:text-[#2D2A26] transition-colors">
              Dashboard
            </button>
            <button onClick={() => setActiveTab('influencers')} className="hover:text-[#2D2A26] transition-colors">
              Influencers
            </button>
            <button onClick={() => setActiveTab('recipes')} className="hover:text-[#2D2A26] transition-colors">
              Recipes
            </button>
            <button onClick={() => setActiveTab('pantry')} className="hover:text-[#2D2A26] transition-colors">
              Pantry
            </button>
            <button onClick={() => setActiveTab('java-hub')} className="text-[#C25630] hover:underline font-bold flex items-center space-x-1">
              <Code2 className="w-3.5 h-3.5" />
              <span>Java OOP Hub</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Recipe Detail Modal */}
      {selectedRecipeMatch && (
        <RecipeDetailModal
          recipeMatch={selectedRecipeMatch}
          currentUser={currentUser}
          onClose={() => setSelectedRecipeMatch(null)}
          onRefreshData={refreshData}
          onViewInfluencerProfile={handleOpenInfluencerProfile}
        />
      )}

      {/* Create Recipe Modal */}
      <RecipeCreateModal
        isOpen={isCreateRecipeOpen}
        currentUser={currentUser}
        onClose={() => setIsCreateRecipeOpen(false)}
        onRecipeCreated={refreshData}
      />

      {/* Recommendation Weights Modal */}
      <RecommendationConfigModal
        isOpen={isWeightsModalOpen}
        onClose={() => setIsWeightsModalOpen(false)}
        currentWeights={db.getWeights()}
        onSaveWeights={handleSaveWeights}
      />

    </div>
  );
}
