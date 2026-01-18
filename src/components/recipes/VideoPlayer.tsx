import { extractYouTubeId } from "@/lib/mealdb-api";

interface VideoPlayerProps {
  url: string | null;
  title?: string;
}

export function VideoPlayer({ url, title = "Recipe video" }: VideoPlayerProps) {
  const videoId = extractYouTubeId(url);

  if (!videoId) {
    return null;
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-lg">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
