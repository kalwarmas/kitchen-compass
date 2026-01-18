import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { User, Settings, LogOut, ChefHat, Heart, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageLoader } from "@/components/ui/loading-spinner";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";

export default function Profile() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { favorites } = useFavorites();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: userRecipes } = useQuery({
    queryKey: ["user-recipes", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("user_recipes")
        .select("*")
        .eq("user_id", user.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (authLoading || profileLoading) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="py-16 text-center">
            <User className="mx-auto h-16 w-16 text-muted-foreground/30" />
            <h2 className="mt-4 text-xl font-semibold">Sign in to view your profile</h2>
            <p className="mt-2 text-muted-foreground">
              Create an account to save recipes and share your own creations
            </p>
            <Button className="mt-6" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const displayName = profile?.username || profile?.full_name || user.email?.split("@")[0];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
                  {displayName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-xl font-bold">{displayName}</h1>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                {profile?.bio && (
                  <p className="mt-2 text-sm">{profile.bio}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="flex flex-col items-center py-4">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="mt-2 text-2xl font-bold">{userRecipes?.length || 0}</span>
              <span className="text-xs text-muted-foreground">Recipes</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center py-4">
              <Heart className="h-6 w-6 text-primary" />
              <span className="mt-2 text-2xl font-bold">{favorites.length}</span>
              <span className="text-xs text-muted-foreground">Favorites</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center py-4">
              <ChefHat className="h-6 w-6 text-primary" />
              <span className="mt-2 text-2xl font-bold">Chef</span>
              <span className="text-xs text-muted-foreground">Level</span>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate("/create")}
          >
            <ChefHat className="mr-3 h-4 w-4" />
            Create New Recipe
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate("/my-recipes")}
          >
            <BookOpen className="mr-3 h-4 w-4" />
            My Recipes
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => navigate("/favorites")}
          >
            <Heart className="mr-3 h-4 w-4" />
            My Favorites
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
