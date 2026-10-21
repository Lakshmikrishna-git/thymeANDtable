package com.kitchen;

import com.kitchen.dao.DatabaseConnection;
import com.kitchen.model.*;
import com.kitchen.service.RecommendationService;

import java.util.ArrayList;
import java.util.List;

/**
 * Main application runner for demonstration & evaluation.
 */
public class Main {
    public static void main(String[] args) {
        System.out.println("==================================================================");
        System.out.println("  SMART RECIPE BOOK & KITCHEN PANTRY PLANNING SYSTEM (JAVA OOP)");
        System.out.println("==================================================================");

        // 1. Initialize SQLite Database Connection (Singleton)
        System.out.println("[DB] Connecting to SQLite relational database...");
        DatabaseConnection.getInstance();
        System.out.println("[DB] Connection established successfully with foreign keys enabled.\n");

        // 2. Demonstrate OOP Inheritance & Polymorphism
        User student = new RegularUser("u1", "Alex Johnson", "alex@student.edu", "hash123");
        Influencer chef = new Influencer("inf1", "Sofia Martinez", "sofia@chef.com", "hash456",
                "@sofia_greenkitchen", "Plant-Based Mediterranean", "Healthy home cooking author");

        System.out.println("[OOP DEMO] User Hierarchy:");
        System.out.println("  User 1: " + student + " | Can moderate: " + student.canModerateContent());
        System.out.println("  User 2: " + chef + " | Verified: " + chef.isVerified() + " | Specialty: " + chef.getSpeciality() + "\n");

        // 3. Create sample recipe with ingredients
        Recipe pasta = new Recipe("r1", "Garlic Butter Tuscan Pasta", "Fresh 20-min dinner",
                chef.getId(), chef.getName(), chef.getRole());
        pasta.setInfluencerRatingScore(4.8);
        pasta.addIngredient(new RecipeIngredient("i1", "Pasta", 200, "g"));
        pasta.addIngredient(new RecipeIngredient("i2", "Garlic", 3, "cloves"));
        pasta.addIngredient(new RecipeIngredient("i3", "Olive Oil", 2, "tbsp"));
        pasta.addIngredient(new RecipeIngredient("i4", "Tomatoes", 2, "pcs"));

        // 4. Sample student pantry
        List<PantryItem> pantry = new ArrayList<>();
        pantry.add(new PantryItem("p1", student.getId(), "i1", "Pasta", 500, "g", "Pantry"));
        pantry.add(new PantryItem("p2", student.getId(), "i2", "Garlic", 6, "cloves", "Produce"));
        pantry.add(new PantryItem("p3", student.getId(), "i3", "Olive Oil", 250, "ml", "Pantry"));
        pantry.add(new PantryItem("p4", student.getId(), "i4", "Tomatoes", 3, "pcs", "Produce"));

        // 5. Run Deterministic 3-Signal Recommendation Engine
        RecommendationService engine = new RecommendationService(0.50, 0.20, 0.30);
        List<Recipe> recipes = List.of(pasta);
        List<Review> reviews = List.of(new Review("rev1", "r1", student.getId(), student.getName(), "USER", 5, "Amazing!"));

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
