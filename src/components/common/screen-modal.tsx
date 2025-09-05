import React, { PropsWithChildren, useEffect, useState } from 'react';
import { BackIcon } from '../svg/BackIcon';

interface ScreenModalProps {
  isVisible: boolean;
  title: string;
  onClose: () => void;
}

/**
 * Composant permettant d'afficher du contenu dans une modale prenant tout l'écran
 * Version web adaptée du composant React Native
 */
const ScreenModal: React.FC<PropsWithChildren<ScreenModalProps>> = ({ 
  isVisible, 
  children, 
  title, 
  onClose 
}) => {
  // État pour l'animation de la modale
  const [animationClass, setAnimationClass] = useState('translate-y-full');

  // Gestion de l'animation d'entrée/sortie
  useEffect(() => {
    if (isVisible) {
      // Petit délai pour permettre le rendu avant l'animation
      setTimeout(() => {
        setAnimationClass('translate-y-0');
      }, 10);
    } else {
      setAnimationClass('translate-y-full');
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 backdrop-blur-sm flex items-end justify-center">
      {/* Overlay qui permet de fermer la modale en cliquant à l'extérieur */}
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      
      {/* Contenu de la modale */}
      <div 
        className={`relative w-full h-full md:h-5/6 md:max-w-2xl md:rounded-t-xl bg-white border-t-2 border-gray-200 shadow-xl transition-transform duration-300 ease-in-out ${animationClass}`}
      >
        {/* En-tête de la modale */}
        <div className="flex items-center px-4 py-3 border-b border-gray-200">
          <button 
            onClick={onClose}
            className="mr-4 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
            aria-label="Fermer"
          >
            <BackIcon className="h-6 w-6 text-gray-600" />
          </button>
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        </div>
        
        {/* Corps de la modale avec défilement si nécessaire */}
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ScreenModal;
