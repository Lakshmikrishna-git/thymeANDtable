/**
 * Domain Models and Types for Smart Recipe Book & Kitchen Pantry Planning System
 * Designed to mirror Java OOP classes (User, Influencer, Recipe, Ingredient, Review, etc.)
 */

export type UserRole = 'USER' | 'INFLUENCER' | 'ADMIN';

export type RecipeCategory = 
  | 'Healthy' 
  | 'Budget-Friendly' 
  | 'Quick Meals' 
  | 'Vegetarian' 
  | 'High-Protein' 
  | 'Comfort Food' 
  | 'Dessert';

export type IngredientCategory = 
  | 'Produce' 
  | 'Dairy & Eggs' 
  | 'Pantry & Grains' 
  | 'Meat & Seafood' 
  | 'Spices & Condiments' 
  | 'Bakery';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  createdAt: string;
  // Influencer specific fields (Polymorphism / Extended Attributes)
  bio?: string;
  speciality?: string;
  handle?: string;
  isVerified?: boolean;
  followerCount?: number;
}

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  defaultUnit: string;
}

export interface RecipeIngredient {
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorHandle?: string;
  authorAvatar?: string;
  imageUrl: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  categories: RecipeCategory[];
  ingredients: RecipeIngredient[];
  instructions: string[];
  influencerRatingScore?: number; // 0 - 5 endorsement score set by influencer/chef
  createdAt: string;
  isApproved?: boolean;
}

export interface Review {
  id: string;
  recipeId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  userAvatar?: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  isInfluencerEndorsement?: boolean;
}

export interface PantryItem {
  id: string;
  userId: string;
  ingredientId: string;
  name: string;
  quantity: number;
  unit: string;
  category: IngredientCategory;
  expiryDate?: string; // YYYY-MM-DD
  lowStockThreshold?: number;
  updatedAt: string;
}

export interface RecommendationWeights {
  pantryWeight: number;      // e.g. 0.50 (50%)
  userRatingWeight: number;  // e.g. 0.20 (20%)
  influencerWeight: number;  // e.g. 0.30 (30%)
}

export interface RecipeMatchDetail {
  recipe: Recipe;
  pantryMatchScore: number;     // 0 - 100
  userRatingScore: number;      // 0 - 100 (normalized from 1-5 stars)
  influencerRatingScore: number; // 0 - 100 (normalized from 1-5 stars)
  finalScore: number;           // 0 - 100
  matchedIngredientsCount: number;
  totalIngredientsCount: number;
  missingIngredients: {
    name: string;
    requiredQty: number;
    unit: string;
    availableQty: number;
  }[];
  averageRating: number;
  reviewCount: number;
  influencerEndorsementText?: string;
  recommendationReason: string;
}

export type MealTime = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface MealPlanEntry {
  id: string;
  userId: string;
  day: DayOfWeek;
  mealTime: MealTime;
  recipeId: string;
  recipeTitle: string;
  recipeImage: string;
  servings: number;
}
