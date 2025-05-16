import { db } from '../lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  addDoc,
  updateDoc,
  deleteDoc,
  DocumentSnapshot,
  QueryConstraint
} from 'firebase/firestore';
import { Product, products } from '../data/products';

// Firestore collection name
const COLLECTION_NAME = 'products';

// Interface for Firestore product document
export interface FirestoreProduct extends Omit<Product, 'id'> {
  createdAt: Date;
  updatedAt: Date;
  images: string[];
  categories: {
    occasion?: string;
    fandom?: string;
  };
}

// Interface for product query options
export interface ProductQueryOptions {
  type?: string;
  flowerType?: string;
  size?: string;
  occasion?: string;
  fandom?: string;
  sortBy?: 'price' | 'name' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  startAfter?: DocumentSnapshot;
}

/**
 * Get all products with optional filtering and pagination
 */
export const getProducts = async (options: ProductQueryOptions = {}) => {
  try {
    console.log('Fetching products with options:', options);

    const constraints: QueryConstraint[] = [];

    // Add filters
    if (options.type) {
      constraints.push(where('type', '==', options.type));
    }

    if (options.flowerType) {
      constraints.push(where('flowerType', '==', options.flowerType));
    }

    if (options.size) {
      constraints.push(where('size', '==', options.size));
    }

    if (options.occasion) {
      constraints.push(where('categories.occasion', '==', options.occasion));
    }

    if (options.fandom) {
      constraints.push(where('categories.fandom', '==', options.fandom));
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

    // Create query
    const productsQuery = query(collection(db, COLLECTION_NAME), ...constraints);

    // Execute query
    const querySnapshot = await getDocs(productsQuery);

    // Map results to products with IDs
    const firestoreProducts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product & { createdAt: Date; updatedAt: Date }));

    console.log('Found products in Firestore:', firestoreProducts.length);

    // Return products and the last document for pagination
    return {
      products: firestoreProducts,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1]
    };
  } catch (error) {
    console.error('Error fetching products from Firestore:', error);

    // Fallback to local data
    try {
      console.log('Falling back to local data for products');

      // Filter local products based on options
      let filteredProducts = [...products];

      if (options.type) {
        filteredProducts = filteredProducts.filter(p => p.type === options.type);
      }

      if (options.flowerType) {
        filteredProducts = filteredProducts.filter(p => p.flowerType === options.flowerType);
      }

      if (options.size) {
        filteredProducts = filteredProducts.filter(p => p.size === options.size);
      }

      if (options.occasion) {
        filteredProducts = filteredProducts.filter(p => p.categories?.occasion === options.occasion);
      }

      if (options.fandom) {
        filteredProducts = filteredProducts.filter(p => p.categories?.fandom === options.fandom);
      }

      // Sort products
      const sortField = options.sortBy || 'createdAt';
      const sortDir = options.sortDirection || 'desc';

      filteredProducts.sort((a, b) => {
        if (sortField === 'price') {
          return sortDir === 'asc' ? a.price - b.price : b.price - a.price;
        } else if (sortField === 'name') {
          return sortDir === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else {
          // Default sort by ID as a proxy for createdAt
          return sortDir === 'asc'
            ? parseInt(a.id) - parseInt(b.id)
            : parseInt(b.id) - parseInt(a.id);
        }
      });

      // Apply pagination
      const limit = options.limit || filteredProducts.length;
      const startIndex = options.startAfter ? filteredProducts.findIndex(p => p.id === options.startAfter.id) + 1 : 0;
      const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

      // Add timestamps to products
      const productsWithTimestamps = paginatedProducts.map(p => ({
        ...p,
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      console.log('Found products in local data:', productsWithTimestamps.length);

      return {
        products: productsWithTimestamps,
        lastDoc: paginatedProducts.length < limit ? null : {
          id: paginatedProducts[paginatedProducts.length - 1].id
        }
      };
    } catch (localError) {
      console.error('Error fetching products from local data:', localError);
      throw error;
    }
  }
};

/**
 * Get a single product by ID
 */
export const getProductById = async (id: string) => {
  try {
    console.log('Fetching product with ID:', id);

    // First try to get from Firestore
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log('Product found in Firestore:', docSnap.id);
      const productData = docSnap.data();
      console.log('Product data from Firestore:', productData);

      return {
        id: docSnap.id,
        ...productData
      } as Product & { createdAt: Date; updatedAt: Date };
    } else {
      // If not found in Firestore, try to get from local data
      console.log('Product not found in Firestore, trying local data');
      const localProduct = products.find(p => p.id === id);

      if (localProduct) {
        console.log('Product found in local data:', localProduct);
        return {
          ...localProduct,
          createdAt: new Date(),
          updatedAt: new Date()
        } as Product & { createdAt: Date; updatedAt: Date };
      } else {
        console.log('Product not found with ID:', id);
        return null;
      }
    }
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);

    // Fallback to local data if there's an error
    console.log('Error fetching from Firestore, trying local data');
    const localProduct = products.find(p => p.id === id);

    if (localProduct) {
      console.log('Product found in local data:', localProduct);
      return {
        ...localProduct,
        createdAt: new Date(),
        updatedAt: new Date()
      } as Product & { createdAt: Date; updatedAt: Date };
    } else {
      throw error;
    }
  }
};

/**
 * Get related products for a given product
 */
export const getRelatedProducts = async (productId: string) => {
  try {
    console.log('Fetching related products for product ID:', productId);

    // First get the product to get its related product IDs
    const product = await getProductById(productId);

    if (!product || !product.relatedProducts || product.relatedProducts.length === 0) {
      console.log('No related products found for product ID:', productId);
      return [];
    }

    console.log('Related product IDs:', product.relatedProducts);

    // Get all related products
    const relatedProducts = await Promise.all(
      product.relatedProducts.map(id => getProductById(id))
    );

    // Filter out any null results
    const filteredProducts = relatedProducts.filter(Boolean) as (Product & { createdAt: Date; updatedAt: Date })[];
    console.log('Found related products:', filteredProducts.length);

    return filteredProducts;
  } catch (error) {
    console.error(`Error fetching related products for product ${productId}:`, error);

    // Fallback to local data
    try {
      console.log('Trying to get related products from local data');
      const localProduct = products.find(p => p.id === productId);

      if (localProduct && localProduct.relatedProducts && localProduct.relatedProducts.length > 0) {
        const relatedLocalProducts = localProduct.relatedProducts
          .map(id => products.find(p => p.id === id))
          .filter(Boolean)
          .map(p => ({
            ...p,
            createdAt: new Date(),
            updatedAt: new Date()
          })) as (Product & { createdAt: Date; updatedAt: Date })[];

        console.log('Found related products in local data:', relatedLocalProducts.length);
        return relatedLocalProducts;
      }
    } catch (localError) {
      console.error('Error getting related products from local data:', localError);
    }

    return [];
  }
};

/**
 * Add a new product
 */
export const addProduct = async (product: Omit<FirestoreProduct, 'createdAt' | 'updatedAt'>) => {
  try {
    const productWithTimestamps = {
      ...product,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), productWithTimestamps);

    return {
      id: docRef.id,
      ...productWithTimestamps
    };
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

/**
 * Update an existing product
 */
export const updateProduct = async (id: string, updates: Partial<Omit<FirestoreProduct, 'createdAt'>>) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);

    const updatesWithTimestamp = {
      ...updates,
      updatedAt: new Date()
    };

    await updateDoc(docRef, updatesWithTimestamp);

    // Get the updated document
    const updatedDoc = await getDoc(docRef);

    return {
      id: updatedDoc.id,
      ...updatedDoc.data()
    } as Product & { createdAt: Date; updatedAt: Date };
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a product
 */
export const deleteProduct = async (id: string) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    throw error;
  }
};
