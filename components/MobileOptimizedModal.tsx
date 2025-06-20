import React, { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface MobileOptimizedModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  showCloseButton?: boolean;
  className?: string;
}

export const MobileOptimizedModal: React.FC<MobileOptimizedModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = true,
  className = ''
}) => {
  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50">
      {/* Backdrop - only visible on desktop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity hidden md:block"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center">
        {/* Modal */}
        <div className={`
          relative bg-white shadow-xl w-full h-full overflow-hidden
          md:rounded-lg md:max-w-md md:max-h-[90vh] md:h-auto md:mx-4
          transform transition-all
          ${className}
        `}>
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  aria-label="Close modal"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="overflow-y-auto flex-1 h-full md:h-auto md:max-h-[calc(90vh-8rem)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  // Use portal to render modal at the end of body
  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return null;
}; 