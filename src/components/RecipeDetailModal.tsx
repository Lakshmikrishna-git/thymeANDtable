import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  ChefHat, 
  Users, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Plus, 
  Send, 
  Trash2, 
  ShoppingBag,
  ExternalLink,
  Flame,
  Check
} from 'lucide-react';
import { Recipe, RecipeMatchDetail, User, Review } from '../types';
import { db } from '../db/storage';

interface RecipeDetailModalProps {
  recipeMatch: RecipeMatchDetail;
  currentUser: User;
  onClose: () => void;
  onRefreshData: () => void;
  onViewInfluencerProfile?: (influencerId: string) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipeMatch,
  currentUser,
  onClose,
  onRefreshData,
  onViewInfluencerProfile
}) => {
  const { recipe, pantryMatchScore, userRatingScore, influencerRatingScore, finalScore, missingIngredients } = recipeMatch;
  const reviews = db.getReviewsForRecipe(recipe.id);
  const userPantry = db.getPantryItems(currentUser.id);

  // Review Form State
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);

  // Completed steps tracker
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Check if user has already reviewed
  const hasReviewed = db.hasUserReviewedRecipe(recipe.id, currentUser.id);

  const toggleStep = (index: number) => {
    if (completedSteps.includes(index)) {
      setCompletedSteps(completedSteps.filter(s => s !== index));
    } else {
      setCompletedSteps([...completedSteps, index]);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError(null);
    setReviewSuccess(null);

    if (!commentInput.trim()) {
      setReviewError('Please write a brief comment with your rating.');
      return;
    }

    const res = db.addReview({
      recipeId: recipe.id,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      userAvatar: currentUser.avatarUrl,
      rating: ratingInput,
      comment: commentInput.trim(),
      isInfluencerEndorsement: currentUser.role === 'INFLUENCER',
    });

    if (!res.success) {
      setReviewError(res.error || 'Failed to submit review.');
    } else {
      setReviewSuccess('Your review and rating have been posted to the database!');
      setCommentInput('');
      onRefreshData();
    }
  };

  const handleDeleteReview = (reviewId: string) => {
    if (confirm('Delete this review?')) {
      db.deleteReview(reviewId);
      onRefreshData();
    }
  };

  const handleAddMissingToPantry = (item: { name: string; requiredQty: number; unit: string; availableQty: number }) => {
    const deficit = Math.max(1, item.requiredQty - item.availableQty);
    db.addPantryItem({
      ingredientId: 'ing_' + item.name.toLowerCase().replace(/\s+/g, '_'),
      name: item.name,
      quantity: deficit,
      unit: item.unit,
      category: 'Pantry & Grains',
      expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lowStockThreshold: 1,
    }, currentUser.id);

    onRefreshData();
  };

  const handleAddAllMissingToPantry = () => {
    for (const item of missingIngredients) {
      const deficit = Math.max(1, item.requiredQty - item.availableQty);
      db.addPantryItem({
        ingredientId: 'ing_' + item.name.toLowerCase().replace(/\s+/g, '_'),
        name: item.name,
        quantity: deficit,
        unit: item.unit,
        category: 'Pantry & Grains',
        expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        lowStockThreshold: 1,
      }, currentUser.id);
    }
    onRefreshData();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FFFDF9] border border-[#E8DFD1] rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header with Food Image Banner */}
        <div className="relative h-64 sm:h-72 w-full shrink-0 overflow-hidden bg-stone-200">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges on Banner */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {recipe.categories.map((c) => (
              <span
                key={c}
                className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-[#2D2A26] backdrop-blur-md shadow-xs"
              >
                {c}
              </span>
            ))}
          </div>

          {/* Title & Author on Banner Bottom */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 className="font-display text-2xl sm:text-3xl font-bold drop-shadow-md leading-tight">
              {recipe.title}
            </h2>
            
            {/* Author info */}
            <div className="flex items-center space-x-3 mt-2">
              <div 
                className="flex items-center space-x-2 cursor-pointer group"
                onClick={() => onViewInfluencerProfile && onViewInfluencerProfile(recipe.authorId)}
              >
                {recipe.authorAvatar && (
                  <img
                    src={recipe.authorAvatar}
                    alt={recipe.authorName}
                    className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-xs"
                  />
                )}
                <span className="text-xs sm:text-sm font-semibold group-hover:underline text-white flex items-center space-x-1">
                  <span>By {recipe.authorName}</span>
                  {recipe.authorRole === 'INFLUENCER' && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-[#E07A5F] text-white">
                      Influencer Chef
                    </span>
                  )}
                </span>
              </div>

              <span className="text-white/60">•</span>

              <div className="flex items-center space-x-1 text-xs text-amber-300 font-bold">
                <Star className="w-4 h-4 fill-amber-300" />
                <span>{recipeMatch.averageRating > 0 ? recipeMatch.averageRating : 'Unrated'}</span>
                <span className="text-white/70 font-normal">({reviews.length} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-[#F4EFE6] border border-[#E8DFD1] flex items-center space-x-3">
              <Clock className="w-5 h-5 text-[#3D6B50]" />
              <div>
                <p className="text-[11px] text-[#7A7469] font-medium">Prep + Cook</p>
                <p className="text-xs sm:text-sm font-bold text-[#2D2A26]">{recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins</p>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-[#F4EFE6] border border-[#E8DFD1] flex items-center space-x-3">
              <Users className="w-5 h-5 text-[#3D6B50]" />
              <div>
                <p className="text-[11px] text-[#7A7469] font-medium">Servings</p>
                <p className="text-xs sm:text-sm font-bold text-[#2D2A26]">{recipe.servings} portions</p>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-[#F4EFE6] border border-[#E8DFD1] flex items-center space-x-3">
              <Flame className="w-5 h-5 text-[#E07A5F]" />
              <div>
                <p className="text-[11px] text-[#7A7469] font-medium">Difficulty</p>
                <p className="text-xs sm:text-sm font-bold text-[#2D2A26]">{recipe.difficulty}</p>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-[#3D6B50]/10 border border-[#3D6B50]/20 flex items-center space-x-3">
              <Sparkles className="w-5 h-5 text-[#3D6B50]" />
              <div>
                <p className="text-[11px] text-[#3D6B50] font-bold">3-Signal Score</p>
                <p className="text-xs sm:text-sm font-black text-[#2E523D]">{finalScore}% Match</p>
              </div>
            </div>
          </div>

          {/* 3-Signal Recommendation Breakdown Card */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E2D8C7] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#3D6B50]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#2D2A26]">
                  Deterministic Recommendation Analysis
                </h4>
              </div>
              <span className="text-[11px] font-semibold text-[#7A7469]">
                Java OOP Engine Rule
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-[#DDD3C2]">
                <div className="flex items-center justify-between text-[#7A7469] mb-1">
                  <span>Pantry Match (50%)</span>
                  <span className="font-bold text-[#3D6B50]">{pantryMatchScore}%</span>
                </div>
                <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#3D6B50] h-full" style={{ width: `${pantryMatchScore}%` }} />
                </div>
                <p className="text-[10px] text-[#7A7469] mt-1">
                  {recipeMatch.matchedIngredientsCount}/{recipeMatch.totalIngredientsCount} items available
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-[#DDD3C2]">
                <div className="flex items-center justify-between text-[#7A7469] mb-1">
                  <span>User Rating (20%)</span>
                  <span className="font-bold text-[#E07A5F]">{userRatingScore}%</span>
                </div>
                <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#E07A5F] h-full" style={{ width: `${userRatingScore}%` }} />
                </div>
                <p className="text-[10px] text-[#7A7469] mt-1">
                  {recipeMatch.averageRating > 0 ? `${recipeMatch.averageRating}★ average` : 'No user ratings yet'}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-[#DDD3C2]">
                <div className="flex items-center justify-between text-[#7A7469] mb-1">
                  <span>Influencer (30%)</span>
                  <span className="font-bold text-purple-700">{influencerRatingScore}%</span>
                </div>
                <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-600 h-full" style={{ width: `${influencerRatingScore}%` }} />
                </div>
                <p className="text-[10px] text-[#7A7469] mt-1 truncate">
                  {recipe.authorRole === 'INFLUENCER' ? `Created by ${recipe.authorName}` : 'No influencer link'}
                </p>
              </div>
            </div>

            <p className="text-xs text-[#5C564C] bg-white/60 p-2.5 rounded-xl border border-[#E8DFD1]">
              <span className="font-bold text-[#2D2A26]">Why Recommended:</span> {recipeMatch.recommendationReason}
            </p>
          </div>

          {/* Description */}
          <div>
            <p className="text-sm text-[#5C564C] leading-relaxed">
              {recipe.description}
            </p>
          </div>

          {/* Ingredients & Pantry Comparison */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-lg font-bold text-[#2D2A26] flex items-center space-x-2">
                <span>Required Ingredients</span>
                <span className="text-xs font-sans font-normal text-[#7A7469]">
                  ({recipe.ingredients.length} items)
                </span>
              </h3>
              {missingIngredients.length > 0 && (
                <button
                  onClick={handleAddAllMissingToPantry}
                  className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-[#3D6B50] bg-[#3D6B50]/15 hover:bg-[#3D6B50]/25 rounded-xl transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Restock All Missing ({missingIngredients.length}) to Pantry</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {recipe.ingredients.map((ing) => {
                const isMissing = missingIngredients.some(m => m.name.toLowerCase() === ing.ingredientName.toLowerCase());
                const missingDetail = missingIngredients.find(m => m.name.toLowerCase() === ing.ingredientName.toLowerCase());

                return (
                  <div
                    key={ing.ingredientName}
                    className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-colors ${
                      isMissing
                        ? 'bg-amber-50/60 border-amber-200 text-stone-800'
                        : 'bg-emerald-50/60 border-emerald-200 text-[#2D2A26]'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      {isMissing ? (
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="font-bold truncate">{ing.ingredientName}</p>
                        <p className="text-[11px] text-[#7A7469]">
                          Required: {ing.quantity} {ing.unit}
                          {isMissing && missingDetail && (
                            <span className="text-amber-700 ml-1 font-semibold">
                              (Pantry has {missingDetail.availableQty} {missingDetail.unit})
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {isMissing && missingDetail && (
                      <button
                        onClick={() => handleAddMissingToPantry(missingDetail)}
                        className="shrink-0 p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold transition-colors"
                        title="Add missing quantity to your pantry"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Instructions Step-by-Step */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-lg font-bold text-[#2D2A26]">
                Cooking Instructions
              </h3>
              <span className="text-xs font-semibold text-[#7A7469]">
                {completedSteps.length} of {recipe.instructions.length} completed
              </span>
            </div>

            <div className="space-y-3">
              {recipe.instructions.map((step, idx) => {
                const isDone = completedSteps.includes(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start space-x-3.5 ${
                      isDone
                        ? 'bg-[#F4EFE6]/50 border-stone-200 opacity-60'
                        : 'bg-white border-[#E8DFD1] hover:border-[#3D6B50]/40'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold transition-colors ${
                      isDone
                        ? 'bg-[#3D6B50] text-white'
                        : 'bg-[#F4EFE6] text-[#5C564C] border border-[#DDD3C2]'
                    }`}>
                      {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className={`text-xs sm:text-sm leading-relaxed ${isDone ? 'line-through text-stone-500' : 'text-[#2D2A26]'}`}>
                        {step}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reviews & Ratings Section */}
          <div className="pt-4 border-t border-[#E8DFD1] space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-[#2D2A26]">
                  Reviews & Endorsements
                </h3>
                <p className="text-xs text-[#7A7469]">
                  Influencer reviews and community feedback
                </p>
              </div>
              <div className="flex items-center space-x-1 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{recipeMatch.averageRating > 0 ? `${recipeMatch.averageRating} / 5.0` : 'Unrated'}</span>
              </div>
            </div>

            {/* Submit Review Form (with Duplicate Rating Prevention) */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E2D8C7] space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2D2A26]">
                {hasReviewed ? 'Your Review Submitted' : 'Leave a Rating & Review'}
              </h4>

              {hasReviewed ? (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    You have already submitted a rating for this recipe. (One review per user is enforced by database constraint).
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-[#5C564C]">Rating:</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRatingInput(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= ratingInput
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-stone-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-amber-800 ml-1">
                      ({ratingInput} Star{ratingInput > 1 ? 's' : ''})
                    </span>
                  </div>

                  <div className="relative">
                    <textarea
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder={currentUser.role === 'INFLUENCER' 
                        ? 'Leave an Influencer Endorsement with professional culinary tips...'
                        : 'Share how this recipe turned out with your pantry items...'}
                      rows={2}
                      className="w-full p-3 rounded-xl bg-white border border-[#DDD3C2] text-xs focus:ring-2 focus:ring-[#3D6B50] focus:outline-hidden"
                    />
                  </div>

                  {reviewError && (
                    <p className="text-xs text-red-600">{reviewError}</p>
                  )}
                  {reviewSuccess && (
                    <p className="text-xs text-emerald-700">{reviewSuccess}</p>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#3D6B50] hover:bg-[#2E523D] transition-colors shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{currentUser.role === 'INFLUENCER' ? 'Post Chef Endorsement' : 'Post Review'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* List of Reviews */}
            <div className="space-y-3">
              {reviews.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#7A7469]">
                  No reviews yet. Be the first to try and review this recipe!
                </div>
              ) : (
                reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className={`p-4 rounded-2xl border text-xs space-y-2 ${
                      rev.isInfluencerEndorsement || rev.userRole === 'INFLUENCER'
                        ? 'bg-purple-50/50 border-purple-200'
                        : 'bg-white border-[#E8DFD1]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        {rev.userAvatar ? (
                          <img
                            src={rev.userAvatar}
                            alt={rev.userName}
                            className="w-7 h-7 rounded-full object-cover border border-stone-200"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-[#3D6B50] text-white flex items-center justify-center font-bold text-[10px]">
                            {rev.userName[0]}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-[#2D2A26]">{rev.userName}</span>
                            {rev.userRole === 'INFLUENCER' && (
                              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-[#E07A5F] text-white">
                                Influencer
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#7A7469]">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'
                              }`}
                            />
                          ))}
                        </div>

                        {/* Admin or Author Delete */}
                        {(currentUser.role === 'ADMIN' || rev.userId === currentUser.id) && (
                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            className="p-1 text-stone-400 hover:text-red-600 transition-colors"
                            title="Delete review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-[#5C564C] leading-relaxed pl-9">
                      {rev.comment}
                    </p>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
