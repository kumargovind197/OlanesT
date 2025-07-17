"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/context/i18n-context";
import React, { useEffect, useState } from 'react';

export default function PrivacyPolicyPage() {
  const { t } = useI18n();
  const [clientFormattedDate, setClientFormattedDate] = useState('');

  useEffect(() => {
    setClientFormattedDate(new Date().toLocaleDateString(t('common.appName') === 'OlaNest' ? 'en-US' : 'fr-CA', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, [t]);

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary font-headline">{t('pages.privacyPolicy.title')}</CardTitle>
           <p className="text-muted-foreground pt-2">{t('pages.privacyPolicy.lastUpdated')} {clientFormattedDate || '...'}</p>
        </CardHeader>
        <CardContent className="prose prose-lg max-w-none dark:prose-invert">
          <h2 className="font-headline">{t('common.introduction', {defaultValue: "1. Introduction"})}</h2>
          <p>
            Welcome to {t('common.appName')}. We are committed to protecting your personal information and your right to privacy.
            If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information,
            please contact us.
          </p>

          <h2 className="font-headline">{t('common.informationWeCollect', {defaultValue: "2. Information We Collect"})}</h2>
          <p>
            We collect personal information that you voluntarily provide to us when you register on {t('common.appName')},
            express an interest in obtaining information about us or our products and services, when you participate
            in activities on {t('common.appName')} or otherwise when you contact us.
          </p>
          <p>
            The personal information that we collect depends on the context of your interactions with us and {t('common.appName')},
            the choices you make and the products and features you use. The personal information we collect may include the following:
          </p>
          <ul>
            <li>Personal Information Provided by You. We collect names; phone numbers; email addresses; mailing addresses; job titles; usernames; passwords; contact preferences; contact or authentication data; billing addresses; and other similar information.</li>
            <li>License Information for Contractors. If you are a contractor, we collect information related to your professional licenses for verification purposes.</li>
          </ul>

          <h2 className="font-headline">{t('common.howWeUseYourInformation', {defaultValue: "3. How We Use Your Information"})}</h2>
          <p>
            We use personal information collected via our {t('common.appName')} for a variety of business purposes described below.
            We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you,
            with your consent, and/or for compliance with our legal obligations.
          </p>

          <h2 className="font-headline">{t('common.contactUs', {defaultValue: "4. Contact Us"})}</h2>
          <p>
            If you have questions or comments about this notice, you may email us at privacy@olanest.link.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
