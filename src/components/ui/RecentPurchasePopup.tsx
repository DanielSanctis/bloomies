import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '../../data/products';

interface Purchase {
  id: string;
  productName: string;
  productImage: string;
  timeAgo: string;
  location: string;
}

// Generate recent purchases from actual products
const mockPurchases: Purchase[] = products.slice(0, 8).map(product => ({
  id: product.id,
  productName: product.name,
  productImage: product.image,
  timeAgo: `${Math.floor(Math.random() * 5) + 1} ${Math.random() > 0.5 ? 'hours' : 'minutes'} ago`,
  location: 'from India' // We only ship in India
}));

const RecentPurchasePopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentPurchase, setCurrentPurchase] = useState<Purchase | null>(null);

  useEffect(() => {
    // Function to show a random purchase
    const showRandomPurchase = () => {
      const randomIndex = Math.floor(Math.random() * mockPurchases.length);
      setCurrentPurchase(mockPurchases[randomIndex]);
      setIsVisible(true);

      // Hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    // Show first popup after 10 seconds
    const initialTimer = setTimeout(() => {
      showRandomPurchase();
    }, 10000);

    // Show a new popup every 30-60 seconds
    const intervalTimer = setInterval(() => {
      showRandomPurchase();
    }, Math.random() * 30000 + 30000); // Random time between 30-60 seconds

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && currentPurchase && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-4 z-50 bg-white shadow-lg rounded-none border border-gray-200 max-w-xs flex overflow-hidden"
        >
          <div className="w-20 h-20 flex-shrink-0 overflow-hidden">
            <div className="w-full h-full relative">
              <img
                src={currentPurchase.productImage}
                alt={currentPurchase.productName}
                className="w-full h-full object-contain absolute inset-0"
              />
            </div>
          </div>
          <div className="p-3 flex-grow">
            <div className="flex justify-between items-start">
              <p className="text-sm text-gray-600">Someone recently bought</p>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="font-medium text-brown mt-1">{currentPurchase.productName}</p>
            <p className="text-xs text-gray-500 mt-1">
              {currentPurchase.timeAgo}, {currentPurchase.location}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RecentPurchasePopup;
