import { ChefHat } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { PageLoader } from "@/components/ui/loading-spinner";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export default function MyRecipes() {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const { data: userRecipes, isLoading } = useQuery({
        queryKey: ["user-recipes", user?.id],
        queryFn: async () => {
            if (!user) return [];
            // The type for data returned by supabase select might be inferred roughly, but let's trust it works like in Profile.tsx
            const { data, error } = await supabase
                .from("user_recipes")
                .select("*")
                .eq("user_id", user.id)
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        },
        enabled: !!user,
    });

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
                    <h1 className="text-2xl font-bold">My Recipes</h1>
                    <p className="text-muted-foreground">
                        {userRecipes?.length || 0} recipe{userRecipes?.length !== 1 ? "s" : ""} created
                    </p>
                </div>

                {userRecipes && userRecipes.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {userRecipes.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                id={recipe.id}
                                title={recipe.title}
                                image={recipe.image_url || "/placeholder.svg"}
                                category={recipe.category}
                                prepTime={recipe.prep_time}
                                recipeType="user"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-16 text-center">
                        <ChefHat className="mx-auto h-16 w-16 text-muted-foreground/30" />
                        <h3 className="mt-4 text-lg font-medium">No recipes yet</h3>
                        <p className="mt-2 text-muted-foreground">
                            Share your culinary creations with the community
                        </p>
                        <Button className="mt-6" onClick={() => navigate("/create")}>
                            Create Recipe
                        </Button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
