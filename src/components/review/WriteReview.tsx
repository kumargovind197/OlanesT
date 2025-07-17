"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';

interface WriteReviewProps {
  contractorId: string;
  contractorName: string;
}

export function WriteReview({ contractorId, contractorName }: WriteReviewProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user, role } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) {
      toast({ title: "Incomplete Review", description: "Please provide a rating and a comment.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    console.log({ contractorId, rating, title, comment });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setRating(0);
    setTitle('');
    setComment('');
    toast({ title: "Review Submitted", description: `Thank you for your feedback on ${contractorName}.` });
  };

  if (!user || role !== 'homeowner') {
    return null; // Don't show the form if not a logged-in homeowner
  }

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
      </CardContent>
    </Card>
  );
}
