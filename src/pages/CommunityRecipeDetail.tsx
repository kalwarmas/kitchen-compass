import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Heart, Share2, Clock, Users, ChefHat, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageLoader } from "@/components/ui/loading-spinner";
import { VideoPlayer } from "@/components/recipes/VideoPlayer";
import { IngredientsList } from "@/components/recipes/IngredientsList";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

interface Ingredient {
  name: string;
  measure: string;
}

export default function CommunityRecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const { data: recipe, isLoading } = useQuery({
    queryKey: ["community-recipe", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_recipes")
        .select("*, profiles!user_recipes_user_id_fkey(username, full_name, avatar_url)")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  if (!recipe) {
    return (
      <AppLayout>
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Recipe not found</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </AppLayout>
    );
  }

  const ingredients = (recipe.ingredients as unknown as Ingredient[]) || [];
  const instructions = (recipe.instructions as unknown as string[]) || [];
  const isFav = isFavorite(recipe.id, "user");
  const profile = recipe.profiles as { username?: string; full_name?: string; avatar_url?: string } | null;
  const authorName = profile?.username || profile?.full_name || "Chef";

  const handleShare = async () => {
    try {
      await navigator.share({
        title: recipe.title,
        text: `Check out this recipe: ${recipe.title}`,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleFavoriteClick = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    toggleFavorite(recipe.id, "user", recipe.title, recipe.image_url);
  };

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <AppLayout hideNav>
      <div className="space-y-6 pb-8 animate-fade-in">
        {/* Back Button */}
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mb-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Hero Image */}
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-muted">
          {recipe.image_url ? (
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ChefHat className="h-16 w-16 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-2xl font-bold text-white md:text-3xl">
              {recipe.title}
            </h1>
          </div>
        </div>

        {/* Author */}
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{authorName}</p>
            <p className="text-sm text-muted-foreground">Recipe Creator</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant={isFav ? "default" : "outline"}
            className="flex-1"
            onClick={handleFavoriteClick}
          >
            <Heart className={cn("mr-2 h-4 w-4", isFav && "fill-current")} />
            {isFav ? "Saved" : "Save Recipe"}
          </Button>
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Description */}
        {recipe.description && (
          <p className="text-muted-foreground">{recipe.description}</p>
        )}

        {/* Meta Info */}
        <div className="flex flex-wrap gap-2">
          {recipe.category && (
            <Badge variant="secondary" className="gap-1">
              <ChefHat className="h-3 w-3" />
              {recipe.category}
            </Badge>
          )}
          {recipe.cuisine && (
            <Badge variant="secondary">{recipe.cuisine}</Badge>
          )}
          {(recipe.prep_time || recipe.cook_time) && (
            <Badge variant="secondary" className="gap-1">
              <Clock className="h-3 w-3" />
              {recipe.prep_time && `${recipe.prep_time}m prep`}
              {recipe.prep_time && recipe.cook_time && " + "}
              {recipe.cook_time && `${recipe.cook_time}m cook`}
            </Badge>
          )}
          {recipe.servings && (
            <Badge variant="secondary" className="gap-1">
              <Users className="h-3 w-3" />
              {recipe.servings} servings
            </Badge>
          )}
          {recipe.difficulty && (
            <Badge variant="outline">{recipe.difficulty}</Badge>
          )}
        </div>

        {/* Video Tutorial */}
        {recipe.video_url && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Video Tutorial</h3>
            <VideoPlayer url={recipe.video_url} title={recipe.title} />
          </div>
        )}

        {/* Ingredients */}
        {ingredients.length > 0 && (
          <IngredientsList ingredients={ingredients} />
        )}

        {/* Instructions */}
        {instructions.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Instructions</h3>
            <ol className="space-y-4">
              {instructions.map((step, index) => (
                <li
                  key={index}
                  className={cn(
                    "flex gap-3 rounded-lg border bg-card p-4 transition-all cursor-pointer",
                    completedSteps[index] && "bg-accent/30 border-accent"
                  )}
                  onClick={() => toggleStep(index)}
                >
                  <div className="flex-shrink-0">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full font-semibold transition-colors",
                        completedSteps[index]
                          ? "bg-accent text-accent-foreground"
                          : "bg-primary text-primary-foreground"
                      )}
                    >
                      {completedSteps[index] ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        index + 1
                      )}
                    </div>
                  </div>
                  <p
                    className={cn(
                      "flex-1 pt-1",
                      completedSteps[index] && "text-muted-foreground line-through"
                    )}
                  >
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
