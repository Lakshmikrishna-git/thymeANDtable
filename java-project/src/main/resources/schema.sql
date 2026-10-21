-- Smart Recipe Book & Kitchen Pantry Planning System
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
