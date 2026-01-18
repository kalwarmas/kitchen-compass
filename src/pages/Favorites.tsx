import { Heart } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { PageLoader } from "@/components/ui/loading-spinner";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

export default function Favorites() {
  const { user, loading: authLoading } = useAuth();
  const { favorites, isLoading } = useFavorites();

  if (authLoading) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

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
        <div>
          <h1 className="text-2xl font-bold">My Favorites</h1>
          <p className="text-muted-foreground">
            {favorites.length} saved recipe{favorites.length !== 1 ? "s" : ""}
          </p>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {favorites.map((fav) => (
              <RecipeCard
                key={fav.id}
                id={fav.recipe_id}
                title={fav.recipe_title}
                image={fav.recipe_image || "/placeholder.svg"}
                recipeType={fav.recipe_type as "api" | "user"}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <Heart className="mx-auto h-16 w-16 text-muted-foreground/30" />
            <h3 className="mt-4 text-lg font-medium">No favorites yet</h3>
            <p className="mt-2 text-muted-foreground">
              Start exploring recipes and save your favorites here
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
