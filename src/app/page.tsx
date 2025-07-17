
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/context/i18n-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, UserSearch, Star, MapPin } from "lucide-react";
import { useRouter } from 'next/navigation';
import { serviceCategories, canadianProvincesAndCities } from '@/lib/data';
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export default function HomePage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [selectedProvince, setSelectedProvince] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const router = useRouter();
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [provinceSearchTerm, setProvinceSearchTerm] = useState('');
  const [citySearchTerm, setCitySearchTerm] = useState('');

  useEffect(() => {
    if (selectedProvince) {
      const provinceData = canadianProvincesAndCities.find(p => p.province === selectedProvince);
      setCities(provinceData ? provinceData.cities : []);
    } else {
      setCities([]);
    }


  const handleSearch = () => {
    if (!selectedCategory || !selectedProvince || !selectedCity) {
      toast({
        title: t('toast.searchErrorTitle'),
        description: t('toast.searchErrorDescription'),
        variant: "destructive",
      });
      return;
    }

    const queryParams = new URLSearchParams();
    queryParams.append('category', selectedCategory);
    queryParams.append('province', selectedProvince);
    queryParams.append('city', selectedCity);
    router.push(`/homeowner/search?${queryParams.toString()}`);
  };

    setSelectedCity('');
  }, [selectedProvince]); // Correctly ending the useEffect hook

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you would use these coordinates with a reverse geocoding API
          // to determine the city and province.
          console.log('Latitude:', position.coords.latitude);
          console.log('Longitude:', position.coords.longitude);
          toast({
            title: "Location Detected",
            description: "This feature is for demonstration. Your coordinates are in the console.",
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast({
            title: "Location Error",
            description: "Could not retrieve your location. Please ensure location services are enabled.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Unsupported Feature",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = () => {
    if (!selectedCategory || !selectedProvince || !selectedCity) {
      toast({
        title: t('toast.searchErrorTitle'),
        description: t('toast.searchErrorDescription'),
        variant: "destructive",
      });
      return;
    }

    const queryParams = new URLSearchParams();
    queryParams.append('category', selectedCategory);
    queryParams.append('province', selectedProvince);
    queryParams.append('city', selectedCity);
    router.push(`/homeowner/search?${queryParams.toString()}`);
  };


  const features = [
    {
      icon: <UserSearch className="h-10 w-10 text-primary" />,
      titleKey: "pages.home.feature1Title",
      descriptionKey: "pages.home.feature1Description",
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-primary" />,
      titleKey: "pages.home.feature2Title",
      descriptionKey: "pages.home.feature2Description",
    },
    {
      icon: <Star className="h-10 w-10 text-primary" />,
      titleKey: "pages.home.feature3Title",
      descriptionKey: "pages.home.feature3Description",
    },
  ];

  return (
    <div className="flex flex-col">
      <section className="relative w-full pb-8 lg:pb-12 bg-background">
        <div className="container mx-auto text-center px-4">
 <Image src="/olanest_home.png" alt="OlaNest" width={0} height={0} sizes="100vw" className="mx-auto mt-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 h-auto" />
 <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
            {t('pages.home.heroDescription')}
          </p>
          <div className="max-w-4xl mx-auto mt-6 p-6 sm:p-8 bg-card rounded-xl shadow-lg border">
            <div className="grid grid-cols-1 gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full h-12 text-base">
                  <SelectValue placeholder={t("pages.home.serviceCategoryPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2">
                    <Input
                      value={categorySearchTerm}
                      onChange={(e) => setCategorySearchTerm(e.target.value)}
                      placeholder="Search services..."
                      className="w-full"
                    />
                  </div>
                  {serviceCategories
                    .filter(category => t(`serviceCategory.${category.toLowerCase().replace(/\s+/g, '').replace(/\(masonry\)/g, 'masonry')}`).toLowerCase().includes(categorySearchTerm.toLowerCase()))
                    .map((category) => (
                      <SelectItem key={category} value={category}>
                        {t(`serviceCategory.${category.toLowerCase().replace(/\s+/g, '').replace(/\(masonry\)/g, 'masonry')}`)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            
              <div className="grid grid-cols-[auto,1fr,1fr] gap-4 items-center">
                <Button variant="outline" size="icon" onClick={handleLocateMe} className="h-12 w-full sm:w-12 shrink-0">
                  <MapPin className="h-5 w-5"/>
                  <span className="sr-only">Locate Me</span>
                </Button>
                <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder={t('pages.home.provincePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2">
                      <Input
                        value={provinceSearchTerm}
                        onChange={(e) => setProvinceSearchTerm(e.target.value)}
                        placeholder="Search provinces..."
                      />
                    </div>
                    {canadianProvincesAndCities.filter(p => p.province.toLowerCase().includes(provinceSearchTerm.toLowerCase())).map((p) => (
                      <SelectItem key={p.province} value={p.province}>{p.province}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedCity} onValueChange={setSelectedCity} disabled={!selectedProvince}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder={t('pages.home.cityPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                     <div className="p-2">
                        <Input
                          value={citySearchTerm}
                          onChange={(e) => setCitySearchTerm(e.target.value)}
                          placeholder="Search cities..."
                        />
                      </div>
                    {cities.filter(city => city.toLowerCase().includes(citySearchTerm.toLowerCase())).map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button size="lg" className="text-base font-semibold bg-accent hover:bg-accent/90 text-accent-foreground w-full" onClick={handleSearch}>
                {t("pages.home.findContractorButton")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="pt-8 sm:pt-12 pb-24 sm:pb-32 bg-secondary/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-accent font-headline">{t('pages.home.whyOlaNest')}</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl font-headline">
              {t('pages.home.everythingYouNeed')}
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={t(feature.titleKey)} className="flex flex-col items-center text-center p-6 rounded-lg hover:bg-card transition-colors duration-300 transform hover:-translate-y-2 hover:shadow-xl">
                  <div className="mb-4 p-3 bg-primary/10 rounded-full">{feature.icon}</div>
                  <dt className="text-lg font-semibold leading-7 text-foreground font-headline">
                    {t(feature.titleKey)}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-muted-foreground">
                    {t(feature.descriptionKey)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}
