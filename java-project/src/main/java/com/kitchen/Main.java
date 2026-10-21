package com.kitchen;

import com.kitchen.dao.DatabaseConnection;
import com.kitchen.model.*;
import com.kitchen.service.RecommendationService;

import java.util.ArrayList;
import java.util.List;

/**
 * Main application runner for demonstration & evaluation.
 * Demonstrates Kerala Naadan Culinary matching & OOP concepts.
 */
public class Main {
    public static void main(String[] args) {
        System.out.println("==================================================================");
        System.out.println("  SMART RECIPE BOOK & KITCHEN PANTRY PLANNING SYSTEM (JAVA OOP)");
        System.out.println("  KERALA TRADITIONAL CUISINE & INFLUENCER MATCHING ENGINE");
        System.out.println("==================================================================");

        // 1. Initialize SQLite Database Connection (Singleton)
        System.out.println("[DB] Connecting to SQLite relational database...");
        DatabaseConnection.getInstance();
        System.out.println("[DB] Connection established successfully with foreign keys enabled.\n");

        // 2. Demonstrate OOP Inheritance & Polymorphism
        User student = new RegularUser("u1", "Lakshmi Krishna", "lakshmi.krishna@kerala.edu", "hash123");
        Influencer chef = new Influencer("inf1", "Chef Madhavan Pillai", "pillai@naadankitchen.in", "hash456",
                "@chef_pillai_naadan", "Traditional Kerala Sadya & Coastal Seafood", "Heritage culinary author");

        System.out.println("[OOP DEMO] User Hierarchy:");
        System.out.println("  User 1: " + student + " | Can moderate: " + student.canModerateContent());
        System.out.println("  User 2: " + chef + " | Verified: " + chef.isVerified() + " | Specialty: " + chef.getSpeciality() + "\n");

        // 3. Create sample Kerala recipe with ingredients
        Recipe meenCurry = new Recipe("r1", "Traditional Kerala Meen Curry", "Kudampuli clay pot fish curry",
                chef.getId(), chef.getName(), chef.getRole());
        meenCurry.setInfluencerRatingScore(4.95);
        meenCurry.addIngredient(new RecipeIngredient("i1", "Fish (Meen)", 400, "g"));
        meenCurry.addIngredient(new RecipeIngredient("i2", "Coconut Oil (Velichenna)", 3, "tbsp"));
        meenCurry.addIngredient(new RecipeIngredient("i3", "Shallots (Kunjulli)", 15, "pcs"));
        meenCurry.addIngredient(new RecipeIngredient("i4", "Curry Leaves (Kariveppila)", 2, "sprigs"));
        meenCurry.addIngredient(new RecipeIngredient("i5", "Kudampuli (Malabar Tamarind)", 3, "pieces"));

        // 4. Sample student Kerala pantry
        List<PantryItem> pantry = new ArrayList<>();
        pantry.add(new PantryItem("p1", student.getId(), "i2", "Coconut Oil (Velichenna)", 1000, "ml", "Pantry"));
        pantry.add(new PantryItem("p2", student.getId(), "i3", "Shallots (Kunjulli)", 25, "pcs", "Produce"));
        pantry.add(new PantryItem("p3", student.getId(), "i4", "Curry Leaves (Kariveppila)", 5, "sprigs", "Produce"));
        pantry.add(new PantryItem("p4", student.getId(), "i5", "Kudampuli (Malabar Tamarind)", 5, "pieces", "Spices"));

        // 5. Run Deterministic 3-Signal Recommendation Engine
        RecommendationService engine = new RecommendationService(0.50, 0.20, 0.30);
        List<Recipe> recipes = List.of(meenCurry);
        List<Review> reviews = List.of(new Review("rev1", "r1", student.getId(), student.getName(), "USER", 5, "Authentic Naadan Ruchi!"));

        List<RecommendationService.ScoredRecipe> scored = engine.rankRecipes(recipes, pantry, reviews);
        RecommendationService.ScoredRecipe top = scored.get(0);

        System.out.println("[RECOMMENDATION ENGINE] Formula Output:");
        System.out.printf("  Recipe: %s%n", top.recipe.getTitle());
        System.out.printf("  Pantry Match Score (50%% weight):       %.1f / 100%n", top.pantryScore);
        System.out.printf("  User Rating Score  (20%% weight):       %.1f / 100%n", top.userRatingScore);
        System.out.printf("  Influencer Score   (30%% weight):       %.1f / 100%n", top.influencerScore);
        System.out.printf("  ===> Final Composite Score:            %.1f / 100%n", top.finalCompositeScore);
        System.out.printf("  Reason: %s%n", top.recommendationReason);
        System.out.println("==================================================================");
    }
}
