import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc
} from 'firebase/firestore';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => Promise<void>;
  isOpen: boolean;
  toggleWishlist: () => void;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider = ({ children }: WishlistProviderProps) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuth();

  // Calculate total items
  const totalItems = items.length;

  // Toggle wishlist sidebar
  const toggleWishlist = () => setIsOpen(!isOpen);

  // Load wishlist from Firestore when user changes
  useEffect(() => {
    const loadWishlist = async () => {
      if (currentUser) {
        const wishlistRef = doc(db, 'wishlists', currentUser.uid);
        const wishlistSnap = await getDoc(wishlistRef);

        if (wishlistSnap.exists()) {
          setItems(wishlistSnap.data().items || []);
        } else {
          // Initialize empty wishlist for new users
          await setDoc(wishlistRef, { items: [] });
          setItems([]);
        }
      } else {
        // For non-authenticated users, load from localStorage
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
          try {
            const parsedWishlist = JSON.parse(savedWishlist);
            if (Array.isArray(parsedWishlist)) {
              setItems(parsedWishlist);
            } else {
              // Invalid format, clear localStorage
              localStorage.removeItem('wishlist');
              setItems([]);
            }
          } catch (error) {
            // Invalid JSON, clear localStorage
            localStorage.removeItem('wishlist');
            setItems([]);
          }
        } else {
          setItems([]);
        }
      }
    };

    loadWishlist();
  }, [currentUser]);

  // Save wishlist to localStorage when it changes (for non-authenticated users)
  useEffect(() => {
    if (!currentUser) {
      if (items.length > 0) {
        localStorage.setItem('wishlist', JSON.stringify(items));
      } else {
        localStorage.removeItem('wishlist');
      }
    }
  }, [items, currentUser]);

  // Check if item is in wishlist
  const isInWishlist = (id: string) => {
    return items.some(item => item.id === id);
  };

  // Add item to wishlist
  const addToWishlist = async (newItem: WishlistItem) => {
    // Check if item already exists in wishlist
    if (isInWishlist(newItem.id)) {
      return; // Item already in wishlist, do nothing
    }

    const updatedItems = [...items, newItem];
    setItems(updatedItems);

    // Save to Firestore if user is authenticated
    if (currentUser) {
      const wishlistRef = doc(db, 'wishlists', currentUser.uid);
      await updateDoc(wishlistRef, { items: updatedItems });
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);

    // Save to Firestore if user is authenticated
    if (currentUser) {
      const wishlistRef = doc(db, 'wishlists', currentUser.uid);
      await updateDoc(wishlistRef, { items: updatedItems });
    }
  };

  // Clear wishlist
  const clearWishlist = async () => {
    setItems([]);

    // Save to Firestore if user is authenticated
    if (currentUser) {
      const wishlistRef = doc(db, 'wishlists', currentUser.uid);
      await updateDoc(wishlistRef, { items: [] });
    }
  };

  const value = {
    items,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    isOpen,
    toggleWishlist,
    totalItems
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
