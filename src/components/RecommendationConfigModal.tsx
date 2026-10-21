import React, { useState } from 'react';
import { Sliders, X, Check, RotateCcw, Info, Sparkles, Utensils, Star, ShieldCheck } from 'lucide-react';
import { RecommendationWeights } from '../types';
import { DEFAULT_WEIGHTS } from '../db/initialData';

interface RecommendationConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWeights: RecommendationWeights;
  onSaveWeights: (weights: RecommendationWeights) => void;
}

export const RecommendationConfigModal: React.FC<RecommendationConfigModalProps> = ({
  isOpen,
  onClose,
  currentWeights,
  onSaveWeights
}) => {
  const [pantryPct, setPantryPct] = useState(Math.round(currentWeights.pantryWeight * 100));
  const [userRatingPct, setUserRatingPct] = useState(Math.round(currentWeights.userRatingWeight * 100));
  const [influencerPct, setInfluencerPct] = useState(Math.round(currentWeights.influencerWeight * 100));

  if (!isOpen) return null;

  const total = pantryPct + userRatingPct + influencerPct;
  const isExact100 = total === 100;

  const handleSave = () => {
    const sum = pantryPct + userRatingPct + influencerPct;
    if (sum === 0) return;
    onSaveWeights({
      pantryWeight: pantryPct / sum,
      userRatingWeight: userRatingPct / sum,
      influencerWeight: influencerPct / sum,
    });
    onClose();
  };

  const handleReset = () => {
    setPantryPct(50);
    setUserRatingPct(20);
    setInfluencerPct(30);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-[#FFFDF9] border border-[#E8DFD1] rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#F4EFE6] flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#3D6B50]/15 text-[#3D6B50]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-[#2D2A26]">
                Recommendation Engine Weights
              </h3>
              <p className="text-xs text-[#7A7469]">
                Deterministic 3-Signal Scoring Formula (Java OOP Rule)
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

        {/* Content */}
        <div className="p-6 space-y-6">
          
          <div className="p-4 rounded-2xl bg-[#F4EFE6] border border-[#E2D8C7] text-xs text-[#5C564C] space-y-2">
            <div className="flex items-center space-x-1.5 font-bold text-[#2D2A26]">
              <Info className="w-4 h-4 text-[#3D6B50]" />
              <span>Project Specification Rule (No AI / No LLM)</span>
            </div>
            <p className="leading-relaxed">
              Recipes are ranked using an explainable mathematical formula combining three normalized factors. As required by the college project brief, these weights are project rules, not trained AI parameters:
            </p>
            <div className="font-mono text-[11px] bg-white/80 p-2.5 rounded-xl border border-[#DDD3C2] text-[#2D2A26]">
              FinalScore = ({pantryPct}% × PantryMatch) + ({userRatingPct}% × UserRating) + ({influencerPct}% × InfluencerScore)
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-5">
            {/* Signal 1: Pantry Match */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-[#2D2A26] flex items-center space-x-1.5">
                  <Utensils className="w-4 h-4 text-[#3D6B50]" />
                  <span>1. Pantry Availability Match</span>
                </span>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded-lg bg-[#3D6B50]/15 text-[#3D6B50]">
                  {pantryPct}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={pantryPct}
                onChange={(e) => setPantryPct(Number(e.target.value))}
                className="w-full accent-[#3D6B50] cursor-pointer"
              />
              <p className="text-[11px] text-[#7A7469] mt-0.5">
                Evaluates quantity and coverage of user's current pantry items
              </p>
            </div>

            {/* Signal 2: User Rating */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-[#2D2A26] flex items-center space-x-1.5">
                  <Star className="w-4 h-4 text-[#E07A5F]" />
                  <span>2. Regular User Rating</span>
                </span>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded-lg bg-[#E07A5F]/15 text-[#C25630]">
                  {userRatingPct}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={userRatingPct}
                onChange={(e) => setUserRatingPct(Number(e.target.value))}
                className="w-full accent-[#E07A5F] cursor-pointer"
              />
              <p className="text-[11px] text-[#7A7469] mt-0.5">
                Average community star reviews (unrated recipes score 0 to prevent inflation)
              </p>
            </div>

            {/* Signal 3: Influencer Rating */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-[#2D2A26] flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-[#8C52FF]" />
                  <span>3. Influencer Endorsement Score</span>
                </span>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded-lg bg-purple-100 text-purple-700">
                  {influencerPct}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={influencerPct}
                onChange={(e) => setInfluencerPct(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <p className="text-[11px] text-[#7A7469] mt-0.5">
                Verified influencer chef ratings and signature endorsement weights
              </p>
            </div>
          </div>

          {/* Sum Status */}
          <div className="flex items-center justify-between text-xs px-3 py-2 rounded-xl bg-stone-100 border border-stone-200">
            <span className="text-[#5C564C]">Current Sum:</span>
            <span className={`font-bold ${isExact100 ? 'text-[#3D6B50]' : 'text-amber-700'}`}>
              {total}% {isExact100 ? '(Balanced 100%)' : '(Will be auto-normalized to 100%)'}
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#FAF7F2] border-t border-[#F4EFE6] flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center space-x-1.5 text-xs font-semibold text-[#7A7469] hover:text-[#2D2A26] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset (50 / 20 / 30)</span>
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#5C564C] hover:bg-[#EAE2D3] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-1.5 px-5 py-2 text-xs font-bold text-white bg-[#3D6B50] hover:bg-[#2E523D] rounded-xl shadow-sm transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Apply Formula</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
