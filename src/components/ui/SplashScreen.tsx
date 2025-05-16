import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  duration?: number; // Duration in milliseconds
}

const SplashScreen: React.FC<SplashScreenProps> = ({ duration = 2500 }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Check if the splash screen has been shown before
    const hasShownSplash = sessionStorage.getItem('hasShownSplash');

    if (hasShownSplash) {
      setShow(false);
      return;
    }

    // Set a timeout to hide the splash screen after the specified duration
    const timer = setTimeout(() => {
      setShow(false);
      // Store in session storage that we've shown the splash screen
      sessionStorage.setItem('hasShownSplash', 'true');
    }, duration);

    // Clean up the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-cream to-beige/95 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center justify-center p-8"
          >
            <div className="flex items-center justify-center mb-6">
              <span className="handwritten text-6xl text-primary-dark">Bloomies</span>
              <i className="fas fa-seedling ml-2 text-3xl text-accent-dark"></i>
            </div>

            <p className="text-xl text-brown font-inter mb-6">Welcome to Bloomies</p>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: 'easeInOut' }}
              className="h-1 bg-brown/60 mt-2"
              style={{ maxWidth: '240px' }}
            />

            <p className="text-sm text-brown-light/80 mt-8 font-inter italic">Handcrafted Forever Bouquets</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
