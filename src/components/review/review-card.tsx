import type { Review } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RatingStars } from '@/components/shared/rating-stars';
import { formatDistanceToNow } from 'date-fns';
import { db } from '@/firebase/config';
import { useAuth } from '@/context/auth-context';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="bg-secondary/30 border-none shadow-none">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar>
          <AvatarImage src={`https://placehold.co/40x40.png?text=${review.reviewerName.charAt(0)}`} data-ai-hint="avatar initial" />
          <AvatarFallback>{review.reviewerName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-base font-semibold">{review.reviewerName}</CardTitle>
          <div className="flex items-center gap-2">
            <RatingStars rating={review.rating} size={16} />
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <h4 className="font-semibold mb-1">{review.title}</h4>
        <p className="text-sm text-muted-foreground">{review.comment}</p>
        {review.contractorComment && (
            <div className="mt-4 ml-4 pl-4 border-l-2">
                <p className="text-sm font-semibold text-foreground">Reply from contractor:</p>
                <p className="text-sm text-muted-foreground italic">"{review.contractorComment}"</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
