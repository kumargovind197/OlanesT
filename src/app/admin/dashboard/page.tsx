"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockLicenseApplications } from "@/lib/data";
import type { LicenseApplication } from "@/types";
import { CheckCircle, XCircle, FileText, AlertTriangle, User } from "lucide-react";
import { format, parseISO, isValid } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useI18n } from '@/context/i18n-context';
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
export default function AdminLicenseApprovalPage() {
const [applications, setApplications] = useState<LicenseApplication[]>([]);

useEffect(() => {
  async function fetchApplications() {
    const snapshot = await getDocs(collection(db, "AdminApproveLicense"));
    const apps = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as LicenseApplication[];

    setApplications(apps);
  }

  fetchApplications();
}, []);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const { t } = useI18n();
const router = useRouter();

useEffect(() => {
  const auth = getAuth();

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user || user.email !== "admin123@olanest.com") {
      router.push("/auth/login"); 
    } else {
      setIsClient(true); // ✅ Only show content if admin
    }
  });

  return () => unsubscribe();
}, [router]);


 const handleApprove = async (id: string) => {
  const updatedAt = new Date().toISOString();
  const updatedApps = applications.map(app =>
    app.id === id
      ? {
          ...app,
          status: "approved" as "approved", // 👈 Type assertion
          reviewedAt: updatedAt,
        }
      : app
  );
  setApplications(updatedApps as LicenseApplication[]); // 👈 Array cast

  try {
    await updateDoc(doc(db, "AdminApproveLicense", id), {
      status: "approved",
      reviewedAt: updatedAt,
    });

    toast({
      title: "License Approved",
      description: `Application for ${applications.find(a => a.id === id)?.contractorName} marked as approved.`,
    });
  } catch (error) {
    console.error("Error approving license:", error);
  }
};

 const handleReject = async (id: string) => {
  const updatedAt = new Date().toISOString();
  const updatedApps = applications.map(app =>
    app.id === id
      ? {
          ...app,
          status: "rejected" as "rejected",
          reviewedAt: updatedAt,
          reviewerNotes: "Rejected by admin.",
        }
      : app
  );
  setApplications(updatedApps as LicenseApplication[]);

  try {
    await updateDoc(doc(db, "AdminApproveLicense", id), {
      status: "rejected",
      reviewedAt: updatedAt,
      reviewerNotes: "Rejected by admin.",
    });

    toast({
      title: "License Rejected",
      description: `Application for ${applications.find(a => a.id === id)?.contractorName} marked as rejected.`,
      variant: "destructive",
    });
  } catch (error) {
    console.error("Error rejecting license:", error);
  }
};

  const formatDate = (dateString: string | undefined, includeTime = false) => {
    if (!isClient || !dateString) return '...';
    try {
      const date = parseISO(dateString);
      if (isValid(date)) {
        return includeTime ? format(date, "MMM d, yyyy, HH:mm") : format(date, "MMM d, yyyy");
      }
    } catch (error) {
      return 'Invalid Date';
    }
    return 'Invalid Date';
  }

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const reviewedApplications = applications.filter(app => app.status !== 'pending');

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary font-headline">Contractor License Approvals</h1>
        <p className="text-muted-foreground mt-2">Review and manage pending license applications to ensure quality and trust on the platform.</p>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <AlertTriangle className="text-accent" /> Pending Applications ({pendingApplications.length})
          </CardTitle>
          <CardDescription>Review each application and approve or reject as necessary.</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingApplications.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contractor</TableHead>
                    <TableHead>License #</TableHead>
                    <TableHead>Profile</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-center">Document</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingApplications.map(app => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.contractorName}</TableCell>
                      <TableCell>{app.licenseNumber}</TableCell>
                      <TableCell>
                        <Button variant="link" asChild className="p-0 h-auto">
                          <Link href={`/contractor/${app.contractorId}`}>
                            <User className="mr-1 h-4 w-4" /> View
                          </Link>
                        </Button>
                      </TableCell>
                      <TableCell>{formatDate(app.submittedAt)}</TableCell>
                      <TableCell className="text-center">
                        {app.licenseDocumentUrl ? (
                          <Button variant="outline" size="sm" asChild>
                            <a href={app.licenseDocumentUrl} target="_blank" rel="noopener noreferrer">
                              <FileText className="h-4 w-4 mr-1" /> {t('common.view')}
                            </a>
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">{t('common.na')}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-100 hover:text-green-700" onClick={() => handleApprove(app.id)}>
                          <CheckCircle className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-100 hover:text-red-700" onClick={() => handleReject(app.id)}>
                          <XCircle className="h-4 w-4 mr-1" /> Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
             <div className="text-center py-10">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold">All Clear!</h3>
                <p className="text-muted-foreground mt-2">There are no pending license applications to review.</p>
              </div>
          )}
        </CardContent>
      </Card>
      
      {reviewedApplications.length > 0 && (
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Reviewed Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contractor</TableHead>
                    <TableHead>License #</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reviewed At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviewedApplications.map(app => (
                    <TableRow key={app.id}>
                      <TableCell>{app.contractorName}</TableCell>
                      <TableCell>{app.licenseNumber}</TableCell>
                      <TableCell>
                        <Badge variant={app.status === 'approved' ? 'default' : 'destructive'} 
                               className={app.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}>
                          {t(`common.${app.status}`)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(app.reviewedAt, true)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
