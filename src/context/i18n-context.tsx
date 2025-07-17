
"use client";

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';

type Language = 'en' | 'fr';

interface TranslationObject {
  [key: string]: string | TranslationObject;
}

interface Translations {
  en: TranslationObject;
  fr: TranslationObject;
}

const translations: Translations = {
  en: {
    common: {
      appName: 'OlaNest',
      loading: 'Loading...',
      error: 'Error',
      save: 'Save',
      cancel: 'Cancel',
      submit: 'Submit',
      view: 'View',
      edit: 'Edit',
      delete: 'Delete',
      search: 'Search',
      clearFilters: 'Clear Filters',
      status: 'Status',
      actions: 'Actions',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
      na: 'N/A', // Not Applicable
      all: 'All',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      english: 'English',
      french: 'Français',
      back: 'Back',
      introduction: "1. Introduction",
      informationWeCollect: "2. Information We Collect",
      howWeUseYourInformation: "3. How We Use Your Information",
      contactUs: "4. Contact Us",
      agreementToTerms: "1. Agreement to Terms",
      descriptionOfService: "2. Description of Service",
      userAccounts: "3. User Accounts",
      licenseVerification: "4. License Verification",
      ratingsAndReviews: "5. Ratings and Reviews",
      changesToTerms: "6. Changes to Terms",
    },
    navbar: {
      home: 'Home',
      messages: 'Messages',
      admin: 'Admin',
      login: 'Login',
      logout: 'Logout', // New
      signUp: 'Sign Up',
      changeLanguage: 'Change language',
      dashboard: 'Dashboard',
      unreadMessages: '{count, plural, =0 {No unread messages} =1 {# unread message} other {# unread messages}}',
    },
    pages: {
      home: {
        heroTitle: 'Your Home Improvement Journey Starts Here!',
        heroDescription: 'OlaNest connects homeowners with trusted professionals for all your home service needs. Find the right expert, efficiently.',
        findContractorButton: 'Find a Professional',
        searchIconAlt: 'Search Icon',
        serviceCategoryPlaceholder: "What service do you need?",
        locationPlaceholder: "Enter your city or postal code",
        provincePlaceholder: "Province",
        cityPlaceholder: "City",
        whyOlaNest: 'Why OlaNest?',
        everythingYouNeed: 'Everything you need to complete your home project',
        feature1Title: 'Easy Professional Search',
        feature1Description: 'Filter by location, service, and ratings to find the perfect match for any home task.',
        feature2Title: 'Verified Professionals',
        feature2Description: "We verify licenses to ensure you're hiring qualified and trustworthy contractors.",
        feature3Title: 'Transparent Reviews',
        feature3Description: 'Honest ratings and comments from both homeowners and professionals build trust.',
      },
      login: {
        title: 'Welcome Back to OlaNest!',
        description: 'Sign in to access your OlaNest account.',
        dontHaveAccount: "Don't have an account?",
        forgotPassword: "Forgot password?",
      },
      signup: {
        title: 'Create an OlaNest Account',
        description: 'Join OlaNest as a Homeowner or Contractor.',
        alreadyHaveAccount: 'Already have an account?',
        roleLabel: 'I am a...',
        roleHomeowner: 'Homeowner',
        roleContractor: 'Contractor', 
      },
      contractorDashboard: { 
        becomeContractorTitle: 'Offer Your Services on OlaNest',
      },
      search: {
        title: 'Find Your Perfect Home Professional',
        reviews: 'reviews',
        noReviews: 'No reviews yet',
        viewProfileButton: 'View Profile',
        performSearchPrompt: 'Please perform a search from the home page to see results.',
        noContractorsFound: 'No contractors found for your search criteria.',
        refineSearch: 'Refine Search',
        searchServicesPlaceholder: 'Search services...',
        searchProvincesPlaceholder: 'Search provinces...',
        searchCitiesPlaceholder: 'Search cities...',
        searchButton: 'Search',
        showingResultsFor: "Showing results for",
        in: "in",
        startNewSearch: "Start New Search"
      },
      privacyPolicy: {
        title: "Privacy Policy",
        lastUpdated: "Last updated: ",
      },
      termsOfService: {
        title: "Terms of Service",
        lastUpdated: "Last updated: ",
      },
      forgotPassword: {
        title: "Forgot Your Password?",
        description: "No problem. Enter your email address and we'll send you a link to reset it.",
        sendResetLinkButton: "Send Reset Link",
        backToLogin: "Back to Login",
      },
    },
    footer: {
      allRightsReserved: 'All Rights Reserved',
    },
    form: {
      emailLabel: 'Email',
      emailPlaceholder: 'your@email.com',
      passwordLabel: 'Password',
      passwordPlaceholder: '••••••••',
      confirmPasswordLabel: 'Confirm Password',
      fullNameLabel: 'Full Name',
      fullNamePlaceholder: 'John Doe',
      serviceCategoriesLabel: 'Service Categories You Offer', 
      serviceCategoriesDescription: 'Select all services you are qualified to provide.', 
      errorEmailInvalid: 'Invalid email address.',
      errorPasswordMinLength: 'Password must be at least {count} characters.',
      errorPasswordsDontMatch: "Passwords don't match.",
      errorNameMinLength: 'Name must be at least {count} characters.',
      errorRoleRequired: 'You need to select a role.',
      errorServiceCategoriesRequired: 'Please select at least one service category.', 
    },
    toast: {
      loginSuccess: "Login Successful",
      loginSuccessDescription: "Welcome back!",
      loginError: "Login Error",
      loginFailedGeneric: "An unexpected error occurred. Please try again.",
      loginInvalidCredentials: "Invalid email or password. Please try again.",
      loginInvalidEmailFormat: "The email format is invalid.",
      userDataNotFound: "Could not find user data. Please contact support.",
      signupSuccess: "Account Created",
      signupSuccessDescription: "Your account has been created. You can now log in.",
      signupError: "Signup Error",
      signupFailedGeneric: "An unexpected error occurred. Please try again.",
      signupEmailInUse: "This email is already in use. Please try another.",
      logoutSuccess: "You have been logged out.",
      passwordResetRequestedTitle: "Password Reset Requested",
      passwordResetRequestedDescription: "If an account exists for {email}, a password reset link has been sent.",
      searchErrorTitle: "Incomplete Search",
      searchErrorDescription: "Please select a service, province, and city to continue.",
    },
    serviceCategory: {
      plumbing: 'Plumbing',
      electrical: 'Electrical',
      roofing: 'Roofing',
      landscaping: 'Landscaping',
      painting: 'Painting',
      generalconstruction: 'General Construction',
      exterminator: 'Exterminator',
      irrigation: 'Irrigation',
      poolrepair: 'Pool Repair',
      homecleaning: 'Home Cleaning',
      appliancerepair: 'Appliance Repair',
      hvac: 'HVAC',
      chimneysweep: 'Chimney Sweep',
      windowcleaning: 'Window Cleaning',
      guttercleaning: 'Gutter Cleaning',
      smarthomeinstallation: 'Smart Home Installation',
      brickbuildermasonry: 'Brick Builder (Masonry)',
      cabinetbuilder: 'Cabinet Builder',
      flooring: 'Flooring',
      plastering: 'Plastering',
      ceramicinstallation: 'Ceramic Installation',
      airconditioning: 'Air Conditioning',
      asbestosremoval: 'Asbestos Removal',
      atticrestoration: 'Attic Restoration',
      basementrenovations: 'Basement Renovations',
      basementwaterproofing: 'Basement Waterproofing',
      bathroomrenovations: 'Bathroom Renovations',
      cabinetrefacing: 'Cabinet Refacing',
      closets: 'Closets',
      concretecontractors: 'Concrete Contractors',
      concretelifting: 'Concrete Lifting',
      drywallcontractors: 'Drywall Contractors',
      exteriorrenovations: 'Exterior Renovations',
      furnacerepair: 'Furnace Repair',
      furnaceinstallation: 'Furnace Installation',
      garagebuilders: 'Garage Builders',
      garagedoorrepair: 'Garage Door Repair',
      handymanservices: 'Handyman Services',
      homesecurity: 'Home Security',
      waterheaterinstallation: 'Water Heater Installation',
      houselifting: 'House Lifting',
      insulation: 'Insulation',
      interiordesign: 'Interior Design',
      junkremoval: 'Junk Removal',
      kitchenrenovations: 'Kitchen Renovations',
      moving: 'Moving',
      polybreplacement: 'Poly B Replacement',
      majorrenovations: 'Major Renovations',
      siding: 'Siding',
      windowcoverings: 'Window Coverings',
      windowsanddoors: 'Windows and Doors',
    },
  },
  fr: {
    common: {
      appName: 'OlaNest',
      loading: 'Chargement...',
      error: 'Erreur',
      save: 'Enregistrer',
      cancel: 'Annuler',
      submit: 'Soumettre',
      view: 'Voir',
      edit: 'Modifier',
      delete: 'Supprimer',
      search: 'Rechercher',
      clearFilters: 'Effacer les filtres',
      status: 'Statut',
      actions: 'Actions',
      yes: 'Oui',
      no: 'Non',
      ok: 'OK',
      na: 'S.O.',
      all: 'Tous',
      pending: 'En attente',
      approved: 'Approuvé',
      rejected: 'Rejeté',
      english: 'English',
      french: 'Français',
      back: 'Retour',
      introduction: "1. Introduction",
      informationWeCollect: "2. Informations que nous collectons",
      howWeUseYourInformation: "3. Comment nous utilisons vos informations",
      contactUs: "4. Nous contacter",
      agreementToTerms: "1. Acceptation des conditions",
      descriptionOfService: "2. Description du service",
      userAccounts: "3. Comptes utilisateurs",
      licenseVerification: "4. Vérification des licences",
      ratingsAndReviews: "5. Évaluations et avis",
      changesToTerms: "6. Modifications des conditions",
    },
    navbar: {
      home: 'Accueil',
      messages: 'Messagerie',
      admin: 'Administration',
      logout: 'Déconnexion',
      signUp: 'Inscription',
      changeLanguage: 'Changer de langue',
      dashboard: 'Tableau de bord',
      unreadMessages: '{count, plural, =0 {Aucun message non lu} =1 {# message non lu} other {# messages non lus}}',
      login: 'Connexion',
    },
    pages: {
      home: {
        heroTitle: "Votre parcours d'amélioration résidentielle commence ici !",
        heroDescription: "OlaNest met en relation les propriétaires avec des professionnels de confiance pour tous vos besoins en services à domicile. Trouvez le bon expert, efficacement.",
        findContractorButton: 'Trouver un Professionnel',
        searchIconAlt: 'Icône de Recherche',
        serviceCategoryPlaceholder: "De quel service avez-vous besoin?",
        locationPlaceholder: "Entrez votre ville ou code postal",
        provincePlaceholder: "Province",
        cityPlaceholder: "Ville",
        whyOlaNest: 'Pourquoi OlaNest ?',
        everythingYouNeed: 'Tout ce dont vous avez besoin pour réaliser votre projet domiciliaire',
        feature1Title: 'Recherche Facile de Professionnels',
        feature1Description: "Filtrez par lieu, service et évaluations pour trouver la solution idéale pour toute tâche à domicile.",
        feature2Title: 'Professionnels Vérifiés',
        feature2Description: "Nous vérifions les licences pour garantir que vous engagez des entrepreneurs qualifiés et dignes de confiance.",
        feature3Title: 'Avis Transparents',
        feature3Description: 'Des évaluations et commentaires honnêtes des propriétaires et des professionnels renforcent la confiance.',
      },
      login: {
        title: 'Content de vous revoir sur OlaNest !',
        description: 'Connectez-vous pour accéder à votre compte OlaNest.',
        dontHaveAccount: "Vous n'avez pas de compte ?",
        forgotPassword: "Mot de passe oublié ?",
      },
      signup: {
        title: 'Créer un Compte OlaNest',
        description: 'Rejoignez OlaNest en tant que Propriétaire ou Contracteur.',
        alreadyHaveAccount: 'Vous avez déjà un compte ?',
        roleLabel: 'Je suis un(e)...',
        roleHomeowner: 'Propriétaire',
        roleContractor: 'Contracteur',
      },
      contractorDashboard: {
        becomeContractorTitle: 'Proposez Vos Services sur OlaNest',
      },
      search: {
        title: 'Trouvez Votre Professionnel Idéal pour la Maison',
        reviews: 'avis',
        noReviews: 'Aucun avis pour le moment',
        viewProfileButton: 'Voir le profil',
        performSearchPrompt: "Veuillez effectuer une recherche à partir de la page d'accueil pour voir les résultats.",
        noContractorsFound: "Aucun entrepreneur trouvé pour vos critères de recherche.",
        refineSearch: 'Affiner la recherche',
        searchServicesPlaceholder: 'Rechercher des services...',
        searchProvincesPlaceholder: 'Rechercher des provinces...',
        searchCitiesPlaceholder: 'Rechercher des villes...',
        searchButton: 'Rechercher',
        showingResultsFor: "Affichage des résultats pour",
        in: "à",
        startNewSearch: "Nouvelle recherche"
      },
      privacyPolicy: {
        title: "Politique de Confidentialité",
        lastUpdated: "Dernière mise à jour : ",
      },
      termsOfService: {
        title: "Conditions d'Utilisation",
        lastUpdated: "Dernière mise à jour : ",
      },
      forgotPassword: {
        title: "Mot de passe oublié ?",
        description: "Aucun problème. Entrez votre adresse e-mail et nous vous enverrons un lien pour le réinitialiser.",
        sendResetLinkButton: "Envoyer le lien de réinitialisation",
        backToLogin: "Retour à la connexion",
      },
    },
    footer: {
      allRightsReserved: 'Tous droits réservés',
    },
    form: {
      emailLabel: 'E-mail',
      emailPlaceholder: 'votre@email.com',
      passwordLabel: 'Mot de passe',
      passwordPlaceholder: '••••••••',
      confirmPasswordLabel: 'Confirmez le mot de passe',
      fullNameLabel: 'Nom Complet',
      fullNamePlaceholder: 'Jean Dupont',
      serviceCategoriesLabel: 'Catégories de services que vous offrez',
      serviceCategoriesDescription: 'Sélectionnez tous les services pour lesquels vous êtes qualifié(e).',
      errorEmailInvalid: 'Adresse e-mail invalide.',
      errorPasswordMinLength: 'Le mot de passe doit comporter au moins {count} caractères.',
      errorPasswordsDontMatch: 'Les mots de passe ne correspondent pas.',
      errorNameMinLength: 'Le nom doit comporter au moins {count} caractères.',
      errorRoleRequired: 'Vous devez sélectionner un rôle.',
      errorServiceCategoriesRequired: 'Veuillez sélectionner au moins une catégorie de service.',
    },
    toast: {
      loginSuccess: "Connexion réussie",
      loginSuccessDescription: "Content de vous revoir !",
      loginError: "Erreur de connexion",
      loginFailedGeneric: "Une erreur inattendue est survenue. Veuillez réessayer.",
      loginInvalidCredentials: "Email ou mot de passe invalide. Veuillez réessayer.",
      loginInvalidEmailFormat: "Le format de l'e-mail est invalide.",
      userDataNotFound: "Impossible de trouver les données de l'utilisateur. Veuillez contacter le support.",
      signupSuccess: "Compte créé",
      signupSuccessDescription: "Votre compte a été créé. Vous pouvez maintenant vous connecter.",
      signupError: "Erreur d'inscription",
      signupFailedGeneric: "Une erreur inattendue est survenue. Veuillez réessayer.",
      signupEmailInUse: "Cet e-mail est déjà utilisé. Veuillez en essayer un autre.",
      logoutSuccess: "Vous avez été déconnecté.",
      passwordResetRequestedTitle: "Demande de réinitialisation de mot de passe",
      passwordResetRequestedDescription: "Si un compte existe pour {email}, un lien de réinitialisation de mot de passe a été envoyé.",
      searchErrorTitle: "Recherche incomplète",
      searchErrorDescription: "Veuillez sélectionner un service, une province et une ville pour continuer.",
    },
    serviceCategory: {
      plumbing: 'Plomberie',
      electrical: 'Électricité',
      roofing: 'Toiture',
      landscaping: 'Aménagement paysager',
      painting: 'Peinture',
      generalconstruction: 'Construction Générale',
      exterminator: 'Extermination',
      irrigation: 'Irrigation',
      poolrepair: 'Réparation de piscine',
      homecleaning: 'Nettoyage à domicile',
      appliancerepair: 'Réparation d’appareils électroménagers',
      hvac: 'CVC (Chauffage, Ventilation, Climatisation)',
      chimneysweep: 'Ramonage',
      windowcleaning: 'Nettoyage de fenêtres',
      guttercleaning: 'Nettoyage de gouttières',
      smarthomeinstallation: 'Installation de maison intelligente',
      brickbuildermasonry: 'Maçonnerie',
      cabinetbuilder: 'Ébéniste / Créateur de meubles',
      flooring: 'Revêtement de sol',
      plastering: 'Plâtrage',
      ceramicinstallation: 'Pose de céramique',
      airconditioning: 'Climatisation',
      asbestosremoval: 'Désamiantage',
      atticrestoration: 'Restauration de grenier',
      basementrenovations: 'Rénovations de sous-sol',
      basementwaterproofing: 'Imperméabilisation de sous-sol',
      bathroomrenovations: 'Rénovations de salle de bain',
      cabinetrefacing: 'Resurfaçage d\'armoires',
      closets: 'Placards et garde-robes',
      concretecontractors: 'Entrepreneurs en béton',
      concretelifting: 'Soulèvement de béton',
      drywallcontractors: 'Entrepreneurs en cloisons sèches',
      exteriorrenovations: 'Rénovations extérieures',
      furnacerepair: 'Réparation de fournaise',
      furnaceinstallation: 'Installation de fournaise',
      garagebuilders: 'Construction de garage',
      garagedoorrepair: 'Réparation de porte de garage',
      handymanservices: 'Services de bricolage',
      homesecurity: 'Sécurité domiciliaire',
      waterheaterinstallation: 'Installation de chauffe-eau',
      houselifting: 'Levage de maison',
      insulation: 'Isolation',
      interiordesign: 'Design d\'intérieur',
      junkremoval: 'Enlèvement de débris',
      kitchenrenovations: 'Rénovations de cuisine',
      moving: 'Déménagement',
      polybreplacement: 'Remplacement de tuyaux Poly-B',
      majorrenovations: 'Rénovations majeures',
      siding: 'Revêtement extérieur',
      windowcoverings: 'Habillage de fenêtres',
      windowsanddoors: 'Fenêtres et portes',
    },
  }
};

interface I18nContextType {
  language: Language;
  setLanguage: Dispatch<SetStateAction<Language>>;
  t: (keyPath: string, replacements?: Record<string, string | number | undefined>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // You could persist language preference in localStorage here
  }, [language]);

  const t = useCallback((keyPath: string, replacements?: Record<string, string | number | undefined>): string => {
    const keys = keyPath.split('.');
    
    const findTranslation = (lang: Language) => {
        let result: any = translations[lang];
        for (const key of keys) {
            result = result?.[key];
            if (result === undefined) return undefined;
        }
        return result;
    };

    let translation = findTranslation(language);
    if (translation === undefined) {
        translation = findTranslation('en'); // Fallback to English
    }

    if (translation === undefined) {
        return replacements?.defaultValue as string || keyPath;
    }

    if (typeof translation === 'string' && replacements) {
        return Object.entries(replacements).reduce((acc, [pKey, pValue]) => {
            if (pKey === 'defaultValue' || pValue === undefined) return acc;
            const regex = new RegExp(`\\{${pKey}\\}`, 'g');
            return acc.replace(regex, String(pValue));
        }, translation);
    }
    
    return typeof translation === 'string' ? translation : keyPath;
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, t]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
