import { User, Recipe, Review, PantryItem, RecommendationWeights, MealPlanEntry } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_alex',
    name: 'Alex Johnson',
    email: 'alex@student.edu',
    role: 'USER',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'inf_sofia',
    name: 'Sofia Martinez',
    email: 'sofia@plantchef.com',
    role: 'INFLUENCER',
    handle: '@sofia_greenkitchen',
    speciality: 'Plant-Based & Mediterranean Cuisine',
    bio: 'Culinary author, nutritionist & lover of fresh herbs, wholesome grains, and vibrant Mediterranean bowls. Making plant-forward cooking fast and flavorful!',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    followerCount: 142000,
    createdAt: '2025-11-01T08:00:00Z',
  },
  {
    id: 'inf_marcus',
    name: 'Chef Marcus Vance',
    email: 'marcus@vancebites.com',
    role: 'INFLUENCER',
    handle: '@chefmarcus_speed',
    speciality: '15-Minute Dinners & High-Protein Fuel',
    bio: 'Former restaurant head chef turned home kitchen advocate. Passionate about bold pan sauces, pantry hacks, and nutritious dinners under 20 minutes.',
    avatarUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    followerCount: 98500,
    createdAt: '2025-12-10T14:30:00Z',
  },
  {
    id: 'inf_chloe',
    name: 'Chloe Bennett',
    email: 'chloe@budgetbites.io',
    role: 'INFLUENCER',
    handle: '@chloebudgetbites',
    speciality: 'Budget-Friendly Student Meals & Meal Prep',
    bio: 'Teaching university students and young professionals how to eat gourmet food on a $5/dinner grocery budget using simple smart pantry staples.',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    followerCount: 76400,
    createdAt: '2026-02-05T09:15:00Z',
  },
  {
    id: 'user_admin',
    name: 'Elena Rostova',
    email: 'admin@smartkitchen.org',
    role: 'ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    createdAt: '2025-08-01T00:00:00Z',
  }
];

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'rec_1',
    title: 'Garlic Butter Tuscan Tomato Pasta',
    description: 'A creamy, comforting 20-minute pasta bursting with sun-dried tomatoes, fresh baby spinach, and golden garlic.',
    authorId: 'inf_sofia',
    authorName: 'Sofia Martinez',
    authorRole: 'INFLUENCER',
    authorHandle: '@sofia_greenkitchen',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281728?auto=format&fit=crop&w=1000&q=80',
    prepTimeMinutes: 10,
    cookTimeMinutes: 12,
    servings: 2,
    difficulty: 'Easy',
    categories: ['Quick Meals', 'Vegetarian', 'Budget-Friendly'],
    influencerRatingScore: 4.8,
    isApproved: true,
    createdAt: '2026-02-14T12:00:00Z',
    ingredients: [
      { ingredientId: 'ing_pasta', ingredientName: 'Pasta', quantity: 200, unit: 'g' },
      { ingredientId: 'ing_garlic', ingredientName: 'Garlic', quantity: 3, unit: 'cloves' },
      { ingredientId: 'ing_olive_oil', ingredientName: 'Olive Oil', quantity: 2, unit: 'tbsp' },
      { ingredientId: 'ing_tomatoes', ingredientName: 'Tomatoes', quantity: 2, unit: 'pcs' },
      { ingredientId: 'ing_spinach', ingredientName: 'Spinach', quantity: 100, unit: 'g' },
      { ingredientId: 'ing_parmesan', ingredientName: 'Parmesan Cheese', quantity: 40, unit: 'g' },
    ],
    instructions: [
      'Bring a large pot of salted water to a rolling boil. Cook pasta al dente according to box instructions.',
      'Heat extra virgin olive oil in a wide skillet over medium heat. Sauté sliced garlic until fragrant and pale golden (approx 60s).',
      'Add diced ripe tomatoes and a pinch of salt. Cook until softened and juicy, creating a natural rustic sauce.',
      'Toss in fresh baby spinach and stir gently until just wilted.',
      'Transfer drained pasta directly into the sauce along with a splash of starchy pasta water. Sprinkle grated parmesan cheese and toss vigorously until glossy.',
      'Serve warm with cracked black pepper and fresh basil leaves.'
    ]
  },
  {
    id: 'rec_2',
    title: 'High-Protein Lemon Herb Pan Chicken',
    description: 'Juicy, seared chicken breasts deglazed with lemon, garlic butter, and fresh herbs. Lean, deeply savory, and meal-prep ready.',
    authorId: 'inf_marcus',
    authorName: 'Chef Marcus Vance',
    authorRole: 'INFLUENCER',
    authorHandle: '@chefmarcus_speed',
    authorAvatar: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=400&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1000&q=80',
    prepTimeMinutes: 8,
    cookTimeMinutes: 14,
    servings: 2,
    difficulty: 'Easy',
    categories: ['High-Protein', 'Quick Meals', 'Healthy'],
    influencerRatingScore: 4.9,
    isApproved: true,
    createdAt: '2026-02-18T15:20:00Z',
    ingredients: [
      { ingredientId: 'ing_chicken', ingredientName: 'Chicken Breast', quantity: 400, unit: 'g' },
      { ingredientId: 'ing_olive_oil', ingredientName: 'Olive Oil', quantity: 2, unit: 'tbsp' },
      { ingredientId: 'ing_garlic', ingredientName: 'Garlic', quantity: 4, unit: 'cloves' },
      { ingredientId: 'ing_lemon', ingredientName: 'Lemon', quantity: 1, unit: 'pcs' },
      { ingredientId: 'ing_butter', ingredientName: 'Butter', quantity: 1, unit: 'tbsp' },
      { ingredientId: 'ing_rosemary', ingredientName: 'Herbs & Pepper', quantity: 1, unit: 'tsp' }
    ],
    instructions: [
      'Pat chicken breasts dry with paper towels. Season generously on both sides with salt, pepper, and herbs.',
      'Heat olive oil in a heavy stainless steel or cast-iron skillet over medium-high heat until shimmering.',
      'Sear chicken undisturbed for 5-6 minutes until a rich golden crust develops. Flip and cook for another 4-5 minutes.',
      'Turn heat to low, drop in butter, smashed garlic cloves, and squeeze fresh lemon juice over the pan.',
      'Tilt skillet and spoon the foamy lemon-garlic butter continuously over the chicken breasts for 1 minute.',
      'Rest for 4 minutes on a cutting board before slicing against the grain.'
    ]
  },
  {
    id: 'rec_3',
    title: 'Savory Mediterranean Shakshuka Skillet',
    description: 'Farm-fresh eggs poached gently in a spiced simmering reduction of crushed tomatoes, sweet onions, bell peppers, and cumin.',
    authorId: 'inf_sofia',
    authorName: 'Sofia Martinez',
    authorRole: 'INFLUENCER',
    authorHandle: '@sofia_greenkitchen',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=1000&q=80',
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    servings: 2,
    difficulty: 'Easy',
    categories: ['Healthy', 'Vegetarian', 'Budget-Friendly', 'Quick Meals'],
    influencerRatingScore: 4.7,
    isApproved: true,
    createdAt: '2026-02-22T08:30:00Z',
    ingredients: [
      { ingredientId: 'ing_eggs', ingredientName: 'Eggs', quantity: 4, unit: 'pcs' },
      { ingredientId: 'ing_tomatoes', ingredientName: 'Tomatoes', quantity: 3, unit: 'pcs' },
      { ingredientId: 'ing_onion', ingredientName: 'Onion', quantity: 1, unit: 'pcs' },
      { ingredientId: 'ing_garlic', ingredientName: 'Garlic', quantity: 2, unit: 'cloves' },
      { ingredientId: 'ing_olive_oil', ingredientName: 'Olive Oil', quantity: 2, unit: 'tbsp' },
      { ingredientId: 'ing_bread', ingredientName: 'Crusty Bread', quantity: 2, unit: 'slices' }
    ],
    instructions: [
      'Finely dice the onion and mince garlic.',
      'Warm olive oil in a medium pan. Cook onion until soft and translucent (about 4 mins), then add garlic.',
      'Add chopped tomatoes and a pinch of cumin and smoked paprika. Simmer gently for 8-10 minutes until sauce thickens.',
      'Make 4 small wells in the bubbling tomato sauce using the back of a spoon.',
      'Crack one egg gently into each well. Cover skillet with a lid and cook on low heat for 5-7 minutes until whites are set and yolks remain runny.',
      'Garnish with fresh parsley or cilantro. Serve piping hot with toasted crusty bread for dipping.'
    ]
  },
  {
    id: 'rec_4',
    title: '$3 Pantry Staple Fried Rice',
    description: 'Turn leftover day-old rice, pantry aromatics, soy sauce, and scrambled eggs into a satisfying restaurant-quality comfort bowl.',
    authorId: 'inf_chloe',
    authorName: 'Chloe Bennett',
    authorRole: 'INFLUENCER',
    authorHandle: '@chloebudgetbites',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1000&q=80',
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    servings: 2,
    difficulty: 'Easy',
    categories: ['Budget-Friendly', 'Quick Meals', 'Vegetarian'],
    influencerRatingScore: 4.6,
    isApproved: true,
    createdAt: '2026-03-01T17:45:00Z',
    ingredients: [
      { ingredientId: 'ing_rice', ingredientName: 'Cooked Rice', quantity: 300, unit: 'g' },
      { ingredientId: 'ing_eggs', ingredientName: 'Eggs', quantity: 2, unit: 'pcs' },
      { ingredientId: 'ing_onion', ingredientName: 'Onion', quantity: 1, unit: 'pcs' },
      { ingredientId: 'ing_garlic', ingredientName: 'Garlic', quantity: 2, unit: 'cloves' },
      { ingredientId: 'ing_olive_oil', ingredientName: 'Olive Oil', quantity: 1.5, unit: 'tbsp' },
      { ingredientId: 'ing_soy_sauce', ingredientName: 'Soy Sauce', quantity: 2, unit: 'tbsp' }
    ],
    instructions: [
      'Whisk eggs with a tiny pinch of salt. Scramble loosely in a hot oiled pan, then remove to a bowl.',
      'Add remaining oil to the pan. Add chopped onions and garlic; stir-fry for 2 minutes on high heat.',
      'Add cold day-old cooked rice, breaking up clumps with a wooden spatula so every grain heats evenly.',
      'Drizzle soy sauce around the perimeter of the pan so it caramelizes against the hot surface before mixing.',
      'Fold the scrambled eggs back into the rice. Toss continuously for 2 minutes until hot and aromatic.'
    ]
  },
  {
    id: 'rec_5',
    title: 'Warm Golden Chickpea & Spinach Stew',
    description: 'Hearty protein-dense legume stew simmering in turmeric, diced tomatoes, coconut milk or broth, and heaps of wilted greens.',
    authorId: 'inf_sofia',
    authorName: 'Sofia Martinez',
    authorRole: 'INFLUENCER',
    authorHandle: '@sofia_greenkitchen',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80',
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    servings: 3,
    difficulty: 'Easy',
    categories: ['Healthy', 'Vegetarian', 'Budget-Friendly', 'Comfort Food'],
    influencerRatingScore: 4.85,
    isApproved: true,
    createdAt: '2026-03-05T11:00:00Z',
    ingredients: [
      { ingredientId: 'ing_chickpeas', ingredientName: 'Chickpeas (Canned)', quantity: 400, unit: 'g' },
      { ingredientId: 'ing_spinach', ingredientName: 'Spinach', quantity: 150, unit: 'g' },
      { ingredientId: 'ing_tomatoes', ingredientName: 'Tomatoes', quantity: 2, unit: 'pcs' },
      { ingredientId: 'ing_onion', ingredientName: 'Onion', quantity: 1, unit: 'pcs' },
      { ingredientId: 'ing_garlic', ingredientName: 'Garlic', quantity: 3, unit: 'cloves' },
      { ingredientId: 'ing_olive_oil', ingredientName: 'Olive Oil', quantity: 2, unit: 'tbsp' }
    ],
    instructions: [
      'Warm olive oil in a Dutch oven or deep pot over medium heat.',
      'Sauté diced onions and minced garlic with a pinch of turmeric and chili flakes until fragrant.',
      'Stir in drained chickpeas and chopped tomatoes. Lightly mash 1/4 of the chickpeas with the back of a fork to thicken the broth naturally.',
      'Pour in 1 cup of vegetable broth or water and simmer uncovered for 12 minutes.',
      'Fold in fresh spinach and simmer for 2 minutes until tender and vibrant green. Serve with rice or flatbread.'
    ]
  },
  {
    id: 'rec_6',
    title: 'Crispy Garlic Butter Salmon Bowl',
    description: 'Pan-seared crispy skin salmon served over fluffy rice, cucumber slices, and finished with a hot sweet-garlic drizzle.',
    authorId: 'inf_marcus',
    authorName: 'Chef Marcus Vance',
    authorRole: 'INFLUENCER',
    authorHandle: '@chefmarcus_speed',
    authorAvatar: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=400&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1000&q=80',
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    servings: 2,
    difficulty: 'Medium',
    categories: ['High-Protein', 'Healthy', 'Quick Meals'],
    influencerRatingScore: 4.95,
    isApproved: true,
    createdAt: '2026-03-10T19:00:00Z',
    ingredients: [
      { ingredientId: 'ing_salmon', ingredientName: 'Salmon Fillet', quantity: 350, unit: 'g' },
      { ingredientId: 'ing_rice', ingredientName: 'Cooked Rice', quantity: 250, unit: 'g' },
      { ingredientId: 'ing_garlic', ingredientName: 'Garlic', quantity: 3, unit: 'cloves' },
      { ingredientId: 'ing_butter', ingredientName: 'Butter', quantity: 1, unit: 'tbsp' },
      { ingredientId: 'ing_soy_sauce', ingredientName: 'Soy Sauce', quantity: 1.5, unit: 'tbsp' },
      { ingredientId: 'ing_olive_oil', ingredientName: 'Olive Oil', quantity: 1, unit: 'tbsp' }
    ],
    instructions: [
      'Ensure salmon skin is completely dry using paper towels. Season flesh with salt and cracked pepper.',
      'Heat oil in a stainless pan until shimmering. Place salmon skin-side down; press lightly for 20 seconds so it does not curl.',
      'Cook for 5 minutes on skin side until golden and crispy. Flip gently and add butter and minced garlic.',
      'Baste salmon with melting garlic butter for 2-3 minutes. Drizzle soy sauce into pan to create a glaze.',
      'Spoon warm rice into bowls, top with the seared salmon fillet and pour the skillet pan juices right over.'
    ]
  }
];

export const INITIAL_PANTRY: PantryItem[] = [
  {
    id: 'pan_1',
    userId: 'user_alex',
    ingredientId: 'ing_pasta',
    name: 'Pasta',
    quantity: 500,
    unit: 'g',
    category: 'Pantry & Grains',
    expiryDate: '2026-11-20',
    lowStockThreshold: 100,
    updatedAt: '2026-03-01T10:00:00Z'
  },
  {
    id: 'pan_2',
    userId: 'user_alex',
    ingredientId: 'ing_garlic',
    name: 'Garlic',
    quantity: 8,
    unit: 'cloves',
    category: 'Produce',
    expiryDate: '2026-04-15',
    lowStockThreshold: 2,
    updatedAt: '2026-03-01T10:00:00Z'
  },
  {
    id: 'pan_3',
    userId: 'user_alex',
    ingredientId: 'ing_olive_oil',
    name: 'Olive Oil',
    quantity: 500,
    unit: 'ml',
    category: 'Pantry & Grains',
    expiryDate: '2026-12-31',
    lowStockThreshold: 50,
    updatedAt: '2026-03-01T10:00:00Z'
  },
  {
    id: 'pan_4',
    userId: 'user_alex',
    ingredientId: 'ing_tomatoes',
    name: 'Tomatoes',
    quantity: 4,
    unit: 'pcs',
    category: 'Produce',
    expiryDate: '2026-03-25',
    lowStockThreshold: 1,
    updatedAt: '2026-03-01T10:00:00Z'
  },
  {
    id: 'pan_5',
    userId: 'user_alex',
    ingredientId: 'ing_eggs',
    name: 'Eggs',
    quantity: 6,
    unit: 'pcs',
    category: 'Dairy & Eggs',
    expiryDate: '2026-03-29',
    lowStockThreshold: 2,
    updatedAt: '2026-03-01T10:00:00Z'
  },
  {
    id: 'pan_6',
    userId: 'user_alex',
    ingredientId: 'ing_onion',
    name: 'Onion',
    quantity: 3,
    unit: 'pcs',
    category: 'Produce',
    expiryDate: '2026-04-10',
    lowStockThreshold: 1,
    updatedAt: '2026-03-01T10:00:00Z'
  },
  {
    id: 'pan_7',
    userId: 'user_alex',
    ingredientId: 'ing_rice',
    name: 'Cooked Rice',
    quantity: 400,
    unit: 'g',
    category: 'Pantry & Grains',
    expiryDate: '2026-03-22',
    lowStockThreshold: 100,
    updatedAt: '2026-03-01T10:00:00Z'
  },
  {
    id: 'pan_8',
    userId: 'user_alex',
    ingredientId: 'ing_spinach',
    name: 'Spinach',
    quantity: 150,
    unit: 'g',
    category: 'Produce',
    expiryDate: '2026-03-23',
    lowStockThreshold: 50,
    updatedAt: '2026-03-01T10:00:00Z'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    recipeId: 'rec_1',
    userId: 'user_alex',
    userName: 'Alex Johnson',
    userRole: 'USER',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    comment: 'Made this after late evening classes using just tomatoes and spinach from my fridge. Super fast, creamy, and tasted like a bistro meal!',
    createdAt: '2026-03-02T19:30:00Z'
  },
  {
    id: 'rev_2',
    recipeId: 'rec_1',
    userId: 'inf_marcus',
    userName: 'Chef Marcus Vance',
    userRole: 'INFLUENCER',
    userAvatar: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    comment: 'Sofia nailed the starch emulsification here. Adding that splash of salty pasta water right before the parmesan creates a velvety gloss without heavy cream. Chef approved!',
    createdAt: '2026-02-15T18:00:00Z',
    isInfluencerEndorsement: true
  },
  {
    id: 'rev_3',
    recipeId: 'rec_3',
    userId: 'inf_chloe',
    userName: 'Chloe Bennett',
    userRole: 'INFLUENCER',
    userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    comment: 'The best budget brunch on earth. Costs less than $2 to assemble and feels so luxurious with crusty sourdough bread.',
    createdAt: '2026-02-23T11:15:00Z',
    isInfluencerEndorsement: true
  },
  {
    id: 'rev_4',
    recipeId: 'rec_4',
    userId: 'user_alex',
    userName: 'Alex Johnson',
    userRole: 'USER',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    rating: 4,
    comment: 'Lifesaver recipe for leftover rice in the dorm mini-fridge. I added a dash of sriracha and it was perfect.',
    createdAt: '2026-03-06T20:10:00Z'
  },
  {
    id: 'rev_5',
    recipeId: 'rec_2',
    userId: 'inf_sofia',
    userName: 'Sofia Martinez',
    userRole: 'INFLUENCER',
    userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    comment: 'The lemon butter basting technique keeps the breast so juicy. High protein, minimal cleanup.',
    createdAt: '2026-02-19T13:40:00Z',
    isInfluencerEndorsement: true
  }
];

export const INITIAL_MEAL_PLANS: MealPlanEntry[] = [
  {
    id: 'mp_1',
    userId: 'user_alex',
    day: 'Monday',
    mealTime: 'Dinner',
    recipeId: 'rec_1',
    recipeTitle: 'Garlic Butter Tuscan Tomato Pasta',
    recipeImage: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281728?auto=format&fit=crop&w=600&q=80',
    servings: 2
  },
  {
    id: 'mp_2',
    userId: 'user_alex',
    day: 'Wednesday',
    mealTime: 'Dinner',
    recipeId: 'rec_3',
    recipeTitle: 'Savory Mediterranean Shakshuka Skillet',
    recipeImage: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=600&q=80',
    servings: 2
  },
  {
    id: 'mp_3',
    userId: 'user_alex',
    day: 'Friday',
    mealTime: 'Dinner',
    recipeId: 'rec_4',
    recipeTitle: '$3 Pantry Staple Fried Rice',
    recipeImage: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80',
    servings: 2
  }
];

export const DEFAULT_WEIGHTS: RecommendationWeights = {
  pantryWeight: 0.50,      // 50%
  userRatingWeight: 0.20,  // 20%
  influencerWeight: 0.30   // 30%
};
