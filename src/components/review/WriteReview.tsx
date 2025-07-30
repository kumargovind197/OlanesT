"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { collection, addDoc, serverTimestamp, getDocs, query, where, orderBy, getDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/config';

export type Review = {
  id?: string;
  contractorId: string;
  contractorName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt?: any;
  reviewerId?: string;
  reviewerName?: string;
  reviewerEmail?: string;
};

interface WriteReviewProps {
  contractorId: string;
  contractorName: string;
}

export function WriteReview({ contractorId, contractorName }: WriteReviewProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user, role } = useAuth();

useEffect(() => {
  const fetchReviewsWithNames = async () => {
    try {
      const q = query(
        collection(db, "reviews"),
        where("contractorId", "==", contractorId),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const reviewsWithNames: Review[] = [];

      for (const docSnap of snapshot.docs) {
        const review = docSnap.data() as Review;
        const reviewerId = review.reviewerId;

        let reviewerName = "Anonymous";

        if (reviewerId) {
          const userDoc = await getDoc(doc(db, "users", reviewerId));
          if (userDoc.exists()) {
             reviewerName = userDoc.data().fullName || "Anonymous";
          }
        }

        reviewsWithNames.push({
          id: docSnap.id,
          ...review,
          reviewerName,
        });
      }

      setReviews(reviewsWithNames);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  fetchReviewsWithNames();
}, [contractorId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) {
      toast({
        title: "Incomplete Review",
        description: "Please provide a rating and a comment.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData: Review = {
        contractorId,
        contractorName,
        rating,
        title: title.trim(),
        comment: comment.trim(),
        createdAt: serverTimestamp(),
        reviewerId: user?.uid,
        reviewerName: user?.displayName || "Anonymous",
        reviewerEmail: user?.email || ""
      };

      const docRef = await addDoc(collection(db, "reviews"), reviewData);
      setReviews(prev => [{ ...reviewData, id: docRef.id }, ...prev]); // Add on top

      toast({
        title: "Review Submitted",
        description: `Thank you for your feedback on ${contractorName}.`
      });

      setRating(0);
      setTitle('');
      setComment('');
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || role !== 'homeowner') return null;

  return (
    <Card className="bg-secondary/50">
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
        <CardDescription>Share your experience with {contractorName}.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-semibold text-sm mb-2 block">Your Rating</label>
            <div className="flex items-center" onMouseLeave={() => setHoverRating(0)}>
              {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                  <Star
                    key={starValue}
                    className={cn(
                      "h-8 w-8 cursor-pointer",
                      (hoverRating || rating) >= starValue ? "text-amber-400 fill-amber-400" : "text-gray-300"
                    )}
                    onMouseEnter={() => setHoverRating(starValue)}
                    onClick={() => setRating(starValue)}
                  />
                );
              })}
            </div>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Review Title (e.g., Excellent Service!)"
            className="w-full p-2 border rounded-md"
          />
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={`Describe your experience with ${contractorName}...`}
            rows={4}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>

        {/* ✅ Render Reviews */}
        {reviews.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Recent Reviews</h3>
            {reviews.map((review) => (
              <div key={review.id} className="border p-4 rounded-md bg-white">
                <div className="flex items-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"
                      )}
                    />
                  ))}
                  <span className="ml-2 font-medium text-gray-700">{review.title}</span>
                </div>
                <p className="text-sm text-gray-800">{review.comment}</p>
                <p className="text-xs text-gray-500 mt-2">
                  By {review.reviewerName || "Anonymous"} –{" "}
                  {review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString() : "just now"}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
