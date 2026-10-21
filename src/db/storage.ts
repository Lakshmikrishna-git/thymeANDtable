/**
 * Relational In-Memory / LocalStorage Persistence Layer
 * Simulates a relational SQLite/PostgreSQL schema with foreign keys,
 * unique constraints (e.g., prevent duplicate user reviews for the same recipe),
 * and transaction-safe operations.
 */

import {
  User,
  Recipe,
  Review,
  PantryItem,
  RecommendationWeights,
  MealPlanEntry,
  RecipeIngredient
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_RECIPES,
  INITIAL_PANTRY,
  INITIAL_REVIEWS,
  INITIAL_MEAL_PLANS,
  DEFAULT_WEIGHTS
} from './initialData';

const STORAGE_KEY = 'smart_kitchen_college_db_v1';

export interface DatabaseState {
  users: User[];
  recipes: Recipe[];
  pantryItems: PantryItem[];
  reviews: Review[];
  mealPlans: MealPlanEntry[];
  weights: RecommendationWeights;
  currentUserId: string;
}

class StorageEngine {
  private state: DatabaseState;

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): DatabaseState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using defaults', e);
    }

    return {
      users: INITIAL_USERS,
      recipes: INITIAL_RECIPES,
      pantryItems: INITIAL_PANTRY,
      reviews: INITIAL_REVIEWS,
      mealPlans: INITIAL_MEAL_PLANS,
      weights: DEFAULT_WEIGHTS,
      currentUserId: 'user_alex', // Default logged-in student user
    };
  }

  private saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  public resetToDefaults(): void {
    this.state = {
      users: INITIAL_USERS,
      recipes: INITIAL_RECIPES,
      pantryItems: INITIAL_PANTRY,
      reviews: INITIAL_REVIEWS,
      mealPlans: INITIAL_MEAL_PLANS,
      weights: DEFAULT_WEIGHTS,
      currentUserId: 'user_alex',
    };
    this.saveState();
  }

  // --- Auth & User DAO operations ---
  public getUsers(): User[] {
    return [...this.state.users];
  }

  public getUserById(id: string): User | undefined {
    return this.state.users.find(u => u.id === id);
  }

  public getCurrentUser(): User {
    const user = this.getUserById(this.state.currentUserId);
    if (!user) {
      return this.state.users[0];
    }
    return user;
  }

  public setCurrentUserId(userId: string): void {
    if (this.getUserById(userId)) {
      this.state.currentUserId = userId;
      this.saveState();
    }
  }

  public registerUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...user,
      id: 'usr_' + Date.now(),
      createdAt: new Date().toISOString(),
      followerCount: user.role === 'INFLUENCER' ? 0 : undefined,
      isVerified: user.role === 'INFLUENCER' ? true : undefined,
    };
    this.state.users.push(newUser);
    this.state.currentUserId = newUser.id;
    this.saveState();
    return newUser;
  }

  public updateUserRole(userId: string, newRole: User['role'], isVerified?: boolean): boolean {
    const user = this.state.users.find(u => u.id === userId);
    if (!user) return false;
    user.role = newRole;
    if (isVerified !== undefined) user.isVerified = isVerified;
    this.saveState();
    return true;
  }

  public deleteUser(userId: string): boolean {
    const initialLen = this.state.users.length;
    this.state.users = this.state.users.filter(u => u.id !== userId);
    // Cascade delete pantry items & meal plans
    this.state.pantryItems = this.state.pantryItems.filter(p => p.userId !== userId);
    this.state.mealPlans = this.state.mealPlans.filter(m => m.userId !== userId);
    if (this.state.currentUserId === userId) {
      this.state.currentUserId = this.state.users[0]?.id || '';
    }
    this.saveState();
    return this.state.users.length < initialLen;
  }

  // --- Recipe DAO operations ---
  public getRecipes(): Recipe[] {
    return [...this.state.recipes];
  }

  public getRecipeById(id: string): Recipe | undefined {
    return this.state.recipes.find(r => r.id === id);
  }

  public createRecipe(recipeData: Omit<Recipe, 'id' | 'createdAt'>): Recipe {
    const newRecipe: Recipe = {
      ...recipeData,
      id: 'rec_' + Date.now(),
      createdAt: new Date().toISOString(),
      isApproved: true,
    };
    this.state.recipes.unshift(newRecipe);
    this.saveState();
    return newRecipe;
  }

  public updateRecipe(id: string, updates: Partial<Recipe>): Recipe | null {
    const index = this.state.recipes.findIndex(r => r.id === id);
    if (index === -1) return null;
    this.state.recipes[index] = { ...this.state.recipes[index], ...updates };
    this.saveState();
    return this.state.recipes[index];
  }

  public deleteRecipe(id: string): boolean {
    const initialLen = this.state.recipes.length;
    this.state.recipes = this.state.recipes.filter(r => r.id !== id);
    // Cascade delete reviews & meal plans for this recipe
    this.state.reviews = this.state.reviews.filter(rev => rev.recipeId !== id);
    this.state.mealPlans = this.state.mealPlans.filter(mp => mp.recipeId !== id);
    this.saveState();
    return this.state.recipes.length < initialLen;
  }

  // --- Reviews DAO operations (with duplicate rating prevention) ---
  public getReviews(): Review[] {
    return [...this.state.reviews];
  }

  public getReviewsForRecipe(recipeId: string): Review[] {
    return this.state.reviews
      .filter(r => r.recipeId === recipeId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public hasUserReviewedRecipe(recipeId: string, userId: string): boolean {
    return this.state.reviews.some(r => r.recipeId === recipeId && r.userId === userId);
  }

  public addReview(reviewData: Omit<Review, 'id' | 'createdAt'>): { success: boolean; error?: string; review?: Review } {
    // Check constraint: One review per user per recipe
    if (this.hasUserReviewedRecipe(reviewData.recipeId, reviewData.userId)) {
      return { success: false, error: 'You have already submitted a review for this recipe. Each user can review once.' };
    }

    const newReview: Review = {
      ...reviewData,
      id: 'rev_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    this.state.reviews.unshift(newReview);
    this.saveState();
    return { success: true, review: newReview };
  }

  public deleteReview(reviewId: string): boolean {
    const len = this.state.reviews.length;
    this.state.reviews = this.state.reviews.filter(r => r.id !== reviewId);
    this.saveState();
    return this.state.reviews.length < len;
  }

  // --- Pantry DAO operations ---
  public getPantryItems(userId?: string): PantryItem[] {
    const targetUserId = userId || this.state.currentUserId;
    return this.state.pantryItems.filter(item => item.userId === targetUserId);
  }

  public addPantryItem(item: Omit<PantryItem, 'id' | 'updatedAt' | 'userId'>, userId?: string): PantryItem {
    const targetUserId = userId || this.state.currentUserId;
    // Check if ingredient already exists in pantry -> if so, aggregate quantity
    const normalizedName = item.name.trim().toLowerCase();
    const existing = this.state.pantryItems.find(
      p => p.userId === targetUserId && p.name.trim().toLowerCase() === normalizedName
    );

    if (existing) {
      existing.quantity += item.quantity;
      existing.updatedAt = new Date().toISOString();
      if (item.expiryDate) existing.expiryDate = item.expiryDate;
      this.saveState();
      return existing;
    }

    const newItem: PantryItem = {
      ...item,
      id: 'pan_' + Date.now() + Math.random().toString(36).substring(2, 5),
      userId: targetUserId,
      updatedAt: new Date().toISOString(),
    };
    this.state.pantryItems.push(newItem);
    this.saveState();
    return newItem;
  }

  public updatePantryItem(id: string, updates: Partial<PantryItem>): PantryItem | null {
    const index = this.state.pantryItems.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.state.pantryItems[index] = {
      ...this.state.pantryItems[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveState();
    return this.state.pantryItems[index];
  }

  public deletePantryItem(id: string): boolean {
    const len = this.state.pantryItems.length;
    this.state.pantryItems = this.state.pantryItems.filter(p => p.id !== id);
    this.saveState();
    return this.state.pantryItems.length < len;
  }

  // --- Meal Plan DAO operations ---
  public getMealPlans(userId?: string): MealPlanEntry[] {
    const targetUserId = userId || this.state.currentUserId;
    return this.state.mealPlans.filter(mp => mp.userId === targetUserId);
  }

  public addMealPlanEntry(entry: Omit<MealPlanEntry, 'id' | 'userId'>, userId?: string): MealPlanEntry {
    const targetUserId = userId || this.state.currentUserId;
    // Check if slot is occupied
    const existingIndex = this.state.mealPlans.findIndex(
      m => m.userId === targetUserId && m.day === entry.day && m.mealTime === entry.mealTime
    );

    const newEntry: MealPlanEntry = {
      ...entry,
      id: 'mp_' + Date.now(),
      userId: targetUserId,
    };

    if (existingIndex !== -1) {
      this.state.mealPlans[existingIndex] = newEntry;
    } else {
      this.state.mealPlans.push(newEntry);
    }
    this.saveState();
    return newEntry;
  }

  public removeMealPlanEntry(id: string): boolean {
    const len = this.state.mealPlans.length;
    this.state.mealPlans = this.state.mealPlans.filter(m => m.id !== id);
    this.saveState();
    return this.state.mealPlans.length < len;
  }

  // --- Recommendation Weights ---
  public getWeights(): RecommendationWeights {
    return { ...this.state.weights };
  }

  public updateWeights(weights: RecommendationWeights): void {
    // Normalization safety: ensure sum is around 1.0
    const sum = weights.pantryWeight + weights.userRatingWeight + weights.influencerWeight;
    if (sum > 0) {
      this.state.weights = {
        pantryWeight: Number((weights.pantryWeight / sum).toFixed(2)),
        userRatingWeight: Number((weights.userRatingWeight / sum).toFixed(2)),
        influencerWeight: Number((weights.influencerWeight / sum).toFixed(2)),
      };
    } else {
      this.state.weights = DEFAULT_WEIGHTS;
    }
    this.saveState();
  }
}

export const db = new StorageEngine();
