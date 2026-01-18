import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Heart, Share2, Clock, Users, Globe, Tag } from "lucide-react";
import { getMealById, parseIngredients } from "@/lib/mealdb-api";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageLoader } from "@/components/ui/loading-spinner";
import { VideoPlayer } from "@/components/recipes/VideoPlayer";
import { IngredientsList } from "@/components/recipes/IngredientsList";
import { InstructionsList } from "@/components/recipes/InstructionsList";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  const { data: meal, isLoading } = useQuery({
    queryKey: ["meal", id],
    queryFn: () => getMealById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  if (!meal) {
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

  const ingredients = parseIngredients(meal);
  const isFav = isFavorite(meal.idMeal, "api");
  const tags = meal.strTags?.split(",").map((t) => t.trim()).filter(Boolean) || [];

  const handleShare = async () => {
    try {
      await navigator.share({
        title: meal.strMeal,
        text: `Check out this recipe: ${meal.strMeal}`,
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
    toggleFavorite(meal.idMeal, "api", meal.strMeal, meal.strMealThumb);
  };

  return (
    <AppLayout hideNav>
      <div className="space-y-6 pb-8 animate-fade-in">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="mb-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Hero Image */}
        <div className="relative aspect-video overflow-hidden rounded-2xl">
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-2xl font-bold text-white md:text-3xl">
              {meal.strMeal}
            </h1>
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

        {/* Meta Info */}
        <div className="flex flex-wrap gap-2">
          {meal.strCategory && (
            <Badge variant="secondary" className="gap-1">
              <Tag className="h-3 w-3" />
              {meal.strCategory}
            </Badge>
          )}
          {meal.strArea && (
            <Badge variant="secondary" className="gap-1">
              <Globe className="h-3 w-3" />
              {meal.strArea}
            </Badge>
          )}
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            30-45 min
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Users className="h-3 w-3" />
            4 servings
          </Badge>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Video Tutorial */}
        {meal.strYoutube && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Video Tutorial</h3>
            <VideoPlayer url={meal.strYoutube} title={meal.strMeal} />
          </div>
        )}

        {/* Ingredients */}
        <IngredientsList ingredients={ingredients} />

        {/* Instructions */}
        <InstructionsList instructions={meal.strInstructions} />
      </div>
    </AppLayout>
  );
}
