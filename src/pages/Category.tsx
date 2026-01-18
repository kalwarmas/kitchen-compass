import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { getMealsByCategory } from "@/lib/mealdb-api";
import { AppLayout } from "@/components/layout/AppLayout";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/loading-spinner";

export default function Category() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();

  const { data: meals, isLoading } = useQuery({
    queryKey: ["category", name],
    queryFn: () => getMealsByCategory(name!),
    enabled: !!name,
  });

  if (isLoading) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{name}</h1>
            <p className="text-sm text-muted-foreground">
              {meals?.length || 0} recipes
            </p>
          </div>
        </div>

        {/* Recipes Grid */}
        {meals && meals.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {meals.map((meal) => (
              <RecipeCard
                key={meal.idMeal}
                id={meal.idMeal}
                title={meal.strMeal}
                image={meal.strMealThumb}
                category={name}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No recipes found in this category</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
