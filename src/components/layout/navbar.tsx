"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useI18n } from "@/context/i18n-context";
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { LogOut, LayoutDashboard, Menu } from "lucide-react";
import { ContactForm } from "./contactus";

export function Navbar() {
  const { user, role, logout } = useAuth();
  const { t, language, setLanguage } = useI18n();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const getDashboardLink = () => {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'contractor':
        return '/contractor/dashboard';
      case 'homeowner':
        return '/homeowner/dashboard';
      default:
        return '/';
    }
  };

  const LanguageSwitcher = ({ isMobile = false }: { isMobile?: boolean }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={isMobile ? "w-full justify-start" : ""}>
          <span className="font-semibold">{language === 'en' ? 'EN' : 'FR'}</span>
          <span className="sr-only">{t('navbar.changeLanguage')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => setLanguage('en')} disabled={language === 'en'}>
          {t('common.english')}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setLanguage('fr')} disabled={language === 'fr'}>
          {t('common.french')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const navItems = (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader className="sr-only">
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>
              Main navigation menu containing links to other pages and user actions.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col space-y-4 pt-6">
        {user ? (
  <>
    <SheetClose asChild>
      <Link href={getDashboardLink()} className="flex items-center p-2 rounded-md hover:bg-accent">
        <LayoutDashboard className="h-4 w-4 mr-2" />
        {t('navbar.dashboard')}
      </Link>
    </SheetClose>
    <SheetClose asChild>
      <button onClick={handleLogout} className="w-full text-left flex items-center p-2 rounded-md hover:bg-accent">
        <LogOut className="mr-2 h-4 w-4" />
        <span>{t('navbar.logout')}</span>
      </button>
    </SheetClose>

   <SheetClose asChild>
  <Link href="/contact" className="block p-2 rounded-md hover:bg-accent">
    {t('ContactUs') || "Contact"}
  </Link>
</SheetClose>

  </>
) : (
  <>
    <SheetClose asChild>
      <Link href="/auth/login" className="block p-2 rounded-md hover:bg-accent">{t('navbar.login')}</Link>
    </SheetClose>
    <SheetClose asChild>
      <Link href="/auth/signup" className="block p-2 rounded-md hover:bg-accent">{t('navbar.signUp')}</Link>
    </SheetClose>
  </>
)}

            <div className="pt-4 border-t">
              <LanguageSwitcher isMobile={true} />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center space-x-2" aria-label="Home">
 <Image src="/olanestlogo.png" alt="OlaNest Logo" width={50} height={50}/>
 <Image src="/olanest_title2.png" alt="OlaNest" width={100} height={60}/>
 </Link>
        </div>
        
        {navItems}
      </div>
    </header>
  );
}
