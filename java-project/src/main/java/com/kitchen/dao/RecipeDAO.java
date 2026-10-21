package com.kitchen.dao;

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
}
