"use client"

import Link from "next/link";
import { useI18n } from "@/context/i18n-context";

export function Footer() {
    const { t } = useI18n();

    const footerLinks = [
        { href: "/privacy-policy", label: t('pages.privacyPolicy.title') },
        { href: "/terms-of-service", label: t('pages.termsOfService.title') },
    ];
    
    return (
        <footer className="bg-secondary/50">
            <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} {t('common.appName')}. {t('footer.allRightsReserved')}
                </p>
                <div className="flex items-center gap-4">
                    {footerLinks.map(link => (
                        <Link key={link.href} href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    );
}
