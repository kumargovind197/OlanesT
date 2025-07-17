"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/context/i18n-context";
import React, { useEffect, useState } from 'react';

export default function TermsOfServicePage() {
  const { t } = useI18n();
  const [clientFormattedDate, setClientFormattedDate] = useState('');

  useEffect(() => {
    setClientFormattedDate(new Date().toLocaleDateString(t('common.appName') === 'OlaNest' ? 'en-US' : 'fr-CA', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, [t]);

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary font-headline">{t('pages.termsOfService.title')}</CardTitle>
          <p className="text-muted-foreground pt-2">{t('pages.termsOfService.lastUpdated')} {clientFormattedDate || '...'}</p>
        </CardHeader>
        <CardContent className="prose prose-lg max-w-none dark:prose-invert">
          <h2 className="font-headline">{t('common.agreementToTerms', {defaultValue: "1. Agreement to Terms"})}</h2>
          <p>
            By using {t('common.appName')} (the "Service"), you agree to be bound by these Terms of Service ("Terms").
            If you disagree with any part of the terms, then you may not access the Service.
          </p>

          <h2 className="font-headline">{t('common.descriptionOfService', {defaultValue: "2. Description of Service"})}</h2>
          <p>
            {t('common.appName')} is a platform that connects homeowners with contractors for renovation projects.
            We facilitate introductions but are not a party to any agreements made between homeowners and contractors.
          </p>

          <h2 className="font-headline">{t('common.userAccounts', {defaultValue: "3. User Accounts"})}</h2>
          <p>
            When you create an account with us, you must provide information that is accurate, complete, and current at all times.
            Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
            You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
          </p>

          <h2 className="font-headline">{t('common.licenseVerification', {defaultValue: "4. License Verification"})}</h2>
          <p>
            Contractors are required to submit valid license information for verification. {t('common.appName')} attempts to verify this information
            but does not guarantee the accuracy or validity of any license. Homeowners are encouraged to conduct their own due diligence.
          </p>

          <h2 className="font-headline">{t('common.ratingsAndReviews', {defaultValue: "5. Ratings and Reviews"})}</h2>
          <p>
            Users may post ratings and reviews. You are solely responsible for the content you post.
            {t('common.appName')} reserves the right to remove content that is deemed inappropriate, offensive, or violates these Terms.
          </p>
          
          <h2 className="font-headline">{t('common.changesToTerms', {defaultValue: "6. Changes to Terms"})}</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
            If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect.
          </p>

          <h2 className="font-headline">{t('common.contactUs', {defaultValue: "7. Contact Us"})}</h2>
          <p>
            If you have any questions about these Terms, please contact us at support@olanest.link.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
