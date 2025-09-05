import { PropsWithChildren, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BackIcon } from "../svg/BackIcon";

export const BaseModale = ({
  children,
  isOpen,
  onClose,
  title,
}: PropsWithChildren<{
  isOpen: boolean,
  onClose: () => void,
  title: string,
}>) => {
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setAnimationClass('translate-y-0');
      }, 10);
    } else {
      setAnimationClass('translate-y-full');
    }
  }, [isOpen]);

  const [animationClass, setAnimationClass] = useState('translate-y-full');

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 md:px-2 bg-blue-deep/20 flex items-center justify-center">
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      <div
        className={`relative w-full h-full md:h-5/6 md:max-w-2xl rounded-t-lg md:rounded-t-xl bg-white shadow-xl transition-transform duration-100 ease-in-out ${animationClass} overflow-hidden`}
      >
        {/* En-tête de la modale */}
        <div className="bg-gradient-to-r from-gold-primary to-gold-600 sticky top-0 shadow-lg z-10">
          <div className="flex items-center px-4 py-4">
            <button
              onClick={onClose}
              className="mr-4 p-2 rounded-full hover:bg-white/10 transition-colors duration-200 focus:outline-none"
              aria-label="Fermer"
            >
              <BackIcon className="h-6 w-6 text-white" />
            </button>
            <h3 className="text-xl font-bold text-white font-poppins">
              {title}
            </h3>
          </div>
        </div>

        {/* Corps de la modale avec défilement */}
        <div className="overflow-y-auto h-[calc(100%-5rem)] bg-gradient-to-b from-orange-light/10 to-blue-50/30">
          {children}
        </div>
      </div>
    </div>,
    document.body 
  );
}
