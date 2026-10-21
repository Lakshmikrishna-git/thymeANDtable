package com.kitchen.model;

import java.util.ArrayList;
import java.util.List;

public class Recipe {
    private String id;
    private String title;
    private String description;
    private String authorId;
    private String authorName;
    private String authorRole;
    private int prepTimeMinutes;
    private int cookTimeMinutes;
    private int servings;
    private String difficulty; // Easy, Medium, Hard
    private double influencerRatingScore; // 1.0 - 5.0 endorsement
    private List<RecipeIngredient> ingredients;
    private List<String> instructions;
    private List<String> categories;

    public Recipe(String id, String title, String description, String authorId, String authorName, String authorRole) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.authorId = authorId;
        this.authorName = authorName;
        this.authorRole = authorRole;
        this.ingredients = new ArrayList<>();
        this.instructions = new ArrayList<>();
        this.categories = new ArrayList<>();
        this.influencerRatingScore = 0.0;
        this.servings = 2;
    }

    public void addIngredient(RecipeIngredient ingredient) {
        this.ingredients.add(ingredient);
    }

    public void addInstruction(String step) {
        this.instructions.add(step);
    }

    public void addCategory(String category) {
        this.categories.add(category);
    }

    public String getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getAuthorId() { return authorId; }
    public String getAuthorName() { return authorName; }
    public String getAuthorRole() { return authorRole; }
    public int getPrepTimeMinutes() { return prepTimeMinutes; }
    public void setPrepTimeMinutes(int minutes) { this.prepTimeMinutes = minutes; }
    public int getCookTimeMinutes() { return cookTimeMinutes; }
    public void setCookTimeMinutes(int minutes) { this.cookTimeMinutes = minutes; }
    public int getServings() { return servings; }
    public void setServings(int servings) { this.servings = servings; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public double getInfluencerRatingScore() { return influencerRatingScore; }
    public void setInfluencerRatingScore(double score) { this.influencerRatingScore = score; }
    public List<RecipeIngredient> getIngredients() { return ingredients; }
    public List<String> getInstructions() { return instructions; }
    public List<String> getCategories() { return categories; }
}
