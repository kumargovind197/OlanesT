'use client';

import type { Contractor } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RatingStars } from '@/components/shared/rating-stars';
import { MapPin, Briefcase, Facebook, Instagram, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

interface ContractorCardProps {
  contractor: Contractor;
}

export function ContractorCard({ contractor }: ContractorCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border">
            <AvatarImage src={contractor.profilePictureUrl} alt={contractor.name} data-ai-hint="person portrait" />
           <AvatarFallback>
  {contractor.name?.charAt(0) || "?"}
</AvatarFallback>

          </Avatar>
          <div className="flex-1">
            <h3 className="font-bold text-lg font-headline text-primary">{contractor.name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <RatingStars rating={contractor.averageRating} />
             {contractor?.reviews && (
  <span className="text-xs text-muted-foreground">
    ({contractor.reviews.length} reviews)
  </span>
)}

            </div>
            {/* Social Media Links */}
            {(contractor.socialLinks?.facebook || contractor.socialLinks?.instagram || contractor.website) && (
              <div className="flex justify-start gap-3 mt-2 text-muted-foreground">
                {contractor.socialLinks?.facebook && (
                  <a href={contractor.socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <Facebook className="h-4 w-4 transition-colors hover:text-primary" />
                  </a>
                )}
                {contractor.socialLinks?.instagram && (
                  <a href={contractor.socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <Instagram className="h-4 w-4 transition-colors hover:text-primary" />
                  </a>
                )}
                {contractor.website && (
                  <a href={contractor.website} target="_blank" rel="noopener noreferrer" aria-label="Website">
                    <LinkIcon className="h-4 w-4 transition-colors hover:text-primary" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="space-y-2 text-sm text-muted-foreground flex-grow">
         {(contractor.city || contractor.province) && (
  <div className="flex items-start gap-2">
    <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
    <p className="text-sm text-muted-foreground">
      {contractor.city}, {contractor.province}
    </p>
  </div>
)}

          <div className="flex items-start gap-2">
             <Briefcase className="h-4 w-4 mt-0.5 shrink-0" />
            <p className="line-clamp-2">
  {(contractor.serviceCategories ?? []).slice(0, 2).join(', ')}
  {(contractor.serviceCategories?.length ?? 0) > 2 ? '...' : ''}
</p>

          </div>
        </div>
        <div className="mt-4">
          <Button asChild className="w-full">
            <Link href={`/contractor/${contractor.id}`}>View Profile</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
