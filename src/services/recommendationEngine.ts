/**
 * Deterministic 3-Signal Recommendation Engine
 * Strictly rule-based, mathematical, and transparent (NO AI/LLM or black-box models).
 * Designed according to College Java OOP Specification:
 * 
 * Formula:
 * FinalScore = (w_pantry * PantryMatch%) + (w_user * UserRating%) + (w_influencer * InfluencerRating%)
 * 
 * Where:
 * - PantryMatch% is computed from ingredient availability and quantity coverage (0-100)
 * - UserRating% is normalized average regular-user rating (0-100, unrated = 0)
 * - InfluencerRating% is normalized author/chef endorsement score (0-100)
 * - Weights are project configurable parameters (default: 50% / 20% / 30%)
 */

import { Recipe, PantryItem, Review, RecommendationWeights, RecipeMatchDetail } from '../types';

export class RecommendationEngine {
  /**
   * Normalizes an ingredient name for flexible matching (e.g., 'Cooked Rice' -> 'rice')
   */
  public static normalizeIngredientName(name: string): string {
    return name
      .toLowerCase()
      .replace(/\(.*?\)/g, '') // remove parenthetical like (canned)
      .replace(/fresh|diced|sliced|crushed|cloves|chopped|cooked|dry|raw/g, '')
      .trim();
  }

  /**
   * Calculates the Pantry Match score (0 to 100) and identifies missing items
   */
  public static evaluatePantryMatch(
    recipe: Recipe,
    pantryItems: PantryItem[]
  ): {
    score: number;
    matchedCount: number;
    totalCount: number;
    missingIngredients: RecipeMatchDetail['missingIngredients'];
  } {
    if (!recipe.ingredients || recipe.ingredients.length === 0) {
      return { score: 100, matchedCount: 0, totalCount: 0, missingIngredients: [] };
    }

    const totalCount = recipe.ingredients.length;
    let matchedCount = 0;
    let matchRatioSum = 0;
    const missingIngredients: RecipeMatchDetail['missingIngredients'] = [];

    for (const reqIng of recipe.ingredients) {
      const normReq = this.normalizeIngredientName(reqIng.ingredientName);
      
      // Find matching item in user pantry
      const foundItem = pantryItems.find(p => {
        const normPantry = this.normalizeIngredientName(p.name);
        return normPantry.includes(normReq) || normReq.includes(normPantry);
      });

      if (foundItem) {
        // Compare quantities if units are compatible or assume standard baseline
        if (foundItem.quantity >= reqIng.quantity) {
          matchedCount++;
          matchRatioSum += 1.0;
        } else if (foundItem.quantity > 0) {
          // Partial credit based on available fraction
          const fraction = Math.min(1.0, foundItem.quantity / reqIng.quantity);
          matchRatioSum += fraction;
          missingIngredients.push({
            name: reqIng.ingredientName,
            requiredQty: reqIng.quantity,
            unit: reqIng.unit,
            availableQty: foundItem.quantity,
          });
        } else {
          missingIngredients.push({
            name: reqIng.ingredientName,
            requiredQty: reqIng.quantity,
            unit: reqIng.unit,
            availableQty: 0,
          });
        }
      } else {
        missingIngredients.push({
          name: reqIng.ingredientName,
          requiredQty: reqIng.quantity,
          unit: reqIng.unit,
          availableQty: 0,
        });
      }
    }

    const score = Number(((matchRatioSum / totalCount) * 100).toFixed(1));
    return { score, matchedCount, totalCount, missingIngredients };
  }

  /**
   * Evaluates regular user ratings (1 to 5 stars normalized to 0-100)
   * Prevents unrated recipes from falsely appearing as high rated.
   */
  public static evaluateUserRating(recipeId: string, reviews: Review[]): {
    score: number;
    averageRating: number;
    reviewCount: number;
  } {
    const userReviews = reviews.filter(
      r => r.recipeId === recipeId && r.userRole === 'USER' && !r.isInfluencerEndorsement
    );

    if (userReviews.length === 0) {
      // Unrated: score is 0, average is 0
      return { score: 0, averageRating: 0, reviewCount: 0 };
    }

    const sum = userReviews.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating = Number((sum / userReviews.length).toFixed(1));
    // Normalization to 0 - 100 scale
    const score = Number(((averageRating / 5.0) * 100).toFixed(1));

    return { score, averageRating, reviewCount: userReviews.length };
  }

  /**
   * Evaluates influencer rating or endorsement score (0 to 100)
   */
  public static evaluateInfluencerScore(
    recipe: Recipe,
    reviews: Review[]
  ): { score: number; endorsementText?: string; influencerScore: number } {
    // Check if recipe has direct author influencer rating score
    let baseScore = recipe.influencerRatingScore || 0;
    let endorsementText: string | undefined;

    // Check for explicit influencer endorsement in reviews
    const influencerReviews = reviews.filter(
      r => r.recipeId === recipe.id && (r.userRole === 'INFLUENCER' || r.isInfluencerEndorsement)
    );

    if (influencerReviews.length > 0) {
      const topEndorsement = influencerReviews[0];
      endorsementText = `${topEndorsement.userName} (${topEndorsement.rating}★): "${topEndorsement.comment.slice(0, 70)}..."`;
      // Take the max or weighted combination
      baseScore = Math.max(baseScore, topEndorsement.rating);
    } else if (recipe.authorRole === 'INFLUENCER') {
      endorsementText = `Created by verified chef ${recipe.authorName}`;
      if (!baseScore) baseScore = 4.5;
    }

    const normalizedScore = Number(((baseScore / 5.0) * 100).toFixed(1));
    return { score: normalizedScore, endorsementText, influencerScore: baseScore };
  }

  /**
   * Computes the deterministic 3-signal match score for all recipes
   */
  public static rankRecipes(
    recipes: Recipe[],
    pantryItems: PantryItem[],
    reviews: Review[],
    weights: RecommendationWeights
  ): RecipeMatchDetail[] {
    const results: RecipeMatchDetail[] = recipes.map(recipe => {
      // Signal 1: Pantry Match
      const pantryResult = this.evaluatePantryMatch(recipe, pantryItems);

      // Signal 2: User Rating
      const userRatingResult = this.evaluateUserRating(recipe.id, reviews);

      // Signal 3: Influencer Rating / Endorsement
      const influencerResult = this.evaluateInfluencerScore(recipe, reviews);

      // Weighted combination
      // Final = (w_p * S_p) + (w_u * S_u) + (w_i * S_i)
      const finalScore = Number((
        weights.pantryWeight * pantryResult.score +
        weights.userRatingWeight * userRatingResult.score +
        weights.influencerWeight * influencerResult.score
      ).toFixed(1));

      // Construct plain-English transparent reason
      let recommendationReason = '';
      if (pantryResult.score >= 90) {
        recommendationReason = `Ready to cook! You have ${pantryResult.matchedCount}/${pantryResult.totalCount} pantry ingredients.`;
      } else if (pantryResult.score >= 50) {
        recommendationReason = `${pantryResult.score}% pantry match (${pantryResult.missingIngredients.length} item(s) needed).`;
      } else {
        recommendationReason = `Needs grocery restocking (${pantryResult.missingIngredients.length} items missing).`;
      }

      if (influencerResult.influencerScore > 0) {
        recommendationReason += ` Endorsed by ${recipe.authorName} (${influencerResult.influencerScore}★).`;
      } else if (userRatingResult.reviewCount > 0) {
        recommendationReason += ` Rated ${userRatingResult.averageRating}★ by community.`;
      }

      return {
        recipe,
        pantryMatchScore: pantryResult.score,
        userRatingScore: userRatingResult.score,
        influencerRatingScore: influencerResult.score,
        finalScore,
        matchedIngredientsCount: pantryResult.matchedCount,
        totalIngredientsCount: pantryResult.totalCount,
        missingIngredients: pantryResult.missingIngredients,
        averageRating: userRatingResult.averageRating,
        reviewCount: userRatingResult.reviewCount,
        influencerEndorsementText: influencerResult.endorsementText,
        recommendationReason,
      };
    });

    // Sort descending by finalScore
    return results.sort((a, b) => b.finalScore - a.finalScore);
  }
}
