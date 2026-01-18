import { useQuery } from "@tanstack/react-query";
import { getCategories, getRandomMeals } from "@/lib/mealdb-api";
import { AppLayout } from "@/components/layout/AppLayout";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { CategoryCard } from "@/components/recipes/CategoryCard";
import { PageLoader } from "@/components/ui/loading-spinner";
import { ChefHat, TrendingUp, Sparkles } from "lucide-react";

export default function Index() {
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: featuredMeals, isLoading: mealsLoading } = useQuery({
    queryKey: ["featured-meals"],
    queryFn: () => getRandomMeals(6),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  if (categoriesLoading || mealsLoading) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="mb-8 animate-fade-in">
        <div className="rounded-2xl bg-gradient-to-br from-primary/90 to-warm p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <ChefHat className="h-6 w-6" />
            <span className="text-sm font-medium opacity-90">Welcome to</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">CookBook</h1>
          <p className="text-white/80">
            Discover delicious recipes from around the world
          </p>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Featured Recipes</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {featuredMeals?.map((meal) => (
            <RecipeCard
              key={meal.idMeal}
              id={meal.idMeal}
              title={meal.strMeal}
              image={meal.strMealThumb}
              category={meal.strCategory}
              area={meal.strArea}
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Browse Categories</h2>
        </div>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-6">
          {categories?.slice(0, 12).map((category) => (
            <CategoryCard
              key={category.idCategory}
              name={category.strCategory}
              image={category.strCategoryThumb}
            />
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
