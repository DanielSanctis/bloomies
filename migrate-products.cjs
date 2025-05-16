// CommonJS migration script
require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, deleteDoc } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "bloomies-cdf07.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "bloomies-cdf07.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample products data - using images from the images folder
const products = [
  {
    id: '1',
    name: 'Large Satin Ribbon Rose Bouquet',
    price: 1499,
    oldPrice: 1899,
    salePercentage: 21,
    image: '/images/1.jpg',
    image2: '/images/1-alt.jpg',
    description: 'A stunning large bouquet featuring elegant satin ribbon roses that captures the essence of romance and elegance.',
    details: [
      'Contains 24 premium satin ribbon roses',
      'Large size perfect for making a statement',
      'Available in red, pink, or white',
      'Arrangement height: 16 inches',
      'Includes decorative vase',
      'Long-lasting and maintenance-free'
    ],
    type: 'bouquet',
    flowerType: 'satin ribbon',
    size: 'large',
    categories: {
      occasion: 'romance',
      fandom: ''
    },
    relatedProducts: ['2', '3', '4']
  },
  {
    id: '2',
    name: 'Medium Satin Ribbon Rose Bouquet',
    price: 999,
    oldPrice: 1299,
    salePercentage: 23,
    image: '/images/2.jpg',
    image2: '/images/2-alt.jpg',
    description: 'A beautiful medium-sized bouquet of satin ribbon roses, perfect for gifting or home decor.',
    details: [
      'Contains 16 premium satin ribbon roses',
      'Medium size ideal for gifting',
      'Available in red, pink, or white',
      'Arrangement height: 12 inches',
      'Includes decorative vase',
      'Long-lasting and maintenance-free'
    ],
    type: 'bouquet',
    flowerType: 'satin ribbon',
    size: 'medium',
    categories: {
      occasion: 'romance',
      fandom: ''
    },
    relatedProducts: ['1', '3', '5']
  }
];

/**
 * Migrate products to Firestore
 */
async function migrateProducts(force = false) {
  console.log('Starting product migration to Firestore...');

  try {
    // Check if products already exist
    const productsRef = collection(db, 'products');
    const existingProductsSnapshot = await getDocs(productsRef);

    if (!existingProductsSnapshot.empty) {
      console.log(`Found ${existingProductsSnapshot.size} existing products in Firestore.`);

      if (force) {
        console.log('Force flag detected. Deleting existing products...');

        // Delete all existing products
        const deletePromises = existingProductsSnapshot.docs.map(doc =>
          deleteDoc(doc.ref)
        );

        await Promise.all(deletePromises);
        console.log('Existing products deleted successfully.');
      } else {
        console.log('Products already exist in Firestore. Use --force to overwrite.');
        console.log('Migration aborted.');
        return;
      }
    }

    // Upload products to Firestore
    console.log(`Uploading ${products.length} products to Firestore...`);

    const addPromises = products.map(product => {
      // Convert the product to a Firestore-friendly format
      const firestoreProduct = {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date(),
        // Convert relatedProducts to an array if it's not already
        relatedProducts: product.relatedProducts || [],
        // Ensure categories is an object
        categories: product.categories || { occasion: '', fandom: '' },
        // Ensure details is an array
        details: product.details || [],
        // Create an images array
        images: [product.image, product.image2].filter(Boolean),
      };

      return addDoc(collection(db, 'products'), firestoreProduct);
    });

    const results = await Promise.all(addPromises);
    console.log(`Successfully uploaded ${results.length} products to Firestore.`);

    // Create admin user in admins collection if it doesn't exist
    console.log('Checking for admin user...');
    const adminsRef = collection(db, 'admins');
    const adminSnapshot = await getDocs(adminsRef);

    if (adminSnapshot.empty) {
      console.log('No admin user found. Creating admin user...');
      // You'll need to replace this with your admin user's UID
      await addDoc(collection(db, 'admins'), {
        role: 'admin',
        createdAt: new Date()
      });
      console.log('Admin user created successfully.');
    } else {
      console.log('Admin user already exists.');
    }

  } catch (error) {
    console.error('Error migrating products to Firestore:', error);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const force = args.includes('--force');

// Run the migration
migrateProducts(force)
  .then(() => console.log('Migration complete.'))
  .catch(err => console.error('Migration failed:', err));
