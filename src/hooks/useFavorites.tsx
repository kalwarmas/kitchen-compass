import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

interface Favorite {
  id: string;
  recipe_id: string;
  recipe_type: "api" | "user";
  recipe_title: string;
  recipe_image: string | null;
  created_at: string;
}

export function useFavorites() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Favorite[];
    },
    enabled: !!user,
  });

  const addFavorite = useMutation({
    mutationFn: async ({
      recipeId,
      recipeType,
      recipeTitle,
      recipeImage,
    }: {
      recipeId: string;
      recipeType: "api" | "user";
      recipeTitle: string;
      recipeImage: string | null;
    }) => {
      if (!user) throw new Error("Must be logged in");

      const { error } = await supabase.from("favorites").insert({
        user_id: user.id,
        recipe_id: recipeId,
        recipe_type: recipeType,
        recipe_title: recipeTitle,
        recipe_image: recipeImage,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast.success("Added to favorites!");
    },
    onError: (error) => {
      toast.error("Failed to add favorite: " + error.message);
    },
  });

  const removeFavorite = useMutation({
    mutationFn: async ({ recipeId, recipeType }: { recipeId: string; recipeType: "api" | "user" }) => {
      if (!user) throw new Error("Must be logged in");

      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("recipe_id", recipeId)
        .eq("recipe_type", recipeType);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast.success("Removed from favorites");
    },
    onError: (error) => {
      toast.error("Failed to remove favorite: " + error.message);
    },
  });

  const isFavorite = (recipeId: string, recipeType: "api" | "user" = "api") => {
    return favorites.some(
      (f) => f.recipe_id === recipeId && f.recipe_type === recipeType
    );
  };

  const toggleFavorite = (
    recipeId: string,
    recipeType: "api" | "user",
    recipeTitle: string,
    recipeImage: string | null
  ) => {
    if (isFavorite(recipeId, recipeType)) {
      removeFavorite.mutate({ recipeId, recipeType });
    } else {
      addFavorite.mutate({ recipeId, recipeType, recipeTitle, recipeImage });
    }
  };

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };
}
