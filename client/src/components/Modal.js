import React, { useEffect, useRef } from 'react';
import './Modal.css';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium', // small, medium, large, fullscreen
  closeOnOutsideClick = true,
  showCloseButton = true
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Only disable scrolling for fullscreen modals or when not in appearance settings
      if (size === 'fullscreen' && !title.includes('personalization')) {
        document.body.style.overflow = 'hidden';
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, size, title]);

  const handleOutsideClick = (e) => {
    if (closeOnOutsideClick && modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOutsideClick}>
      <div className={`modal modal-${size}`} ref={modalRef}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          {showCloseButton && (
            <button className="modal-close" onClick={onClose}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
        <div className="modal-body">
          {children}
        </div>
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
