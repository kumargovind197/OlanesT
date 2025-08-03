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
  contractor: Contractor & {
    averageRating?: number;
    reviewCount?: number;
  };
}

export function ContractorCard({ contractor }: ContractorCardProps) {
  const { name, profilePictureUrl, averageRating, reviews, socialLinks, website, location, serviceCategories, id } = contractor;

  const hasSocials = socialLinks?.facebook || socialLinks?.instagram || website;
  const categoryList = serviceCategories ?? [];

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border">
            <AvatarImage src={profilePictureUrl} alt={name || 'Contractor'} />
            <AvatarFallback>{name?.charAt(0) || '?'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-bold text-lg font-headline text-primary">{name || 'Unnamed Contractor'}</h3>
            <div className="flex items-center gap-1 mt-1">
              <RatingStars rating={averageRating || 0} />
              {reviews && (
                <span className="text-xs text-muted-foreground">
                  ({reviews.length} reviews)
                </span>
              )}
            </div>

            {/* Social Media Links */}
            {hasSocials && (
              <div className="flex gap-3 mt-2 text-muted-foreground">
                {socialLinks?.facebook && (
                  <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <Facebook className="h-4 w-4 hover:text-primary transition-colors" />
                  </a>
                )}
                {socialLinks?.instagram && (
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <Instagram className="h-4 w-4 hover:text-primary transition-colors" />
                  </a>
                )}
                {website && (
                  <a href={website} target="_blank" rel="noopener noreferrer" aria-label="Website">
                    <LinkIcon className="h-4 w-4 hover:text-primary transition-colors" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="space-y-2 text-sm text-muted-foreground flex-grow">
          {location && (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{location}</span>
            </div>
          )}
          {categoryList.length > 0 && (
            <div className="flex items-start gap-2">
              <Briefcase className="h-4 w-4 mt-0.5 shrink-0" />
              <p className="line-clamp-2">
                {categoryList.slice(0, 2).join(', ')}
                {categoryList.length > 2 ? '...' : ''}
              </p>
            </div>
          )}
        </div>

        <div className="mt-4">
          <Button asChild className="w-full">
            <Link href={`/contractor/${id}`}>View Profile</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
