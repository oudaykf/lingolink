import React from 'react';
import SimpleAuthPage from './SimpleAuthPage';
import ColorChangingLogo from './ColorChangingLogo';
import './LoginPage.css';

const LoginPage = ({ onAuthenticated }) => {
  const [currentLanguage, setCurrentLanguage] = React.useState(() => {
    return localStorage.getItem('preferredLanguage') || 'en';
  });

  // Basic translations for the login page
  const translations = {
    en: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      getStarted: 'Get Started',
      signIn: 'Sign In',
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
      signUp: 'Sign Up'
    },
    fr: {
      home: 'Accueil',
      about: 'À propos',
      services: 'Services',
      getStarted: 'Commencer',
      signIn: 'Connexion',
      welcomeBack: 'Bon Retour!',
      createAccount: 'Créer un Compte',
      signInSubtitle: 'Connectez-vous pour accéder à vos traductions',
      signUpSubtitle: 'Rejoignez notre communauté de traducteurs et de clients',
      continueWithGoogle: 'Continuer avec Google',
      orContinueWithEmail: 'ou continuer avec email',
      fullName: 'Nom Complet',
      fullNamePlaceholder: 'Jean Dupont',
      emailAddress: 'Adresse Email',
      emailPlaceholder: 'vous@exemple.com',
      password: 'Mot de Passe',
      passwordPlaceholder: '••••••••',
      iWantTo: 'Type de Compte',
      hireTranslators: 'Client',
      workAsTranslator: 'Traducteur',
      rememberMe: 'Se souvenir de moi',
      forgotPassword: 'Mot de passe oublié?',
      dontHaveAccount: "Vous n'avez pas de compte? ",
      alreadyHaveAccount: "Vous avez déjà un compte? ",
      signUp: "S'inscrire"
    }
  };

  const handleAuthenticated = (userData) => {
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(userData));

    // Update the parent component's user state
    if (onAuthenticated) {
      onAuthenticated(userData);
    }

    // Redirect to dashboard
    window.location.href = '/dashboard';
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <a href="/" className="login-logo">
            <ColorChangingLogo className="logo" alt="LingoLink" size="medium" />
            <h1>LingoLink</h1>
          </a>
        </div>
        <div className="login-content">
          <SimpleAuthPage
            onSuccess={() => {}}
            currentLanguage={currentLanguage}
            translations={translations}
            onAuthenticated={handleAuthenticated}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
