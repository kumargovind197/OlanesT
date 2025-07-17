export type ServiceCategory = string;
export type Language = 'english' | 'french';
export type UserRole = 'admin' | 'homeowner' | 'contractor';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Review {
  id: string;
  reviewerName: string;
  revieweeId: string; // The ID of the contractor being reviewed
  rating: number; // e.g., 4.5
  title: string;
  comment: string;
  createdAt: string; // ISO date string
  contractorComment?: string;
}

export interface Contractor {
  id: string;
  name: string;
  email: string;
  location: string; // e.g., "Toronto, ON"
  serviceCategories: ServiceCategory[];
  bio?: string;
  profilePictureUrl?: string;
  profilePictureStatus?: 'pending' | 'approved' | 'rejected';
  averageRating: number;
  reviews: Review[];
  languagePreferences?: Language[];
  licenseNumber?: string;
  isLicenseApproved: boolean;
  availability?: string;
  phone?: string;
  website?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
  };
}

export interface LicenseApplication {
  id: string;
  contractorId: string;
  contractorName: string;
  licenseNumber: string;
  licenseDocumentUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string; // ISO date string
  reviewedAt?: string; // ISO date string
  reviewerNotes?: string;
}
