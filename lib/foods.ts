/**
 * Programmatic food pages data.
 * All values per 100g. Easy to extend for new foods and future category/comparison pages.
 */

export interface NutritionPer100g {
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
}

export interface Food {
  slug: string;
  name: string;
  /** Display icon on /foods and related cards */
  emoji: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  /** Optional: different nutrition by cooking method. Key = method slug, value = per 100g. */
  variants?: Record<string, NutritionPer100g>;
}

/** All foods available at /foods/[slug]. Order = display order in "Frequently Searched". */
export const FOODS: Food[] = [
  {
    slug: 'chicken-breast',
    name: 'Chicken Breast',
    emoji: '🐔',
    caloriesPer100g: 165,
    proteinPer100g: 31,
    carbsPer100g: 0,
    fatPer100g: 3.6,
    variants: {
      raw: { caloriesPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatPer100g: 3.6 },
      grilled: { caloriesPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatPer100g: 3.6 },
      boiled: { caloriesPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatPer100g: 3.6 },
      fried: { caloriesPer100g: 220, proteinPer100g: 28, carbsPer100g: 2, fatPer100g: 12 },
      baked: { caloriesPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatPer100g: 3.6 },
    },
  },
  {
    slug: 'white-rice',
    name: 'White Rice',
    emoji: '🍚',
    caloriesPer100g: 130,
    proteinPer100g: 2.7,
    carbsPer100g: 28,
    fatPer100g: 0.3,
    variants: {
      'raw-dry': { caloriesPer100g: 360, proteinPer100g: 6.6, carbsPer100g: 80, fatPer100g: 0.6 },
      cooked: { caloriesPer100g: 130, proteinPer100g: 2.7, carbsPer100g: 28, fatPer100g: 0.3 },
    },
  },
  {
    slug: 'brown-rice',
    name: 'Brown Rice',
    emoji: '🌾',
    caloriesPer100g: 112,
    proteinPer100g: 2.6,
    carbsPer100g: 24,
    fatPer100g: 0.9,
    variants: {
      'raw-dry': { caloriesPer100g: 370, proteinPer100g: 7.9, carbsPer100g: 78, fatPer100g: 2.9 },
      cooked: { caloriesPer100g: 112, proteinPer100g: 2.6, carbsPer100g: 24, fatPer100g: 0.9 },
    },
  },
  {
    slug: 'eggs',
    name: 'Eggs',
    emoji: '🥚',
    caloriesPer100g: 155,
    proteinPer100g: 13,
    carbsPer100g: 1.1,
    fatPer100g: 11,
    variants: {
      raw: { caloriesPer100g: 155, proteinPer100g: 13, carbsPer100g: 1.1, fatPer100g: 11 },
      boiled: { caloriesPer100g: 155, proteinPer100g: 13, carbsPer100g: 1.1, fatPer100g: 11 },
      scrambled: { caloriesPer100g: 149, proteinPer100g: 10, carbsPer100g: 1.6, fatPer100g: 11 },
      fried: { caloriesPer100g: 196, proteinPer100g: 14, carbsPer100g: 0.8, fatPer100g: 15 },
    },
  },
  {
    slug: 'salmon',
    name: 'Salmon',
    emoji: '🐟',
    caloriesPer100g: 208,
    proteinPer100g: 20,
    carbsPer100g: 0,
    fatPer100g: 13,
    variants: {
      raw: { caloriesPer100g: 208, proteinPer100g: 20, carbsPer100g: 0, fatPer100g: 13 },
      grilled: { caloriesPer100g: 208, proteinPer100g: 20, carbsPer100g: 0, fatPer100g: 13 },
      baked: { caloriesPer100g: 208, proteinPer100g: 20, carbsPer100g: 0, fatPer100g: 13 },
      fried: { caloriesPer100g: 250, proteinPer100g: 19, carbsPer100g: 2, fatPer100g: 17 },
    },
  },
  { slug: 'tuna', name: 'Tuna', emoji: '🐠', caloriesPer100g: 132, proteinPer100g: 28, carbsPer100g: 0, fatPer100g: 1 },
  { slug: 'oatmeal', name: 'Oatmeal', emoji: '🫕', caloriesPer100g: 68, proteinPer100g: 2.4, carbsPer100g: 12, fatPer100g: 1.4 },
  { slug: 'greek-yogurt', name: 'Greek Yogurt', emoji: '🍨', caloriesPer100g: 97, proteinPer100g: 9, carbsPer100g: 3.5, fatPer100g: 5 },
  { slug: 'cottage-cheese', name: 'Cottage Cheese', emoji: '🫙', caloriesPer100g: 98, proteinPer100g: 11, carbsPer100g: 3.4, fatPer100g: 4.3 },
  { slug: 'avocado', name: 'Avocado', emoji: '🥑', caloriesPer100g: 160, proteinPer100g: 2, carbsPer100g: 9, fatPer100g: 15 },
  { slug: 'banana', name: 'Banana', emoji: '🍌', caloriesPer100g: 89, proteinPer100g: 1.1, carbsPer100g: 23, fatPer100g: 0.3 },
  { slug: 'apple', name: 'Apple', emoji: '🍎', caloriesPer100g: 52, proteinPer100g: 0.3, carbsPer100g: 14, fatPer100g: 0.2 },
  { slug: 'ground-beef', name: 'Ground Beef', emoji: '🍔', caloriesPer100g: 250, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 15 },
  { slug: 'beef-steak', name: 'Beef Steak', emoji: '🥩', caloriesPer100g: 271, proteinPer100g: 25, carbsPer100g: 0, fatPer100g: 19 },
  { slug: 'turkey-breast', name: 'Turkey Breast', emoji: '🦃', caloriesPer100g: 135, proteinPer100g: 30, carbsPer100g: 0, fatPer100g: 0.7 },
  { slug: 'pork-chop', name: 'Pork Chop', emoji: '🐷', caloriesPer100g: 231, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 14 },
  { slug: 'chicken-thigh', name: 'Chicken Thigh', emoji: '🍗', caloriesPer100g: 209, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 10.9 },
  { slug: 'protein-bar', name: 'Protein Bar', emoji: '💪', caloriesPer100g: 400, proteinPer100g: 30, carbsPer100g: 40, fatPer100g: 12 },
  { slug: 'protein-powder', name: 'Protein Powder', emoji: '🥤', caloriesPer100g: 400, proteinPer100g: 80, carbsPer100g: 7, fatPer100g: 5 },
  { slug: 'almonds', name: 'Almonds', emoji: '🌰', caloriesPer100g: 579, proteinPer100g: 21, carbsPer100g: 22, fatPer100g: 50 },
  { slug: 'peanut-butter', name: 'Peanut Butter', emoji: '🥜', caloriesPer100g: 588, proteinPer100g: 25, carbsPer100g: 20, fatPer100g: 50 },
  { slug: 'olive-oil', name: 'Olive Oil', emoji: '🫒', caloriesPer100g: 884, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 100 },
  {
    slug: 'pasta-cooked',
    name: 'Pasta (Cooked)',
    emoji: '🍝',
    caloriesPer100g: 131,
    proteinPer100g: 5,
    carbsPer100g: 25,
    fatPer100g: 1.1,
    variants: {
      'raw-dry': { caloriesPer100g: 371, proteinPer100g: 13, carbsPer100g: 74, fatPer100g: 1.5 },
      cooked: { caloriesPer100g: 131, proteinPer100g: 5, carbsPer100g: 25, fatPer100g: 1.1 },
    },
  },
  { slug: 'white-bread', name: 'White Bread', emoji: '🍞', caloriesPer100g: 265, proteinPer100g: 9, carbsPer100g: 49, fatPer100g: 3.2 },
  { slug: 'whole-wheat-bread', name: 'Whole Wheat Bread', emoji: '🥖', caloriesPer100g: 247, proteinPer100g: 10.7, carbsPer100g: 41, fatPer100g: 3.4 },
  { slug: 'potatoes', name: 'Potatoes', emoji: '🥔', caloriesPer100g: 77, proteinPer100g: 2, carbsPer100g: 17, fatPer100g: 0.1 },
  { slug: 'sweet-potatoes', name: 'Sweet Potatoes', emoji: '🍠', caloriesPer100g: 86, proteinPer100g: 1.6, carbsPer100g: 20, fatPer100g: 0.1 },
  {
    slug: 'broccoli',
    name: 'Broccoli',
    emoji: '🥦',
    caloriesPer100g: 34,
    proteinPer100g: 2.8,
    carbsPer100g: 7,
    fatPer100g: 0.4,
    variants: {
      raw: { caloriesPer100g: 34, proteinPer100g: 2.8, carbsPer100g: 7, fatPer100g: 0.4 },
      steamed: { caloriesPer100g: 35, proteinPer100g: 2.4, carbsPer100g: 7.2, fatPer100g: 0.4 },
      boiled: { caloriesPer100g: 35, proteinPer100g: 2.4, carbsPer100g: 7.2, fatPer100g: 0.4 },
    },
  },
  {
    slug: 'spinach',
    name: 'Spinach',
    emoji: '🥬',
    caloriesPer100g: 23,
    proteinPer100g: 2.9,
    carbsPer100g: 3.6,
    fatPer100g: 0.4,
    variants: {
      raw: { caloriesPer100g: 23, proteinPer100g: 2.9, carbsPer100g: 3.6, fatPer100g: 0.4 },
      steamed: { caloriesPer100g: 23, proteinPer100g: 2.9, carbsPer100g: 3.6, fatPer100g: 0.4 },
      boiled: { caloriesPer100g: 23, proteinPer100g: 2.9, carbsPer100g: 3.6, fatPer100g: 0.4 },
    },
  },
  {
    slug: 'carrots',
    name: 'Carrots',
    emoji: '🥕',
    caloriesPer100g: 41,
    proteinPer100g: 0.9,
    carbsPer100g: 10,
    fatPer100g: 0.2,
    variants: {
      raw: { caloriesPer100g: 41, proteinPer100g: 0.9, carbsPer100g: 10, fatPer100g: 0.2 },
      steamed: { caloriesPer100g: 41, proteinPer100g: 0.8, carbsPer100g: 9.6, fatPer100g: 0.2 },
      boiled: { caloriesPer100g: 35, proteinPer100g: 0.8, carbsPer100g: 8.2, fatPer100g: 0.2 },
    },
  },
  { slug: 'cheese-cheddar', name: 'Cheese (Cheddar)', emoji: '🧀', caloriesPer100g: 403, proteinPer100g: 25, carbsPer100g: 1.3, fatPer100g: 33 },
  { slug: 'mozzarella', name: 'Mozzarella', emoji: '🍕', caloriesPer100g: 280, proteinPer100g: 28, carbsPer100g: 3.1, fatPer100g: 17 },
  { slug: 'milk-whole', name: 'Milk (Whole)', emoji: '🥛', caloriesPer100g: 61, proteinPer100g: 3.2, carbsPer100g: 4.8, fatPer100g: 3.3 },
  { slug: 'milk-low-fat', name: 'Milk (Low Fat)', emoji: '🍼', caloriesPer100g: 41, proteinPer100g: 3.4, carbsPer100g: 5, fatPer100g: 1 },
  { slug: 'dark-chocolate', name: 'Dark Chocolate', emoji: '🍫', caloriesPer100g: 546, proteinPer100g: 4.9, carbsPer100g: 61, fatPer100g: 31 },
  { slug: 'rice-cooked-white', name: 'Rice (Cooked White)', emoji: '🍛', caloriesPer100g: 130, proteinPer100g: 2.7, carbsPer100g: 28, fatPer100g: 0.3 },
  { slug: 'rice-cooked-brown', name: 'Rice (Cooked Brown)', emoji: '🍙', caloriesPer100g: 112, proteinPer100g: 2.6, carbsPer100g: 24, fatPer100g: 0.9 },
  { slug: 'quinoa', name: 'Quinoa', emoji: '🌱', caloriesPer100g: 120, proteinPer100g: 4.4, carbsPer100g: 21, fatPer100g: 1.9 },
  { slug: 'lentils', name: 'Lentils', emoji: '🥘', caloriesPer100g: 116, proteinPer100g: 9, carbsPer100g: 20, fatPer100g: 0.4 },
  { slug: 'black-beans', name: 'Black Beans', emoji: '🫘', caloriesPer100g: 132, proteinPer100g: 8.9, carbsPer100g: 24, fatPer100g: 0.5 },
  { slug: 'chickpeas', name: 'Chickpeas', emoji: '🧆', caloriesPer100g: 164, proteinPer100g: 8.9, carbsPer100g: 27, fatPer100g: 2.6 },
  { slug: 'tofu', name: 'Tofu', emoji: '🍱', caloriesPer100g: 76, proteinPer100g: 8.1, carbsPer100g: 1.9, fatPer100g: 4.8 },
  { slug: 'shrimp', name: 'Shrimp', emoji: '🦐', caloriesPer100g: 99, proteinPer100g: 24, carbsPer100g: 0.2, fatPer100g: 0.3 },
  { slug: 'ground-turkey', name: 'Ground Turkey', emoji: '🥙', caloriesPer100g: 170, proteinPer100g: 20, carbsPer100g: 0, fatPer100g: 10 },
  { slug: 'grilled-chicken', name: 'Grilled Chicken', emoji: '🍖', caloriesPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatPer100g: 3.6 },
  { slug: 'scrambled-eggs', name: 'Scrambled Eggs', emoji: '🍳', caloriesPer100g: 149, proteinPer100g: 10, carbsPer100g: 1.6, fatPer100g: 11 },
  { slug: 'omelette', name: 'Omelette', emoji: '🥞', caloriesPer100g: 154, proteinPer100g: 10.6, carbsPer100g: 0.6, fatPer100g: 12 },
  { slug: 'greek-yogurt-0', name: 'Greek Yogurt (0%)', emoji: '🍦', caloriesPer100g: 59, proteinPer100g: 10, carbsPer100g: 3.6, fatPer100g: 0.4 },
  { slug: 'granola', name: 'Granola', emoji: '🥣', caloriesPer100g: 471, proteinPer100g: 10, carbsPer100g: 64, fatPer100g: 20 },
];

const slugToFood = new Map<string, Food>(FOODS.map((f) => [f.slug, f]));

export function getFoodBySlug(slug: string): Food | undefined {
  return slugToFood.get(slug);
}

export function getAllFoodSlugs(): string[] {
  return FOODS.map((f) => f.slug);
}

/** For Meal Log Calculator "Frequently Searched" – same order as FOODS. */
export function getFrequentlySearchedFoods(): Food[] {
  return FOODS;
}

/** Food categories for finding related products */
const FOOD_CATEGORIES: Record<string, string[]> = {
  protein: ['chicken-breast', 'chicken-thigh', 'grilled-chicken', 'turkey-breast', 'ground-turkey', 'salmon', 'tuna', 'shrimp', 'eggs', 'scrambled-eggs', 'omelette', 'ground-beef', 'beef-steak', 'pork-chop', 'tofu', 'protein-powder', 'protein-bar'],
  dairy: ['greek-yogurt', 'greek-yogurt-0', 'cottage-cheese', 'cheese-cheddar', 'mozzarella', 'milk-whole', 'milk-low-fat'],
  grains: ['white-rice', 'brown-rice', 'rice-cooked-white', 'rice-cooked-brown', 'quinoa', 'oatmeal', 'pasta-cooked', 'white-bread', 'whole-wheat-bread', 'granola'],
  vegetables: ['broccoli', 'spinach', 'carrots', 'potatoes', 'sweet-potatoes'],
  fruits: ['banana', 'apple', 'avocado'],
  legumes: ['lentils', 'black-beans', 'chickpeas'],
  nutsAndFats: ['almonds', 'peanut-butter', 'olive-oil', 'dark-chocolate'],
};

function getFoodCategory(slug: string): string | null {
  for (const [category, slugs] of Object.entries(FOOD_CATEGORIES)) {
    if (slugs.includes(slug)) return category;
  }
  return null;
}

/** Get related foods for a given food slug */
export function getRelatedFoods(slug: string, limit = 4): Food[] {
  const category = getFoodCategory(slug);
  const currentFood = getFoodBySlug(slug);
  if (!currentFood) return [];

  const related: Food[] = [];

  if (category) {
    const sameCategorySlugs = FOOD_CATEGORIES[category].filter((s) => s !== slug);
    for (const s of sameCategorySlugs) {
      const food = getFoodBySlug(s);
      if (food) related.push(food);
      if (related.length >= limit) break;
    }
  }

  if (related.length < limit) {
    const calorieRange = 50;
    const similarCalorieFoods = FOODS.filter(
      (f) =>
        f.slug !== slug &&
        !related.some((r) => r.slug === f.slug) &&
        Math.abs(f.caloriesPer100g - currentFood.caloriesPer100g) <= calorieRange
    );
    for (const food of similarCalorieFoods) {
      related.push(food);
      if (related.length >= limit) break;
    }
  }

  if (related.length < limit) {
    for (const food of FOODS) {
      if (food.slug !== slug && !related.some((r) => r.slug === food.slug)) {
        related.push(food);
        if (related.length >= limit) break;
      }
    }
  }

  return related.slice(0, limit);
}
