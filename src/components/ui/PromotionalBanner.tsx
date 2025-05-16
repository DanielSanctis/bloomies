import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PromotionalBannerProps {
  messages?: string[];
  codes?: string[];
  backgroundColor?: string;
  textColor?: string;
  transitionDuration?: number;
}

const PromotionalBanner: React.FC<PromotionalBannerProps> = ({
  messages = [
    "GET 10% off on PREPAID Orders!",
    "Free shipping on orders over ₹2000!",
  ],
  codes = ["CodeFloral10", "FREESHIP"],
  backgroundColor = "#000000",
  textColor = "#ffffff",
  transitionDuration = 8 // seconds between transitions
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Check if banner has been dismissed in this session
  useEffect(() => {
    const bannerDismissed = sessionStorage.getItem('promotionalBannerDismissed');
    if (bannerDismissed) {
      setIsVisible(false);
    }
  }, []);

  // Rotate through messages
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, transitionDuration * 1000);

    return () => clearInterval(interval);
  }, [isVisible, messages.length, transitionDuration]);

  const handleDismiss = () => {
    setIsVisible(false);
    // Store in session storage that the banner has been dismissed
    sessionStorage.setItem('promotionalBannerDismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div
      className="py-2 overflow-hidden relative"
      style={{ backgroundColor, color: textColor }}
    >
      <div className="container mx-auto px-4 flex justify-center items-center h-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-center text-sm font-medium"
          >
            {messages[currentIndex]}
            {codes[currentIndex] && (
              <span className="font-semibold ml-1">
                Code: {codes[currentIndex]}
              </span>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={handleDismiss}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-70 hover:opacity-100 z-10"
        aria-label="Dismiss promotion"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default PromotionalBanner;
