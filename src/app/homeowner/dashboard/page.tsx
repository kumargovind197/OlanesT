"use client";

import { useEffect, useState } from 'react';
import { ContractorCard } from '@/components/contractor/contractor-card';
import type { Contractor } from '@/types';
import { Heart, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomeownerDashboardPage() {
  const [favoriteContractors, setFavoriteContractors] = useState<Contractor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setIsLoading(true);
        // Replace with your actual API endpoint and authentication
        const response = await fetch('/api/user/favorites');
        if (!response.ok) {
          throw new Error(`Error fetching favorites: ${response.statusText}`);
        }
        const data = await response.json();
        setFavoriteContractors(data);
      } catch (error) {
        console.error("Failed to fetch favorite contractors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-4 border rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary font-headline">My Favorite Contractors</h1>
        <p className="text-muted-foreground mt-2">Your hand-picked list of top professionals.</p>
      </header>
      <section>
        {isLoading ? (
          renderSkeletons()
        ) : favoriteContractors.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold text-foreground">No Favorites Yet</h3>
            <p className="mt-2 text-muted-foreground">Find contractors and click the heart icon to save them here.</p>
            <Button asChild className="mt-6">
              <Link href="/homeowner/search">
                <Search className="mr-2 h-4 w-4" /> Find Professionals
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteContractors.map((contractor) => (
              <ContractorCard key={contractor.id} contractor={contractor} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
