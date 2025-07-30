'use client';

import { useState } from 'react';
import { ReviewCard } from '@/components/review/review-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Contractor, Review } from '@/types';
import { BarChart3, Star, MessageSquare } from 'lucide-react';
import { RatingStars } from '@/components/shared/rating-stars';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

function ReviewWithComment({ review }: { review: Review }) {
  const [comment, setComment] = useState(review.contractorComment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(!review.contractorComment);
  const { toast } = useToast();

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Replace this with actual Firestore update
    console.log(`Submitting comment for review ${review.id}: ${comment}`);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setShowCommentBox(false);
    toast({
      title: "Comment Posted",
      description: "Your response to the review has been saved.",
    });
  };

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-background transition-shadow hover:shadow-md">
      <ReviewCard review={review} />
      {showCommentBox ? (
        <form onSubmit={handleCommentSubmit} className="mt-4 border-t pt-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-muted-foreground" /> Add a Public Reply
          </h4>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Respond to this review..."
            className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
            disabled={isSubmitting}
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="ghost" onClick={() => setShowCommentBox(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting || comment.trim() === ''}>
              {isSubmitting ? 'Submitting...' : 'Submit Reply'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="mt-4 border-t pt-4">
          <Button variant="link" onClick={() => setShowCommentBox(true)} className="p-0 h-auto">
            {review.contractorComment ? 'Edit Reply' : 'Add Reply'}
          </Button>
        </div>
      )}
    </div>
  );
}

export default function ContractorReviewsPageClient({
  reviews: initialReviews,
  currentContractor
}: {
  reviews: Review[],
  currentContractor: Contractor
}) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  // 🔁 This will be used after new review is added
  const handleNewReview = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary font-headline">Your Reviews & Feedback</h1>
        <p className="text-muted-foreground mt-2">See what homeowners are saying about your services.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column (Reviews + Form) */}
        <div className="lg:col-span-2 space-y-6">

          {/* 🔽 Insert your form here and call handleNewReview() after Firestore save */}
          {/* <ReviewForm contractorId={currentContractor.id} onNewReview={handleNewReview} /> */}

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Star className="text-accent" /> All Reviews ({reviews.length})
              </CardTitle>
              <CardDescription>Browse through all feedback received from homeowners.</CardDescription>
            </CardHeader>
            <CardContent>
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map(review => (
                    <ReviewWithComment key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">You haven't received any reviews yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Performance Summary) */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <BarChart3 className="text-accent" /> Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-muted-foreground">Average Rating</h3>
                <div className="flex items-center gap-2 mt-1">
                  <RatingStars rating={currentContractor.averageRating} size={24} />
                  <span className="text-2xl font-bold">{currentContractor.averageRating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">/ 5</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-muted-foreground">Total Reviews</h3>
                <p className="text-3xl font-bold mt-1">{reviews.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
