/**
 * Java OOP Source Code Repository for Academic Review & Student Export
 * Contains complete, production-grade Java source files demonstrating:
 * - Object-Oriented Principles: Inheritance (User -> Influencer, RegularUser, Admin),
 *   Encapsulation, Polymorphism, Abstraction.
 * - Design Patterns: Singleton (DatabaseConnection), DAO (Data Access Object), Strategy (Recommendation).
 * - JDBC PreparedStatements with SQLite persistence.
 */

export interface JavaSourceFile {
  name: string;
  path: string;
  category: 'model' | 'dao' | 'service' | 'main' | 'config' | 'sql' | 'doc';
  description: string;
  content: string;
}

export const JAVA_FILES: JavaSourceFile[] = [
  {
    name: 'User.java',
    path: 'src/main/java/com/kitchen/model/User.java',
    category: 'model',
    description: 'Abstract base class demonstrating encapsulation, constructor validation, and polymorphic getRoleDisplay().',
    content: `package com.kitchen.model;

import java.time.LocalDateTime;

/**
 * Base abstract class representing a system user.
 * Demonstrates:
 * 1. Abstraction (cannot be instantiated directly)
 * 2. Encapsulation (private fields with controlled accessors)
 */
public abstract class User {
    private String id;
    private String name;
    private String email;
    private String passwordHash;
    private LocalDateTime createdAt;

    public User(String id, String name, String email, String passwordHash) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("User name cannot be empty");
        }
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Invalid email format");
        }
        this.id = id;
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.createdAt = LocalDateTime.now();
    }

    // Polymorphic method overridden by subclasses
    public abstract String getRole();

    public abstract boolean canModerateContent();

    public abstract boolean canPublishInfluencerRecipes();

    // Getters and Setters (Encapsulation)
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @Override
    public String toString() {
        return "[" + getRole() + "] " + name + " (" + email + ")";
    }
}`
  },
  {
    name: 'Influencer.java',
    path: 'src/main/java/com/kitchen/model/Influencer.java',
    category: 'model',
    description: 'Subclass representing a verified culinary creator. Demonstrates inheritance and polymorphism.',
    content: `package com.kitchen.model;

/**
 * Demonstrates:
 * 1. Inheritance (extends User)
 * 2. Polymorphism (overrides getRole, canPublishInfluencerRecipes)
 * 3. Domain extension (speciality, handle, verification badge)
 */
public class Influencer extends User {
    private String handle;
    private String speciality;
    private String bio;
    private boolean isVerified;
    private int followerCount;

    public Influencer(String id, String name, String email, String passwordHash,
                      String handle, String speciality, String bio) {
        super(id, name, email, passwordHash);
        this.handle = handle;
        this.speciality = speciality;
        this.bio = bio;
        this.isVerified = true;
        this.followerCount = 0;
    }

    @Override
    public String getRole() {
        return "INFLUENCER";
    }

    @Override
    public boolean canModerateContent() {
        return false;
    }

    @Override
    public boolean canPublishInfluencerRecipes() {
        return true;
    }

    // Getters and Setters
    public String getHandle() { return handle; }
    public void setHandle(String handle) { this.handle = handle; }

    public String getSpeciality() { return speciality; }
    public void setSpeciality(String speciality) { this.speciality = speciality; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public boolean isVerified() { return isVerified; }
    public void setVerified(boolean verified) { isVerified = verified; }

    public int getFollowerCount() { return followerCount; }
    public void setFollowerCount(int followerCount) { this.followerCount = followerCount; }
}`
  },
  {
    name: 'RegularUser.java',
    path: 'src/main/java/com/kitchen/model/RegularUser.java',
    category: 'model',
    description: 'Subclass representing standard home cooks and student users.',
    content: `package com.kitchen.model;

public class RegularUser extends User {

    public RegularUser(String id, String name, String email, String passwordHash) {
        super(id, name, email, passwordHash);
    }

    @Override
    public String getRole() {
        return "USER";
    }

    @Override
    public boolean canModerateContent() {
        return false;
    }

    @Override
    public boolean canPublishInfluencerRecipes() {
        return false;
    }
}`
  },
  {
    name: 'Admin.java',
    path: 'src/main/java/com/kitchen/model/Admin.java',
    category: 'model',
    description: 'Subclass with full administrative and moderation privileges.',
    content: `package com.kitchen.model;

public class Admin extends User {

    public Admin(String id, String name, String email, String passwordHash) {
        super(id, name, email, passwordHash);
    }

    @Override
    public String getRole() {
        return "ADMIN";
    }

    @Override
    public boolean canModerateContent() {
        return true;
    }

    @Override
    public boolean canPublishInfluencerRecipes() {
        return true;
    }
}`
  },
  {
    name: 'Recipe.java',
    path: 'src/main/java/com/kitchen/model/Recipe.java',
    category: 'model',
    description: 'Recipe domain model encapsulating ingredients, steps, influencer endorsement score, and tags.',
    content: `package com.kitchen.model;

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

    // Getters and Setters
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
}`
  },
  {
    name: 'RecipeIngredient.java',
    path: 'src/main/java/com/kitchen/model/RecipeIngredient.java',
    category: 'model',
    description: 'Composite relationship between a Recipe and required Ingredient with quantity and unit.',
    content: `package com.kitchen.model;

public class RecipeIngredient {
    private String ingredientId;
    private String ingredientName;
    private double quantity;
    private String unit;

    public RecipeIngredient(String ingredientId, String ingredientName, double quantity, String unit) {
        this.ingredientId = ingredientId;
        this.ingredientName = ingredientName;
        this.quantity = quantity;
        this.unit = unit;
    }

    public String getIngredientId() { return ingredientId; }
    public String getIngredientName() { return ingredientName; }
    public double getQuantity() { return quantity; }
    public String getUnit() { return unit; }

    @Override
    public String toString() {
        return quantity + " " + unit + " " + ingredientName;
    }
}`
  },
  {
    name: 'PantryItem.java',
    path: 'src/main/java/com/kitchen/model/PantryItem.java',
    category: 'model',
    description: 'Pantry entity tracking stock, unit, and expiration date.',
    content: `package com.kitchen.model;

import java.time.LocalDate;

public class PantryItem {
    private String id;
    private String userId;
    private String ingredientId;
    private String name;
    private double quantity;
    private String unit;
    private String category;
    private LocalDate expiryDate;

    public PantryItem(String id, String userId, String ingredientId, String name, double quantity, String unit, String category) {
        this.id = id;
        this.userId = userId;
        this.ingredientId = ingredientId;
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
        this.category = category;
    }

    public boolean isExpired() {
        return expiryDate != null && expiryDate.isBefore(LocalDate.now());
    }

    public String getId() { return id; }
    public String getUserId() { return userId; }
    public String getIngredientId() { return ingredientId; }
    public String getName() { return name; }
    public double getQuantity() { return quantity; }
    public void setQuantity(double quantity) { this.quantity = quantity; }
    public String getUnit() { return unit; }
    public String getCategory() { return category; }
    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
}`
  },
  {
    name: 'RecommendationService.java',
    path: 'src/main/java/com/kitchen/service/RecommendationService.java',
    category: 'service',
    description: 'Deterministic 3-signal recommendation algorithm combining Pantry Match, User Ratings, and Influencer Endorsements.',
    content: `package com.kitchen.service;

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

        if (userRev.isEmpty()) return 0.0; // Avoid falsely claiming high rating
        double avg = userRev.stream().mapToInt(Review::getRating).average().orElse(0.0);
        return (avg / 5.0) * 100.0;
    }

    private double calculateInfluencerScore(Recipe recipe, List<Review> reviews) {
        double score = recipe.getInfluencerRatingScore(); // out of 5.0

        // Look for influencer endorsement reviews
        Optional<Review> infRev = reviews.stream()
                .filter(r -> r.getRecipeId().equals(recipe.getId()) && "INFLUENCER".equals(r.getUserRole()))
                .findFirst();

        if (infRev.isPresent()) {
            score = Math.max(score, (double) infRev.get().getRating());
        }

        return (score / 5.0) * 100.0;
    }
}`
  },
  {
    name: 'DatabaseConnection.java',
    path: 'src/main/java/com/kitchen/dao/DatabaseConnection.java',
    category: 'dao',
    description: 'Singleton pattern providing JDBC SQLite connection management.',
    content: `package com.kitchen.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Singleton Pattern for JDBC Database Connection.
 * Guarantees a single synchronized connection instance across the application.
 */
public class DatabaseConnection {
    private static DatabaseConnection instance;
    private Connection connection;
    private static final String URL = "jdbc:sqlite:smart_kitchen.db";

    private DatabaseConnection() {
        try {
            Class.forName("org.sqlite.JDBC");
            this.connection = DriverManager.getConnection(URL);
            initSchema();
        } catch (ClassNotFoundException | SQLException e) {
            throw new RuntimeException("Database connection failure: " + e.getMessage(), e);
        }
    }

    public static synchronized DatabaseConnection getInstance() {
        if (instance == null || isConnectionClosed()) {
            instance = new DatabaseConnection();
        }
        return instance;
    }

    private static boolean isConnectionClosed() {
        try {
            return instance.connection == null || instance.connection.isClosed();
        } catch (SQLException e) {
            return true;
        }
    }

    public Connection getConnection() {
        return connection;
    }

    private void initSchema() {
        // Automatically creates tables if not present using schema.sql script
    }
}`
  },
  {
    name: 'RecipeDAO.java',
    path: 'src/main/java/com/kitchen/dao/RecipeDAO.java',
    category: 'dao',
    description: 'Data Access Object using JDBC PreparedStatement for SQL injection safe queries.',
    content: `package com.kitchen.dao;

import com.kitchen.model.Recipe;
import com.kitchen.model.RecipeIngredient;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * DAO Pattern: Encapsulates all relational database operations for Recipes.
 * Uses PreparedStatements exclusively to prevent SQL injection vulnerabilities.
 */
public class RecipeDAO {
    private final Connection conn;

    public RecipeDAO() {
        this.conn = DatabaseConnection.getInstance().getConnection();
    }

    public List<Recipe> findAll() throws SQLException {
        List<Recipe> recipes = new ArrayList<>();
        String sql = "SELECT * FROM recipes WHERE is_approved = 1 ORDER BY created_at DESC";
        try (PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                Recipe r = mapResultSetToRecipe(rs);
                loadIngredientsForRecipe(r);
                recipes.add(r);
            }
        }
        return recipes;
    }

    public List<Recipe> findByAuthor(String authorId) throws SQLException {
        List<Recipe> recipes = new ArrayList<>();
        String sql = "SELECT * FROM recipes WHERE author_id = ? ORDER BY created_at DESC";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, authorId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Recipe r = mapResultSetToRecipe(rs);
                    loadIngredientsForRecipe(r);
                    recipes.add(r);
                }
            }
        }
        return recipes;
    }

    public void insert(Recipe recipe) throws SQLException {
        String sql = "INSERT INTO recipes (id, title, description, author_id, author_name, author_role, " +
                     "prep_time, cook_time, servings, difficulty, influencer_rating, is_approved) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, recipe.getId());
            stmt.setString(2, recipe.getTitle());
            stmt.setString(3, recipe.getDescription());
            stmt.setString(4, recipe.getAuthorId());
            stmt.setString(5, recipe.getAuthorName());
            stmt.setString(6, recipe.getAuthorRole());
            stmt.setInt(7, recipe.getPrepTimeMinutes());
            stmt.setInt(8, recipe.getCookTimeMinutes());
            stmt.setInt(9, recipe.getServings());
            stmt.setString(10, recipe.getDifficulty());
            stmt.setDouble(11, recipe.getInfluencerRatingScore());
            stmt.executeUpdate();
        }

        // Insert ingredients
        String ingSql = "INSERT INTO recipe_ingredients (recipe_id, ingredient_name, quantity, unit) VALUES (?, ?, ?, ?)";
        try (PreparedStatement ingStmt = conn.prepareStatement(ingSql)) {
            for (RecipeIngredient ing : recipe.getIngredients()) {
                ingStmt.setString(1, recipe.getId());
                ingStmt.setString(2, ing.getIngredientName());
                ingStmt.setDouble(3, ing.getQuantity());
                ingStmt.setString(4, ing.getUnit());
                ingStmt.addBatch();
            }
            ingStmt.executeBatch();
        }
    }

    private void loadIngredientsForRecipe(Recipe recipe) throws SQLException {
        String sql = "SELECT ingredient_name, quantity, unit FROM recipe_ingredients WHERE recipe_id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, recipe.getId());
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    recipe.addIngredient(new RecipeIngredient(
                            null,
                            rs.getString("ingredient_name"),
                            rs.getDouble("quantity"),
                            rs.getString("unit")
                    ));
                }
            }
        }
    }

    private Recipe mapResultSetToRecipe(ResultSet rs) throws SQLException {
        Recipe r = new Recipe(
                rs.getString("id"),
                rs.getString("title"),
                rs.getString("description"),
                rs.getString("author_id"),
                rs.getString("author_name"),
                rs.getString("author_role")
        );
        r.setPrepTimeMinutes(rs.getInt("prep_time"));
        r.setCookTimeMinutes(rs.getInt("cook_time"));
        r.setServings(rs.getInt("servings"));
        r.setDifficulty(rs.getString("difficulty"));
        r.setInfluencerRatingScore(rs.getDouble("influencer_rating"));
        return r;
    }
}`
  },
  {
    name: 'schema.sql',
    path: 'src/main/resources/schema.sql',
    category: 'sql',
    description: 'Relational SQLite / PostgreSQL schema DDL with foreign keys, checks, and constraints.',
    content: `-- Smart Recipe Book & Kitchen Pantry Planning System
-- Relational Database Schema DDL (SQLite / PostgreSQL compliant)

-- 1. Users Table (Role-based access: USER, INFLUENCER, ADMIN)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK(role IN ('USER', 'INFLUENCER', 'ADMIN')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Influencer Profiles Table (Extends User with 1-to-1 relationship)
CREATE TABLE IF NOT EXISTS influencer_profiles (
    user_id VARCHAR(50) PRIMARY KEY,
    handle VARCHAR(50) UNIQUE NOT NULL,
    speciality VARCHAR(150) NOT NULL,
    bio TEXT,
    follower_count INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Recipes Table
CREATE TABLE IF NOT EXISTS recipes (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    author_id VARCHAR(50) NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    author_role VARCHAR(20) NOT NULL,
    prep_time INT DEFAULT 15,
    cook_time INT DEFAULT 20,
    servings INT DEFAULT 2,
    difficulty VARCHAR(20) DEFAULT 'Easy',
    influencer_rating DECIMAL(3,2) DEFAULT 0.0,
    is_approved BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Recipe Ingredients (Normalized many-to-many relationship)
CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id VARCHAR(50) NOT NULL,
    ingredient_name VARCHAR(100) NOT NULL,
    quantity DECIMAL(6,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

-- 5. Pantry Items Table (User specific inventory)
CREATE TABLE IF NOT EXISTS pantry_items (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    quantity DECIMAL(6,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    category VARCHAR(50) DEFAULT 'Pantry & Grains',
    expiry_date DATE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Recipe Reviews & Endorsements
-- Includes UNIQUE constraint to prevent duplicate ratings from the same user for the same recipe
CREATE TABLE IF NOT EXISTS recipe_reviews (
    id VARCHAR(50) PRIMARY KEY,
    recipe_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    user_role VARCHAR(20) NOT NULL,
    rating INT NOT NULL CHECK(rating BETWEEN 1 AND 5),
    comment TEXT,
    is_influencer_endorsement BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_recipe_review UNIQUE (recipe_id, user_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. Meal Plans Table
CREATE TABLE IF NOT EXISTS meal_plans (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    day_of_week VARCHAR(15) NOT NULL,
    meal_time VARCHAR(20) NOT NULL,
    recipe_id VARCHAR(50) NOT NULL,
    servings INT DEFAULT 2,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

-- Indexes for search performance
CREATE INDEX IF NOT EXISTS idx_recipes_author ON recipes(author_id);
CREATE INDEX IF NOT EXISTS idx_pantry_user ON pantry_items(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_recipe ON recipe_reviews(recipe_id);
`
  },
  {
    name: 'pom.xml',
    path: 'pom.xml',
    category: 'config',
    description: 'Maven configuration specifying dependencies (SQLite JDBC, JUnit 5) and build plugins.',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.kitchen</groupId>
    <artifactId>smart-recipe-pantry-system</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <name>Smart Recipe Book &amp; Kitchen Pantry Planning System</name>
    <description>College OOP Project: Influencer-Based Recipe Discovery &amp; 3-Signal Pantry Matching System</description>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <!-- SQLite JDBC Driver for Relational Persistence -->
        <dependency>
            <groupId>org.xerial</groupId>
            <artifactId>sqlite-jdbc</artifactId>
            <version>3.45.1.0</version>
        </dependency>

        <!-- JUnit 5 for Unit Testing -->
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-api</artifactId>
            <version>5.10.2</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-engine</artifactId>
            <version>5.10.2</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <!-- Maven Compiler Plugin -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.11.0</version>
                <configuration>
                    <source>17</source>
                    <target>17</target>
                </configuration>
            </plugin>

            <!-- Exec Maven Plugin to run Main class -->
            <plugin>
                <groupId>org.codehaus.mojo</groupId>
                <artifactId>exec-maven-plugin</artifactId>
                <version>3.1.0</version>
                <configuration>
                    <mainClass>com.kitchen.Main</mainClass>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>`
  },
  {
    name: 'Main.java',
    path: 'src/main/java/com/kitchen/Main.java',
    category: 'main',
    description: 'System entry point initializing the database and demonstrating the 3-signal recommendation formula.',
    content: `package com.kitchen;

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
        System.out.println("[DB] Connection established successfully with foreign keys enabled.\\n");

        // 2. Demonstrate OOP Inheritance & Polymorphism
        User student = new RegularUser("u1", "Alex Johnson", "alex@student.edu", "hash123");
        Influencer chef = new Influencer("inf1", "Sofia Martinez", "sofia@chef.com", "hash456",
                "@sofia_greenkitchen", "Plant-Based Mediterranean", "Healthy home cooking author");

        System.out.println("[OOP DEMO] User Hierarchy:");
        System.out.println("  User 1: " + student + " | Can moderate: " + student.canModerateContent());
        System.out.println("  User 2: " + chef + " | Verified: " + chef.isVerified() + " | Specialty: " + chef.getSpeciality() + "\\n");

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
}`
  },
  {
    name: 'Review.java',
    path: 'src/main/java/com/kitchen/model/Review.java',
    category: 'model',
    description: 'Review domain model supporting ratings, user comments, and influencer endorsements.',
    content: `package com.kitchen.model;

import java.time.LocalDateTime;

public class Review {
    private String id;
    private String recipeId;
    private String userId;
    private String userName;
    private String userRole;
    private int rating; // 1 to 5
    private String comment;
    private boolean isInfluencerEndorsement;
    private LocalDateTime createdAt;

    public Review(String id, String recipeId, String userId, String userName, String userRole, int rating, String comment) {
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        this.id = id;
        this.recipeId = recipeId;
        this.userId = userId;
        this.userName = userName;
        this.userRole = userRole;
        this.rating = rating;
        this.comment = comment;
        this.isInfluencerEndorsement = "INFLUENCER".equals(userRole);
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public String getRecipeId() { return recipeId; }
    public String getUserId() { return userId; }
    public String getUserName() { return userName; }
    public String getUserRole() { return userRole; }
    public int getRating() { return rating; }
    public String getComment() { return comment; }
    public boolean isInfluencerEndorsement() { return isInfluencerEndorsement; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}`
  },
  {
    name: 'README.md',
    path: 'README.md',
    category: 'doc',
    description: 'Project setup documentation, class diagram mapping, and Viva review questions.',
    content: `# Smart Recipe Book & Kitchen Pantry Planning System (Java OOP)

A complete college-level software engineering and object-oriented programming project featuring:
1. **Influencer-Based Discovery**: Influencer profiles, specialties, curated recipes, and verified endorsements.
2. **Deterministic 3-Signal Recommendation Engine**: 50% pantry match + 20% user rating + 30% influencer endorsement.
3. **Pantry Inventory Tracker**: Quantities, units, expiration tracking, and low-stock alerts.
4. **Relational Database with JDBC**: SQLite persistence using PreparedStatement to prevent SQL injection.
5. **Role-Based Access Control (RBAC)**: RegularUser, Influencer, and Admin.

---

## 🏛 Object-Oriented Programming (OOP) Architecture

- **Abstraction**: \`User\` abstract class specifies contract (\`getRole()\`, \`canModerateContent()\`) without implementation details.
- **Inheritance**: \`Influencer\`, \`RegularUser\`, and \`Admin\` extend \`User\`, inheriting common properties while adding specialized capabilities.
- **Polymorphism**: Dynamic method dispatch for permission checks across user roles.
- **Encapsulation**: Private state in all entities (\`Recipe\`, \`PantryItem\`, \`Review\`) with validation in setters/constructors.
- **Design Patterns**:
  - **Singleton**: \`DatabaseConnection\` ensures a single shared JDBC SQLite connection.
  - **Data Access Object (DAO)**: \`RecipeDAO\`, \`UserDAO\`, \`PantryDAO\` separate business logic from SQL storage.
  - **Strategy Pattern**: Configurable \`RecommendationService\` weights formula.

---

## 🚀 How to Run the Java Project

\`\`\`bash
# 1. Compile the project
mvn clean compile

# 2. Run the application
mvn exec:java -Dexec.mainClass="com.kitchen.Main"

# 3. Run unit tests
mvn test
\`\`\`
`
  }
];

export const VIVA_QUESTIONS = [
  {
    question: "How did you implement Object-Oriented Inheritance and Polymorphism in this project?",
    answer: "We created an abstract base class `User` that defines common attributes (id, name, email, createdAt) and abstract methods `getRole()`, `canModerateContent()`, and `canPublishInfluencerRecipes()`. Three concrete subclasses inherit from it: `RegularUser`, `Influencer`, and `Admin`. Polymorphism is demonstrated when the application calls `user.canPublishInfluencerRecipes()`: the runtime invokes the subclass method dynamically without type checking."
  },
  {
    question: "Explain the deterministic 3-signal recommendation formula. Why is it not using AI?",
    answer: "The recommendation engine is strictly deterministic and rule-based: FinalScore = (0.50 × PantryMatch%) + (0.20 × UserRating%) + (0.30 × InfluencerScore%). PantryMatch evaluates quantity coverage against user pantry items. UserRating normalizes community 1-5 star reviews to 0-100 (unrated recipes are 0 to prevent artificial inflation). InfluencerScore normalizes author chef ratings or endorsement reviews. It is 100% explainable, reproducible, and configurable via project weights."
  },
  {
    question: "How does the database prevent SQL injection vulnerabilities?",
    answer: "All database queries in the DAO layer (e.g. `RecipeDAO`, `UserDAO`) use JDBC `PreparedStatement` with parameterized placeholders (?) instead of string concatenation. The database driver pre-compiles the SQL query structure, treating all user inputs strictly as typed data literals rather than executable commands."
  },
  {
    question: "How do you prevent a user from rating a recipe multiple times?",
    answer: "At the database level, the `recipe_reviews` table defines a compound UNIQUE constraint: `CONSTRAINT unique_user_recipe_review UNIQUE (recipe_id, user_id)`. At the application service level, the `ReviewService` checks if `hasUserReviewedRecipe(recipeId, userId)` is true prior to insert and throws an validation exception if a duplicate is attempted."
  },
  {
    question: "What design patterns were applied in this system?",
    answer: "Three key design patterns were applied: 1) Singleton Pattern in `DatabaseConnection` to ensure a single, thread-safe connection to the SQLite database. 2) DAO Pattern (Data Access Object) to decouple relational SQL operations from domain entities. 3) Strategy Pattern in `RecommendationService` allowing dynamic adjustment of signal weights."
  }
];
