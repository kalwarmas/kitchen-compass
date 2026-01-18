import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon, X } from "lucide-react";
import { searchMeals, getAreas } from "@/lib/mealdb-api";
import { AppLayout } from "@/components/layout/AppLayout";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function Search() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const { data: areas } = useQuery({
    queryKey: ["areas"],
    queryFn: getAreas,
  });

  const { data: results, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => searchMeals(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQuery(query);
  };

  const filteredResults = selectedArea
    ? results?.filter((meal) => meal.strArea === selectedArea)
    : results;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search recipes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-20 h-12 text-base"
          />
          <Button
            type="submit"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            Search
          </Button>
        </form>

        {/* Area Filters */}
        {areas && areas.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Filter by Cuisine
            </h3>
            <div className="flex flex-wrap gap-2">
              {areas.slice(0, 12).map((area) => (
                <Badge
                  key={area}
                  variant={selectedArea === area ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() =>
                    setSelectedArea(selectedArea === area ? null : area)
                  }
                >
                  {area}
                  {selectedArea === area && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {isLoading ? (
          <LoadingSpinner className="py-12" size="lg" />
        ) : debouncedQuery.length < 2 ? (
          <div className="py-12 text-center">
            <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">
              Enter at least 2 characters to search
            </p>
          </div>
        ) : filteredResults && filteredResults.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filteredResults.map((meal) => (
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
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              No recipes found for "{debouncedQuery}"
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
