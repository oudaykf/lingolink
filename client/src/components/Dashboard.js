import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Dashboard.css';
import './Dashboard-modern.css';
import './Dashboard-sections.css';
import './Dashboard-animations.css';
import './Settings.css';
import './GlobalTheme.css';
import './Celebrations.css';
import TutorialPopup from './TutorialPopup';
import ProfileCustomizationPopup from './ProfileCustomizationPopup';
import './SettingsTabs.css';
import EditProfile from './EditProfile';

import Modal from './Modal';
import NotificationManager, { notify } from './NotificationManager';
import VerificationPage from './VerificationPage';
import OnboardingTutorial from './OnboardingTutorial';
import ThemeSelector from './ThemeSelector';
import FontSettings from './FontSettings';
import AnimationSettings from './AnimationSettings';
import LayoutSettings from './LayoutSettings';
import TranslatorChart from './TranslatorChart';
import BannerCustomizer from './BannerCustomizer';
import BannerDecorations from './BannerDecorations';
import ColorChangingLogo from './ColorChangingLogo';
import MessagingPage from './MessagingPage';
import TranslationRequestsPage from './TranslationRequestsPage';
import TranslatorWorkPage from './TranslatorWorkPage';
import { getAllTranslators } from '../services/translatorService';
import MessagesTab from './MessagesTab';
import { useNavigate } from 'react-router-dom';

// Language translations
const translations = {
  en: {
    dashboard: 'Dashboard',
    myTranslations: 'My Translations',
    myWork: 'My Work',
    newTranslation: 'New Translation',
    findTranslator: 'Find Translator',
    priceCalculator: 'Price Calculator',
    translationRequests: 'Translation Requests',
    clientMessages: 'Client Messages',
    settings: 'Settings',
    verification: 'Verification',
    verifyNow: 'Verify Now',
    notVerified: 'Not Verified',
    verified: 'Verified',
    welcomeBack: 'Welcome back',
    clientDescription: 'As a client, you can request translations, track their progress, and manage your translation projects.',
    translatorDescription: 'As a translator, you can view available translation jobs, submit your work, and track your translation history.',
    newTranslationRequest: 'New Translation Request',
    viewTranslationRequests: 'View Translation Requests',
    yourProfile: 'Your Profile',
    editProfile: 'Edit Profile',
    activeRequests: 'Active Requests',
    completed: 'Completed',
    totalWords: 'Total Words',
    availableRequests: 'Available Requests',
    completedJobs: 'Completed Jobs',
    earnings: 'Earnings',
    recentActivity: 'Recent Activity',
    accountInformation: 'Account Information',
    name: 'Name',
    email: 'Email',
    accountType: 'Account Type',
    preferences: 'Preferences',
    appearance: 'Appearance',
    language: 'Language',
    theme: 'Theme',
    notifications: 'Notifications',
    security: 'Security',
    lightTheme: 'Light Theme',
    darkTheme: 'Dark Theme',
    systemTheme: 'System Theme',
    emailNotifications: 'Email Notifications',
    browserNotifications: 'Browser Notifications',
    saveChanges: 'Save Changes',
    english: 'English',
    french: 'French',
    spanish: 'Spanish',
    arabic: 'Arabic',
    german: 'German',
    changed: 'changed',
    personalInformation: 'Personal Information',
    professionalInformation: 'Professional Information',
    bio: 'Bio',
    phone: 'Phone',
    location: 'Location',
    languages: 'Languages',
    specializations: 'Specializations',
    cancel: 'Cancel',
    saving: 'Saving...',
    clickToUpload: 'Click to upload profile image',
    recommendedSize: 'Recommended size: 300x300 pixels',
    appearance: 'Appearance',
    chooseTheme: 'Choose Theme',
    accentColor: 'Accent Color',
    lightTheme: 'Light Theme',
    darkTheme: 'Dark Theme',
    systemTheme: 'System Theme',
    turquoise: 'Turquoise',
    blue: 'Blue',
    purple: 'Purple',
    pink: 'Pink',
    red: 'Red',
    orange: 'Orange',
    yellow: 'Yellow',
    green: 'Green',
    welcomeToLingoLink: 'Welcome to LingoLink',
    clientWelcomeMessage: 'Your gateway to professional legal document translation services.',
    findTranslators: 'Find Translators',
    clientFindTranslatorsMessage: 'Browse our network of professional translators specializing in legal documents.',
    manageRequests: 'Manage Requests',
    clientManageRequestsMessage: 'Track and manage your translation requests from submission to completion.',
    communicateEffectively: 'Communicate Effectively',
    clientCommunicateMessage: 'Direct messaging with your translator ensures clear communication throughout the process.',
    customizeYourExperience: 'Customize Your Experience',
    clientCustomizeMessage: 'Personalize your dashboard, set preferences, and choose your theme.',
    translatorWelcomeMessage: 'Welcome to your professional translation workspace.',
    findJobs: 'Find Jobs',
    translatorFindJobsMessage: 'Browse available translation requests that match your expertise.',
    manageTranslations: 'Manage Translations',
    translatorManageMessage: 'Track your active and completed translation projects in one place.',
    communicateWithClients: 'Communicate With Clients',
    translatorCommunicateMessage: 'Direct messaging with clients ensures clear communication throughout the process.',
    customizeYourProfile: 'Customize Your Profile',
    translatorCustomizeMessage: 'Showcase your expertise, languages, and specializations to attract more clients.',
    previous: 'Previous',
    next: 'Next',
    skipTutorial: 'Skip Tutorial',
    getStarted: 'Get Started',
    personalization: 'Personalization',
    client: 'Client',
    translator: 'Translator',
    logout: 'Logout',
    advancedAppearanceSettings: 'Advanced Appearance Settings',
    done: 'Done',
    themeChanged: 'Theme changed successfully',
    tutorialCompleted: 'Tutorial completed',
    fontSettings: 'Font Settings',
    fontSize: 'Font Size',
    fontFamily: 'Font Family',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    extraLarge: 'Extra Large',
    systemDefault: 'System Default',
    serif: 'Serif',
    sansSerif: 'Sans Serif',
    monospace: 'Monospace',
    animationSettings: 'Animation Settings',
    enableAnimations: 'Enable Animations',
    animationSpeed: 'Animation Speed',
    fast: 'Fast',
    normal: 'Normal',
    slow: 'Slow',
    layoutSettings: 'Layout Settings',
    compactMode: 'Compact Mode',
    sidebarPosition: 'Sidebar Position',
    left: 'Left',
    right: 'Right',
    bannerCustomization: 'Banner Customization',
    bannerStyle: 'Banner Style',
    bannerPattern: 'Banner Pattern',
    bannerAnimation: 'Banner Animation',
    defaultStyle: 'Default',
    gradientStyle: 'Gradient',
    solidStyle: 'Solid',
    minimalStyle: 'Minimal',
    noPattern: 'No Pattern',
    dotsPattern: 'Dots',
    linesPattern: 'Lines',
    wavesPattern: 'Waves',
    geometricPattern: 'Geometric',
    noAnimation: 'No Animation',
    fadeAnimation: 'Fade',
    slideAnimation: 'Slide',
    pulseAnimation: 'Pulse',
    particlesAnimation: 'Particles',
    showDecorations: 'Show Decorations'
  },
  fr: {
    dashboard: 'Tableau de bord',
    myTranslations: 'Mes traductions',
    myWork: 'Mon travail',
    newTranslation: 'Nouvelle traduction',
    findTranslator: 'Trouver un traducteur',
    priceCalculator: 'Calculateur de prix',
    translationRequests: 'Demandes de traduction',
    clientMessages: 'Messages clients',
    settings: 'Paramètres',
    welcomeBack: 'Bon retour',
    clientDescription: 'En tant que client, vous pouvez demander des traductions, suivre leur progression et gérer vos projets de traduction.',
    translatorDescription: 'En tant que traducteur, vous pouvez consulter les travaux de traduction disponibles, soumettre votre travail et suivre votre historique de traduction.',
    newTranslationRequest: 'Nouvelle demande de traduction',
    viewTranslationRequests: 'Voir les demandes de traduction',
    yourProfile: 'Votre profil',
    editProfile: 'Modifier le profil',
    activeRequests: 'Demandes actives',
    completed: 'Terminé',
    totalWords: 'Total des mots',
    availableRequests: 'Demandes disponibles',
    completedJobs: 'Travaux terminés',
    earnings: 'Gains',
    recentActivity: 'Activité récente',
    accountInformation: 'Informations du compte',
    name: 'Nom',
    email: 'Email',
    accountType: 'Type de compte',
    preferences: 'Préférences',
    appearance: 'Apparence',
    language: 'Langue',
    theme: 'Thème',
    notifications: 'Notifications',
    security: 'Sécurité',
    lightTheme: 'Thème clair',
    darkTheme: 'Thème sombre',
    systemTheme: 'Thème système',
    emailNotifications: 'Notifications par email',
    browserNotifications: 'Notifications du navigateur',
    saveChanges: 'Enregistrer les modifications',
    english: 'Anglais',
    french: 'Français',
    spanish: 'Espagnol',
    arabic: 'Arabe',
    german: 'Allemand',
    personalInformation: 'Informations personnelles',
    professionalInformation: 'Informations professionnelles',
    bio: 'Biographie',
    phone: 'Téléphone',
    location: 'Emplacement',
    languages: 'Langues',
    specializations: 'Spécialisations',
    cancel: 'Annuler',
    saving: 'Enregistrement...',
    clickToUpload: 'Cliquez pour télécharger une image de profil',
    recommendedSize: 'Taille recommandée: 300x300 pixels',
    personalization: 'Personnalisation',
    client: 'Client',
    translator: 'Traducteur',
    logout: 'Déconnexion',
    changed: 'modifiée'
  },
  es: {
    dashboard: 'Panel de control',
    myTranslations: 'Mis traducciones',
    myWork: 'Mi trabajo',
    newTranslation: 'Nueva traducción',
    findTranslator: 'Encontrar traductor',
    priceCalculator: 'Calculadora de precios',
    translationRequests: 'Solicitudes de traducción',
    clientMessages: 'Mensajes de clientes',
    settings: 'Configuración',
    welcomeBack: 'Bienvenido de nuevo',
    clientDescription: 'Como cliente, puede solicitar traducciones, seguir su progreso y gestionar sus proyectos de traducción.',
    translatorDescription: 'Como traductor, puede ver los trabajos de traducción disponibles, enviar su trabajo y seguir su historial de traducción.',
    newTranslationRequest: 'Nueva solicitud de traducción',
    viewTranslationRequests: 'Ver solicitudes de traducción',
    yourProfile: 'Tu perfil',
    editProfile: 'Editar perfil',
    activeRequests: 'Solicitudes activas',
    completed: 'Completado',
    totalWords: 'Total de palabras',
    availableRequests: 'Solicitudes disponibles',
    completedJobs: 'Trabajos completados',
    earnings: 'Ganancias',
    recentActivity: 'Actividad reciente',
    accountInformation: 'Información de la cuenta',
    name: 'Nombre',
    email: 'Correo electrónico',
    accountType: 'Tipo de cuenta',
    preferences: 'Preferencias',
    appearance: 'Apariencia',
    language: 'Idioma',
    theme: 'Tema',
    notifications: 'Notificaciones',
    security: 'Seguridad',
    lightTheme: 'Tema claro',
    darkTheme: 'Tema oscuro',
    systemTheme: 'Tema del sistema',
    emailNotifications: 'Notificaciones por correo electrónico',
    browserNotifications: 'Notificaciones del navegador',
    saveChanges: 'Guardar cambios',
    english: 'Inglés',
    french: 'Francés',
    spanish: 'Español',
    arabic: 'Árabe',
    german: 'Alemán',
    personalization: 'Personalización',
    client: 'Cliente',
    translator: 'Traductor',
    logout: 'Cerrar sesión',
    changed: 'cambiado'
  },
  ar: {
    dashboard: 'لوحة التحكم',
    myTranslations: 'ترجماتي',
    myWork: 'عملي',
    newTranslation: 'ترجمة جديدة',
    findTranslator: 'البحث عن مترجم',
    priceCalculator: 'حاسبة الأسعار',
    translationRequests: 'طلبات الترجمة',
    clientMessages: 'رسائل العملاء',
    settings: 'الإعدادات',
    welcomeBack: 'مرحبًا بعودتك',
    clientDescription: 'كعميل، يمكنك طلب الترجمات وتتبع تقدمها وإدارة مشاريع الترجمة الخاصة بك.',
    translatorDescription: 'كمترجم، يمكنك عرض وظائف الترجمة المتاحة وتقديم عملك وتتبع تاريخ الترجمة الخاص بك.',
    newTranslationRequest: 'طلب ترجمة جديد',
    viewTranslationRequests: 'عرض طلبات الترجمة',
    yourProfile: 'ملفك الشخصي',
    editProfile: 'تعديل الملف الشخصي',
    activeRequests: 'الطلبات النشطة',
    completed: 'مكتمل',
    totalWords: 'إجمالي الكلمات',
    availableRequests: 'الطلبات المتاحة',
    completedJobs: 'الوظائف المكتملة',
    earnings: 'الأرباح',
    recentActivity: 'النشاط الأخير',
    accountInformation: 'معلومات الحساب',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    accountType: 'نوع الحساب',
    preferences: 'التفضيلات',
    appearance: 'المظهر',
    language: 'اللغة',
    theme: 'السمة',
    notifications: 'الإشعارات',
    security: 'الأمان',
    lightTheme: 'السمة الفاتحة',
    darkTheme: 'السمة الداكنة',
    systemTheme: 'سمة النظام',
    emailNotifications: 'إشعارات البريد الإلكتروني',
    browserNotifications: 'إشعارات المتصفح',
    saveChanges: 'حفظ التغييرات',
    english: 'الإنجليزية',
    french: 'الفرنسية',
    spanish: 'الإسبانية',
    arabic: 'العربية',
    german: 'الألمانية',
    personalization: 'التخصيص',
    client: 'عميل',
    translator: 'مترجم',
    logout: 'تسجيل الخروج',
    changed: 'تم التغيير'
  }
};

// SVG Icons for the dashboard
const DocumentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const VerificationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const WordsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);



const Dashboard = (props) => {
  const { user, setUser, onLogout } = props;
  const navigate = useNavigate();
  // All useState hooks must be at the top, before any return or conditional
  const [activeView, setActiveView] = useState('dashboard');
  const [translationItems, setTranslationItems] = useState([]);
  const [stats, setStats] = useState({ active: 0, completed: 0, totalWords: 0 });
  const [chartData, setChartData] = useState({ months: [], tasks: [], pages: [] });
  const [activePeriod, setActivePeriod] = useState('year');
  const [translators, setTranslators] = useState([]);
  const [filteredTranslators, setFilteredTranslators] = useState([]);
  const [refreshTranslators, setRefreshTranslators] = useState(0);
  const [selectedTranslator, setSelectedTranslator] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Tutorial and Profile Customization states
  const [showTutorial, setShowTutorial] = useState(false);
  const [showProfileCustomization, setShowProfileCustomization] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Find Translator filter states
  const [sourceLang, setSourceLang] = useState('');
  const [targetLang, setTargetLang] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [minRating, setMinRating] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 0.25]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('rating'); // 'rating', 'price', 'projects'
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState('appearance');

  // Settings tab state
  const [settingsTab, setSettingsTab] = useState('account');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [settingsChanged, setSettingsChanged] = useState(false);

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    browserNotifications: true,
    marketingEmails: false,
    newRequestNotifications: true,
    messageNotifications: true,
    updateNotifications: true
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowDataCollection: true
  });

  // Accessibility settings
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    highContrast: false,
    largerText: false,
    reducedMotion: false
  });
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    return savedLanguage || 'en';
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  // Banner customization state
  const [bannerStyle, setBannerStyle] = useState(localStorage.getItem('bannerStyle') || 'default');
  const [bannerPattern, setBannerPattern] = useState(localStorage.getItem('bannerPattern') || 'none');
  const [bannerAnimation, setBannerAnimation] = useState(localStorage.getItem('bannerAnimation') || 'fade');
  const [showDecorations, setShowDecorations] = useState(localStorage.getItem('showDecorations') !== 'false');

  // Enhanced theme and color system
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('currentTheme') || 'turquoise');
  const [animationsEnabled, setAnimationsEnabled] = useState(localStorage.getItem('animationsEnabled') !== 'false');
  const [animationSpeed, setAnimationSpeed] = useState(localStorage.getItem('animationSpeed') || 'normal');
  const [compactMode, setCompactMode] = useState(localStorage.getItem('compactMode') === 'true');
  const [borderRadius, setBorderRadius] = useState(localStorage.getItem('borderRadius') || 'medium');
  const [shadowIntensity, setShadowIntensity] = useState(localStorage.getItem('shadowIntensity') || 'medium');

  // Enhanced celebration system
  const [currentCelebration, setCurrentCelebration] = useState(null);
  const [celebrationsEnabled, setCelebrationsEnabled] = useState(localStorage.getItem('celebrationsEnabled') !== 'false');
  const [showCelebrationBanner, setShowCelebrationBanner] = useState(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [celebrationParticles, setCelebrationParticles] = useState([]);
  const [showFireworks, setShowFireworks] = useState(false);
  const [cursorTrails, setCursorTrails] = useState([]);
  const [cursorEffectsEnabled, setCursorEffectsEnabled] = useState(localStorage.getItem('cursorEffectsEnabled') !== 'false');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(localStorage.getItem('sidebarCollapsed') === 'true');
  // Calculator states (move here)
  const [calcSourceLang, setCalcSourceLang] = useState('');
  const [calcTargetLang, setCalcTargetLang] = useState('');
  const [calcDocType, setCalcDocType] = useState('general');
  const [calcPages, setCalcPages] = useState(1);
  const [calcPricePerPage, setCalcPricePerPage] = useState(15);
  const [calcDelivery, setCalcDelivery] = useState('standard');
  const [calcServices, setCalcServices] = useState({ proofreading: false, formatting: false, certified: false });
  const [calcResult, setCalcResult] = useState(null);
  const [calcError, setCalcError] = useState('');

  // Enhanced theme definitions
  const themes = {
    turquoise: {
      name: 'Turquoise Ocean',
      primary: '#20B2AA',
      secondary: '#48D1CC',
      accent: '#00CED1',
      background: '#F0FDFF',
      surface: '#FFFFFF',
      text: '#1A202C',
      textSecondary: '#4A5568',
      gradient: 'linear-gradient(135deg, #20B2AA 0%, #48D1CC 100%)',
      rgb: '32, 178, 170'
    },
    barbie: {
      name: 'Barbie Pink',
      primary: '#E91E63',
      secondary: '#F06292',
      accent: '#FF4081',
      background: '#FCE4EC',
      surface: '#FFFFFF',
      text: '#1A202C',
      textSecondary: '#4A5568',
      gradient: 'linear-gradient(135deg, #E91E63 0%, #F06292 100%)',
      rgb: '233, 30, 99'
    },
    ocean: {
      name: 'Ocean Blue',
      primary: '#0077BE',
      secondary: '#4FC3F7',
      accent: '#29B6F6',
      background: '#E3F2FD',
      surface: '#FFFFFF',
      text: '#1A202C',
      textSecondary: '#4A5568',
      gradient: 'linear-gradient(135deg, #0077BE 0%, #4FC3F7 100%)',
      rgb: '0, 119, 190'
    },
    sunset: {
      name: 'Sunset Orange',
      primary: '#FF6B35',
      secondary: '#FF8A65',
      accent: '#FF7043',
      background: '#FFF3E0',
      surface: '#FFFFFF',
      text: '#1A202C',
      textSecondary: '#4A5568',
      gradient: 'linear-gradient(135deg, #FF6B35 0%, #FF8A65 100%)',
      rgb: '255, 107, 53'
    },
    forest: {
      name: 'Forest Green',
      primary: '#2E7D32',
      secondary: '#66BB6A',
      accent: '#4CAF50',
      background: '#E8F5E8',
      surface: '#FFFFFF',
      text: '#1A202C',
      textSecondary: '#4A5568',
      gradient: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)',
      rgb: '46, 125, 50'
    },
    royal: {
      name: 'Royal Purple',
      primary: '#673AB7',
      secondary: '#9575CD',
      accent: '#7E57C2',
      background: '#F3E5F5',
      surface: '#FFFFFF',
      text: '#1A202C',
      textSecondary: '#4A5568',
      gradient: 'linear-gradient(135deg, #673AB7 0%, #9575CD 100%)',
      rgb: '103, 58, 183'
    },
    midnight: {
      name: 'Midnight Dark',
      primary: '#1A1A2E',
      secondary: '#16213E',
      accent: '#0F3460',
      background: '#0A0A0A',
      surface: '#1E1E1E',
      text: '#FFFFFF',
      textSecondary: '#B0B0B0',
      gradient: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
      rgb: '26, 26, 46'
    },
    cherry: {
      name: 'Cherry Blossom',
      primary: '#E91E63',
      secondary: '#F8BBD9',
      accent: '#F48FB1',
      background: '#FCE4EC',
      surface: '#FFFFFF',
      text: '#1A202C',
      textSecondary: '#4A5568',
      gradient: 'linear-gradient(135deg, #E91E63 0%, #F8BBD9 100%)',
      rgb: '233, 30, 99'
    },
    gold: {
      name: 'Golden Luxury',
      primary: '#FFB300',
      secondary: '#FFCA28',
      accent: '#FFC107',
      background: '#FFFDE7',
      surface: '#FFFFFF',
      text: '#1A202C',
      textSecondary: '#4A5568',
      gradient: 'linear-gradient(135deg, #FFB300 0%, #FFCA28 100%)',
      rgb: '255, 179, 0'
    },
    cyberpunk: {
      name: 'Cyberpunk Neon',
      primary: '#00FFFF',
      secondary: '#FF00FF',
      accent: '#FFFF00',
      background: '#0A0A0A',
      surface: '#1A1A1A',
      text: '#00FFFF',
      textSecondary: '#FF00FF',
      gradient: 'linear-gradient(135deg, #00FFFF 0%, #FF00FF 100%)',
      rgb: '0, 255, 255'
    },
    barbieDream: {
      name: 'Barbie Dream House',
      primary: '#E91E63',
      secondary: '#F8BBD9',
      accent: '#FF69B4',
      background: '#FFF0F5',
      surface: '#FFFFFF',
      text: '#1A202C',
      textSecondary: '#4A5568',
      gradient: 'linear-gradient(135deg, #E91E63 0%, #FF69B4 50%, #F8BBD9 100%)',
      rgb: '233, 30, 99'
    },
    space: {
      name: 'Space Odyssey',
      primary: '#1E3A8A',
      secondary: '#3B82F6',
      accent: '#8B5CF6',
      background: '#0F172A',
      surface: '#1E293B',
      text: '#F8FAFC',
      textSecondary: '#CBD5E1',
      gradient: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 50%, #8B5CF6 100%)',
      rgb: '30, 58, 138'
    },
    christmas: {
      name: 'Christmas Magic',
      primary: '#DC2626',
      secondary: '#16A34A',
      accent: '#EAB308',
      background: '#FEF2F2',
      surface: '#FFFFFF',
      text: '#1A202C',
      textSecondary: '#4A5568',
      gradient: 'linear-gradient(135deg, #DC2626 0%, #16A34A 50%, #EAB308 100%)',
      rgb: '220, 38, 38'
    },
    valentine: {
      name: 'Valentine Romance',
      primary: '#BE185D',
      secondary: '#F472B6',
      accent: '#EC4899',
      background: '#FDF2F8',
      surface: '#FFFFFF',
      text: '#1A202C',
      textSecondary: '#4A5568',
      gradient: 'linear-gradient(135deg, #BE185D 0%, #EC4899 50%, #F472B6 100%)',
      rgb: '190, 24, 93'
    },
    halloween: {
      name: 'Halloween Spooky',
      primary: '#EA580C',
      secondary: '#7C2D12',
      accent: '#FBBF24',
      background: '#1C1917',
      surface: '#292524',
      text: '#F5F5F4',
      textSecondary: '#D6D3D1',
      gradient: 'linear-gradient(135deg, #EA580C 0%, #7C2D12 50%, #FBBF24 100%)',
      rgb: '234, 88, 12'
    },
    spring: {
      name: 'Spring Bloom',
      primary: '#16A34A',
      secondary: '#84CC16',
      accent: '#F59E0B',
      background: '#F0FDF4',
      surface: '#FFFFFF',
      text: '#1A202C',
      textSecondary: '#4A5568',
      gradient: 'linear-gradient(135deg, #16A34A 0%, #84CC16 50%, #F59E0B 100%)',
      rgb: '22, 163, 74'
    },
    summer: {
      name: 'Summer Vibes',
      primary: '#F59E0B',
      secondary: '#FBBF24',
      accent: '#F97316',
      background: '#FFFBEB',
      surface: '#FFFFFF',
      text: '#1A202C',
      textSecondary: '#4A5568',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 50%, #F97316 100%)',
      rgb: '245, 158, 11'
    },
    autumn: {
      name: 'Autumn Leaves',
      primary: '#DC2626',
      secondary: '#EA580C',
      accent: '#F59E0B',
      background: '#FEF2F2',
      surface: '#FFFFFF',
      text: '#1A202C',
      textSecondary: '#4A5568',
      gradient: 'linear-gradient(135deg, #DC2626 0%, #EA580C 50%, #F59E0B 100%)',
      rgb: '220, 38, 38'
    },
    winter: {
      name: 'Winter Frost',
      primary: '#0EA5E9',
      secondary: '#38BDF8',
      accent: '#7DD3FC',
      background: '#F0F9FF',
      surface: '#FFFFFF',
      text: '#1A202C',
      textSecondary: '#4A5568',
      gradient: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 50%, #7DD3FC 100%)',
      rgb: '14, 165, 233'
    },
    womensDay: {
      name: "Women's Day",
      primary: '#BE185D',
      secondary: '#F472B6',
      accent: '#8B5CF6',
      background: '#FDF2F8',
      surface: '#FFFFFF',
      text: '#1A202C',
      textSecondary: '#4A5568',
      gradient: 'linear-gradient(135deg, #BE185D 0%, #F472B6 50%, #8B5CF6 100%)',
      rgb: '190, 24, 93'
    },
    galaxy: {
      name: 'Galaxy Explorer',
      primary: '#4C1D95',
      secondary: '#7C3AED',
      accent: '#A855F7',
      background: '#1E1B4B',
      surface: '#312E81',
      text: '#F8FAFC',
      textSecondary: '#CBD5E1',
      gradient: 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 50%, #A855F7 100%)',
      rgb: '76, 29, 149'
    },
    neon: {
      name: 'Neon Nights',
      primary: '#10B981',
      secondary: '#06FFA5',
      accent: '#00E5FF',
      background: '#0A0A0A',
      surface: '#1A1A1A',
      text: '#10B981',
      textSecondary: '#06FFA5',
      gradient: 'linear-gradient(135deg, #10B981 0%, #06FFA5 50%, #00E5FF 100%)',
      rgb: '16, 185, 129'
    },
    pastel: {
      name: 'Pastel Dreams',
      primary: '#A78BFA',
      secondary: '#F472B6',
      accent: '#60A5FA',
      background: '#FAF5FF',
      surface: '#FFFFFF',
      text: '#1A202C',
      textSecondary: '#4A5568',
      gradient: 'linear-gradient(135deg, #A78BFA 0%, #F472B6 50%, #60A5FA 100%)',
      rgb: '167, 139, 250'
    }
  };

  // Celebrations and special occasions
  const celebrations = {
    christmas: {
      name: 'Christmas',
      emoji: '🎄',
      theme: 'christmas',
      dates: ['12-24', '12-25', '12-26'], // Dec 24-26
      message: 'Merry Christmas! Wishing you joy and happiness! 🎄✨',
      decorations: ['snowflakes', 'christmas-lights', 'santa-hat'],
      colors: ['#DC2626', '#16A34A', '#EAB308']
    },
    newYear: {
      name: 'New Year',
      emoji: '🎊',
      theme: 'gold',
      dates: ['12-31', '01-01'], // Dec 31 - Jan 1
      message: 'Happy New Year! Here\'s to new beginnings! 🎊🥳',
      decorations: ['confetti', 'fireworks', 'party-hat'],
      colors: ['#FFB300', '#FFCA28', '#FFC107']
    },
    womensDay: {
      name: "International Women's Day",
      emoji: '👩',
      theme: 'womensDay',
      dates: ['03-08'], // March 8
      message: 'Happy International Women\'s Day! Celebrating amazing women everywhere! 👩💪',
      decorations: ['flowers', 'hearts', 'sparkles'],
      colors: ['#BE185D', '#F472B6', '#8B5CF6']
    },
    valentine: {
      name: "Valentine's Day",
      emoji: '💕',
      theme: 'valentine',
      dates: ['02-14'], // Feb 14
      message: 'Happy Valentine\'s Day! Spread love and kindness! 💕❤️',
      decorations: ['hearts', 'roses', 'cupid'],
      colors: ['#BE185D', '#EC4899', '#F472B6']
    },
    halloween: {
      name: 'Halloween',
      emoji: '🎃',
      theme: 'halloween',
      dates: ['10-31'], // Oct 31
      message: 'Happy Halloween! Have a spook-tacular day! 🎃👻',
      decorations: ['pumpkins', 'ghosts', 'bats'],
      colors: ['#EA580C', '#7C2D12', '#FBBF24']
    },
    spring: {
      name: 'Spring Equinox',
      emoji: '🌸',
      theme: 'spring',
      dates: ['03-20', '03-21'], // March 20-21
      message: 'Welcome Spring! Time for new growth and fresh starts! 🌸🌱',
      decorations: ['flowers', 'butterflies', 'leaves'],
      colors: ['#16A34A', '#84CC16', '#F59E0B']
    },
    summer: {
      name: 'Summer Solstice',
      emoji: '☀️',
      theme: 'summer',
      dates: ['06-20', '06-21'], // June 20-21
      message: 'Happy Summer! Enjoy the sunshine and warmth! ☀️🌻',
      decorations: ['sun', 'beach', 'sunflowers'],
      colors: ['#F59E0B', '#FBBF24', '#F97316']
    },
    thanksgiving: {
      name: 'Thanksgiving',
      emoji: '🦃',
      theme: 'autumn',
      dates: ['11-23', '11-24', '11-25', '11-26'], // Late November (approximate)
      message: 'Happy Thanksgiving! Grateful for our amazing community! 🦃🍂',
      decorations: ['leaves', 'turkey', 'pumpkins'],
      colors: ['#DC2626', '#EA580C', '#F59E0B']
    }
  };

  // Function to detect current celebration
  const detectCurrentCelebration = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateString = `${month}-${day}`;

    for (const [key, celebration] of Object.entries(celebrations)) {
      if (celebration.dates.includes(dateString)) {
        return { key, ...celebration };
      }
    }
    return null;
  };

  const servicePercentages = {
    proofreading: 0.1, // 10%
    formatting: 0.08,  // 8%
    certified: 0.2     // 20%
  };
  const deliveryPercentages = {
    standard: 0,
    express: 0.15, // 15%
    urgent: 0.3    // 30%
  };

  const handleCalcServiceChange = (service) => {
    setCalcServices(s => ({ ...s, [service]: !s[service] }));
  };

  const handleCalculatePrice = (e) => {
    e.preventDefault();
    setCalcError('');
    if (!calcSourceLang || !calcTargetLang) {
      setCalcError('Please select both source and target languages.');
      return;
    }
    if (calcPages < 1) {
      setCalcError('Number of pages must be at least 1.');
      return;
    }
    if (calcPricePerPage < 15) {
      setCalcError('Minimum price per page is 15 TND.');
      return;
    }
    // Base price
    let base = calcPages * calcPricePerPage;
    // Delivery markup
    let deliveryMarkup = base * deliveryPercentages[calcDelivery];
    // Services markup
    let servicesMarkup = 0;
    Object.keys(calcServices).forEach(s => {
      if (calcServices[s]) servicesMarkup += base * servicePercentages[s];
    });
    // Total
    let total = base + deliveryMarkup + servicesMarkup;
    setCalcResult({
      base,
      deliveryMarkup,
      servicesMarkup,
      total
    });
  };

  // Apply filters to translators
  const applyFilters = () => {
    if (!translators || translators.length === 0) return;

    let filtered = [...translators];

    // Filter by source language
    if (sourceLang) {
      filtered = filtered.filter(t =>
        t.languages && t.languages.some(lang =>
          lang.toLowerCase().includes(sourceLang.toLowerCase())
        )
      );
    }

    // Filter by target language
    if (targetLang) {
      filtered = filtered.filter(t =>
        t.languages && t.languages.some(lang =>
          lang.toLowerCase().includes(targetLang.toLowerCase())
        )
      );
    }

    // Filter by specialty
    if (specialty) {
      filtered = filtered.filter(t =>
        t.specialties && t.specialties.some(spec =>
          spec.toLowerCase().includes(specialty.toLowerCase())
        )
      );
    }

    // Filter by minimum rating
    if (minRating !== 'all') {
      const minRatingValue = parseFloat(minRating);
      filtered = filtered.filter(t => (t.rating || 0) >= minRatingValue);
    }

    // Filter by price range
    if (priceRange && priceRange.length === 2) {
      filtered = filtered.filter(t => {
        const rate = parseFloat(t.ratePerWord) || 0;
        return rate >= priceRange[0] && rate <= priceRange[1];
      });
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        (t.name && t.name.toLowerCase().includes(query)) ||
        (t.description && t.description.toLowerCase().includes(query)) ||
        (t.specialties && t.specialties.some(s => s.toLowerCase().includes(query))) ||
        (t.languages && t.languages.some(l => l.toLowerCase().includes(query)))
      );
    }

    // Sort translators
    if (sortBy === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'price') {
      filtered.sort((a, b) => (parseFloat(a.ratePerWord) || 0) - (parseFloat(b.ratePerWord) || 0));
    } else if (sortBy === 'projects') {
      filtered.sort((a, b) => (b.completedProjects || 0) - (a.completedProjects || 0));
    }

    setFilteredTranslators(filtered);
  };

  // Language and theme settings
  const t = (key) => {
    try {
      // First check if the language exists in translations
      if (translations[currentLanguage]) {
        // Then check if the key exists in that language
        if (translations[currentLanguage][key]) {
          return translations[currentLanguage][key];
        }
      }

      // Fallback to English
      if (translations['en'] && translations['en'][key]) {
        return translations['en'][key];
      }

      // If all else fails, return the key itself
      return key;
    } catch (error) {
      return key;
    }
  };

  // Apply filters whenever filter states change
  useEffect(() => {
    applyFilters();
  }, [translators, sourceLang, targetLang, specialty, minRating, priceRange, sortBy, searchQuery]);

  // Initialize data and fetch real translators
  useEffect(() => {
    setLoading(true);

    // Add a sample bio if none exists (for demo purposes)
    if (!user.bio && user.userType === 'translator') {
      user.bio = "Professional translator with expertise in technical and business content. Fluent in multiple languages with a focus on delivering high-quality translations that maintain the original meaning and context.";
    } else if (!user.bio && user.userType === 'client') {
      user.bio = "Business professional seeking quality translation services for international expansion. Looking for reliable translators who can help with technical documentation and marketing materials.";
    }

    // Initialize with empty data
    setTranslationItems([]);
    setStats({ active: 0, completed: 0, totalWords: 0 });

    // Apply enhanced theme system
    applyTheme(currentTheme);

    // Check for current celebrations
    if (celebrationsEnabled) {
      const celebration = detectCurrentCelebration();
      if (celebration) {
        setCurrentCelebration(celebration);
        setShowCelebrationBanner(true);
        // Show celebration notification after a delay
        setTimeout(() => {
          notify(`🎉 ${celebration.message}`, 'success', 5000);
        }, 2000);
      }
    }

    // Apply language direction
    if (currentLanguage === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }

    // Check if tutorial should be shown (first login)
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    const isFirstLogin = localStorage.getItem('isFirstLogin') === 'true';

    if (isFirstLogin && !hasSeenTutorial) {
      setIsNewUser(true);
      setShowTutorial(true);
      localStorage.removeItem('isFirstLogin'); // Remove flag after showing tutorial
    }

    // Initialize chart data for translator dashboard
    if (user && user.userType === 'translator') {
      updateChartData('year');
    }



    // Fetch real translators if user is a client
    const fetchTranslators = async () => {
      if (user && user.userType === 'client') {
        try {
          setLoading(true);
          setError('');

          // Always show Ouday Kefi as a guaranteed translator
          const guaranteedTranslator = {
            id: 'ouday-kefi',
            name: 'Ouday Kefi',
            email: 'ouday.kefi@example.com',
            userType: 'translator',
            languages: ['English', 'Arabic', 'French'],
            specialties: ['Technical', 'IT', 'Business'],
            rating: 4.9,
            reviewCount: 42,
            completedProjects: 87,
            onTimePercentage: 100,
            ratePerWord: 0.12,
            description: 'Professional translator specializing in Technical and IT translations. Fluent in English, Arabic, and French with extensive experience in software localization and technical documentation.'
          };

          // Start with at least Ouday Kefi
          let allTranslators = [guaranteedTranslator];

          // Set up a timeout for the API request
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

          try {
            // Fetch translators from the API
            const fetchedTranslators = await getAllTranslators();

            if (fetchedTranslators && fetchedTranslators.length > 0) {
              // Add API translators to our list, but keep Ouday Kefi
              const apiTranslators = fetchedTranslators.filter(t => t.id !== 'ouday-kefi');
              allTranslators = [...allTranslators, ...apiTranslators];
            } else {
            }

            clearTimeout(timeoutId);
          } catch (apiError) {
            clearTimeout(timeoutId);
            // Don't show error message, just use fallback data
          }

          // Check if there are any registered translators in localStorage
          try {
            const registeredUsers = localStorage.getItem('registeredUsers');

            if (registeredUsers) {
              const parsedUsers = JSON.parse(registeredUsers);
              const translatorUsers = parsedUsers.filter(u =>
                u.userType === 'translator' &&
                u.id !== 'ouday-kefi' &&
                !allTranslators.some(t => t.id === u.id)
              );

              if (translatorUsers.length > 0) {

                // Convert registered users to translator format
                const localTranslators = translatorUsers.map(user => {
                  // Use existing languages if available, otherwise generate
                  const languages = user.languages || ['English'];

                  // Use existing specialties if available, otherwise generate
                  let specialties = user.specializations || user.specialties;

                  if (!specialties || specialties.length === 0) {
                    const allSpecialties = [
                      'Legal', 'Medical', 'Technical', 'Financial', 'Marketing',
                      'Literary', 'Academic', 'Scientific', 'Business', 'IT'
                    ];

                    const numSpecialties = 1 + Math.floor(Math.random() * 2);
                    specialties = [];

                    // For other translators, pick random specialties
                    while (specialties.length < numSpecialties) {
                      const specialty = allSpecialties[Math.floor(Math.random() * allSpecialties.length)];
                      if (!specialties.includes(specialty)) {
                        specialties.push(specialty);
                      }
                    }
                  }

                  return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    userType: 'translator',
                    languages: languages,
                    specialties: specialties,
                    rating: 4.0 + Math.random(),
                    reviewCount: Math.floor(Math.random() * 50),
                    completedProjects: Math.floor(Math.random() * 100),
                    onTimePercentage: 90 + Math.floor(Math.random() * 10),
                    ratePerWord: (0.08 + Math.random() * 0.07).toFixed(2),
                    description: `Professional translator specializing in ${specialties.join(' and ')} translations. Fluent in ${languages.join(', ')}.`,
                    profileImage: user.profileImage
                  };
                });

                // Add local translators to our list
                allTranslators = [...allTranslators, ...localTranslators];
              }
            }
          } catch (e) {
          }

          // Set all translators
          setTranslators(allTranslators);
          setFilteredTranslators(allTranslators);

        } catch (error) {
          // Don't show error, just use Ouday Kefi
          const fallbackTranslator = {
            id: 'ouday-kefi',
            name: 'Ouday Kefi',
            email: 'ouday.kefi@example.com',
            userType: 'translator',
            languages: ['English', 'Arabic', 'French'],
            specialties: ['Technical', 'IT', 'Business'],
            rating: 4.9,
            reviewCount: 42,
            completedProjects: 87,
            onTimePercentage: 100,
            ratePerWord: 0.12,
            description: 'Professional translator specializing in Technical and IT translations. Fluent in English, Arabic, and French with extensive experience in software localization and technical documentation.'
          };
          setTranslators([fallbackTranslator]);
          setFilteredTranslators([fallbackTranslator]);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchTranslators();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, refreshTranslators]);

  // Separate useEffect for theme changes
  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme, animationsEnabled, animationSpeed, compactMode, borderRadius, shadowIntensity]);

  // Separate useEffect for language changes
  useEffect(() => {
    if (currentLanguage === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }, [currentLanguage]);



  // Handle theme toggle
  const toggleTheme = () => {
    const newThemeValue = !isDarkMode;
    setIsDarkMode(newThemeValue);
    localStorage.setItem('theme', newThemeValue ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', newThemeValue ? 'dark' : 'light');
  };

  // Handle language change
  const changeLanguage = (langCode) => {
    // Add animation class to language button
    const langButton = document.querySelector('.language-dropdown-btn');
    if (langButton) {
      // Add the changed class
      langButton.classList.add('changed');

      // Add rotation effect
      langButton.style.transform = 'rotate(360deg)';

      // Remove the class and reset transform after animation completes
      setTimeout(() => {
        langButton.classList.remove('changed');
        langButton.style.transform = '';
      }, 1000);
    }

    setCurrentLanguage(langCode);
    localStorage.setItem('preferredLanguage', langCode);

    // Set RTL for Arabic
    if (langCode === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }

    // Show notification
    notify(`${t('language')} ${t('changed')}`, 'success', 2000);
  };



  const handleSaveProfile = async (formData) => {
    try {
      console.log('Saving profile data:', formData);

      // Create a new updated user object
      const updatedUser = {
        ...user,
        name: formData.get('name'),
        email: formData.get('email'),
        bio: formData.get('bio'),
        phone: formData.get('phone'),
        location: formData.get('location'),
        languages: JSON.parse(formData.get('languages')),
        specializations: JSON.parse(formData.get('specializations'))
      };

      // Handle profile image
      if (formData.get('profileImage')) {
        const profileImage = formData.get('profileImage');

        try {
          // Create a persistent URL for the image
          const imageUrl = URL.createObjectURL(profileImage);
          updatedUser.profileImage = imageUrl;

          // Store the image in localStorage as base64 for persistence
          const reader = new FileReader();
          reader.readAsDataURL(profileImage);
          reader.onloadend = () => {
            const base64data = reader.result;
            localStorage.setItem('profileImageData', base64data);
          };
        } catch (imageError) {
          console.error('Error processing profile image:', imageError);
        }
      }

      // Try to update the user in the API
      try {
        // Simulate API call with a timeout
        await new Promise(resolve => setTimeout(resolve, 1000));

        // In a real app, you would send this data to your API
        // const response = await fetch(`${API_URL}/api/users/profile`, {
        //   method: 'PUT',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify(updatedUser)
        // });

        // if (!response.ok) {
        //   throw new Error('Failed to update profile on server');
        // }
      } catch (apiError) {
        console.warn('Could not update profile on server, saving locally only:', apiError);
      }

      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Update the user state in the current component
      setUser(updatedUser);

      // Update registered users list if this is a translator
      if (updatedUser.userType === 'translator') {
        try {
          const existingUsers = localStorage.getItem('registeredUsers');
          if (existingUsers) {
            const users = JSON.parse(existingUsers);
            const updatedUsers = users.map(u =>
              u.id === updatedUser.id ? updatedUser : u
            );
            localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

            // Trigger a refresh of the translator list
            setRefreshTranslators(prev => prev + 1);
            console.log('Triggered translator list refresh after profile update');
          }
        } catch (e) {
          console.error('Error updating registered users:', e);
        }
      }

      // Show success message
      setProfileUpdateSuccess(true);
      setTimeout(() => setProfileUpdateSuccess(false), 3000);

      // Exit edit mode
      setIsEditingProfile(false);

      // Return to profile view
      setActiveView('profile');

      return true;
    } catch (error) {
      console.error('Error saving profile:', error);
      return false;
    }
  };

  const handleCancelEditProfile = () => {
    setIsEditingProfile(false);
  };

  // Enhanced theme application function
  const applyTheme = (themeName) => {
    const theme = themes[themeName];
    if (!theme) return;

    const root = document.documentElement;

    // Apply CSS custom properties
    root.style.setProperty('--primary-color', theme.primary);
    root.style.setProperty('--secondary-color', theme.secondary);
    root.style.setProperty('--accent-color', theme.accent);
    root.style.setProperty('--background-color', theme.background);
    root.style.setProperty('--surface-color', theme.surface);
    root.style.setProperty('--text-color', theme.text);
    root.style.setProperty('--text-secondary-color', theme.textSecondary);
    root.style.setProperty('--gradient-bg', theme.gradient);
    root.style.setProperty('--accent-color-rgb', theme.rgb);

    // Apply animation settings
    root.style.setProperty('--animations-enabled', animationsEnabled ? '1' : '0');
    root.style.setProperty('--animation-speed',
      animationSpeed === 'fast' ? '0.2s' :
      animationSpeed === 'slow' ? '0.8s' : '0.4s'
    );

    // Apply border radius
    const radiusValue =
      borderRadius === 'none' ? '0px' :
      borderRadius === 'small' ? '4px' :
      borderRadius === 'large' ? '16px' :
      borderRadius === 'extra-large' ? '24px' : '8px';
    root.style.setProperty('--border-radius', radiusValue);

    // Apply shadow intensity
    const shadowValue =
      shadowIntensity === 'none' ? 'none' :
      shadowIntensity === 'light' ? '0 2px 4px rgba(0,0,0,0.1)' :
      shadowIntensity === 'strong' ? '0 8px 32px rgba(0,0,0,0.3)' :
      '0 4px 16px rgba(0,0,0,0.15)';
    root.style.setProperty('--box-shadow', shadowValue);

    // Apply compact mode
    root.style.setProperty('--spacing-unit', compactMode ? '0.75rem' : '1rem');

    // Set theme attribute for CSS selectors
    root.setAttribute('data-theme', themeName);
    root.setAttribute('data-compact', compactMode.toString());
    root.setAttribute('data-animations', animationsEnabled.toString());
  };

  const handleThemeChange = (themeName) => {
    setCurrentTheme(themeName);
    localStorage.setItem('currentTheme', themeName);
    applyTheme(themeName);
    notify(`Theme changed to ${themes[themeName]?.name || themeName}`, 'success', 3000);
  };

  const handleAnimationToggle = (enabled) => {
    setAnimationsEnabled(enabled);
    localStorage.setItem('animationsEnabled', enabled.toString());
    applyTheme(currentTheme);
    notify(`Animations ${enabled ? 'enabled' : 'disabled'}`, 'success', 2000);
  };

  const handleAnimationSpeedChange = (speed) => {
    setAnimationSpeed(speed);
    localStorage.setItem('animationSpeed', speed);
    applyTheme(currentTheme);
    notify(`Animation speed set to ${speed}`, 'success', 2000);
  };

  const handleCompactModeToggle = (enabled) => {
    setCompactMode(enabled);
    localStorage.setItem('compactMode', enabled.toString());
    applyTheme(currentTheme);
    notify(`Compact mode ${enabled ? 'enabled' : 'disabled'}`, 'success', 2000);
  };

  const handleBorderRadiusChange = (radius) => {
    setBorderRadius(radius);
    localStorage.setItem('borderRadius', radius);
    applyTheme(currentTheme);
    notify(`Border radius changed to ${radius}`, 'success', 2000);
  };

  const handleShadowIntensityChange = (intensity) => {
    setShadowIntensity(intensity);
    localStorage.setItem('shadowIntensity', intensity);
    applyTheme(currentTheme);
    notify(`Shadow intensity set to ${intensity}`, 'success', 2000);
  };

  // Celebration handlers
  const handleCelebrationsToggle = (enabled) => {
    setCelebrationsEnabled(enabled);
    localStorage.setItem('celebrationsEnabled', enabled.toString());

    if (enabled) {
      const celebration = detectCurrentCelebration();
      if (celebration) {
        setCurrentCelebration(celebration);
        setShowCelebrationBanner(true);
        // Auto-apply celebration theme if enabled
        if (celebration.theme && themes[celebration.theme]) {
          handleThemeChange(celebration.theme);
        }
        notify(`🎉 ${celebration.message}`, 'success', 5000);
      }
    } else {
      setCurrentCelebration(null);
      setShowCelebrationBanner(false);
      setCursorTrails([]); // Clear cursor trails when disabling celebrations
    }
  };

  const handleCursorEffectsToggle = (enabled) => {
    setCursorEffectsEnabled(enabled);
    localStorage.setItem('cursorEffectsEnabled', enabled.toString());

    if (!enabled) {
      setCursorTrails([]); // Clear existing trails
    }

    notify(`Cursor effects ${enabled ? 'enabled' : 'disabled'}`, 'success', 2000);
  };

  const handleSidebarToggle = () => {
    const newCollapsed = !sidebarCollapsed;
    setSidebarCollapsed(newCollapsed);
    localStorage.setItem('sidebarCollapsed', newCollapsed.toString());
    notify(`Sidebar ${newCollapsed ? 'hidden' : 'shown'}`, 'success', 1500);
  };

  const triggerCelebration = (celebrationKey) => {
    const celebration = celebrations[celebrationKey];
    if (celebration) {
      setCurrentCelebration({ key: celebrationKey, ...celebration });
      setShowCelebrationBanner(true);
      if (celebration.theme && themes[celebration.theme]) {
        handleThemeChange(celebration.theme);
      }
      notify(`🎉 ${celebration.message}`, 'success', 5000);
    }
  };

  const dismissCelebration = () => {
    setShowCelebrationBanner(false);
  };

  // Particle system for celebrations
  const createParticles = (celebrationType, count = 20) => {
    const particles = [];
    const particleTypes = {
      christmas: ['❄️', '🎄', '🎅', '⭐', '🔔'],
      valentine: ['💕', '💖', '🌹', '💝', '💘'],
      womensDay: ['🌸', '🌺', '🦋', '💐', '🌷'],
      halloween: ['🎃', '👻', '🦇', '🕷️', '🍭'],
      newYear: ['🎊', '🎆', '⭐', '🥳', '🎉'],
      spring: ['🌸', '🌱', '🦋', '🌼', '🌿'],
      summer: ['☀️', '🌻', '🏖️', '🌊', '🍉'],
      autumn: ['🍂', '🍁', '🎃', '🌰', '🦃'],
      winter: ['❄️', '⛄', '🏔️', '🧊', '🎿']
    };

    const emojis = particleTypes[celebrationType] || particleTypes.christmas;

    for (let i = 0; i < count; i++) {
      particles.push({
        id: Math.random(),
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        x: Math.random() * window.innerWidth,
        y: -50,
        delay: Math.random() * 5,
        duration: 8 + Math.random() * 4,
        type: celebrationType
      });
    }
    return particles;
  };

  const startCelebrationEffects = (celebration) => {
    // Create particles
    const particles = createParticles(celebration.key, 30);
    setCelebrationParticles(particles);

    // Show celebration modal
    setShowCelebrationModal(true);

    // Add fireworks for special occasions
    if (['newYear', 'christmas'].includes(celebration.key)) {
      setShowFireworks(true);
      setTimeout(() => setShowFireworks(false), 10000);
    }

    // Auto-dismiss modal after 5 seconds
    setTimeout(() => {
      setShowCelebrationModal(false);
    }, 5000);

    // Clear particles after animation
    setTimeout(() => {
      setCelebrationParticles([]);
    }, 15000);
  };

  const createFirework = (x, y) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    const firework = document.createElement('div');
    firework.className = 'firework-burst';
    firework.style.left = x + 'px';
    firework.style.top = y + 'px';
    firework.style.background = colors[Math.floor(Math.random() * colors.length)];

    const fireworksContainer = document.querySelector('.celebration-fireworks');
    if (fireworksContainer) {
      fireworksContainer.appendChild(firework);
      setTimeout(() => {
        if (firework.parentNode) {
          firework.parentNode.removeChild(firework);
        }
      }, 2000);
    }
  };

  // Optimized cursor trail effect with throttling
  const lastMouseMoveTime = useRef(0);
  const trailCleanupTimeouts = useRef(new Set());

  const handleMouseMove = useCallback((e) => {
    if (!currentCelebration || !celebrationsEnabled || !cursorEffectsEnabled) return;

    const now = Date.now();
    // Throttle to 60fps (16.67ms) for smooth performance
    if (now - lastMouseMoveTime.current < 16) return;
    lastMouseMoveTime.current = now;

    const trail = {
      id: now, // Use timestamp as ID for better performance
      x: e.clientX,
      y: e.clientY
    };

    setCursorTrails(prev => {
      const newTrails = [...prev.slice(-3), trail]; // Limit to 4 trails max
      return newTrails;
    });

    // Optimized cleanup with timeout tracking
    const timeoutId = setTimeout(() => {
      setCursorTrails(prev => prev.filter(t => t.id !== trail.id));
      trailCleanupTimeouts.current.delete(timeoutId);
    }, 800);

    trailCleanupTimeouts.current.add(timeoutId);
  }, [currentCelebration, celebrationsEnabled, cursorEffectsEnabled]);

  // Cleanup effect for cursor trails
  useEffect(() => {
    return () => {
      // Clear all pending timeouts when component unmounts or celebration changes
      trailCleanupTimeouts.current.forEach(timeoutId => clearTimeout(timeoutId));
      trailCleanupTimeouts.current.clear();
      setCursorTrails([]);
    };
  }, [currentCelebration]);

  // Enhanced celebration trigger
  const triggerCelebrationEnhanced = (celebrationKey) => {
    const celebration = celebrations[celebrationKey];
    if (celebration) {
      setCurrentCelebration({ key: celebrationKey, ...celebration });
      setShowCelebrationBanner(true);

      // Apply theme
      if (celebration.theme && themes[celebration.theme]) {
        handleThemeChange(celebration.theme);
      }

      // Start enhanced effects
      startCelebrationEffects({ key: celebrationKey, ...celebration });

      // Show notification
      notify(`🎉 ${celebration.message}`, 'success', 5000);
    }
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    localStorage.setItem('hasSeenTutorial', 'true');

    // Show profile customization popup after tutorial
    setShowProfileCustomization(true);
  };

  const handleProfileCustomizationComplete = () => {
    setShowProfileCustomization(false);
    notify('Profile setup completed successfully!', 'success', 3000);
  };

  const handleProfileCustomizationSave = async (profileData) => {
    try {
      // Save profile data to localStorage
      const updatedProfile = {
        ...userProfile,
        ...profileData,
        lastUpdated: new Date().toISOString()
      };

      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      setUserProfile(updatedProfile);

      // Update user object with basic info
      const updatedUser = {
        ...user,
        name: profileData.fullName || user.name,
        bio: profileData.bio || user.bio,
        location: profileData.location || user.location,
        phone: profileData.phone || user.phone,
        profileImage: profileData.profileImage || user.profileImage,
        languages: profileData.languages || user.languages,
        specializations: profileData.specializations || user.specializations
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      // If user is a translator, update the registered users list
      if (user.userType === 'translator') {
        try {
          const existingUsers = localStorage.getItem('registeredUsers');
          if (existingUsers) {
            const users = JSON.parse(existingUsers);
            const updatedUsers = users.map(u =>
              u.id === user.id ? updatedUser : u
            );
            localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
            setRefreshTranslators(prev => prev + 1);
          }
        } catch (e) {
          console.error('Error updating registered users:', e);
        }
      }

      // Try to save to API (optional)
      try {
        // In a real app, you would send this data to your API
        console.log('Profile data saved locally:', updatedProfile);
        // await saveProfileToAPI(updatedProfile);
      } catch (apiError) {
        console.warn('Could not save to API, but saved locally:', apiError);
      }

      return true;
    } catch (error) {
      console.error('Error saving profile customization:', error);
      throw error;
    }
  };

  const handleRestartTutorial = () => {
    localStorage.removeItem('hasSeenTutorial');
    setShowTutorial(true);
    setShowSettingsModal(false);
  };

  const handleCustomizeProfile = () => {
    setShowProfileCustomization(true);
    setShowSettingsModal(false);
  };

  const simulateNewUserLogin = () => {
    localStorage.setItem('isFirstLogin', 'true');
    localStorage.removeItem('hasSeenTutorial');
    setShowTutorial(true);
    setShowSettingsModal(false);
  };

  // Settings handlers
  const handleSettingsTabChange = (tab) => {
    setSettingsTab(tab);
  };

  const handleTogglePasswordChange = () => {
    setShowPasswordChange(!showPasswordChange);
    // Reset password form when toggling
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validate password
    if (!passwordData.currentPassword) {
      setPasswordError('Current password is required');
      return;
    }

    if (!passwordData.newPassword) {
      setPasswordError('New password is required');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }

    // Simulate password change
    setTimeout(() => {
      setPasswordSuccess('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordChange(false);
    }, 1000);
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
    setSettingsChanged(true);
  };

  const handlePrivacyChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPrivacySettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setSettingsChanged(true);
  };

  const handleAccessibilityChange = (e) => {
    const { name, checked } = e.target;
    setAccessibilitySettings(prev => ({
      ...prev,
      [name]: checked
    }));
    setSettingsChanged(true);
  };

  const handleSaveSettings = () => {
    // Save settings to localStorage
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
    localStorage.setItem('privacySettings', JSON.stringify(privacySettings));
    localStorage.setItem('accessibilitySettings', JSON.stringify(accessibilitySettings));

    // Apply accessibility settings
    if (accessibilitySettings.largerText) {
      document.documentElement.style.fontSize = '18px';
    } else {
      document.documentElement.style.fontSize = '16px';
    }

    if (accessibilitySettings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    if (accessibilitySettings.reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }

    // Show success message
    notify('Settings saved successfully', 'success', 3000);
    setSettingsChanged(false);
  };



  const closeSettingsModal = () => {
    setShowSettingsModal(false);
    // Reset to appearance tab when modal is closed
    setActiveSettingsTab('appearance');
  };

  // Define additional icons for new features
  const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );

  const CalculatorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
      <line x1="8" y1="6" x2="16" y2="6"></line>
      <line x1="8" y1="10" x2="16" y2="10"></line>
      <line x1="8" y1="14" x2="16" y2="14"></line>
      <line x1="8" y1="18" x2="16" y2="18"></line>
    </svg>
  );

  const RequestsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
      <path d="M9 14l2 2 4-4"></path>
    </svg>
  );

  const MessagesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  );

  const ProfileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  // Log the user object to check its structure
  console.log('User object:', user);

  // Add safety check for user object
  if (!user) {
    console.error('User object is undefined or null');
    // You could redirect to login or show an error message here
    return (
      <div className="error-container">
        <h2>Error: User information not available</h2>
        <p>Please try logging in again.</p>
        <button onClick={() => window.location.href = '/login'}>Go to Login</button>
      </div>
    );
  }





  // Restore updateChartData function
  const updateChartData = (period) => {
    let newData = {};
    switch(period) {
      case 'week':
        newData = {
          months: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          tasks: [0, 0, 0, 0, 0, 0, 0],
          pages: [0, 0, 0, 0, 0, 0, 0]
        };
        break;
      case 'month':
        newData = {
          months: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          tasks: [0, 0, 0, 0],
          pages: [0, 0, 0, 0]
        };
        break;
      case 'year':
        newData = {
          months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          tasks: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          pages: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        };
        break;
      default:
        newData = {
          months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          tasks: [0, 0, 0, 0, 0, 0],
          pages: [0, 0, 0, 0, 0, 0]
        };
    }
    setChartData(newData);
    setActivePeriod(period);
  };

  // Create bubbles for the background
  const createBubbles = () => {
    const bubbles = [];
    const bubbleCount = 15;

    for (let i = 0; i < bubbleCount; i++) {
      const size = Math.random() * 60 + 20; // Random size between 20px and 80px
      const left = Math.random() * 100; // Random position from 0% to 100%
      const animationDuration = Math.random() * 10 + 10; // Random duration between 10s and 20s
      const animationDelay = Math.random() * 5; // Random delay between 0s and 5s

      bubbles.push(
        <div
          key={i}
          className="bubble"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            animationDuration: `${animationDuration}s`,
            animationDelay: `${animationDelay}s`
          }}
        />
      );
    }

    return bubbles;
  };

  return (
    <div
      className="dashboard-container"
      onMouseMove={handleMouseMove}
      style={{ position: 'relative' }}
    >
      {/* Enhanced Celebration System */}
      {currentCelebration && celebrationsEnabled && (
        <>
          {/* Celebration Overlay */}
          <div className="celebration-overlay">
            {/* Falling Particles */}
            <div className="celebration-particles">
              {celebrationParticles.map((particle) => (
                <div
                  key={particle.id}
                  className={`particle ${particle.type}`}
                  style={{
                    left: `${particle.x}px`,
                    top: `${particle.y}px`,
                    animationDelay: `${particle.delay}s`,
                    animationDuration: `${particle.duration}s`
                  }}
                >
                  {particle.emoji}
                </div>
              ))}
            </div>

            {/* Fireworks */}
            {showFireworks && (
              <div className="celebration-fireworks" onClick={(e) => {
                createFirework(e.clientX, e.clientY);
              }}>
              </div>
            )}

            {/* Background Effect */}
            <div className="celebration-background-effect"></div>
          </div>

          {/* Cursor Trails */}
          {cursorTrails.map((trail) => (
            <div
              key={trail.id}
              className="celebration-cursor-trail"
              style={{
                left: `${trail.x - 10}px`,
                top: `${trail.y - 10}px`
              }}
            ></div>
          ))}


        </>
      )}

      {/* Celebration Banner */}
      {showCelebrationBanner && currentCelebration && (
        <div className="celebration-banner">
          <div className="celebration-banner-content">
            <div className="celebration-banner-left">
              <span className="celebration-banner-emoji">{currentCelebration.emoji}</span>
              <div className="celebration-banner-text">
                <h3 className="celebration-banner-title">{currentCelebration.name}</h3>
                <p className="celebration-banner-message">{currentCelebration.message}</p>
              </div>
            </div>
            <button
              className="celebration-banner-close"
              onClick={dismissCelebration}
              title="Dismiss celebration"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div className="celebration-decorations">
            {currentCelebration.decorations?.map((decoration, index) => (
              <div key={index} className={`decoration decoration-${decoration}`}></div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Celebration Modal */}
      {showCelebrationModal && currentCelebration && (
        <div className="celebration-interactive">
          <span className="celebration-interactive-emoji">{currentCelebration.emoji}</span>
          <h2>{currentCelebration.name}</h2>
          <p className="celebration-interactive-message">{currentCelebration.message}</p>
          <button
            className="celebration-interactive-button"
            onClick={() => setShowCelebrationModal(false)}
          >
            Let's Celebrate! 🎉
          </button>
        </div>
      )}

      {/* Background Bubbles */}
      <div className="dashboard-bubbles">
        {createBubbles()}
      </div>

      {/* Notification Manager */}
      <NotificationManager />

      {/* Onboarding Tutorial */}
      {showTutorial && (
        <OnboardingTutorial
          isOpen={showTutorial}
          userType={user?.userType || 'client'}
          onComplete={handleTutorialComplete}
          translations={translations}
          currentLanguage={currentLanguage}
        />
      )}

      {/* Settings Modal */}
      <Modal
        isOpen={showSettingsModal}
        onClose={closeSettingsModal}
        title={t('personalization')}
        size="medium"
        footer={
          <button className="btn-primary" onClick={closeSettingsModal}>
            {t('done')}
          </button>
        }
      >
        <div className="settings-content" style={{ maxHeight: 'none' }}>
          <div className="settings-tabs">
            <div className="settings-tab-list">
              <button
                className={`settings-tab ${activeSettingsTab === 'appearance' ? 'active' : ''}`}
                onClick={() => setActiveSettingsTab('appearance')}
              >
                {t('appearance')}
              </button>
              <button
                className={`settings-tab ${activeSettingsTab === 'fontSettings' ? 'active' : ''}`}
                onClick={() => setActiveSettingsTab('fontSettings')}
              >
                {t('fontSettings')}
              </button>
              <button
                className={`settings-tab ${activeSettingsTab === 'animationSettings' ? 'active' : ''}`}
                onClick={() => setActiveSettingsTab('animationSettings')}
              >
                {t('animationSettings')}
              </button>
              <button
                className={`settings-tab ${activeSettingsTab === 'layoutSettings' ? 'active' : ''}`}
                onClick={() => setActiveSettingsTab('layoutSettings')}
              >
                {t('layoutSettings')}
              </button>
              <button
                className={`settings-tab ${activeSettingsTab === 'bannerCustomization' ? 'active' : ''}`}
                onClick={() => setActiveSettingsTab('bannerCustomization')}
              >
                {t('bannerCustomization')}
              </button>
            </div>

            <div className="settings-tab-content">
              {activeSettingsTab === 'appearance' && (
                <div className="settings-section">
                  <h3>{t('appearance')}</h3>
                  <ThemeSelector
                    onThemeChange={handleThemeChange}
                    translations={translations}
                    currentLanguage={currentLanguage}
                  />
                </div>
              )}

              {activeSettingsTab === 'fontSettings' && (
                <div className="settings-section">
                  <h3>{t('fontSettings')}</h3>
                  <FontSettings
                    translations={translations}
                    currentLanguage={currentLanguage}
                  />
                </div>
              )}

              {activeSettingsTab === 'animationSettings' && (
                <div className="settings-section">
                  <h3>{t('animationSettings')}</h3>
                  <AnimationSettings
                    translations={translations}
                    currentLanguage={currentLanguage}
                  />
                </div>
              )}

              {activeSettingsTab === 'layoutSettings' && (
                <div className="settings-section">
                  <h3>{t('layoutSettings')}</h3>
                  <LayoutSettings
                    translations={translations}
                    currentLanguage={currentLanguage}
                  />
                </div>
              )}

              {activeSettingsTab === 'bannerCustomization' && (
                <div className="settings-section">
                  <h3>{t('bannerCustomization')}</h3>
                  <BannerCustomizer
                    translations={translations}
                    currentLanguage={currentLanguage}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>

      <header className="dashboard-header">
        <div className="dashboard-logo">
          {/* Professional Sidebar Toggle Button - Moved to left */}
          <button
            className="sidebar-toggle-btn professional"
            onClick={handleSidebarToggle}
            title={sidebarCollapsed ? 'Show Sidebar' : 'Hide Sidebar'}
          >
            <div className="hamburger-icon">
              {sidebarCollapsed ? (
                // Right arrow icon when sidebar is collapsed
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              ) : (
                // Hamburger menu when sidebar is open
                <>
                  <span className="hamburger-line"></span>
                  <span className="hamburger-line"></span>
                  <span className="hamburger-line"></span>
                </>
              )}
            </div>
          </button>

          <ColorChangingLogo className="logo" alt="LingoLink" size="medium" />
          <h1>LingoLink</h1>
        </div>
        <div className="dashboard-user">
          <span>{t('welcomeBack')}, {user.name}</span>
          <div className="user-type-badge">{user.userType === 'client' ? t('client') : t('translator')}</div>

          <div className="dashboard-controls">

            {/* Celebration Icon in Header */}
            {currentCelebration && celebrationsEnabled && (
              <div className="header-celebration-indicator" title={`${currentCelebration.name} - Celebration Active!`}>
                <div className="celebration-sound-waves"></div>
                <span className="header-celebration-emoji">{currentCelebration.emoji}</span>
              </div>
            )}

            <div className="language-dropdown">
              <button className="language-dropdown-btn" title={t('language')}>
                {currentLanguage === 'en' && '🇺🇸'}
                {currentLanguage === 'fr' && '🇫🇷'}
                {currentLanguage === 'es' && '🇪🇸'}
                {currentLanguage === 'ar' && '🇸🇦'}
              </button>
              <div className="language-dropdown-content">
                <button
                  className={`language-item ${currentLanguage === 'en' ? 'active' : ''}`}
                  onClick={() => changeLanguage('en')}
                >
                  <span>🇺🇸</span> {t('english')}
                </button>
                <button
                  className={`language-item ${currentLanguage === 'fr' ? 'active' : ''}`}
                  onClick={() => changeLanguage('fr')}
                >
                  <span>🇫🇷</span> {t('french')}
                </button>
                <button
                  className={`language-item ${currentLanguage === 'es' ? 'active' : ''}`}
                  onClick={() => changeLanguage('es')}
                >
                  <span>🇪🇸</span> {t('spanish')}
                </button>
                <button
                  className={`language-item ${currentLanguage === 'ar' ? 'active' : ''}`}
                  onClick={() => changeLanguage('ar')}
                >
                  <span>🇸🇦</span> {t('arabic')}
                </button>
              </div>
            </div>

            <button className="theme-toggle" onClick={toggleTheme}>
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>

          <button onClick={onLogout} className="logout-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            {t('logout') || 'Logout'}
          </button>
        </div>
      </header>

      <div className={`dashboard-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {!sidebarCollapsed && (
        <div className="dashboard-sidebar">
            <div className="nav-header">
              <h3
                className={currentCelebration ? 'celebration-header-logo' : ''}
                onClick={() => {
                  if (!currentCelebration) {
                    // Trigger a random celebration when clicking the logo
                    const celebrationKeys = Object.keys(celebrations);
                    const randomKey = celebrationKeys[Math.floor(Math.random() * celebrationKeys.length)];
                    triggerCelebrationEnhanced(randomKey);
                  }
                }}
                style={{ cursor: currentCelebration ? 'default' : 'pointer' }}
                title={currentCelebration ? '' : 'Click for a surprise! 🎉'}
              >
                {currentCelebration ? `${currentCelebration.emoji} Navigation` : 'Navigation'}
              </h3>
            </div>

          <nav className="dashboard-nav">
            <div className="nav-section">
              <div className="nav-section-title">Main</div>
            <ul>
              <li
                className={activeView === 'dashboard' ? 'active' : ''}
                onClick={() => setActiveView('dashboard')}
                  style={{"--nav-index": 0}}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="9"></rect>
                  <rect x="14" y="3" width="7" height="5"></rect>
                  <rect x="14" y="12" width="7" height="9"></rect>
                  <rect x="3" y="16" width="7" height="5"></rect>
                </svg>
                <span>{t('dashboard')}</span>
              </li>

              <li
                className={activeView === 'translations' ? 'active' : ''}
                onClick={() => setActiveView('translations')}
                  style={{"--nav-index": 1}}
              >
                <DocumentIcon />
                <span>{user.userType === 'client' ? t('myTranslations') : t('myWork')}</span>
                  {stats.active > 0 && <span className="nav-badge">{stats.active}</span>}
              </li>
              </ul>
            </div>

            {/* Client-specific section */}
              {user.userType === 'client' && (
              <div className="nav-section">
                <div className="nav-section-title">Services</div>
                <ul>
                  <li
                    className={activeView === 'find-translator' ? 'active' : ''}
                    onClick={() => setActiveView('find-translator')}
                    style={{"--nav-index": 2}}
                  >
                    <SearchIcon />
                    <span>{t('findTranslator')}</span>
                  </li>
                  <li
                    className={activeView === 'price-calculator' ? 'active' : ''}
                    onClick={() => setActiveView('price-calculator')}
                    style={{"--nav-index": 3}}
                  >
                    <CalculatorIcon />
                    <span>{t('priceCalculator')}</span>
                  </li>
                  <li
                    className={activeView === 'my-requests' ? 'active' : ''}
                    onClick={() => setActiveView('my-requests')}
                    style={{"--nav-index": 4}}
                  >
                    <RequestsIcon />
                    <span>My Requests</span>
                  </li>
                  <li
                    className={activeView === 'messages' ? 'active' : ''}
                    onClick={() => setActiveView('messages')}
                    style={{"--nav-index": 5}}
                  >
                    <MessagesIcon />
                    <span>Messages</span>
                  </li>
                </ul>
              </div>
            )}

            {/* Translator-specific section */}
              {user.userType === 'translator' && (
              <div className="nav-section">
                <div className="nav-section-title">Work</div>
                <ul>
                  <li
                    className={activeView === 'requests' ? 'active' : ''}
                    onClick={() => setActiveView('requests')}
                    style={{"--nav-index": 2}}
                  >
                    <RequestsIcon />
                    <div className="nav-text-content">
                      <span>View Requests</span>
                      <div className="nav-description">Browse available translation jobs</div>
                    </div>
                    {stats.active > 0 && <span className="nav-badge">{stats.active}</span>}
                  </li>
                  <li
                    className={activeView === 'translations' ? 'active' : ''}
                    onClick={() => setActiveView('translations')}
                    style={{"--nav-index": 3}}
                  >
                    <DocumentIcon />
                    <div className="nav-text-content">
                      <span>My Translations</span>
                      <div className="nav-description">View your translation work</div>
                    </div>
                  </li>
                  <li
                    className={activeView === 'messages' ? 'active' : ''}
                    onClick={() => setActiveView('messages')}
                    style={{"--nav-index": 4}}
                  >
                    <MessagesIcon />
                    <div className="nav-text-content">
                      <span>Messages</span>
                      <div className="nav-description">Communicate with clients</div>
                    </div>
                  </li>
                </ul>
              </div>
              )}

            <div className="nav-section">
              <div className="nav-section-title">Account</div>
              <ul>
              <li
                className={activeView === 'profile' ? 'active' : ''}
                onClick={() => setActiveView('profile')}
                  style={{"--nav-index": user.userType === 'client' ? 4 : 4}}
              >
                <ProfileIcon />
                <span>{t('yourProfile')}</span>
              </li>

              <li
                className={activeView === 'verification' ? 'active' : ''}
                onClick={() => setActiveView('verification')}
                  style={{"--nav-index": user.userType === 'client' ? 5 : 5}}
              >
                <VerificationIcon />
                <span>{t('verification')}</span>
                  {!user.verified && <span className="nav-badge">!</span>}
              </li>

              <li
                className={activeView === 'settings' ? 'active' : ''}
                onClick={() => setActiveView('settings')}
                  style={{"--nav-index": user.userType === 'client' ? 6 : 6}}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                <span>{t('settings')}</span>
              </li>
            </ul>
            </div>
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-footer-content">
              <div className="sidebar-footer-avatar">
                {user.name.charAt(0).toUpperCase()}
        </div>
              <div className="sidebar-footer-info">
                <p className="sidebar-footer-name">{user.name}</p>
                <p className="sidebar-footer-role">{user.userType === 'client' ? t('client') : t('translator')}</p>
              </div>
            </div>
          </div>
        </div>
        )}

        <main className="dashboard-main">
          {activeView === 'dashboard' && (
            <>
              {error && <div className="error-message">{error}</div>}

              <div className={`welcome-banner banner-style-${bannerStyle}`}>
                {showDecorations && <BannerDecorations pattern={bannerPattern} animation={bannerAnimation} />}
                <div className="decoration"></div>
                <div className="content">
                  <div className="welcome-header">
                    <div className="welcome-header-left">
                      <div className="welcome-avatar">
                        {user.profileImage ? (
                          <img src={user.profileImage} alt={user.name} />
                        ) : (
                          <div className="avatar-placeholder">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="welcome-user-info">
                  <h2>{t('welcomeBack')}, {user.name}!</h2>
                  <div className="user-role-indicator">
                    <span className="user-role-icon">
                      {user.userType === 'client' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                      )}
                    </span>
                    <span className="user-role-text">You are logged in as a <strong>{user.userType === 'client' ? t('client') : t('translator')}</strong></span>
                  </div>
                      </div>
                    </div>
                    <div className="date-time">
                      {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>

                  <div className="welcome-description">
                    {user.bio ? (
                      <div className="user-bio">
                        <p className="bio-text">{user.bio}</p>
                        <div className="bio-label">Your Bio</div>
                      </div>
                    ) : (
                  <p>{user.userType === 'client' ? t('clientDescription') : t('translatorDescription')}</p>
                    )}
                  </div>

                  {/* Dashboard summary metrics */}
                  <div className="dashboard-summary">
                    <div className="summary-metric" style={{"--i": 1}}>
                      <div className="metric-icon">
                        {user.userType === 'client' ? (
                          <DocumentIcon />
                        ) : (
                          <RequestsIcon />
                  )}
                </div>
                      <div className="metric-content">
                        <div className="metric-value">{stats.active}</div>
                        <div className="metric-label">
                          {user.userType === 'client' ? 'Active Requests' : 'Available Jobs'}
                        </div>
                </div>
              </div>

                    <div className="summary-metric" style={{"--i": 2}}>
                      <div className="metric-icon">
                        <CheckIcon />
                      </div>
                      <div className="metric-content">
                        <div className="metric-value">{stats.completed}</div>
                        <div className="metric-label">
                          {user.userType === 'client' ? 'Completed' : 'Completed Jobs'}
                        </div>
                      </div>
                    </div>

                    <div className="summary-metric" style={{"--i": 3}}>
                      <div className="metric-icon">
                {user.userType === 'client' ? (
                          <WordsIcon />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                          </svg>
                        )}
                      </div>
                      <div className="metric-content">
                        <div className="metric-value">
                          {user.userType === 'client' ? stats.totalWords : '$0'}
                        </div>
                        <div className="metric-label">
                          {user.userType === 'client' ? 'Total Words' : 'Earnings'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Primary action buttons */}
                  <div className="welcome-actions">
                    {user.userType === 'client' ? (
                    <button
                        className="action-button action-button-primary"
                      onClick={() => setActiveView('find-translator')}
                    >
                      <SearchIcon /> Find Translator
                    </button>
                    ) : (
                    <button
                      className="action-button action-button-primary"
                      onClick={() => setActiveView('requests')}
                    >
                        <RequestsIcon /> {t('viewTranslationRequests')}
                    </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick access widgets */}
              <div className="quick-access-widgets">
                <div className="widget-header">
                  <h3>Quick Access</h3>
                </div>

                <div className="widgets-container">
                  {user.userType === 'client' ? (
                    <>
                      <div className="quick-widget" onClick={() => setActiveView('find-translator')} style={{"--i": 1}}>
                        <div className="widget-icon">
                          <SearchIcon />
                        </div>
                        <div className="widget-title">Find Translator</div>
                        <div className="widget-description">Search for qualified translators</div>
                      </div>

                      <div className="quick-widget" onClick={() => setActiveView('price-calculator')} style={{"--i": 2}}>
                        <div className="widget-icon">
                          <CalculatorIcon />
                        </div>
                        <div className="widget-title">Calculate Price</div>
                        <div className="widget-description">Estimate translation costs</div>
                      </div>

                      <div className="quick-widget" onClick={() => setActiveView('translations')} style={{"--i": 3}}>
                        <div className="widget-icon">
                          <DocumentIcon />
                        </div>
                        <div className="widget-title">My Translations</div>
                        <div className="widget-description">View your translation projects</div>
                      </div>

                      <div className="quick-widget" onClick={() => setActiveView('profile')} style={{"--i": 4}}>
                        <div className="widget-icon">
                          <ProfileIcon />
                        </div>
                        <div className="widget-title">Profile</div>
                        <div className="widget-description">Manage your account</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="quick-widget" onClick={() => setActiveView('requests')} style={{"--i": 1}}>
                        <div className="widget-icon">
                          <RequestsIcon />
                        </div>
                        <div className="widget-title">View Requests</div>
                        <div className="widget-description">Browse available translation jobs</div>
                      </div>

                      <div className="quick-widget" onClick={() => setActiveView('translations')} style={{"--i": 2}}>
                        <div className="widget-icon">
                          <DocumentIcon />
                        </div>
                        <div className="widget-title">My Translations</div>
                        <div className="widget-description">View your translation work</div>
                      </div>

                      <div className="quick-widget" onClick={() => setActiveView('messages')} style={{"--i": 3}}>
                        <div className="widget-icon">
                          <MessagesIcon />
                        </div>
                        <div className="widget-title">Messages</div>
                        <div className="widget-description">Communicate with clients</div>
                      </div>

                      <div className="quick-widget" onClick={() => setActiveView('profile')} style={{"--i": 4}}>
                        <div className="widget-icon">
                          <ProfileIcon />
                        </div>
                        <div className="widget-title">Profile</div>
                        <div className="widget-description">Manage your account</div>
                      </div>
                  </>
                )}
                </div>
              </div>

              <div className="dashboard-sections">
                {/* Profile and Verification Section */}
                <div className="dashboard-section">
                  <div className="section-header">
                    <h3>Profile & Verification</h3>
                    <button className="section-action" onClick={() => setActiveView('profile')}>
                      View Profile
                    </button>
                  </div>

                <div className="dashboard-card user-profile-card">
                    <div className="user-profile-header">
                      <div className="user-avatar">
                        {user.profileImage ? (
                          <img src={user.profileImage} alt={user.name} />
                        ) : (
                          <div className="avatar-placeholder">
                            {user.name.charAt(0).toUpperCase()}
                    </div>
                        )}
                  </div>
                      <div className="user-info">
                    <div className="user-profile-name">{user.name}</div>
                    <div className="user-profile-email">{user.email}</div>
                    <div className={`user-profile-type ${user.userType}`}>
                      <span className="user-profile-type-icon">
                        {user.userType === 'client' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                          </svg>
                        )}
                      </span>
                      <span className="user-profile-type-text">{user.userType === 'client' ? 'Client Account' : 'Translator Account'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="profile-completion">
                      <div className="completion-header">
                        <span>Profile Completion</span>
                        <span className="completion-percentage">70%</span>
                      </div>
                      <div className="completion-bar">
                        <div className="completion-progress" style={{ width: '70%' }}></div>
                      </div>
                      <div className="completion-tips">
                        Complete your profile to increase visibility and trust.
                      </div>
                    </div>

                    <div className="user-profile-verification">
                      <div className="verification-header">
                      <span className="verification-status not-verified">
                        <VerificationIcon />
                        {t('notVerified')}
                      </span>
                      <button
                        className="verification-button"
                        onClick={() => setActiveView('verification')}
                      >
                        {t('verifyNow')}
                      </button>
                      </div>
                      <div className="verification-description">
                        Verify your identity to unlock all platform features and build trust with clients.
                      </div>
                    </div>

                    <div className="user-profile-actions">
                      <button className="user-profile-button" onClick={() => setActiveView('profile')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        {t('editProfile')}
                      </button>
                      <button className="user-profile-button" onClick={() => setActiveView('settings')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="3"></circle>
                          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                        </svg>
                        Settings
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats Section */}
                <div className="dashboard-section">
                  <div className="section-header">
                    <h3>Statistics</h3>
                    <button className="section-action" onClick={() => setActiveView('translations')}>
                      View All
                    </button>
                  </div>

                  <div className="stats-cards">
                {user.userType === 'client' ? (
                  <>
                        <div className="stats-card" style={{"--i": 1}}>
                          <div className="stats-card-icon">
                          <DocumentIcon />
                        </div>
                          <div className="stats-card-content">
                            <div className="stats-card-title">{t('activeRequests')}</div>
                            <div className="stats-card-value">{stats.active}</div>
                            <div className="stats-card-description">
                        {stats.active === 0 ? 'No active translation requests' :
                         stats.active === 1 ? '1 translation request in progress' :
                         `${stats.active} translation requests in progress`}
                            </div>
                            <div className="stats-card-trend">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                <polyline points="17 6 23 6 23 12"></polyline>
                              </svg>
                              <span>+5% from last month</span>
                            </div>
                      </div>
                    </div>

                        <div className="stats-card" style={{"--i": 2}}>
                          <div className="stats-card-icon">
                          <CheckIcon />
                        </div>
                          <div className="stats-card-content">
                            <div className="stats-card-title">{t('completed')}</div>
                            <div className="stats-card-value">{stats.completed}</div>
                            <div className="stats-card-description">
                        {stats.completed === 0 ? 'No completed translations' :
                         stats.completed === 1 ? '1 translation completed' :
                         `${stats.completed} translations completed`}
                            </div>
                            <div className="stats-card-trend">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                                <polyline points="17 18 23 18 23 12"></polyline>
                              </svg>
                              <span>+12% from last month</span>
                            </div>
                      </div>
                    </div>

                        <div className="stats-card" style={{"--i": 3}}>
                          <div className="stats-card-icon">
                          <WordsIcon />
                        </div>
                          <div className="stats-card-content">
                            <div className="stats-card-title">{t('totalWords')}</div>
                            <div className="stats-card-value">{stats.totalWords}</div>
                            <div className="stats-card-description">
                        {stats.totalWords === 0 ? 'No words translated yet' :
                         stats.totalWords === 1 ? '1 word translated' :
                         `${stats.totalWords} words translated`}
                      </div>
                      {stats.totalWords > 0 && (
                        <div className="progress-container">
                                <div className="progress-label">
                                  <span>Progress to next tier</span>
                                  <span>{Math.min(100, Math.floor((stats.totalWords / 1000) * 100))}%</span>
                                </div>
                                <div className="progress-bar-container">
                          <div
                            className="progress-bar"
                            style={{ width: `${Math.min(100, (stats.totalWords / 1000) * 100)}%` }}
                          ></div>
                                </div>
                        </div>
                      )}
                          </div>
                    </div>
                  </>
                ) : (
                  <>
                        <div className="stats-card" style={{"--i": 1}}>
                          <div className="stats-card-icon">
                          <RequestsIcon />
                        </div>
                          <div className="stats-card-content">
                            <div className="stats-card-title">{t('availableRequests')}</div>
                            <div className="stats-card-value">{stats.active}</div>
                            <div className="stats-card-description">
                        {stats.active === 0 ? 'No available translation requests' :
                         stats.active === 1 ? '1 translation request available' :
                         `${stats.active} translation requests available`}
                            </div>
                            <div className="stats-card-trend">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                <polyline points="17 6 23 6 23 12"></polyline>
                              </svg>
                              <span>+8% from last week</span>
                            </div>
                      </div>
                    </div>

                        <div className="stats-card" style={{"--i": 2}}>
                          <div className="stats-card-icon">
                          <CheckIcon />
                        </div>
                          <div className="stats-card-content">
                            <div className="stats-card-title">{t('completedJobs')}</div>
                            <div className="stats-card-value">{stats.completed}</div>
                            <div className="stats-card-description">
                        {stats.completed === 0 ? 'No completed jobs' :
                         stats.completed === 1 ? '1 job completed' :
                         `${stats.completed} jobs completed`}
                            </div>
                            <div className="stats-card-trend">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                <polyline points="17 6 23 6 23 12"></polyline>
                              </svg>
                              <span>+15% from last month</span>
                            </div>
                      </div>
                    </div>

                        <div className="stats-card" style={{"--i": 3}}>
                          <div className="stats-card-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                          </svg>
                        </div>
                          <div className="stats-card-content">
                            <div className="stats-card-title">{t('earnings')}</div>
                            <div className="stats-card-value">$0</div>
                            <div className="stats-card-description">Total earnings from completed translations</div>
                            <div className="stats-card-trend">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                <polyline points="17 6 23 6 23 12"></polyline>
                              </svg>
                              <span>+0% from last month</span>
                      </div>
                          </div>
                    </div>
                  </>
                )}
                  </div>
                </div>
              </div>

              {/* Translator Chart - Only show for translators */}
              {user.userType === 'translator' && (
                <div className="dashboard-section">
                  <div className="section-header">
                    <h3>Translation Analytics</h3>
                    <div className="chart-period-selector">
                      <button
                        className={`chart-period-btn ${activePeriod === 'week' ? 'active' : ''}`}
                        onClick={() => updateChartData('week')}
                      >
                        Week
                      </button>
                      <button
                        className={`chart-period-btn ${activePeriod === 'month' ? 'active' : ''}`}
                        onClick={() => updateChartData('month')}
                      >
                        Month
                      </button>
                      <button
                        className={`chart-period-btn ${activePeriod === 'year' ? 'active' : ''}`}
                        onClick={() => updateChartData('year')}
                      >
                        Year
                      </button>
                    </div>
                  </div>

                  <div className="analytics-card">
                    <div className="chart-container">
                  <TranslatorChart data={chartData} />
                    </div>

                  <div className="chart-summary">
                    <div className="chart-summary-item">
                        <div className="summary-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                          </svg>
                    </div>
                        <div className="summary-content">
                          <div className="summary-value">{chartData.tasks.reduce((a, b) => a + b, 0)}</div>
                          <div className="summary-label">Total Tasks</div>
                        </div>
                      </div>

                    <div className="chart-summary-item">
                        <div className="summary-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                          </svg>
                    </div>
                        <div className="summary-content">
                          <div className="summary-value">{chartData.pages.reduce((a, b) => a + b, 0)}</div>
                          <div className="summary-label">Total Pages</div>
                        </div>
                      </div>

                    <div className="chart-summary-item">
                        <div className="summary-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                        </div>
                        <div className="summary-content">
                          <div className="summary-value">
                        {(chartData.pages.reduce((a, b) => a + b, 0) / chartData.tasks.reduce((a, b) => a + b, 0)).toFixed(1)}
                          </div>
                          <div className="summary-label">Avg. Pages per Task</div>
                        </div>
                      </div>

                      <div className="chart-summary-item">
                        <div className="summary-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                        </div>
                        <div className="summary-content">
                          <div className="summary-value">98%</div>
                          <div className="summary-label">Completion Rate</div>
                        </div>
                      </div>
                    </div>

                    <div className="chart-insights">
                      <div className="insights-header">
                        <h4>Insights</h4>
                      </div>
                      <div className="insights-content">
                        <div className="insight-item">
                          <div className="insight-icon positive">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                              <polyline points="17 6 23 6 23 12"></polyline>
                            </svg>
                          </div>
                          <div className="insight-text">Your task completion rate has increased by 15% compared to last month.</div>
                        </div>

                        <div className="insight-item">
                          <div className="insight-icon neutral">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                          </div>
                          <div className="insight-text">Your average pages per task remains steady at {(chartData.pages.reduce((a, b) => a + b, 0) / chartData.tasks.reduce((a, b) => a + b, 0)).toFixed(1)} pages.</div>
                        </div>

                        <div className="insight-item">
                          <div className="insight-icon tip">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="12" y1="16" x2="12" y2="12"></line>
                              <line x1="12" y1="8" x2="12.01" y2="8"></line>
                            </svg>
                          </div>
                          <div className="insight-text">Tip: Completing tasks faster can increase your visibility in search results and lead to more job opportunities.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Activity Timeline Section */}
              <div className="dashboard-section">
                <div className="section-header">
                  <h3>Recent Activity</h3>
                  <button className="section-action" onClick={() => setActiveView('translations')}>
                    View All
                  </button>
                </div>

                <div className="activity-timeline">
                {loading ? (
                    <div className="loading">
                      <div className="loading-spinner"></div>
                      <p>Loading activity...</p>
                    </div>
                ) : translationItems.length > 0 ? (
                    <>
                    {translationItems.slice(0, 5).map(translation => (
                      <div key={translation.id} className="activity-item">
                          <div className={`activity-icon ${translation.status}`}>
                            {translation.status === 'completed' ? (
                              <CheckIcon />
                            ) : translation.status === 'in-progress' ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                              </svg>
                            ) : (
                              <DocumentIcon />
                            )}
                        </div>
                        <div className="activity-content">
                            <div className="activity-header">
                          <div className="activity-title">
                            Translation from {translation.sourceLanguage.toUpperCase()} to {translation.targetLanguage.toUpperCase()}
                          </div>
                          <div className="activity-time">{new Date(translation.createdAt).toLocaleString()}</div>
                            </div>
                            <div className="activity-description">
                              <span className={`activity-status status-${translation.status}`}>{translation.status}</span>
                              <span className="activity-words">{translation.wordCount} words</span>
                            </div>
                            <div className="activity-text">
                              {translation.originalText.substring(0, 80)}...
                            </div>
                            <div className="activity-actions">
                              <button
                                className="activity-action-btn"
                                onClick={() => {
                                  // View translation details
                                  console.log(`View translation ${translation.id}`);
                                }}
                              >
                                View Details
                              </button>
                              {translation.status === 'completed' && (
                                <button
                                  className="activity-action-btn"
                                  onClick={() => {
                                    // Download translation
                                    console.log(`Download translation ${translation.id}`);
                                  }}
                                >
                                  Download
                                </button>
                              )}
                            </div>
                        </div>
                      </div>
                    ))}
                      <div className="view-more-container">
                    <button
                          className="view-more-btn"
                      onClick={() => setActiveView('translations')}
                    >
                      View All Translations
                    </button>
                  </div>
                    </>
                  ) : (
                    <div className="empty-activity">
                      <div className="empty-activity-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                  </div>
                      <h3>No Recent Activity</h3>
                      <p>Your recent activities will appear here once you start using the platform.</p>
                      {user.userType === 'client' ? (
                        <button
                          className="start-action-btn"
                          onClick={() => setActiveView('find-translator')}
                        >
                          Find a Translator
                        </button>
                      ) : (
                        <button
                          className="start-action-btn"
                          onClick={() => setActiveView('requests')}
                        >
                          Browse Translation Requests
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeView === 'translations' && (
            <div className="translator-work-container">
              <TranslatorWorkPage userType={user.userType} />
                </div>
          )}



          {activeView === 'verification' && (
            <div className="verification-container-wrapper">
              <h2>{t('verification')}</h2>
              <VerificationPage user={user} />
            </div>
          )}

          {activeView === 'messages' && (
            <div className="messages-container-wrapper">
              <MessagesTab />
            </div>
          )}

          {activeView === 'requests' && (
            <div className="requests-container-wrapper">
              <TranslationRequestsPage />
            </div>
          )}

          {activeView === 'my-requests' && (
            <div className="requests-container-wrapper">
              <TranslationRequestsPage />
            </div>
          )}

          {activeView === 'find-translator' && (
            <>
              <h2>Find a Translator</h2>

              <div className="find-translator-container">
                {/* Search bar at the top */}
                <div className="search-bar">
                  <div className="search-input-container">
                    <SearchIcon />
                    <input
                      type="text"
                      placeholder="Search by name, language, or specialty..."
                      className="search-input"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button
                        className="clear-search"
                        onClick={() => setSearchQuery('')}
                        title="Clear search"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

                <div className="search-filters">
                  <div className="filter-group">
                    <label>Language Pair</label>
                    <div className="language-pair-selector">
                      <select
                        className="language-select"
                        value={sourceLang}
                        onChange={(e) => setSourceLang(e.target.value)}
                      >
                        <option value="">Source Language</option>
                        <option value="English">English</option>
                        <option value="French">French</option>
                        <option value="Spanish">Spanish</option>
                        <option value="German">German</option>
                        <option value="Italian">Italian</option>
                        <option value="Arabic">Arabic</option>
                      </select>
                      <div className="language-arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </div>
                      <select
                        className="language-select"
                        value={targetLang}
                        onChange={(e) => setTargetLang(e.target.value)}
                      >
                        <option value="">Target Language</option>
                        <option value="English">English</option>
                        <option value="French">French</option>
                        <option value="Spanish">Spanish</option>
                        <option value="German">German</option>
                        <option value="Italian">Italian</option>
                        <option value="Arabic">Arabic</option>
                      </select>
                    </div>
                  </div>

                  <div className="filter-group">
                    <label>Specialization</label>
                    <select
                      className="filter-select"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                    >
                      <option value="">All Specializations</option>
                      <option value="Legal">Legal</option>
                      <option value="Medical">Medical</option>
                      <option value="Technical">Technical</option>
                      <option value="Financial">Financial</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Literary">Literary</option>
                      <option value="IT">IT</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <label>Rating</label>
                    <div className="rating-filter">
                      <label className="rating-option">
                        <input
                          type="radio"
                          name="rating"
                          value="all"
                          checked={minRating === 'all'}
                          onChange={() => setMinRating('all')}
                        />
                        <span>All</span>
                      </label>
                      <label className="rating-option">
                        <input
                          type="radio"
                          name="rating"
                          value="4"
                          checked={minRating === '4'}
                          onChange={() => setMinRating('4')}
                        />
                        <span>4+ Stars</span>
                      </label>
                      <label className="rating-option">
                        <input
                          type="radio"
                          name="rating"
                          value="5"
                          checked={minRating === '5'}
                          onChange={() => setMinRating('5')}
                        />
                        <span>5 Stars</span>
                      </label>
                    </div>
                  </div>

                  <div className="filter-group">
                    <label>Price Range ($ per word)</label>
                    <div className="price-range-slider">
                      <input
                        type="range"
                        min="0"
                        max="0.25"
                        step="0.01"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([0, parseFloat(e.target.value)])}
                        className="price-slider"
                      />
                      <div className="price-range-values">
                        <span>$0.00</span>
                        <span>${priceRange[1].toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="filter-actions">
                    <div className="view-toggle">
                      <button
                        className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                        title="Grid view"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="7" height="7"></rect>
                          <rect x="14" y="3" width="7" height="7"></rect>
                          <rect x="14" y="14" width="7" height="7"></rect>
                          <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                    </button>
                      <button
                        className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                        title="List view"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="8" y1="6" x2="21" y2="6"></line>
                          <line x1="8" y1="12" x2="21" y2="12"></line>
                          <line x1="8" y1="18" x2="21" y2="18"></line>
                          <line x1="3" y1="6" x2="3.01" y2="6"></line>
                          <line x1="3" y1="12" x2="3.01" y2="12"></line>
                          <line x1="3" y1="18" x2="3.01" y2="18"></line>
                        </svg>
                      </button>
                    </div>

                    <div className="sort-dropdown">
                      <label>Sort by:</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-select"
                      >
                        <option value="rating">Highest Rating</option>
                        <option value="price">Lowest Price</option>
                        <option value="projects">Most Projects</option>
                      </select>
                    </div>

                    <button
                      className="refresh-button"
                      onClick={() => {
                        setRefreshTranslators(prev => prev + 1);
                        notify('Refreshing translator list...', 'info', 2000);
                      }}
                      title="Refresh translator list"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 4v6h-6"></path>
                        <path d="M1 20v-6h6"></path>
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path>
                        <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"></path>
                      </svg>
                      Refresh
                    </button>
                  </div>
                </div>

                {/* Active filters display */}
                {(sourceLang || targetLang || specialty || minRating !== 'all' || searchQuery) && (
                  <div className="active-filters">
                    <span className="active-filters-label">Active filters:</span>
                    <div className="filter-tags">
                      {sourceLang && (
                        <div className="filter-tag">
                          <span>Source: {sourceLang}</span>
                          <button onClick={() => setSourceLang('')}>×</button>
                        </div>
                      )}
                      {targetLang && (
                        <div className="filter-tag">
                          <span>Target: {targetLang}</span>
                          <button onClick={() => setTargetLang('')}>×</button>
                        </div>
                      )}
                      {specialty && (
                        <div className="filter-tag">
                          <span>Specialty: {specialty}</span>
                          <button onClick={() => setSpecialty('')}>×</button>
                        </div>
                      )}
                      {minRating !== 'all' && (
                        <div className="filter-tag">
                          <span>Rating: {minRating}+ stars</span>
                          <button onClick={() => setMinRating('all')}>×</button>
                        </div>
                      )}
                      {searchQuery && (
                        <div className="filter-tag">
                          <span>Search: {searchQuery}</span>
                          <button onClick={() => setSearchQuery('')}>×</button>
                        </div>
                      )}
                      <button
                        className="clear-all-filters"
                        onClick={() => {
                          setSourceLang('');
                          setTargetLang('');
                          setSpecialty('');
                          setMinRating('all');
                          setSearchQuery('');
                          setPriceRange([0, 0.25]);
                        }}
                      >
                        Clear all
                      </button>
                    </div>
                  </div>
                )}

                <div className={`translator-results ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
                  {error && (
                    <div className="error-message">
                      <div className="error-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                      </div>
                      <p>{error}</p>
                    </div>
                  )}
                  {loading ? (
                    <div className="loading">
                      <div className="loading-spinner"></div>
                      <p>Loading translators...</p>
                    </div>
                  ) : !error && filteredTranslators && filteredTranslators.length > 0 ? (
                    filteredTranslators.map(translator => (
                      <div key={translator.id} className="translator-card">
                        <div className="translator-header">
                          <div className="translator-avatar">
                            {translator.profileImage ? (
                              <img src={translator.profileImage} alt={translator.name} />
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                              </svg>
                            )}
                          </div>
                          <div className="translator-info">
                            <h3>{translator.name}</h3>
                            <div className="translator-languages">
                              {translator.languages ? translator.languages.join(' • ') : 'English'}
                            </div>
                            <div className="translator-rating">
                              <span className="stars" title={`${translator.rating || 0} out of 5 stars`}>
                                {'★'.repeat(Math.floor(translator.rating || 0))}
                                {'☆'.repeat(5 - Math.floor(translator.rating || 0))}
                              </span>
                              <span className="rating-count">({translator.reviewCount || 0} reviews)</span>
                            </div>
                          </div>
                          <div className="translator-verified-badge" title="Verified Translator">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                              <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                          </div>
                        </div>
                        <div className="translator-specialties">
                          {translator.specialties && translator.specialties.map((specialty, index) => (
                            <span
                              key={index}
                              className="specialty-tag"
                              onClick={() => setSpecialty(specialty)}
                            >
                              {specialty}
                            </span>
                          ))}
                          {(!translator.specialties || translator.specialties.length === 0) && (
                            <span className="specialty-tag">General</span>
                          )}
                        </div>
                        <div className="translator-description">
                          {translator.description || `${translator.name} is a professional translator registered on our platform.`}
                        </div>
                        <div className="translator-stats">
                          <div className="stat">
                            <div className="stat-value">{translator.completedProjects || 0}</div>
                            <div className="stat-label">Projects</div>
                          </div>
                          <div className="stat">
                            <div className="stat-value">{translator.onTimePercentage || 100}%</div>
                            <div className="stat-label">On Time</div>
                          </div>
                          <div className="stat">
                            <div className="stat-value">${typeof translator.ratePerWord === 'number' ? translator.ratePerWord.toFixed(2) : (translator.ratePerWord || '0.10')}</div>
                            <div className="stat-label">Per Word</div>
                          </div>
                        </div>
                        <div className="translator-actions">
                          <button
                            className="action-button action-button-primary"
                            onClick={() => navigate(`/apply-translation?translatorId=${translator.id}`)}
                          >
                            Contact
                          </button>
                          <button
                            className="action-button"
                            onClick={() => {
                              setSelectedTranslator(translator);
                              setShowProfileModal(true);
                            }}
                          >
                            View Profile
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                      </div>
                      {(sourceLang || targetLang || specialty || minRating !== 'all' || searchQuery) ? (
                        <>
                          <h3>No translators match your filters</h3>
                          <p>Try adjusting your search criteria or clearing some filters.</p>
                          <button
                            className="clear-filters-btn"
                            onClick={() => {
                              setSourceLang('');
                              setTargetLang('');
                              setSpecialty('');
                              setMinRating('all');
                              setSearchQuery('');
                              setPriceRange([0, 0.25]);
                            }}
                          >
                            Clear all filters
                          </button>
                        </>
                      ) : (
                        <>
                      <h3>No registered translators found</h3>
                      <p>There are currently no registered translators in the system. New translator accounts will appear here automatically when they register.</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}



          {activeView === 'price-calculator' && (
            <>
              <h2>Translation Price Calculator</h2>
              <div className="calculator-container modern-calculator">
                <form className="calculator-form" onSubmit={handleCalculatePrice}>
                  <div className="form-group">
                    <label>Source Language</label>
                    <select className="form-control" value={calcSourceLang} onChange={e => setCalcSourceLang(e.target.value)}>
                      <option value="">Select source language</option>
                      <option value="en">English</option>
                      <option value="fr">French</option>
                      <option value="es">Spanish</option>
                      <option value="de">German</option>
                      <option value="it">Italian</option>
                      <option value="ar">Arabic</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Target Language</label>
                    <select className="form-control" value={calcTargetLang} onChange={e => setCalcTargetLang(e.target.value)}>
                      <option value="">Select target language</option>
                      <option value="en">English</option>
                      <option value="fr">French</option>
                      <option value="es">Spanish</option>
                      <option value="de">German</option>
                      <option value="it">Italian</option>
                      <option value="ar">Arabic</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Document Type</label>
                    <select className="form-control" value={calcDocType} onChange={e => setCalcDocType(e.target.value)}>
                      <option value="general">General</option>
                      <option value="legal">Legal</option>
                      <option value="medical">Medical</option>
                      <option value="technical">Technical</option>
                      <option value="financial">Financial</option>
                      <option value="marketing">Marketing</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Number of Pages</label>
                    <input type="number" className="form-control" min="1" value={calcPages} onChange={e => setCalcPages(Number(e.target.value))} />
                  </div>
                  <div className="form-group">
                    <label>Price per Page (TND)</label>
                    <input type="number" className="form-control" min="15" value={calcPricePerPage} onChange={e => setCalcPricePerPage(Number(e.target.value))} />
                    <small className="form-hint">Minimum 15 TND per page. You can increase for premium service.</small>
                  </div>
                  <div className="form-group">
                    <label>Delivery Time</label>
                    <select className="form-control" value={calcDelivery} onChange={e => setCalcDelivery(e.target.value)}>
                      <option value="standard">Standard (3-5 days)</option>
                      <option value="express">Express (1-2 days, +15%)</option>
                      <option value="urgent">Urgent (24 hours, +30%)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Additional Services</label>
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input type="checkbox" checked={calcServices.proofreading} onChange={() => handleCalcServiceChange('proofreading')} /> Proofreading by second translator (+10%)
                      </label>
                      <label className="checkbox-label">
                        <input type="checkbox" checked={calcServices.formatting} onChange={() => handleCalcServiceChange('formatting')} /> Formatting and layout matching (+8%)
                      </label>
                      <label className="checkbox-label">
                        <input type="checkbox" checked={calcServices.certified} onChange={() => handleCalcServiceChange('certified')} /> Certified translation (+20%)
                      </label>
                    </div>
                  </div>
                  {calcError && <div className="verification-error" style={{marginBottom:8}}>{calcError}</div>}
                  <button className="calculate-button action-button action-button-primary" type="submit">
                    <CalculatorIcon /> Calculate Price
                  </button>
                </form>
                <div className="price-result">
                  <div className="price-card modern-price-card">
                    <h3>Estimated Price</h3>
                    <div className="price-value" style={{fontSize:'2.2rem',color:'#009688',fontWeight:700}}>
                      {calcResult ? `${calcResult.total.toFixed(2)} TND` : '--'}
                    </div>
                    <div className="price-breakdown">
                      <div className="breakdown-item">
                        <span>Base translation:</span>
                        <span>{calcResult ? `${calcResult.base.toFixed(2)} TND` : '--'}</span>
                      </div>
                      <div className="breakdown-item">
                        <span>Delivery markup:</span>
                        <span>{calcResult ? `${calcResult.deliveryMarkup.toFixed(2)} TND` : '--'}</span>
                      </div>
                      <div className="breakdown-item">
                        <span>Additional services:</span>
                        <span>{calcResult ? `${calcResult.servicesMarkup.toFixed(2)} TND` : '--'}</span>
                      </div>
                    </div>
                    <div className="price-info">
                      <p>Enter your translation details to get an estimate. Minimum price per page is 15 TND.</p>
                    </div>
                    <div className="price-actions">
                      <button className="action-button" disabled>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Save Quote as PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeView === 'requests' && (
            <>
              <h2>{t('translationRequests')}</h2>

              <div className="requests-container">
                <div className="requests-filters">
                  <div className="filter-tabs">
                    <button className="filter-tab active">Available</button>
                    <button className="filter-tab">In Progress</button>
                    <button className="filter-tab">Completed</button>
                  </div>

                  <div className="filter-options">
                    <select className="filter-select">
                      <option value="all">All Languages</option>
                      <option value="en-fr">English to French</option>
                      <option value="en-es">English to Spanish</option>
                      <option value="fr-en">French to English</option>
                      <option value="es-en">Spanish to English</option>
                      <option value="ar-en">Arabic to English</option>
                    </select>

                    <select className="filter-select">
                      <option value="all">All Categories</option>
                      <option value="legal">Legal</option>
                      <option value="medical">Medical</option>
                      <option value="technical">Technical</option>
                      <option value="financial">Financial</option>
                      <option value="marketing">Marketing</option>
                    </select>

                    <select className="filter-select">
                      <option value="all">All Deadlines</option>
                      <option value="urgent">Urgent (24h)</option>
                      <option value="3days">3 Days</option>
                      <option value="week">1 Week</option>
                      <option value="twoweeks">2+ Weeks</option>
                    </select>
                  </div>
                </div>

                <div className="requests-list">
                  <div className="empty-requests">
                    <div className="empty-state-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                      </svg>
                    </div>
                    <h3>No translation requests available</h3>
                    <p>There are currently no translation requests matching your filters.</p>
                    <p>Try adjusting your filter settings or check back later.</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeView === 'messages' && (
            <>
              <h2>{t('clientMessages')}</h2>

              <div className="messages-container">
                <div className="messages-sidebar">
                  <div className="messages-search">
                    <input type="text" placeholder="Search messages..." className="search-input" />
                  </div>

                  <div className="conversation-list">
                    <div className="empty-conversations">
                      <div className="empty-state-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </div>
                      <h3>No messages yet</h3>
                      <p>Your message history will appear here.</p>
                      <p>Start a conversation with a translator or client.</p>
                    </div>
                  </div>
                </div>

                <div className="messages-content">
                  <div className="messages-header">
                    <div className="contact-info">
                      <div className="contact-name">No conversation selected</div>
                      <div className="contact-status">-</div>
                    </div>
                    <div className="messages-actions">
                      <button className="message-action-button" disabled>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"></path>
                          <circle cx="8" cy="9" r="2"></circle>
                          <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                        </svg>
                      </button>
                      <button className="message-action-button" disabled>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                      </button>
                      <button className="message-action-button" disabled>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="1"></circle>
                          <circle cx="19" cy="12" r="1"></circle>
                          <circle cx="5" cy="12" r="1"></circle>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="messages-body">
                    <div className="empty-messages">
                      <div className="empty-state-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </div>
                      <h3>Select a conversation</h3>
                      <p>Choose a conversation from the list or start a new one.</p>
                    </div>
                  </div>

                  <div className="messages-footer">
                    <button className="message-action-button">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                        <line x1="9" y1="9" x2="9.01" y2="9"></line>
                        <line x1="15" y1="9" x2="15.01" y2="9"></line>
                      </svg>
                    </button>
                    <button className="message-action-button">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </button>
                    <input type="text" placeholder="Type a message..." className="message-input" />
                    <button className="send-button">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeView === 'profile' && !isEditingProfile && (
            <>
              <h2>{t('yourProfile')}</h2>

              {profileUpdateSuccess && (
                <div className="success-message">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <div className="profile-container">
                <div className="profile-header">
                  <div className="profile-avatar" style={user?.profileImage ? {backgroundImage: `url(${user.profileImage})`, backgroundSize: 'cover'} : {}}>
                    {!user?.profileImage && <ProfileIcon />}
                  </div>
                  <div className="profile-title">
                    <h3>{user?.name || 'User'}</h3>
                    <div className="profile-subtitle">
                      <span className="profile-type-badge">{user?.userType === 'client' ? t('client') : t('translator')}</span>
                      <span className="profile-email">{user?.email || 'email@example.com'}</span>
                    </div>
                  </div>
                </div>

                <div className="profile-section">
                  <h3>{t('accountInformation')}</h3>
                  <div className="profile-info-grid">
                    <div className="profile-info-item">
                      <div className="info-label">{t('name')}</div>
                      <div className="info-value">{user?.name || 'User'}</div>
                    </div>
                    <div className="profile-info-item">
                      <div className="info-label">{t('email')}</div>
                      <div className="info-value">{user?.email || 'email@example.com'}</div>
                    </div>
                    <div className="profile-info-item">
                      <div className="info-label">{t('accountType')}</div>
                      <div className="info-value">{user?.userType === 'client' ? t('client') : t('translator')}</div>
                    </div>
                    {user?.bio && (
                      <div className="profile-info-item">
                        <div className="info-label">{t('bio')}</div>
                        <div className="info-value">{user.bio}</div>
                      </div>
                    )}
                    {user?.phone && (
                      <div className="profile-info-item">
                        <div className="info-label">{t('phone')}</div>
                        <div className="info-value">{user.phone}</div>
                      </div>
                    )}
                    {user?.location && (
                      <div className="profile-info-item">
                        <div className="info-label">{t('location')}</div>
                        <div className="info-value">{user.location}</div>
                      </div>
                    )}
                    <div className="profile-info-item">
                      <div className="info-label">{t('language')}</div>
                      <div className="info-value">
                        {currentLanguage === 'en' && t('english')}
                        {currentLanguage === 'fr' && t('french')}
                        {currentLanguage === 'es' && t('spanish')}
                        {currentLanguage === 'ar' && t('arabic')}
                      </div>
                    </div>
                  </div>
                </div>

                {user && user.userType === 'translator' && (
                  <div className="profile-section">
                    <h3>Translator Information</h3>
                    <div className="profile-info-grid">
                      <div className="profile-info-item">
                        <div className="info-label">Specializations</div>
                        <div className="info-value">
                          <div className="specialization-tags">
                            {user.specializations && user.specializations.length > 0 ? (
                              user.specializations.map((spec, index) => (
                                <span key={index} className="specialization-tag">{spec}</span>
                              ))
                            ) : (
                              <span className="no-data">No specializations added yet</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="profile-info-item">
                        <div className="info-label">Languages</div>
                        <div className="info-value">
                          <div className="language-pairs">
                            {user.languages && user.languages.length > 0 ? (
                              user.languages.map((lang, index) => {
                                const langName = {
                                  en: 'English',
                                  fr: 'French',
                                  es: 'Spanish',
                                  ar: 'Arabic',
                                  de: 'German',
                                  it: 'Italian',
                                  pt: 'Portuguese',
                                  ru: 'Russian',
                                  zh: 'Chinese'
                                }[lang] || lang;
                                return (
                                  <span key={index} className="language-pair">{langName}</span>
                                );
                              })
                            ) : (
                              <span className="no-data">No languages added yet</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="profile-section">
                  <h3>Account Statistics</h3>
                  <div className="profile-stats-grid">
                    <div className="profile-stat-card">
                      <div className="stat-icon">
                        <DocumentIcon />
                      </div>
                      <div className="stat-content">
                        <div className="stat-value">{stats.active || 0}</div>
                        <div className="stat-label">{user?.userType === 'client' ? t('activeRequests') : 'Active Jobs'}</div>
                      </div>
                    </div>
                    <div className="profile-stat-card">
                      <div className="stat-icon">
                        <CheckIcon />
                      </div>
                      <div className="stat-content">
                        <div className="stat-value">{stats.completed || 0}</div>
                        <div className="stat-label">{t('completed')}</div>
                      </div>
                    </div>
                    <div className="profile-stat-card">
                      <div className="stat-icon">
                        <WordsIcon />
                      </div>
                      <div className="stat-content">
                        <div className="stat-value">{stats.totalWords || 0}</div>
                        <div className="stat-label">{t('totalWords')}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="profile-actions">
                  <button className="profile-edit-button" onClick={() => setIsEditingProfile(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    {t('editProfile')}
                  </button>
                </div>
              </div>
            </>
          )}

          {activeView === 'profile' && isEditingProfile && (
            <EditProfile
              user={user}
              onSave={handleSaveProfile}
              onCancel={handleCancelEditProfile}
              translations={translations}
            />
          )}

          {activeView === 'settings' && (
            <>
              <h2>{t('settings')}</h2>

              <div className="settings-section">
                <h3>{t('accountInformation')}</h3>
                <div className="user-info">
                  <div className="info-row">
                    <span className="info-label">{t('name')}:</span>
                    <span className="info-value">{user.name}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">{t('email')}:</span>
                    <span className="info-value">{user.email}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">{t('accountType')}:</span>
                    <span className="info-value">{user.userType === 'client' ? t('client') : t('translator')}</span>
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h3>{t('personalization')}</h3>

                <div className="personalization-options">
                  {/* Language Settings */}
                  <div className="personalization-group">
                    <h4>{t('language')}</h4>
                    <div className="language-options">
                      <button
                        className={`language-option ${currentLanguage === 'en' ? 'active' : ''}`}
                        onClick={() => changeLanguage('en')}
                      >
                        <span className="language-flag">🇺🇸</span>
                        <span className="language-name">{t('english')}</span>
                      </button>

                      <button
                        className={`language-option ${currentLanguage === 'fr' ? 'active' : ''}`}
                        onClick={() => changeLanguage('fr')}
                      >
                        <span className="language-flag">🇫🇷</span>
                        <span className="language-name">{t('french')}</span>
                      </button>

                      <button
                        className={`language-option ${currentLanguage === 'es' ? 'active' : ''}`}
                        onClick={() => changeLanguage('es')}
                      >
                        <span className="language-flag">🇪🇸</span>
                        <span className="language-name">{t('spanish')}</span>
                      </button>

                      <button
                        className={`language-option ${currentLanguage === 'ar' ? 'active' : ''}`}
                        onClick={() => changeLanguage('ar')}
                      >
                        <span className="language-flag">🇸🇦</span>
                        <span className="language-name">{t('arabic')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Enhanced Theme Settings */}
                  <div className="personalization-group">
                    <h4>Color Themes</h4>
                    <div className="enhanced-theme-grid">
                      {Object.entries(themes).map(([key, theme]) => (
                      <button
                          key={key}
                          className={`enhanced-theme-option ${currentTheme === key ? 'active' : ''}`}
                          onClick={() => handleThemeChange(key)}
                          style={{
                            '--theme-primary': theme.primary,
                            '--theme-secondary': theme.secondary,
                            '--theme-gradient': theme.gradient
                          }}
                        >
                          <div className="theme-preview">
                            <div className="theme-color-primary"></div>
                            <div className="theme-color-secondary"></div>
                            <div className="theme-color-accent"></div>
                          </div>
                          <span className="theme-name">{theme.name}</span>
                      </button>
                      ))}
                    </div>
                  </div>

                  {/* Animation Settings */}
                  <div className="personalization-group">
                    <h4>Animations</h4>
                    <div className="animation-controls">
                      <label className="animation-toggle">
                        <input
                          type="checkbox"
                          checked={animationsEnabled}
                          onChange={(e) => handleAnimationToggle(e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                        <span className="toggle-label">Enable Animations</span>
                      </label>

                      {animationsEnabled && (
                        <div className="animation-speed-control">
                          <label>Animation Speed:</label>
                          <div className="speed-options">
                            {['slow', 'normal', 'fast'].map(speed => (
                      <button
                                key={speed}
                                className={`speed-option ${animationSpeed === speed ? 'active' : ''}`}
                                onClick={() => handleAnimationSpeedChange(speed)}
                      >
                                {speed.charAt(0).toUpperCase() + speed.slice(1)}
                      </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Layout Customization */}
                  <div className="personalization-group">
                    <h4>Layout & Style</h4>
                    <div className="layout-controls">
                      <label className="layout-toggle">
                        <input
                          type="checkbox"
                          checked={compactMode}
                          onChange={(e) => handleCompactModeToggle(e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                        <span className="toggle-label">Compact Mode</span>
                      </label>

                      <div className="style-control">
                        <label>Border Radius:</label>
                        <div className="radius-options">
                          {['none', 'small', 'medium', 'large', 'extra-large'].map(radius => (
                            <button
                              key={radius}
                              className={`radius-option ${borderRadius === radius ? 'active' : ''}`}
                              onClick={() => handleBorderRadiusChange(radius)}
                            >
                              {radius.charAt(0).toUpperCase() + radius.slice(1).replace('-', ' ')}
                      </button>
                          ))}
                        </div>
                      </div>

                      <div className="style-control">
                        <label>Shadow Intensity:</label>
                        <div className="shadow-options">
                          {['none', 'light', 'medium', 'strong'].map(intensity => (
                            <button
                              key={intensity}
                              className={`shadow-option ${shadowIntensity === intensity ? 'active' : ''}`}
                              onClick={() => handleShadowIntensityChange(intensity)}
                            >
                              {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Celebrations & Special Events */}
                  <div className="personalization-group">
                    <h4>Celebrations & Events</h4>
                    <div className="celebration-controls">
                      <label className="celebration-toggle">
                        <input
                          type="checkbox"
                          checked={celebrationsEnabled}
                          onChange={(e) => handleCelebrationsToggle(e.target.checked)}
                        />
                        <span className="toggle-slider"></span>
                        <span className="toggle-label">Enable Celebrations</span>
                      </label>

                      {celebrationsEnabled && (
                        <div className="celebration-options">
                          <p className="celebration-description">
                            Automatically celebrate special occasions like Christmas, Women's Day, and more with themed colors and decorations!
                          </p>

                          {/* Cursor Effects Control */}
                          <div className="celebration-sub-option">
                            <label className="celebration-toggle">
                              <input
                                type="checkbox"
                                checked={cursorEffectsEnabled}
                                onChange={(e) => handleCursorEffectsToggle(e.target.checked)}
                              />
                              <span className="toggle-slider"></span>
                              <span className="toggle-label">Enable Cursor Trail Effects</span>
                            </label>
                            <p className="sub-option-description">
                              Show magical cursor trails during celebrations (may affect performance on slower devices)
                            </p>
                          </div>

                          <div className="celebration-demos">
                            <h5>Try a Celebration:</h5>
                            <div className="celebration-demo-grid">
                              {Object.entries(celebrations).map(([key, celebration]) => (
                                <button
                                  key={key}
                                  className="celebration-demo-btn"
                                  onClick={() => triggerCelebrationEnhanced(key)}
                                  title={celebration.message}
                                >
                                  <span className="celebration-emoji">{celebration.emoji}</span>
                                  <span className="celebration-name">{celebration.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h3>{t('notifications')}</h3>
                <div className="notification-options">
                  <label className="notification-option">
                    <input type="checkbox" defaultChecked />
                    <span>{t('emailNotifications')}</span>
                  </label>

                  <label className="notification-option">
                    <input type="checkbox" defaultChecked />
                    <span>{t('browserNotifications')}</span>
                  </label>
                </div>
              </div>

              <div className="settings-section">
                <h3>Help & Setup</h3>
                <div className="help-options">
                  <button className="help-option-btn" onClick={handleRestartTutorial}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                      <path d="M3 3v5h5"></path>
                      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                      <path d="M21 21v-5h-5"></path>
                    </svg>
                    Restart Tutorial
                  </button>

                  <button className="help-option-btn" onClick={handleCustomizeProfile}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Customize Profile
                  </button>

                  <button className="help-option-btn" onClick={simulateNewUserLogin}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 12l2 2 4-4"></path>
                      <path d="M21 12c.552 0 1-.448 1-1V8a2 2 0 0 0-2-2h-5L9.414 0H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3c0-.552-.448-1-1-1z"></path>
                    </svg>
                    Demo: New User Experience
                  </button>

                  <button className="help-option-btn" onClick={() => handleThemeChange('turquoise')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="5"></circle>
                      <line x1="12" y1="1" x2="12" y2="3"></line>
                      <line x1="12" y1="21" x2="12" y2="23"></line>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                      <line x1="1" y1="12" x2="3" y2="12"></line>
                      <line x1="21" y1="12" x2="23" y2="12"></line>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                    Reset to Default Theme
                  </button>

                  <button className="help-option-btn" onClick={() => triggerCelebrationEnhanced('christmas')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                    Test Christmas 🎄
                  </button>

                  <button className="help-option-btn" onClick={() => triggerCelebrationEnhanced('womensDay')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                    Test Women's Day 👩
                  </button>

                  <button className="help-option-btn" onClick={() => triggerCelebrationEnhanced('valentine')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    Test Valentine's 💕
                  </button>

                  <button className="help-option-btn" onClick={() => triggerCelebrationEnhanced('newYear')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12,6 12,12 16,14"></polyline>
                    </svg>
                    Test New Year 🎊
                  </button>
                </div>
              </div>

              <div className="settings-section">
                <h3>{t('security')}</h3>
                <button className="change-password-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  Change Password
                </button>
              </div>

              <div className="settings-actions">
                <button className="save-settings-btn">{t('saveChanges')}</button>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Translator Profile Modal */}
      {showProfileModal && selectedTranslator && (
        <div className="profile-modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <button
                className="profile-modal-close"
                onClick={() => setShowProfileModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="profile-modal-content">
              <div className="profile-modal-hero">
                <div className="profile-hero-bg"></div>
                <div className="profile-hero-content">
                  <div className="profile-avatar-modal">
                    {selectedTranslator.profileImage ? (
                      <img src={selectedTranslator.profileImage} alt={selectedTranslator.name} />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    )}
                    <div className="verified-badge-modal">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                  </div>
                  <div className="profile-hero-info">
                    <h1 className="profile-modal-name">{selectedTranslator.name}</h1>
                    <div className="profile-modal-languages">
                      {selectedTranslator.languages ? selectedTranslator.languages.join(' • ') : 'English • Spanish • French'}
                    </div>
                    <div className="profile-modal-rating">
                      <span className="stars-modal">
                        {'★'.repeat(Math.floor(selectedTranslator.rating || 5))}
                        {'☆'.repeat(5 - Math.floor(selectedTranslator.rating || 5))}
                      </span>
                      <span className="rating-text-modal">
                        {selectedTranslator.rating || 4.9} ({selectedTranslator.reviewCount || 127} reviews)
                      </span>
                    </div>
                    <div className="profile-modal-location">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      {selectedTranslator.location || 'New York, USA'}
                    </div>
                  </div>
                  <div className="profile-modal-actions">
                    <button
                      className="modal-action-btn primary"
                      onClick={() => window.location.href = '/apply-translation'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22 6 12 13 2 6"></polyline>
                      </svg>
                      Contact Now
                    </button>
                    <button className="modal-action-btn secondary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                      Save
                    </button>
                  </div>
                </div>
              </div>

              <div className="profile-modal-body">
                <div className="profile-modal-main">
                  <div className="profile-modal-section">
                    <h3 className="section-title">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                      About
                    </h3>
                    <p className="profile-modal-description">
                      {selectedTranslator.description || `${selectedTranslator.name} is a professional translator with extensive experience in multiple language pairs. Specialized in technical, legal, and business translations with a focus on accuracy and cultural adaptation.`}
                    </p>
                  </div>

                  <div className="profile-modal-section">
                    <h3 className="section-title">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                      </svg>
                      Specializations
                    </h3>
                    <div className="specializations-modal">
                      {selectedTranslator.specialties && selectedTranslator.specialties.length > 0 ? (
                        selectedTranslator.specialties.map((specialty, index) => (
                          <div key={index} className="specialty-tag">
                            {specialty}
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="specialty-tag">Technical Translation</div>
                          <div className="specialty-tag">Legal Documents</div>
                          <div className="specialty-tag">Business Communication</div>
                          <div className="specialty-tag">Medical Translation</div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="profile-modal-section">
                    <h3 className="section-title">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                      </svg>
                      Recent Reviews
                    </h3>
                    <div className="reviews-modal">
                      <div className="review-modal-item">
                        <div className="review-modal-header">
                          <div className="review-modal-avatar">JD</div>
                          <div className="review-modal-info">
                            <div className="review-modal-name">John Doe</div>
                            <div className="review-modal-stars">★★★★★</div>
                          </div>
                          <div className="review-modal-date">2 days ago</div>
                        </div>
                        <p className="review-modal-text">"Outstanding work! The translation was accurate, delivered on time, and exceeded my expectations. Highly professional service."</p>
                      </div>
                      <div className="review-modal-item">
                        <div className="review-modal-header">
                          <div className="review-modal-avatar">MS</div>
                          <div className="review-modal-info">
                            <div className="review-modal-name">Maria Silva</div>
                            <div className="review-modal-stars">★★★★★</div>
                          </div>
                          <div className="review-modal-date">1 week ago</div>
                        </div>
                        <p className="review-modal-text">"Perfect translation for our legal documents. Great attention to detail and cultural nuances."</p>
                      </div>
                      <div className="review-modal-item">
                        <div className="review-modal-header">
                          <div className="review-modal-avatar">RK</div>
                          <div className="review-modal-info">
                            <div className="review-modal-name">Robert Kim</div>
                            <div className="review-modal-stars">★★★★☆</div>
                          </div>
                          <div className="review-modal-date">2 weeks ago</div>
                        </div>
                        <p className="review-modal-text">"Good quality translation with fast turnaround. Will definitely work with again."</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="profile-modal-sidebar">
                  <div className="stats-modal-card">
                    <h3 className="sidebar-title">Quick Stats</h3>
                    <div className="stats-modal-grid">
                      <div className="stat-modal-item">
                        <div className="stat-modal-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                        </div>
                        <div className="stat-modal-content">
                          <div className="stat-modal-value">{selectedTranslator.completedProjects || 247}</div>
                          <div className="stat-modal-label">Projects</div>
                        </div>
                      </div>
                      <div className="stat-modal-item">
                        <div className="stat-modal-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                        </div>
                        <div className="stat-modal-content">
                          <div className="stat-modal-value">{selectedTranslator.responseTime || '< 2h'}</div>
                          <div className="stat-modal-label">Response</div>
                        </div>
                      </div>
                      <div className="stat-modal-item">
                        <div className="stat-modal-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                          </svg>
                        </div>
                        <div className="stat-modal-content">
                          <div className="stat-modal-value">{selectedTranslator.onTimePercentage || 98}%</div>
                          <div className="stat-modal-label">On Time</div>
                        </div>
                      </div>
                      <div className="stat-modal-item">
                        <div className="stat-modal-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                          </svg>
                        </div>
                        <div className="stat-modal-content">
                          <div className="stat-modal-value">${typeof selectedTranslator.ratePerWord === 'number' ? selectedTranslator.ratePerWord.toFixed(2) : (selectedTranslator.ratePerWord || '0.12')}</div>
                          <div className="stat-modal-label">Per Word</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="availability-modal-card">
                    <h3 className="sidebar-title">Availability</h3>
                    <div className="availability-modal-status">
                      <div className="status-modal-indicator available"></div>
                      <span className="status-modal-text">Available Now</span>
                    </div>
                    <div className="availability-modal-details">
                      <div className="availability-modal-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>Typical: {selectedTranslator.typicalTurnaround || '2-3 days'}</span>
                      </div>
                      <div className="availability-modal-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>Timezone: {selectedTranslator.timezone || 'EST (UTC-5)'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="experience-modal-card">
                    <h3 className="sidebar-title">Experience</h3>
                    <div className="experience-modal-items">
                      <div className="experience-modal-item">
                        <div className="experience-modal-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                        </div>
                        <div className="experience-modal-content">
                          <div className="experience-modal-label">Experience</div>
                          <div className="experience-modal-value">{selectedTranslator.yearsOfExperience || '8+'} years</div>
                        </div>
                      </div>
                      <div className="experience-modal-item">
                        <div className="experience-modal-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                            <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                          </svg>
                        </div>
                        <div className="experience-modal-content">
                          <div className="experience-modal-label">Education</div>
                          <div className="experience-modal-value">{selectedTranslator.education || 'MA Linguistics'}</div>
                        </div>
                      </div>
                      <div className="experience-modal-item">
                        <div className="experience-modal-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                          </svg>
                        </div>
                        <div className="experience-modal-content">
                          <div className="experience-modal-label">Certified</div>
                          <div className="experience-modal-value">{selectedTranslator.certifications || 'ATA Certified'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tutorial Popup */}
      <TutorialPopup
        isVisible={showTutorial}
        onComplete={handleTutorialComplete}
        userType={user?.userType || 'client'}
      />

      {/* Profile Customization Popup */}
      <ProfileCustomizationPopup
        isVisible={showProfileCustomization}
        onComplete={handleProfileCustomizationComplete}
        onSave={handleProfileCustomizationSave}
        userType={user?.userType || 'client'}
        initialData={userProfile}
      />
    </div>
  );
};

export default Dashboard;

