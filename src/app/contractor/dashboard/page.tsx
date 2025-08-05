"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserCog, BarChart3, UserPlus, Briefcase, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useI18n } from "@/context/i18n-context"; 
import { useState ,useEffect} from "react";
import { db } from "@/firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// Mock data for a contractor - in a real app, this would come from auth/API
// To simulate a user who is NOT yet a contractor, set 'contractor' to null:
// const contractor = null;
const auth = getAuth();
const contractorId = auth.currentUser?.uid;
export default function ContractorDashboardPage() {
 const { t } = useI18n();
  const [status, setStatus] = useState<"pending" | "approved" | "rejected" | null>(null);
  const [contractorName, setContractorName] = useState("Contractor");
const [hasSubmittedLicense, setHasSubmittedLicense] = useState(false);

 useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      const contractorId = user.uid;

      const q = query(
        collection(db, "AdminApproveLicense"),
        where("contractorId", "==", contractorId)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setHasSubmittedLicense(true); // ✅ License was submitted
        setStatus(data.status);
        setContractorName(data.contractorName || "Contractor");
      } else {
        // ❌ No license submitted — don't show any card
        setHasSubmittedLicense(false);
        setStatus(null); // Optionally reset status
      }
    }
  });

  return () => unsubscribe();
}, []);


  const renderStatusCard = () => {
    switch (status) {
      case "approved":
        return (
          <Card className="mb-6 bg-green-50 border-green-300 dark:bg-green-900/30 dark:border-green-700">
            <CardHeader className="flex flex-row items-center gap-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <CardTitle className="text-green-700 dark:text-green-400">License Approved</CardTitle>
                <CardDescription className="text-green-600 dark:text-green-500">
                  Your license has been successfully approved.
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        );

      case "rejected":
        return (
          <Card className="mb-6 bg-red-50 border-red-300 dark:bg-red-900/30 dark:border-red-700">
            <CardHeader className="flex flex-row items-center gap-4">
              <XCircle className="h-8 w-8 text-red-500" />
              <div>
                <CardTitle className="text-red-700 dark:text-red-400">License Rejected</CardTitle>
                <CardDescription className="text-red-600 dark:text-red-500">
                  Your license was rejected. Please review and resubmit.
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        );

      default:
        return (
          <Card className="mb-6 bg-yellow-50 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700">
            <CardHeader className="flex flex-row items-center gap-4">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <div>
                <CardTitle className="text-yellow-700 dark:text-yellow-400">License Verification Pending</CardTitle>
                <CardDescription className="text-yellow-600 dark:text-yellow-500">
                  Your license is under review. Some features might be limited.
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary font-headline">Contractor Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back, {contractorName}!</p>
      </header>

      {hasSubmittedLicense && renderStatusCard()}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 font-headline">
              <UserCog className="text-accent h-6 w-6" /> Profile Management
            </CardTitle>
            <CardDescription>
              Update your services, bio, availability, and license information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/contractor/profile">Go to Profile</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 font-headline">
              <BarChart3 className="text-accent h-6 w-6" /> Reviews & Ratings
            </CardTitle>
            <CardDescription>
              See what homeowners are saying about your services.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/contractor/reviews">View Reviews</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}