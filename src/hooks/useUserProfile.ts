import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import {
  getUserProfile,
  updateUserProfile,
  uploadProfileImage,
  UserProfile
} from '../services/userService';

// Keys for React Query
const QUERY_KEYS = {
  USER_PROFILE: 'userProfile',
};

/**
 * Hook to fetch and manage user profile
 */
export const useUserProfile = () => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  // Use React Query to fetch and cache user profile
  const {
    data: profile,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: [QUERY_KEYS.USER_PROFILE, currentUser?.uid],
    queryFn: () => currentUser ? getUserProfile(currentUser.uid) : null,
    enabled: !!currentUser, // Only run the query if we have a user
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation for updating user profile
  const {
    mutate: updateProfile,
    isPending: isUpdating,
    error: updateError
  } = useMutation({
    mutationFn: (updates: Partial<Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>>) => {
      if (!currentUser) throw new Error('No user logged in');
      return updateUserProfile(currentUser.uid, updates);
    },
    onSuccess: (updatedProfile) => {
      // Update the cache with the new profile
      queryClient.setQueryData(
        [QUERY_KEYS.USER_PROFILE, currentUser?.uid],
        updatedProfile
      );
    },
  });

  // Mutation for uploading profile image
  const {
    mutate: uploadImage,
    isPending: isUploading,
    error: uploadError
  } = useMutation({
    mutationFn: (file: File) => {
      if (!currentUser) throw new Error('No user logged in');
      return uploadProfileImage(currentUser.uid, file);
    },
    onSuccess: (imageUrl) => {
      // Update the cache with the new profile image URL
      queryClient.setQueryData(
        [QUERY_KEYS.USER_PROFILE, currentUser?.uid],
        (oldData: any) => {
          if (!oldData) return null;
          return {
            ...oldData,
            profileImageUrl: imageUrl
          };
        }
      );
    },
  });

  return {
    profile,
    isLoading,
    error,
    refetch,
    updateProfile,
    isUpdating,
    updateError,
    uploadImage,
    isUploading,
    uploadError
  };
};

/**
 * Hook to manage user addresses
 */
export const useUserAddresses = () => {
  const { profile, isLoading, updateProfile, isUpdating } = useUserProfile();

  // Update user address
  const updateAddress = (addressData: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  }) => {
    updateProfile(addressData);
  };

  return {
    address: profile ? {
      address: profile.address || '',
      city: profile.city || '',
      state: profile.state || '',
      pincode: profile.pincode || '',
    } : null,
    isLoading,
    isUpdating,
    updateAddress,
  };
};

/**
 * Hook to manage user contact information
 */
export const useUserContact = () => {
  const { profile, isLoading, updateProfile, isUpdating } = useUserProfile();

  // Update user contact info
  const updateContactInfo = (contactData: {
    displayName?: string;
    phone?: string;
  }) => {
    updateProfile(contactData);
  };

  return {
    contactInfo: profile ? {
      displayName: profile.displayName || '',
      email: profile.email || '',
      phone: profile.phone || '',
      profileImageUrl: profile.profileImageUrl || '',
    } : null,
    isLoading,
    isUpdating,
    updateContactInfo,
  };
};
