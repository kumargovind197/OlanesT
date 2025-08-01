"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { canadianProvincesAndCities, mockContractors, serviceCategories } from '@/lib/data';
import type { Contractor, Language } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, CheckCircle, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getDoc, doc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { getAuth } from "firebase/auth";

const languages: Language[] = ['english', 'french'];

// Mock current contractor data here 
const currentContractor: Contractor | undefined = mockContractors.find(c => c.id === 'contractor1');

const profileFormSchema = z.object({
  name: z.string().min(2, "Name is too short."),
  email: z.string().email(),
  bio: z.string().max(500, "Bio is too long.").optional(),
  province: z.string().min(1, { message: "Please select a province." }),
  city: z.string().min(1, { message: "Please select a city." }),
  serviceCategories: z.array(z.string()).refine(value => value.some(item => item), {
    message: "You have to select at least one service category.",
  }),
  languagePreferences: z.array(z.string()).optional(),
  licenseNumber: z.string().min(3, "License number is required.").optional(),
  availability: z.string().optional(),
  profilePicture: z.any().optional().nullable(),
  phone: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ContractorProfilePage() {
  const { toast } = useToast();
  
  if (!currentContractor) {
    return <div>Loading contractor data or contractor not found...</div>;
  }
  
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(currentContractor.profilePictureUrl || null);
  const [citiesForProvince, setCitiesForProvince] = useState<string[]>([]);

  const [initialCity, initialProvince] = currentContractor.location?.split(', ') || ['', ''];

  useEffect(() => {
    if (initialProvince) {
      const provinceData = canadianProvincesAndCities.find(p => p.province === initialProvince);
      setCitiesForProvince(provinceData ? provinceData.cities : []);
    }
  }, [initialProvince]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: currentContractor.name,
      email: currentContractor.email,
      bio: currentContractor.bio ?? "",
      province: initialProvince,
      city: initialCity,
      serviceCategories: currentContractor.serviceCategories,
      languagePreferences: currentContractor.languagePreferences || [],
      licenseNumber: currentContractor.licenseNumber || "",
      availability: currentContractor.availability || "",
      profilePicture: null,
      phone: currentContractor.phone || "",
      website: currentContractor.website || "",
      facebook: currentContractor.socialLinks?.facebook || "",
      instagram: currentContractor.socialLinks?.instagram || "",
    },
  });

  const watchProvince = form.watch("province");
  useEffect(() => {
      const provinceData = canadianProvincesAndCities.find(p => p.province === watchProvince);
      setCitiesForProvince(provinceData ? provinceData.cities : []);
      if(form.getValues('province') !== initialProvince) {
        form.setValue('city', ''); 
      }
  }, [watchProvince, form, initialProvince]);

async function onSubmit(data: ProfileFormValues) {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    toast({
      title: "Authentication Error",
      description: "You must be logged in to update your profile.",
      variant: "destructive",
    });
    return;
  }

  const userId = currentUser.uid;

  try {
    const userDocRef = doc(db, "users", userId); // ✅ One document per UID

    await setDoc(userDocRef, {
      name: data.name,
      bio: data.bio ?? "",
      city: `${data.city}`,
      province: `${data.province}`,
      serviceCategories: data.serviceCategories,
      languagePreferences: data.languagePreferences ?? [],
      licenseNumber: data.licenseNumber ?? "",
      availability: data.availability ?? "",
      phone: data.phone ?? "",
      website: data.website ?? "",
      socialLinks: {
        facebook: data.facebook ?? "",
        instagram: data.instagram ?? "",
      },
      updatedAt: new Date(),
    }, { merge: true }); // ✅ merge: true ensures it updates, not overwrite

    toast({
      title: "Profile Updated",
      description: "Your contractor profile has been saved successfully.",
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    toast({
      title: "Update Failed",
      description: "Something went wrong while saving your profile.",
      variant: "destructive",
    });
  }
}


  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary font-headline">Manage Your Profile</h1>
        <p className="text-muted-foreground mt-2">Keep your information up-to-date to attract more homeowners.</p>
      </header>

      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold font-headline">Edit Profile</CardTitle>
          <CardDescription>Update your personal and business information.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col items-center gap-4 mb-6">
                 <Avatar className="h-24 w-24">
                    <AvatarImage src={profilePicturePreview || currentContractor?.profilePictureUrl} alt={`${currentContractor?.name}'s profile picture`} />
                    <AvatarFallback>{currentContractor?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <FormField
                    control={form.control}
                    name="profilePicture"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Profile Picture</FormLabel>
                        <FormControl>
                           <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setProfilePicturePreview(reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                  field.onChange(file);
                                } else {
                                   setProfilePicturePreview(currentContractor?.profilePictureUrl || null);
                                   field.onChange(null);
                                }
                              }}
                           />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your business name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the name that will be displayed on your profile.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Your email address" {...field} disabled />
                    </FormControl>
                    <FormDescription>
                      Email address is used for communication and cannot be changed here.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell homeowners about your business and services" {...field} rows={5} />
                    </FormControl>
                    <FormDescription>
                      Briefly describe your business, experience, and unique selling points.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Province</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a province" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {canadianProvincesAndCities.map(p => (
                            <SelectItem key={p.province} value={p.province}>{p.province}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={!watchProvince}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a city" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           {citiesForProvince.map(city => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
             </div>

              <FormField
                control={form.control}
                name="licenseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Your license number (optional)" {...field} />
                    </FormControl>
                     <FormDescription className="flex items-center gap-2">
                        {currentContractor?.isLicenseApproved ? (
                           <><CheckCircle className="h-4 w-4 text-green-500" /> <span className="text-green-600">License Verified</span></>
                        ) : (
                           <><AlertTriangle className="h-4 w-4 text-yellow-500" /> <span className="text-yellow-600">Verification Pending or Required</span></>
                        )}
                        Provide your license number for verification to build trust with homeowners.
                      </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serviceCategories"
                render={() => (
                  <FormItem>
                    <FormLabel>Service Categories</FormLabel>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {serviceCategories.map((category) => (
                        <FormField
                          key={category}
                          control={form.control}
                          name="serviceCategories"
                          render={({ field }) => {
                            const translatedCategory = category.toLowerCase().replace(/\s+/g, '').replace(/\(masonry\)/g, 'masonry');
                            return (
                              <FormItem key={category} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(category)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, category])
                                        : field.onChange(field.value?.filter(value => value !== category));
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-sm cursor-pointer">
                                  {translatedCategory}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormDescription>
                      Select the types of services you offer.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

             <FormField
                control={form.control}
                name="languagePreferences"
                render={() => (
                  <FormItem>
                    <FormLabel>Language Preferences</FormLabel>
                     <div className="flex items-center gap-4">
                       {languages.map((language) => (
                          <FormField
                            key={language}
                            control={form.control}
                            name="languagePreferences"
                            render={({ field }) => (
                              <FormItem key={language} className="flex flex-row items-start space-x-2 space-y-0">
                               <FormControl>
                                <Checkbox
                                  checked={(field.value ?? []).includes(language)}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value ?? [];
                                      return checked
                                      ? field.onChange([...currentValues, language])
                                      : field.onChange(currentValues.filter((value) => value !== language));
                                  }}
                                />
                                 </FormControl>

                                <FormLabel className="font-normal text-sm cursor-pointer capitalize">
                                  {language}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                       ))}
                     </div>
                    <FormDescription>
                      Select the languages you are comfortable communicating in.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
             />

             {/* New Contact Information Section */}
             <div className="space-y-6">
               <h3 className="text-lg font-semibold leading-none tracking-tight">Contact Information</h3>

               <FormField
                 control={form.control}
                 name="phone"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Phone Number</FormLabel>
                     <FormControl>
                       <Input placeholder="Your phone number (optional)" {...field} />
                     </FormControl>
                     <FormDescription>
                       Provide a phone number for homeowners to contact you directly.
                     </FormDescription>
                     <FormMessage />
                   </FormItem>
                 )}
               />

               <FormField
                 control={form.control}
                 name="website"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Website</FormLabel>
                     <FormControl>
                       <Input placeholder="Link to your website (optional)" {...field} />
                     </FormControl>
                     <FormDescription>
                       Link to your official business website.
                     </FormDescription>
                     <FormMessage />
                   </FormItem>
                 )}
               />

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <FormField
                   control={form.control}
                   name="facebook"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Facebook Link</FormLabel>
                       <FormControl>
                         <Input placeholder="Link to your Facebook page (optional)" {...field} />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
                 <FormField
                   control={form.control}
                   name="instagram"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Instagram Link</FormLabel>
                       <FormControl>
                         <Input placeholder="Link to your Instagram profile (optional)" {...field} />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
               </div>
             </div>

              {/* Availability and other fields can be added here following the same pattern */}

              <Button type="submit"><Save className="mr-2 h-4 w-4"/> Save Changes</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
