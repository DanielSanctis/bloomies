import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { 
  getUserOrders, 
  getOrderById, 
  createOrder, 
  updateOrderStatus,
  updatePaymentInfo,
  Order,
  OrderStatus,
  OrderQueryOptions,
  PaymentInfo
} from '../services/orderService';

// Keys for React Query
const QUERY_KEYS = {
  USER_ORDERS: 'userOrders',
  ORDER: 'order',
};

/**
 * Hook to fetch user orders
 */
export const useUserOrders = (options: OrderQueryOptions = {}) => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  
  // Use React Query to fetch and cache user orders
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: [QUERY_KEYS.USER_ORDERS, currentUser?.uid, options],
    queryFn: () => currentUser ? getUserOrders(currentUser.uid, options) : { orders: [], lastDoc: null },
    enabled: !!currentUser, // Only run the query if we have a user
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Function to load more orders (pagination)
  const loadMore = async () => {
    if (!currentUser || !data || !data.lastDoc) return;
    
    const newOptions = {
      ...options,
      startAfter: data.lastDoc,
    };
    
    const newData = await getUserOrders(currentUser.uid, newOptions);
    
    // Update the cache with the combined results
    queryClient.setQueryData([QUERY_KEYS.USER_ORDERS, currentUser.uid, options], {
      orders: [...(data.orders || []), ...(newData.orders || [])],
      lastDoc: newData.lastDoc,
    });
  };
  
  return {
    orders: data?.orders || [],
    lastDoc: data?.lastDoc,
    isLoading,
    error,
    refetch,
    loadMore,
    hasMore: !!data?.lastDoc,
  };
};

/**
 * Hook to fetch a single order
 */
export const useOrder = (orderId: string) => {
  const { 
    data: order, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: [QUERY_KEYS.ORDER, orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId, // Only run the query if we have an order ID
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  return {
    order,
    isLoading,
    error,
  };
};

/**
 * Hook to create an order
 */
export const useCreateOrder = () => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  
  // Mutation for creating an order
  const { 
    mutate: createOrderMutation, 
    isPending: isCreating, 
    error: createError,
    data: createdOrder
  } = useMutation({
    mutationFn: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
      return createOrder(orderData);
    },
    onSuccess: () => {
      // Invalidate user orders query to refetch
      if (currentUser) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_ORDERS, currentUser.uid] });
      }
    },
  });
  
  return {
    createOrder: createOrderMutation,
    isCreating,
    createError,
    createdOrder,
  };
};

/**
 * Hook to update order status
 */
export const useUpdateOrderStatus = (orderId: string) => {
  const queryClient = useQueryClient();
  
  // Mutation for updating order status
  const { 
    mutate: updateStatus, 
    isPending: isUpdating, 
    error: updateError 
  } = useMutation({
    mutationFn: (status: OrderStatus) => {
      return updateOrderStatus(orderId, status);
    },
    onSuccess: (updatedOrder) => {
      // Update the order in the cache
      queryClient.setQueryData([QUERY_KEYS.ORDER, orderId], updatedOrder);
      
      // Invalidate user orders query to refetch
      if (updatedOrder.userId) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_ORDERS, updatedOrder.userId] });
      }
    },
  });
  
  return {
    updateStatus,
    isUpdating,
    updateError,
  };
};

/**
 * Hook to update payment information
 */
export const useUpdatePaymentInfo = (orderId: string) => {
  const queryClient = useQueryClient();
  
  // Mutation for updating payment info
  const { 
    mutate: updatePayment, 
    isPending: isUpdating, 
    error: updateError 
  } = useMutation({
    mutationFn: (paymentInfo: Partial<PaymentInfo>) => {
      return updatePaymentInfo(orderId, paymentInfo);
    },
    onSuccess: (updatedOrder) => {
      // Update the order in the cache
      queryClient.setQueryData([QUERY_KEYS.ORDER, orderId], updatedOrder);
      
      // Invalidate user orders query to refetch
      if (updatedOrder.userId) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_ORDERS, updatedOrder.userId] });
      }
    },
  });
  
  return {
    updatePayment,
    isUpdating,
    updateError,
  };
};
