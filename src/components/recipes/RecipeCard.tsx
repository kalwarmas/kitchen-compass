import { Heart, Clock, ChefHat } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";

interface RecipeCardProps {
  id: string;
  title: string;
  image: string;
  category?: string;
  area?: string;
  recipeType?: "api" | "user";
  prepTime?: number;
}

export function RecipeCard({
  id,
  title,
  image,
  category,
  area,
  recipeType = "api",
  prepTime,
}: RecipeCardProps) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(id, recipeType);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      return;
    }
    
    toggleFavorite(id, recipeType, title, image);
  };

  const linkPath = recipeType === "api" ? `/recipe/${id}` : `/community-recipe/${id}`;

  return (
    <Link to={linkPath}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg animate-fade-in">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {user && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute right-2 top-2 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white",
                isFav && "text-destructive"
              )}
              onClick={handleFavoriteClick}
            >
              <Heart className={cn("h-5 w-5", isFav && "fill-current")} />
            </Button>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="font-semibold text-white line-clamp-2">{title}</h3>
            <div className="mt-1 flex items-center gap-2 text-sm text-white/80">
              {category && (
                <span className="flex items-center gap-1">
                  <ChefHat className="h-3.5 w-3.5" />
                  {category}
                </span>
              )}
              {area && <span>• {area}</span>}
              {prepTime && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {prepTime}m
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
