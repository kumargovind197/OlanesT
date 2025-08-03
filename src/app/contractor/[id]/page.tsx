
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockContractors, mockReviews } from "@/lib/data";
import type { Contractor } from "@/types";
import { Briefcase, CalendarDays, Languages, MapPin, CheckCircle, AlertTriangle, Link as LinkIcon, Facebook, Instagram, Phone, Mail } from "lucide-react";
import { RatingStars } from "@/components/shared/rating-stars";
import { ReviewCard } from "@/components/review/review-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ContractorProfileClient } from "@/components/contractor/ContractorProfileClient";
import { WriteReview } from "@/components/review/WriteReview";
import { Separator } from "@/components/ui/separator";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
// This function would typically fetch data from a database
async function getContractorData(id: string): Promise<Contractor | null> {
  try {
    const docRef = doc(db, "ContractorProfile", id);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data();

    const contractor: Contractor = {
      id: snapshot.id,
      name: data.name || "",
      email: data.email || "",
      serviceCategories: data.serviceCategories || [],
      city: data.city || "",
      province: data.province || "",
      location: data.location || "",
      bio: data.bio || "",
      profilePictureUrl: data.profilePictureUrl || "",
      profilePictureStatus: data.profilePictureStatus || "approved",
      averageRating: data.averageRating || 0,
      reviews: mockReviews.filter(r => r.revieweeId === snapshot.id), // ✅ Mock reviews
      languagePreferences: data.languagePreferences || [],
      licenseNumber: data.licenseNumber || "",
      isLicenseApproved: data.isLicenseApproved || false,
      availability: data.availability || "",
      phone: data.phone || "",
      website: data.website || "",
      socialLinks: data.socialLinks || {},
    };

    return contractor;
  } catch (error) {
    console.error("Error fetching contractor:", error);
    return null;
  }
}
async function checkInitialFavoriteStatus(contractorId: string): Promise<boolean> {
  // In a real app, you would check the logged-in user's favorites from a database
  console.log(`Checking favorite status for ${contractorId}`);
  return contractorId === 'contractor1'; // Mock: contractor1 is favorited by default
}

interface ContractorProfilePageProps {
  params: { id: string };
}

export default async function ContractorProfilePage({ params }: ContractorProfilePageProps) {
  const { id } = params;
  const contractor = await getContractorData(id);
  const initialIsFavorited = await checkInitialFavoriteStatus(id);

  if (!contractor) {
    return (
      <div className="container mx-auto px-4 py-12 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold font-headline">Contractor Not Found</h1>
        <p className="text-muted-foreground mt-2">The contractor profile you are looking for does not exist.</p>
        <Button asChild className="mt-4">
          <Link href="/homeowner/search">Back to Search</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Contractor Info */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
          <Card className="shadow-lg relative">
            <ContractorProfileClient contractorId={id} initialIsFavorited={initialIsFavorited} contractorName={contractor.name} />
            <CardHeader className="items-center text-center p-6">
              <Avatar className="h-32 w-32 border-4 border-primary mb-4">
                <AvatarImage src={contractor.profilePictureUrl} alt={contractor.name} data-ai-hint="person portrait" />
                <AvatarFallback className="text-4xl">{contractor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <CardTitle className="text-2xl font-bold font-headline">{contractor.name}</CardTitle>

              <div className="text-sm text-muted-foreground mt-2">
                {contractor.licenseNumber && `License #: ${contractor.licenseNumber}`}
              </div>
              {contractor.licenseNumber && (
                <div>
                  {contractor.isLicenseApproved ? (
                    <Badge variant="default" className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200 flex items-center gap-1.5">
                        <CheckCircle className="h-4 w-4" />
                        <span>Verified</span>
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200 flex items-center gap-1.5">
                        <AlertTriangle className="h-4 w-4" />
                        <span>License Pending</span>
                    </Badge>
                  )}
                </div>
              )}
               <div className="flex items-center pt-2 gap-2">
                <RatingStars rating={contractor.averageRating} size={20} />
                <span className="text-muted-foreground">({contractor.reviews.length} reviews)</span>
              </div>

            </CardHeader>
            <CardContent className="space-y-4 text-sm p-6 pt-0">
              {contractor.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 mt-0.5 text-accent shrink-0" />
                  <a href={`tel:${contractor.phone.replace(/\s/g, '')}`} className="text-muted-foreground hover:text-primary">{contractor.phone}</a>
                </div>
              )}
               <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 mt-0.5 text-accent shrink-0" />
                  <a href={`mailto:${contractor.email}`} className="text-muted-foreground hover:text-primary break-all">{contractor.email}</a>
                </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 text-accent shrink-0" />
                <span className="text-muted-foreground">{contractor.location}</span>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="h-5 w-5 mt-0.5 text-accent shrink-0" />
                <span className="text-muted-foreground">{contractor.serviceCategories.join(', ')}</span>
              </div>
              {contractor.languagePreferences && contractor.languagePreferences.length > 0 && (
                <div className="flex items-start gap-3">
                  <Languages className="h-5 w-5 mt-0.5 text-accent shrink-0" />
                  <span className="text-muted-foreground">{contractor.languagePreferences.map(lang => lang.charAt(0).toUpperCase() + lang.slice(1)).join(', ')}</span>
                </div>
              )}
               {contractor.availability && (
                <div className="flex items-start gap-3">
                  <CalendarDays className="h-5 w-5 mt-0.5 text-accent shrink-0" />
                  <span className="text-muted-foreground">{contractor.availability}</span>
                </div>
              )}

              {(contractor.website || contractor.socialLinks?.facebook || contractor.socialLinks?.instagram) && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-3">
                    <h4 className="font-semibold">Contractor's Links</h4>
                    {contractor.website && (
                       <a href={contractor.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group text-muted-foreground hover:text-primary">
                          <LinkIcon className="h-5 w-5 mt-0.5 text-accent shrink-0 group-hover:text-primary" />
                          <span className="truncate">{contractor.website.replace(/^https?:\/\//, '')}</span>
                       </a>
                    )}
                    {contractor.socialLinks?.facebook && (
                       <a href={contractor.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group text-muted-foreground hover:text-primary">
                          <Facebook className="h-5 w-5 mt-0.5 text-accent shrink-0 group-hover:text-primary" />
                          <span>Facebook</span>
                       </a>
                    )}
                    {contractor.socialLinks?.instagram && (
                       <a href={contractor.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group text-muted-foreground hover:text-primary">
                          <Instagram className="h-5 w-5 mt-0.5 text-accent shrink-0 group-hover:text-primary" />
                          <span>Instagram</span>
                       </a>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Bio and Reviews */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">About {contractor.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 whitespace-pre-wrap">{contractor.bio || "No detailed bio provided by this contractor."}</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">Client Reviews</CardTitle>
              <CardDescription>See what others are saying about {contractor.name}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <WriteReview contractorId={contractor.id} contractorName={contractor.name} />
              {contractor.reviews.length > 0 ? (
                contractor.reviews.map(review => (
                  <ReviewCard key={review.id} review={review} />
                ))
              ) : (
                <p className="text-muted-foreground pt-4 text-center">This contractor has no reviews yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// This is required for dynamic routes in App Router if not using generateStaticParams
export const dynamic = 'force-dynamic';
