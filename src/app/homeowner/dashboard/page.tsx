"use client";

import { useEffect, useState } from "react";
import { ContractorCard } from "@/components/contractor/contractor-card";
import type { Contractor } from "@/types";
import { Heart, Search, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/config";

export default function HomeownerDashboardPage() {
  const [favoriteContractors, setFavoriteContractors] = useState<Contractor[]>([]);
  const [allContractors, setAllContractors] = useState<Contractor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch favorite contractors from API
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch("/api/user/favorites");
        if (!response.ok) throw new Error("Failed to fetch favorites");
        const data = await response.json();
        setFavoriteContractors(data);
      } catch (error) {
        console.error("Failed to fetch favorite contractors:", error);
      }
    };

    fetchFavorites();
  }, []);

  // Fetch all contractors from Firestore
// useEffect(() => {
//   const fetchContractorsFromFirestore = async () => {
//     try {
//       const q = query(collection(db, "ContractorPrfoile")); // ✅ Corrected name
//       const querySnapshot = await getDocs(q);

//       const contractors: Contractor[] = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       })) as Contractor[];

//       console.log("Loaded contractors:", querySnapshot); // ✅ See if data is loading

//       setAllContractors(contractors);
//     } catch (error) {
//       console.error("Failed to fetch contractors from Firestore:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   fetchContractorsFromFirestore();
// }, []);
useEffect(() => {
  const fetchContractorsFromFirestore = async () => {
    try {
      const contractorSnapshot = await getDocs(collection(db, "ContractorPrfoile"));
      const reviewSnapshot = await getDocs(collection(db, "reviews"));

      const allReviews = reviewSnapshot.docs.map(doc => doc.data());

 const contractors: Contractor[] = contractorSnapshot.docs.map((doc) => {
  const contractorData = doc.data();
  const contractorId = doc.id;

  const contractorReviews = allReviews.filter(
    (review: any) => review.contractorId === contractorId
  );

  const totalRatings = contractorReviews.reduce(
    (sum, review: any) => sum + (review.rating || 0),
    0
  );

  const averageRating =
    contractorReviews.length > 0
      ? totalRatings / contractorReviews.length
      : 0;

  return {
    ...(contractorData as Contractor), // ensure type safety
    id: contractorId,
    averageRating,
    reviewCount: contractorReviews.length,
  };
});

      setAllContractors(contractors);
    } catch (error) {
      console.error("Failed to fetch contractors from Firestore:", error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchContractorsFromFirestore();
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
      {/* My Favorite Contractors Section */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary font-headline">My Favorite Contractors</h1>
        <p className="text-muted-foreground mt-2">Your hand-picked list of top professionals.</p>
      </header>
      <section className="mb-12">
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

      {/* All Contractors from Firestore */}
      <header className="mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-primary font-headline">
          <Users className="w-6 h-6" /> All Contractors
        </h2>
        <p className="text-muted-foreground mt-1">Browse all verified contractors available.</p>
      </header>
      <section>
        {isLoading ? (
          renderSkeletons()
        ) : allContractors.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No contractors found in Firestore.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allContractors.map((contractor) => (
              <ContractorCard key={contractor.id} contractor={contractor} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
