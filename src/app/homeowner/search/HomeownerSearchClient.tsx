"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/i18n-context";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin } from "lucide-react";
import { useSearchParams } from 'next/navigation';
import { mockContractors } from '@/lib/data';
import React, { useMemo } from "react";
import type { Contractor } from "@/types";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function HomeownerSearchClient() {
  const { t } = useI18n();
  const searchParams = useSearchParams();

  const category = searchParams.get('category');
  const province = searchParams.get('province');
  const city = searchParams.get('city');

  const filteredContractors = useMemo(() => {
    if (category && province && city) {
      return mockContractors.filter(contractor =>
        contractor.serviceCategories.includes(category) &&
        contractor.location?.includes(city) &&
        contractor.location?.includes(province)
      );
    }
    return [];
  }, [category, province, city]);

  const hasSearchParams = Boolean(category || province || city);
  const translatedCategory = category ? t(`serviceCategory.${category.toLowerCase().replace(/\s+/g, '').replace(/\(masonry\)/g, 'masonry')}`) : '';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold font-headline">{t('pages.search.title')}</h1>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/">
            {t('pages.search.startNewSearch')}
          </Link>
        </Button>
      </div>

      <div className="mb-8 p-4 bg-secondary/50 rounded-lg">
        {hasSearchParams && category && province && city ? (
          <p className="text-muted-foreground">
            {t('pages.search.showingResultsFor')}{' '}
            <span className="font-semibold text-foreground">{translatedCategory}</span>
            {' '}{t('pages.search.in')}{' '}
            <span className="font-semibold text-foreground">{city}, {province}</span>.
          </p>
        ) : (
          <p className="text-muted-foreground">{t('pages.search.performSearchPrompt')}</p>
        )}
      </div>

      <div className="space-y-6">
        {filteredContractors.length > 0 ? (
          filteredContractors.map(contractor => (
            <Card key={contractor.id} className="flex flex-col sm:flex-row items-center p-6 shadow-lg">
              <Avatar className="h-24 w-24 rounded-full mb-4 sm:mb-0 sm:mr-6 border">
                <AvatarImage src={contractor.profilePictureUrl || undefined} alt={contractor.name} />
                <AvatarFallback>{contractor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow text-center sm:text-left">
                <h3 className="text-xl font-semibold font-headline">{contractor.name}</h3>
                <p className="text-muted-foreground flex items-center justify-center sm:justify-start text-sm mb-2">
                  <MapPin className="h-4 w-4 mr-1"/> {contractor.location}
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-2">
                  {contractor.serviceCategories.map(cat => (
                    <Badge key={cat} variant="secondary">{t(`serviceCategory.${cat.toLowerCase().replace(/\s+/g, '').replace(/\(masonry\)/g, 'masonry')}`)}</Badge>
                  ))}
                </div>
                 {contractor.reviews && contractor.reviews.length > 0 && (
                  <div className="flex items-center justify-center sm:justify-start text-sm text-muted-foreground">
                    <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500"/>
                    <span>{contractor.averageRating?.toFixed(1) || 'N/A'} ({contractor.reviews.length} {t('pages.search.reviews')})</span>
                  </div>
                )}
                {(!contractor.reviews || contractor.reviews.length === 0) && (
                   <div className="flex items-center justify-center sm:justify-start text-sm text-muted-foreground">
                    <Star className="h-4 w-4 text-yellow-500 mr-1"/>
                    <span>{t('pages.search.noReviews')}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-auto">
                <Link href={`/contractor/${contractor.id}`}>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">{t('pages.search.viewProfileButton')}</Button>
                </Link>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center text-muted-foreground text-lg p-8">
             {hasSearchParams ? t('pages.search.noContractorsFound') : t('pages.search.performSearchPrompt')}
          </div>
        )}
      </div>
    </div>
  );
}
