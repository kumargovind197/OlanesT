import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating?: number; // make rating optional for safety
  size?: number;
  className?: string;
}

export function RatingStars({ rating = 0, size = 16, className }: RatingStarsProps) {
  const safeRating = typeof rating === 'number' && !isNaN(rating) && rating >= 0 ? rating : 0;

  const fullStars = Math.floor(safeRating);
  const halfStar = safeRating % 1 >= 0.5;
  const emptyStars = Math.max(0, 5 - fullStars - (halfStar ? 1 : 0));

  return (
    <div className={cn("flex items-center gap-0.5 text-amber-400", className)}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} fill="currentColor" style={{ width: size, height: size }} />
      ))}
      {halfStar && (
        <StarHalf fill="currentColor" style={{ width: size, height: size }} />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="text-gray-300" style={{ width: size, height: size }} />
      ))}
    </div>
  );
}
