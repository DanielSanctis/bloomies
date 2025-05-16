import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { initializeUserProfile } from '../services/userService';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<User>;
  signIn: (email: string, password: string) => Promise<User>;
  signInWithGoogle: () => Promise<User>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Initialize user profile in Firestore when user signs in
        try {
          await initializeUserProfile(user);
        } catch (error) {
          console.error('Error initializing user profile:', error);
        }
      }

      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Initialize user profile in Firestore
    try {
      await initializeUserProfile(userCredential.user);
    } catch (error) {
      console.error('Error initializing user profile during signup:', error);
    }

    return userCredential.user;
  };

  const signIn = async (email: string, password: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  const signInWithGoogle = async (): Promise<User> => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);

    // Initialize user profile in Firestore
    try {
      await initializeUserProfile(userCredential.user);
    } catch (error) {
      console.error('Error initializing user profile during Google sign-in:', error);
    }

    return userCredential.user;
  };

  const signOut = async (): Promise<void> => {
    return firebaseSignOut(auth);
  };

  const value = {
    currentUser,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
