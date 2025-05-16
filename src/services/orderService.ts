import { db } from '../lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  limit,
  startAfter,
  QueryConstraint
} from 'firebase/firestore';
import { CartItem } from '../context/CartContext';

// Firestore collection name
const COLLECTION_NAME = 'orders';

// Order status types
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// Payment methods
export type PaymentMethod = 'upi' | 'cod' | 'razorpay' | 'googlepay';

// Payment status
export type PaymentStatus = 'pending' | 'completed' | 'failed';

// Shipping information interface
export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  specialInstructions?: string;
}

// Payment information interface
export interface PaymentInfo {
  method: PaymentMethod;
  upiId?: string;
  transactionId?: string;
  status: PaymentStatus;
  paidAt?: Date;
}

// Order interface
export interface Order {
  id?: string;
  userId: string | null;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    personalizedNotes?: string;
    image?: string;
  }[];
  shippingInfo: ShippingInfo;
  paymentInfo: PaymentInfo;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
}

// Interface for order query options
export interface OrderQueryOptions {
  userId?: string;
  status?: OrderStatus;
  sortBy?: 'createdAt' | 'updatedAt' | 'total';
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  startAfter?: any;
}

/**
 * Create a new order
 */
export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const orderWithTimestamps = {
      ...orderData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), orderWithTimestamps);

    return {
      id: docRef.id,
      ...orderWithTimestamps
    };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Get all orders for a user
 */
export const getUserOrders = async (userId: string, options: OrderQueryOptions = {}) => {
  try {
    const constraints: QueryConstraint[] = [
      where('userId', '==', userId)
    ];

    // Add status filter if provided
    if (options.status) {
      constraints.push(where('status', '==', options.status));
    }

    // Add sorting
    const sortField = options.sortBy || 'createdAt';
    const sortDir = options.sortDirection || 'desc';
    constraints.push(orderBy(sortField, sortDir));

    // Add pagination
    if (options.limit) {
      constraints.push(limit(options.limit));
    }

    if (options.startAfter) {
      constraints.push(startAfter(options.startAfter));
    }

    // Create and execute query
    const ordersQuery = query(collection(db, COLLECTION_NAME), ...constraints);
    const querySnapshot = await getDocs(ordersQuery);

    // Map results to orders with IDs
    const orders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order));

    // Return orders and the last document for pagination
    return {
      orders,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1]
    };
  } catch (error) {
    console.error(`Error fetching orders for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Get a single order by ID
 */
export const getOrderById = async (orderId: string) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, orderId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Order;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error fetching order with ID ${orderId}:`, error);
    throw error;
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, orderId);

    const updates: any = {
      status,
      updatedAt: new Date()
    };

    // Add timestamp for specific status changes
    if (status === 'shipped') {
      updates.shippedAt = new Date();
    } else if (status === 'delivered') {
      updates.deliveredAt = new Date();
    }

    await updateDoc(docRef, updates);

    // Get the updated document
    const updatedDoc = await getDoc(docRef);

    return {
      id: updatedDoc.id,
      ...updatedDoc.data()
    } as Order;
  } catch (error) {
    console.error(`Error updating status for order ${orderId}:`, error);
    throw error;
  }
};

/**
 * Update payment information
 */
export const updatePaymentInfo = async (orderId: string, paymentInfo: Partial<PaymentInfo>) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, orderId);

    // Get current order
    const orderSnap = await getDoc(docRef);
    if (!orderSnap.exists()) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    const currentOrder = orderSnap.data();
    const currentPaymentInfo = currentOrder.paymentInfo || {};

    // Merge payment info
    const updatedPaymentInfo = {
      ...currentPaymentInfo,
      ...paymentInfo
    };

    // If payment status is completed, add paidAt timestamp
    if (paymentInfo.status === 'completed' && !updatedPaymentInfo.paidAt) {
      updatedPaymentInfo.paidAt = new Date();
    }

    // Update the document
    await updateDoc(docRef, {
      paymentInfo: updatedPaymentInfo,
      updatedAt: new Date()
    });

    // Get the updated document
    const updatedDoc = await getDoc(docRef);

    return {
      id: updatedDoc.id,
      ...updatedDoc.data()
    } as Order;
  } catch (error) {
    console.error(`Error updating payment info for order ${orderId}:`, error);
    throw error;
  }
};
