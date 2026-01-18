// TheMealDB API integration
const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

export interface MealDBMeal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string | null;
  strSource: string | null;
  // Ingredients (1-20)
  strIngredient1?: string;
  strIngredient2?: string;
  strIngredient3?: string;
  strIngredient4?: string;
  strIngredient5?: string;
  strIngredient6?: string;
  strIngredient7?: string;
  strIngredient8?: string;
  strIngredient9?: string;
  strIngredient10?: string;
  strIngredient11?: string;
  strIngredient12?: string;
  strIngredient13?: string;
  strIngredient14?: string;
  strIngredient15?: string;
  strIngredient16?: string;
  strIngredient17?: string;
  strIngredient18?: string;
  strIngredient19?: string;
  strIngredient20?: string;
  // Measures (1-20)
  strMeasure1?: string;
  strMeasure2?: string;
  strMeasure3?: string;
  strMeasure4?: string;
  strMeasure5?: string;
  strMeasure6?: string;
  strMeasure7?: string;
  strMeasure8?: string;
  strMeasure9?: string;
  strMeasure10?: string;
  strMeasure11?: string;
  strMeasure12?: string;
  strMeasure13?: string;
  strMeasure14?: string;
  strMeasure15?: string;
  strMeasure16?: string;
  strMeasure17?: string;
  strMeasure18?: string;
  strMeasure19?: string;
  strMeasure20?: string;
}

export interface MealDBCategory {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export interface ParsedIngredient {
  name: string;
  measure: string;
}

// Parse ingredients from MealDB meal object
export function parseIngredients(meal: MealDBMeal): ParsedIngredient[] {
  const ingredients: ParsedIngredient[] = [];
  
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}` as keyof MealDBMeal] as string;
    const measure = meal[`strMeasure${i}` as keyof MealDBMeal] as string;
    
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        name: ingredient.trim(),
        measure: measure?.trim() || "",
      });
    }
  }
  
  return ingredients;
}

// Extract YouTube video ID from URL
export function extractYouTubeId(url: string | null): string | null {
  if (!url) return null;
  
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
}

// API functions
export async function searchMeals(query: string): Promise<MealDBMeal[]> {
  const response = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
  const data = await response.json();
  return data.meals || [];
}

export async function getMealById(id: string): Promise<MealDBMeal | null> {
  const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
  const data = await response.json();
  return data.meals?.[0] || null;
}

export async function getRandomMeal(): Promise<MealDBMeal | null> {
  const response = await fetch(`${BASE_URL}/random.php`);
  const data = await response.json();
  return data.meals?.[0] || null;
}

export async function getCategories(): Promise<MealDBCategory[]> {
  const response = await fetch(`${BASE_URL}/categories.php`);
  const data = await response.json();
  return data.categories || [];
}

export async function getMealsByCategory(category: string): Promise<MealDBMeal[]> {
  const response = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
  const data = await response.json();
  return data.meals || [];
}

export async function getMealsByArea(area: string): Promise<MealDBMeal[]> {
  const response = await fetch(`${BASE_URL}/filter.php?a=${encodeURIComponent(area)}`);
  const data = await response.json();
  return data.meals || [];
}

export async function getAreas(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/list.php?a=list`);
  const data = await response.json();
  return data.meals?.map((m: { strArea: string }) => m.strArea) || [];
}

export async function getRandomMeals(count: number = 6): Promise<MealDBMeal[]> {
  const promises = Array(count).fill(null).map(() => getRandomMeal());
  const results = await Promise.all(promises);
  return results.filter((meal): meal is MealDBMeal => meal !== null);
}
