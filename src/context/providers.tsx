"use client";

import { AuthProvider } from "./auth-context";
import { I18nProvider } from "./i18n-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <I18nProvider>
        {children}
      </I18nProvider>
    </AuthProvider>
  );
}
