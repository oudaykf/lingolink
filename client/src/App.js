import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import DashboardTest from './components/DashboardTest';
import SimpleDashboard from './components/SimpleDashboard';
import LoginPage from './components/LoginPage';
import ForgotPassword from './components/ForgotPassword';
import VerificationPage from './components/VerificationPage';
import ApplyTranslation from './components/ApplyTranslation';
import ColorChangingLogo from './components/ColorChangingLogo';
import MessagingPage from './components/MessagingPage';
import TranslationRequestsPage from './components/TranslationRequestsPage';
import TranslatorProfilePage from './components/TranslatorProfilePage';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import Features from './components/pages/Features';
import Pricing from './components/pages/Pricing';
import Enterprise from './components/pages/Enterprise';
import About from './components/pages/About';
import Careers from './components/pages/Careers';
import Contact from './components/pages/Contact';
import Privacy from './components/pages/Privacy';
import Terms from './components/pages/Terms';
import Security from './components/pages/Security';
import Services from './components/pages/Services';
import NotificationProvider from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ToastContext';
import './components/Toast.css';

// Global API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

function HomePage({ onAuthenticated }) {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [logoClickTimer, setLogoClickTimer] = useState(null);

  const languages = {
    en: { name: 'English' },
    ar: { name: 'العربية' },
    fr: { name: 'Français' }
  };

  const translations = {
    en: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      getStarted: 'Get Started',
      signIn: 'Sign In',
      signInAlt: 'Login Page',
      heroTitle: 'Legal Document Translation Brokerage',
      heroSubtitle: 'LingoLink connects you with certified legal translators to deliver precise, confidential translations for contracts, patents, and legal documents.',
      featureTitle: 'Our Features',
      howItWorksTitle: 'How It Works',
      testimonialsTitle: 'What Our Clients Say',
      satisfied: 'satisfied customers',
      startTranslating: 'Start Translating',
      viewPricing: 'View Pricing',
      welcomeBack: 'Welcome Back!',
      createAccount: 'Create Account',
      signInSubtitle: 'Sign in to access your translations',
      signUpSubtitle: 'Join our community of translators and clients',
      continueWithGoogle: 'Continue with Google',
      orContinueWithEmail: 'or continue with email',
      fullName: 'Full Name',
      fullNamePlaceholder: 'John Doe',
      emailAddress: 'Email Address',
      emailPlaceholder: 'you@example.com',
      password: 'Password',
      passwordPlaceholder: '••••••••',
      iWantTo: 'Account Type',
      hireTranslators: 'Client',
      workAsTranslator: 'Translator',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      dontHaveAccount: "Don't have an account? ",
      alreadyHaveAccount: "Already have an account? ",
      signUp: 'Sign Up',
      // Feature cards
      featureFastTitle: 'Certified Legal Translators',
      featureFastDesc: 'Access to professional translators with legal expertise and certification',
      featureAccurateTitle: 'Legal Precision',
      featureAccurateDesc: 'Accurate translation of complex legal terminology and concepts',
      featureSecureTitle: 'Confidential & Secure',
      featureSecureDesc: 'Your sensitive legal documents are protected with strict confidentiality',
      featureLanguagesTitle: 'Global Legal Coverage',
      featureLanguagesDesc: 'Support for international legal systems and jurisdictions',
      // How it works steps
      stepUploadTitle: 'Submit',
      stepUploadDesc: 'Submit your legal document for translation',
      stepSelectTitle: 'Match',
      stepSelectDesc: 'We match you with certified legal translators',
      stepTranslateTitle: 'Translate',
      stepTranslateDesc: 'Expert translators work on your legal documents',
      stepDownloadTitle: 'Certify',
      stepDownloadDesc: 'Receive your certified legal translation'
    },
    ar: {
      home: 'الرئيسية',
      about: 'حول',
      services: 'خدمات',
      getStarted: 'ابدأ الآن',
      signIn: 'تسجيل الدخول',
      signInAlt: 'صفحة تسجيل الدخول',
      heroTitle: 'وساطة ترجمة المستندات القانونية',
      heroSubtitle: 'يربطك LingoLink بمترجمين قانونيين معتمدين لتقديم ترجمات دقيقة وسرية للعقود وبراءات الاختراع والمستندات القانونية.',
      featureTitle: 'مميزاتنا',
      howItWorksTitle: 'كيف يعمل',
      testimonialsTitle: 'ماذا يقول عملاؤنا',
      satisfied: 'عميل راضٍ',
      startTranslating: 'ابدأ الترجمة',
      viewPricing: 'عرض الأسعار',
      welcomeBack: 'مرحباً بعودتك!',
      createAccount: 'إنشاء حساب',
      signInSubtitle: 'سجل الدخول للوصول إلى ترجماتك',
      signUpSubtitle: 'انضم إلى مجتمع المترجمين والعملاء',
      continueWithGoogle: 'المتابعة باستخدام Google',
      orContinueWithEmail: 'أو المتابعة بالبريد الإلكتروني',
      fullName: 'الاسم الكامل',
      fullNamePlaceholder: 'محمد أحمد',
      emailAddress: 'البريد الإلكتروني',
      emailPlaceholder: 'you@example.com',
      password: 'كلمة المرور',
      passwordPlaceholder: '••••••••',
      iWantTo: 'نوع الحساب',
      hireTranslators: 'عميل',
      workAsTranslator: 'مترجم',
      rememberMe: 'تذكرني',
      forgotPassword: 'نسيت كلمة المرور؟',
      dontHaveAccount: "ليس لديك حساب؟ ",
      alreadyHaveAccount: "لديك حساب بالفعل؟ ",
      signUp: 'التسجيل',
      // Feature cards
      featureFastTitle: 'مترجمون قانونيون معتمدون',
      featureFastDesc: 'الوصول إلى مترجمين محترفين ذوي خبرة قانونية وشهادات معتمدة',
      featureAccurateTitle: 'دقة قانونية',
      featureAccurateDesc: 'ترجمة دقيقة للمصطلحات والمفاهيم القانونية المعقدة',
      featureSecureTitle: 'سرية وأمان',
      featureSecureDesc: 'مستنداتك القانونية الحساسة محمية بسرية تامة',
      featureLanguagesTitle: 'تغطية قانونية عالمية',
      featureLanguagesDesc: 'دعم للأنظمة القانونية والاختصاصات القضائية الدولية',
      // How it works steps
      stepUploadTitle: 'تقديم',
      stepUploadDesc: 'قم بتقديم مستندك القانوني للترجمة',
      stepSelectTitle: 'مطابقة',
      stepSelectDesc: 'نقوم بمطابقتك مع مترجمين قانونيين معتمدين',
      stepTranslateTitle: 'ترجمة',
      stepTranslateDesc: 'يعمل مترجمون خبراء على مستنداتك القانونية',
      stepDownloadTitle: 'تصديق',
      stepDownloadDesc: 'استلم ترجمتك القانونية المعتمدة'
    },
    fr: {
      home: 'Accueil',
      about: 'À propos',
      services: 'Services',
      getStarted: 'Commencer',
      signIn: 'Connexion',
      signInAlt: 'Page de Connexion',
      heroTitle: 'Service de Courtage en Traduction Juridique',
      heroSubtitle: 'LingoLink vous met en relation avec des traducteurs juridiques certifiés pour fournir des traductions précises et confidentielles de contrats, brevets et documents légaux.',
      featureTitle: 'Nos Fonctionnalités',
      howItWorksTitle: 'Comment ça marche',
      testimonialsTitle: 'Ce que disent nos clients',
      satisfied: 'clients satisfaits',
      startTranslating: 'Commencer la traduction',
      viewPricing: 'Voir les tarifs',
      welcomeBack: 'Bon Retour!',
      createAccount: 'Créer un Compte',
      signInSubtitle: 'Connectez-vous pour accéder à vos traductions',
      signUpSubtitle: 'Rejoignez notre communauté de traducteurs et clients',
      continueWithGoogle: 'Continuer avec Google',
      orContinueWithEmail: 'ou continuer avec email',
      fullName: 'Nom Complet',
      fullNamePlaceholder: 'Jean Dupont',
      emailAddress: 'Adresse Email',
      emailPlaceholder: 'vous@example.com',
      password: 'Mot de passe',
      passwordPlaceholder: '••••••••',
      iWantTo: 'Type de Compte',
      hireTranslators: 'Client',
      workAsTranslator: 'Traducteur',
      rememberMe: 'Se souvenir de moi',
      forgotPassword: 'Mot de passe oublié?',
      dontHaveAccount: "Vous n'avez pas de compte? ",
      alreadyHaveAccount: "Vous avez déjà un compte? ",
      signUp: "S'inscrire",
      // Feature cards
      featureFastTitle: 'Traducteurs Juridiques Certifiés',
      featureFastDesc: 'Accès à des traducteurs professionnels avec expertise juridique et certification',
      featureAccurateTitle: 'Précision Juridique',
      featureAccurateDesc: 'Traduction précise de terminologie et concepts juridiques complexes',
      featureSecureTitle: 'Confidentiel & Sécurisé',
      featureSecureDesc: 'Vos documents juridiques sensibles sont protégés avec une stricte confidentialité',
      featureLanguagesTitle: 'Couverture Juridique Mondiale',
      featureLanguagesDesc: 'Support pour les systèmes juridiques et juridictions internationaux',
      // How it works steps
      stepUploadTitle: 'Soumettre',
      stepUploadDesc: 'Soumettez votre document juridique pour traduction',
      stepSelectTitle: 'Associer',
      stepSelectDesc: 'Nous vous associons à des traducteurs juridiques certifiés',
      stepTranslateTitle: 'Traduire',
      stepTranslateDesc: 'Des traducteurs experts travaillent sur vos documents juridiques',
      stepDownloadTitle: 'Certifier',
      stepDownloadDesc: 'Recevez votre traduction juridique certifiée'
    }
  };

  const t = (key) => translations[currentLanguage][key];

  const toggleAuthForm = () => {
    console.log('Toggling auth form');
    setShowAuthForm(true);
  };

  const closeAuthForm = () => {
    console.log('Closing auth form');
    setShowAuthForm(false);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      // Clean up modal class if component unmounts while modal is open
      document.body.classList.remove('modal-open');
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    document.documentElement.setAttribute('lang', currentLanguage);
    if (currentLanguage === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }, [currentLanguage]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', !isDarkMode ? 'dark' : 'light');
  };

  // Secret admin access - 5 clicks on logo within 3 seconds
  const handleLogoClick = () => {
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);

    // Clear existing timer
    if (logoClickTimer) {
      clearTimeout(logoClickTimer);
    }

    // Set new timer to reset count after 3 seconds
    const timer = setTimeout(() => {
      setLogoClickCount(0);
    }, 3000);
    setLogoClickTimer(timer);

    // Check if we've reached 5 clicks
    if (newCount >= 5) {
      setLogoClickCount(0);
      clearTimeout(timer);
      setShowAdminLogin(true);
      console.log('🔐 Secret admin access activated!');
    }
  };

  return (
    <div className="App">
      {/* Interactive Background */}
      <div
        className="interactive-background"
        style={{
          '--mouse-x': `${mousePosition.x}%`,
          '--mouse-y': `${mousePosition.y}%`
        }}
      >
        <div className="gradient-orb"></div>
      </div>

      <div className="content-wrapper">
        <nav className="navbar">
          <div className="nav-left">
            <div className="brand" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
              <ColorChangingLogo className="logo" alt="LingoLink" size="medium" />
              <span className="brand-name">LINGOLINK</span>
            </div>
          </div>
          <div className="nav-center">
            <a href="/" className="nav-link active">{t('home')}</a>
            <a href="/about" className="nav-link">{t('about')}</a>
            <a href="/services" className="nav-link">{t('services')}</a>
          </div>
          <div className="nav-right">
            <div className="language-selector-container">
              <button
                className="language-selector"
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              >
                {languages[currentLanguage].name}
              </button>
              {showLanguageMenu && (
                <div className="language-menu">
                  {Object.entries(languages).map(([code, lang]) => (
                    <button
                      key={code}
                      className={`language-option ${currentLanguage === code ? 'active' : ''}`}
                      onClick={() => {
                        setCurrentLanguage(code);
                        setShowLanguageMenu(false);
                      }}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              className={`theme-toggle ${isDarkMode ? 'dark' : ''}`}
              onClick={toggleDarkMode}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <img src="/images/sun-icon.svg" alt="Sun" style={{width: '20px', height: '20px'}} />
              ) : (
                <img src="/images/moon-icon.svg" alt="Moon" style={{width: '20px', height: '20px'}} />
              )}
            </button>
            <button
              className="login-button"
              onClick={(e) => {
                e.preventDefault();
                console.log('Login button clicked');
                toggleAuthForm();
              }}
            >
              {t('signIn')}
            </button>
          </div>
        </nav>

        {/* Auth Modal - removed */}

        <main className="main-content">
          <section className="hero-section">
            {!showAuthForm ? (
              <>
                <div className="hero-left">
                  <h1 className="hero-title">
                    {t('heroTitle')}
                  </h1>

                  <p className="hero-description">
                    {t('heroSubtitle')}
                  </p>

                  <div className="cta-buttons">
                    <button
                      className="get-started-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        console.log('Get started button clicked');
                        toggleAuthForm();
                      }}
                    >
                      {t('startTranslating')} →
                    </button>
                    <button className="view-pricing-btn">{t('viewPricing')}</button>
                  </div>
                </div>

                <div className="hero-right">
                  <div className="platform-preview">
                    <div className="preview-header">
                      <div className="window-controls">
                        <span className="control red"></span>
                        <span className="control yellow"></span>
                        <span className="control green"></span>
                      </div>
                    </div>
                    <div className="preview-content">
                      <img src="/images/home-photo.jpg" alt="Legal Translation Platform" />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="auth-modal-centered">
                <AuthPage
                  onSuccess={closeAuthForm}
                  currentLanguage={currentLanguage}
                  translations={translations}
                  onAuthenticated={onAuthenticated}
                />
              </div>
            )}
          </section>

          <section className="features-section">
            <h2>{t('featureTitle')}</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 10V3L4 14H11V21L20 10H13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <h3>{t('featureFastTitle')}</h3>
                <p>{t('featureFastDesc')}</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="12" r="1" fill="currentColor"/>
                  </svg>
                </div>
                <h3>{t('featureAccurateTitle')}</h3>
                <p>{t('featureAccurateDesc')}</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="2"/>
                    <path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </div>
                <h3>{t('featureSecureTitle')}</h3>
                <p>{t('featureSecureDesc')}</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <h3>{t('featureLanguagesTitle')}</h3>
                <p>{t('featureLanguagesDesc')}</p>
              </div>
            </div>
          </section>

          <section className="how-it-works features-section">
            <h2>{t('howItWorksTitle')}</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="18" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="9" y1="15" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>{t('stepUploadTitle')}</h3>
                <p>{t('stepUploadDesc')}</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>{t('stepSelectTitle')}</h3>
                <p>{t('stepSelectDesc')}</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>{t('stepTranslateTitle')}</h3>
                <p>{t('stepTranslateDesc')}</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>{t('stepDownloadTitle')}</h3>
                <p>{t('stepDownloadDesc')}</p>
              </div>
            </div>
          </section>

          <section className="testimonials">
            <h2>{t('testimonialsTitle')}</h2>
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="testimonial-content">
                  "LingoLink has transformed how we handle international documentation. Fast, accurate, and reliable."
                </div>
                <div className="testimonial-author">
                  <div className="author-info">
                    <strong>Sarah Johnson</strong>
                    <span>Global Corp Inc.</span>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-content">
                  "The AI-powered translations are incredibly accurate, and the human verification gives us peace of mind."
                </div>
                <div className="testimonial-author">
                  <div className="author-info">
                    <strong>Michael Chen</strong>
                    <span>Tech Solutions Ltd.</span>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-content">
                  "We've cut our translation time in half while maintaining perfect accuracy. Impressive!"
                </div>
                <div className="testimonial-author">
                  <div className="author-info">
                    <strong>Emma Rodriguez</strong>
                    <span>Marketing Director</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section">
              <div className="brand">
                <img src="/new-main-logo.svg" alt="LingoLink" className="logo" />
                <span className="brand-name">LINGOLINK</span>
              </div>
              <p>Connecting cultures through expert translation services</p>
            </div>
            <div className="footer-section">
              <h4>Product</h4>
              <a href="/features">Features</a>
              <a href="/pricing">Pricing</a>
              <a href="/enterprise">Enterprise</a>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <a href="/about">About</a>
              <a href="/careers">Careers</a>
              <a href="/contact">Contact</a>
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
              <a href="/security">Security</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 LingoLink. All rights reserved.</p>
          </div>
        </footer>
      </div>

      {/* Secret Admin Login Modal */}
      {showAdminLogin && (
        <AdminLogin
          onClose={() => setShowAdminLogin(false)}
          onSuccess={() => setShowAdminLogin(false)}
        />
      )}
    </div>
  );
}

function DashboardPage() {
  // Get the actual logged-in user from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Redirect to home if no user is logged in
  if (!user) {
    return <Navigate to="/" />;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  console.log('Rendering dashboard with user:', user);
  return <Dashboard user={user} setUser={setUser} onLogout={handleLogout} />;
}

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleAuthenticated = (userData) => {
    setUser(userData);
  };

  return (
    <ToastProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              <Route path="/" element={user ? <Navigate to="/dashboard" /> : <HomePage onAuthenticated={handleAuthenticated} />} />
              <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage onAuthenticated={handleAuthenticated} />} />
              <Route path="/forgot-password" element={user ? <Navigate to="/dashboard" /> : <ForgotPassword />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/test-dashboard" element={<DashboardTest />} />
              <Route path="/verify" element={user ? <VerificationPage user={user} /> : <Navigate to="/" />} />
              <Route path="/apply-translation" element={<ApplyTranslation />} />
              <Route path="/messages" element={user ? <MessagingPage /> : <Navigate to="/login" />} />
              <Route path="/translation-requests" element={user ? <TranslationRequestsPage /> : <Navigate to="/login" />} />
              <Route path="/translator/:id" element={<TranslatorProfilePage />} />
              <Route path="/admin" element={user?.userType === 'admin' ? <AdminPanel /> : <Navigate to="/dashboard" />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/enterprise" element={<Enterprise />} />
              <Route path="/about" element={<About />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/security" element={<Security />} />
              <Route path="/services" element={<Services />} />
            </Routes>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
