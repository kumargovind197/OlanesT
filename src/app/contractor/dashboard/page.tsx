"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserCog, BarChart3, UserPlus, Briefcase, AlertTriangle } from "lucide-react";
import { useI18n } from "@/context/i18n-context"; 

// Mock data for a contractor - in a real app, this would come from auth/API
// To simulate a user who is NOT yet a contractor, set 'contractor' to null:
// const contractor = null;

// To simulate a user who IS a contractor:
const contractor = {
  id: 'mock-contractor-123',
  name: "John Doe Renovations",
  isLicenseApproved: false, // Set to false to test the pending message
  unreadMessages: 3,
  pendingJobs: 2,
};

// const contractor = null; // Example: uncomment this line to see the "Join" prompt

export default function ContractorDashboardPage() {
  const { t } = useI18n(); 

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary font-headline">Contractor Dashboard</h1>
        {contractor ? (
          <p className="text-muted-foreground mt-2">Welcome back, {contractor.name}!</p>
        ) : (
          <p className="text-muted-foreground mt-2">Manage your services or join our network of professionals.</p>
        )}
      </header>

      {!contractor ? (
        <Card className="max-w-lg mx-auto shadow-xl border-2 border-dashed border-accent/50 bg-accent/5">
          <CardHeader className="text-center">
            <Briefcase className="h-12 w-12 mx-auto text-primary mb-4" />
            <CardTitle className="text-2xl font-bold text-primary font-headline">{t('pages.contractorDashboard.becomeContractorTitle')}</CardTitle>
            <CardDescription className="mt-2">
              Expand your business and connect with homeowners looking for your skills.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              Sign up today to create your profile, list your services, showcase your work, and start receiving project inquiries.
            </p>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/auth/signup">
                <UserPlus className="mr-2 h-5 w-5" /> {t('navbar.signUp')} 
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {!contractor.isLicenseApproved && (
            <Card className="mb-6 bg-yellow-50 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700">
              <CardHeader className="flex flex-row items-center gap-4">
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
                <div>
                  <CardTitle className="text-yellow-700 dark:text-yellow-400">License Verification Pending</CardTitle>
                  <CardDescription className="text-yellow-600 dark:text-yellow-500">
                    Your license is currently under review. You can update your profile, but some features might be limited.
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-headline"><UserCog className="text-accent h-6 w-6"/> Profile Management</CardTitle>
                 <CardDescription>Update your services, bio, availability, and license information.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/contractor/profile">Go to Profile</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-headline"><BarChart3 className="text-accent h-6 w-6"/> Reviews & Ratings</CardTitle>
                <CardDescription>See what homeowners are saying about your services and analyze feedback.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/contractor/reviews">View Reviews</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
