import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc
} from 'firebase/firestore';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  personalizedNotes?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  updateItemQuantity: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isOpen: boolean;
  toggleCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuth();

  // Calculate total items and subtotal
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Toggle cart sidebar
  const toggleCart = () => setIsOpen(!isOpen);

  // Load cart from Firestore when user changes
  useEffect(() => {
    const loadCart = async () => {
      if (currentUser) {
        const cartRef = doc(db, 'carts', currentUser.uid);
        const cartSnap = await getDoc(cartRef);

        if (cartSnap.exists()) {
          setItems(cartSnap.data().items || []);
        } else {
          // Initialize empty cart for new users
          await setDoc(cartRef, { items: [] });
          setItems([]);
        }
      } else {
        // For non-authenticated users, load from localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            if (Array.isArray(parsedCart)) {
              setItems(parsedCart);
            } else {
              // Invalid format, clear localStorage
              localStorage.removeItem('cart');
              setItems([]);
            }
          } catch (error) {
            // Invalid JSON, clear localStorage
            localStorage.removeItem('cart');
            setItems([]);
          }
        } else {
          setItems([]);
        }
      }
    };

    loadCart();
  }, [currentUser]);

  // Save cart to localStorage when it changes (for non-authenticated users)
  useEffect(() => {
    if (!currentUser) {
      if (items.length > 0) {
        localStorage.setItem('cart', JSON.stringify(items));
      } else {
        localStorage.removeItem('cart');
      }
    }
  }, [items, currentUser]);

  // Add item to cart
  const addToCart = async (newItem: CartItem) => {
    // Check if item already exists in cart
    const existingItemIndex = items.findIndex(item => item.id === newItem.id);

    let updatedItems: CartItem[];

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += newItem.quantity;
    } else {
      // Add new item
      updatedItems = [...items, newItem];
    }

    setItems(updatedItems);

    // Save to Firestore if user is authenticated
    if (currentUser) {
      const cartRef = doc(db, 'carts', currentUser.uid);
      await updateDoc(cartRef, { items: updatedItems });
    }
  };

  // Update item quantity
  const updateItemQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      return removeItem(id);
    }

    const updatedItems = items.map(item =>
      item.id === id ? { ...item, quantity } : item
    );

    setItems(updatedItems);

    // Save to Firestore if user is authenticated
    if (currentUser) {
      const cartRef = doc(db, 'carts', currentUser.uid);
      await updateDoc(cartRef, { items: updatedItems });
    }
  };

  // Remove item from cart
  const removeItem = async (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);

    setItems(updatedItems);

    // Save to Firestore if user is authenticated
    if (currentUser) {
      const cartRef = doc(db, 'carts', currentUser.uid);
      await updateDoc(cartRef, { items: updatedItems });
    }
  };

  // Clear cart
  const clearCart = async () => {
    setItems([]);

    // Save to Firestore if user is authenticated
    if (currentUser) {
      const cartRef = doc(db, 'carts', currentUser.uid);
      await updateDoc(cartRef, { items: [] });
    }
  };

  const value = {
    items,
    addToCart,
    updateItemQuantity,
    removeItem,
    clearCart,
    isOpen,
    toggleCart,
    totalItems,
    subtotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
