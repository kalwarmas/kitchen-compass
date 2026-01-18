import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

interface CategoryCardProps {
  name: string;
  image: string;
  description?: string;
}

export function CategoryCard({ name, image, description }: CategoryCardProps) {
  return (
    <Link to={`/category/${encodeURIComponent(name)}`}>
      <Card className="group relative overflow-hidden transition-all hover:shadow-lg animate-fade-in">
        <div className="aspect-square overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
            <h3 className="text-lg font-bold text-white">{name}</h3>
            {description && (
              <p className="mt-1 text-xs text-white/70 line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
