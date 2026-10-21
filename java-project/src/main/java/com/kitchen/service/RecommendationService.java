package com.kitchen.service;

import com.kitchen.model.PantryItem;
import com.kitchen.model.Recipe;
import com.kitchen.model.RecipeIngredient;
import com.kitchen.model.Review;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Deterministic Recommendation Engine (No AI / No LLM).
 * Computes recipe suitability score using three configurable weighted signals:
 * 1. Pantry Match (default 50%)
 * 2. Regular User Rating (default 20%)
 * 3. Influencer Rating / Endorsement (default 30%)
 */
public class RecommendationService {
    private double pantryWeight = 0.50;
    private double userRatingWeight = 0.20;
    private double influencerWeight = 0.30;

    public RecommendationService() {}

    public RecommendationService(double pantryWeight, double userRatingWeight, double influencerWeight) {
        setWeights(pantryWeight, userRatingWeight, influencerWeight);
    }

    public void setWeights(double pantryWeight, double userRatingWeight, double influencerWeight) {
        double sum = pantryWeight + userRatingWeight + influencerWeight;
        if (sum <= 0) throw new IllegalArgumentException("Sum of weights must be positive");
        this.pantryWeight = pantryWeight / sum;
        this.userRatingWeight = userRatingWeight / sum;
        this.influencerWeight = influencerWeight / sum;
    }

    public static class ScoredRecipe {
        public Recipe recipe;
        public double pantryScore;      // 0 - 100
        public double userRatingScore;  // 0 - 100
        public double influencerScore;  // 0 - 100
        public double finalCompositeScore; // 0 - 100
        public List<String> missingIngredients = new ArrayList<>();
        public String recommendationReason;
    }

    public List<ScoredRecipe> rankRecipes(List<Recipe> recipes, List<PantryItem> pantry, List<Review> allReviews) {
        List<ScoredRecipe> results = new ArrayList<>();

        for (Recipe recipe : recipes) {
            ScoredRecipe item = new ScoredRecipe();
            item.recipe = recipe;

            // Signal 1: Pantry Match Calculation
            double pantryScore = calculatePantryMatch(recipe, pantry, item.missingIngredients);
            item.pantryScore = pantryScore;

            // Signal 2: Regular User Rating (1-5 stars normalized to 0-100)
            double userScore = calculateUserRatingScore(recipe.getId(), allReviews);
            item.userRatingScore = userScore;

            // Signal 3: Influencer Rating / Endorsement (0-100)
            double infScore = calculateInfluencerScore(recipe, allReviews);
            item.influencerScore = infScore;

            // Weighted Composite Formula
            item.finalCompositeScore = (pantryWeight * item.pantryScore)
                    + (userRatingWeight * item.userRatingScore)
                    + (influencerWeight * item.influencerScore);

            item.recommendationReason = String.format("%.0f%% pantry match + Influencer score: %.0f/100",
                    item.pantryScore, item.influencerScore);

            results.add(item);
        }

        // Deterministic Sort: descending order of final composite score
        results.sort((a, b) -> Double.compare(b.finalCompositeScore, a.finalCompositeScore));
        return results;
    }

    private double calculatePantryMatch(Recipe recipe, List<PantryItem> pantry, List<String> missingList) {
        if (recipe.getIngredients().isEmpty()) return 100.0;

        double matchFractionSum = 0.0;
        int total = recipe.getIngredients().size();

        for (RecipeIngredient req : recipe.getIngredients()) {
            String normReq = req.getIngredientName().trim().toLowerCase();
            Optional<PantryItem> found = pantry.stream()
                    .filter(p -> p.getName().trim().toLowerCase().contains(normReq) ||
                                 normReq.contains(p.getName().trim().toLowerCase()))
                    .findFirst();

            if (found.isPresent()) {
                PantryItem p = found.get();
                if (p.getQuantity() >= req.getQuantity()) {
                    matchFractionSum += 1.0;
                } else if (p.getQuantity() > 0) {
                    matchFractionSum += (p.getQuantity() / req.getQuantity());
                    missingList.add(req.getIngredientName() + " (need " + (req.getQuantity() - p.getQuantity()) + " " + req.getUnit() + ")");
                } else {
                    missingList.add(req.getIngredientName());
                }
            } else {
                missingList.add(req.getIngredientName());
            }
        }

        return (matchFractionSum / total) * 100.0;
    }

    private double calculateUserRatingScore(String recipeId, List<Review> reviews) {
        List<Review> userRev = reviews.stream()
                .filter(r -> r.getRecipeId().equals(recipeId) && "USER".equals(r.getUserRole()))
                .collect(Collectors.toList());

        if (userRev.isEmpty()) return 0.0;
        double avg = userRev.stream().mapToInt(Review::getRating).average().orElse(0.0);
        return (avg / 5.0) * 100.0;
    }

    private double calculateInfluencerScore(Recipe recipe, List<Review> reviews) {
        double score = recipe.getInfluencerRatingScore();

        Optional<Review> infRev = reviews.stream()
                .filter(r -> r.getRecipeId().equals(recipe.getId()) && "INFLUENCER".equals(r.getUserRole()))
                .findFirst();

        if (infRev.isPresent()) {
            score = Math.max(score, (double) infRev.get().getRating());
        }

        return (score / 5.0) * 100.0;
    }
}
