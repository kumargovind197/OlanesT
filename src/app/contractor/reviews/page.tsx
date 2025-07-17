import { mockContractors, mockReviews } from '@/lib/data';
import type { Contractor } from '@/types';
import ContractorReviewsPageClient from './contractor-reviews-client';
import { Card, CardContent } from '@/components/ui/card';

async function fetchContractorData() {
  // In a real app, you'd fetch the authenticated contractor based on user session or ID
  const contractorId = 'contractor1'; // Using mock ID for now
  const currentContractor: Contractor | undefined = mockContractors.find(c => c.id === contractorId); 

  if (!currentContractor) {
    return { currentContractor: undefined, reviews: [] };
  }

  // Fetch reviews associated with this contractor
  const reviews = mockReviews.filter(review => review.revieweeId === contractorId);

  return { currentContractor, reviews };
}

// Server Component to fetch data and render the Client Component
export default async function ContractorReviewsPage() {
  const { currentContractor, reviews } = await fetchContractorData();

  if (!currentContractor) {
    return (
       <div className="container mx-auto px-4 py-8 text-center sm:px-6 lg:px-8">
         <Card>
           <CardContent className="p-8">
             <p className="text-lg text-muted-foreground">Contractor data not found. Please log in to view your reviews.</p>
           </CardContent>
         </Card>
       </div>
    );
  }

  return (
    <ContractorReviewsPageClient reviews={reviews} currentContractor={currentContractor} />
  );
}
