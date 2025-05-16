import { db, storage } from '../lib/firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { User } from 'firebase/auth';

// Firestore collection name
const COLLECTION_NAME = 'users';

// User profile interface
export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  profileImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create a new user profile when a user registers
 */
export const createUserProfile = async (user: User) => {
  try {
    const userProfile = {
      uid: user.uid,
      displayName: user.displayName || '',
      email: user.email || '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      profileImageUrl: user.photoURL || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Check if user document already exists
    const userDoc = await getDoc(doc(db, COLLECTION_NAME, user.uid));

    if (!userDoc.exists()) {
      // Create new user document
      await setDoc(doc(db, COLLECTION_NAME, user.uid), userProfile);
    }

    return userProfile;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

/**
 * Get a user profile by user ID
 */
export const getUserProfile = async (userId: string) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        ...docSnap.data()
      } as UserProfile;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error fetching user profile for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Update a user profile
 */
export const updateUserProfile = async (userId: string, updates: Partial<Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>>) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, userId);

    // Add updatedAt timestamp
    const updatesWithTimestamp = {
      ...updates,
      updatedAt: new Date()
    };

    await updateDoc(docRef, updatesWithTimestamp);

    // Get the updated document
    const updatedDoc = await getDoc(docRef);

    return {
      ...updatedDoc.data()
    } as UserProfile;
  } catch (error) {
    console.error(`Error updating profile for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Upload a profile image for a user
 */
export const uploadProfileImage = async (userId: string, file: File) => {
  try {
    // Create a reference to the file in Firebase Storage
    const fileRef = ref(storage, `profile-images/${userId}`);

    // Upload the file
    await uploadBytes(fileRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(fileRef);

    // Update the user profile with the new image URL
    await updateUserProfile(userId, { profileImageUrl: downloadURL });

    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
};

/**
 * Initialize user profile on authentication
 * This should be called when a user signs in or registers
 */
export const initializeUserProfile = async (user: User) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      // User doesn't exist in Firestore yet, create profile
      return await createUserProfile(user);
    } else {
      // User exists, return existing profile
      return docSnap.data() as UserProfile;
    }
  } catch (error) {
    console.error(`Error initializing user profile for user ${user.uid}:`, error);
    throw error;
  }
};
