import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface Ingredient {
  name: string;
  measure: string;
}

interface IngredientsListProps {
  ingredients: Ingredient[];
}

export function IngredientsList({ ingredients }: IngredientsListProps) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const toggleIngredient = (index: number) => {
    setChecked((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Ingredients</h3>
      <ul className="space-y-2">
        {ingredients.map((ingredient, index) => (
          <li
            key={index}
            className="flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors"
          >
            <Checkbox
              id={`ingredient-${index}`}
              checked={checked[index] || false}
              onCheckedChange={() => toggleIngredient(index)}
            />
            <label
              htmlFor={`ingredient-${index}`}
              className={`flex-1 cursor-pointer ${
                checked[index] ? "text-muted-foreground line-through" : ""
              }`}
            >
              <span className="font-medium">{ingredient.measure}</span>{" "}
              {ingredient.name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
