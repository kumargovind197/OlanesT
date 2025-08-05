"use client";

import { ContactForm } from "@/components/layout/contactus";


export default function ContactPage() {
  return (
    <div className="flex justify-center items-start min-h-screen px-4 py-12 bg-background">
      <div className="w-full max-w-lg space-y-6 bg-white dark:bg-background border rounded-lg shadow-md p-6">
        <div>
          <h1 className="text-2xl font-bold font-headline mb-2">Contact Us</h1>
          <p className="text-muted-foreground text-sm">
            Have a question or feedback? Fill out the form below and we’ll get back to you soon.
          </p>
        </div>
      <ContactForm contractorEmail="test@example.com" contractorName="Test Contractor" />

      </div>
    </div>
  );
}
