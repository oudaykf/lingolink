import React, { useEffect } from " react\;
import AuthPage from \./AuthPage\;
import \./AuthPopup.css\;

const AuthPopup = ({ isOpen, onClose, currentLanguage, translations, onAuthenticated }) => {
 // Prevent body scrolling when popup is open
 useEffect(() => {
 if (isOpen) {
 document.body.classList.add(\popup-open\);
 } else {
 document.body.classList.remove(\popup-open\);
 }
 
 // Cleanup function
 return () => {
 document.body.classList.remove(\popup-open\);
 };
 }, [isOpen]);

 // Handle successful authentication
 const handleSuccess = () => {
 onClose();
 if (onAuthenticated) {
 onAuthenticated();
 }
 };

 // Close popup when clicking outside
 const handleOverlayClick = (e) => {
 if (e.target === e.currentTarget) {
 onClose();
 }
 };

 return (
 <div 
 className={uth-popup-overlay }
 onClick={handleOverlayClick}
 >
 <div className=\auth-popup-container\>
 <AuthPage 
 onSuccess={handleSuccess}
 currentLanguage={currentLanguage}
 translations={translations}
 onAuthenticated={onAuthenticated}
 />
 </div>
 </div>
 );
};

export default AuthPopup;
