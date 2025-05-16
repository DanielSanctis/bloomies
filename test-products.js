// Import Firebase modules
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLFYkPeEy1fJRmCJTlZdgXMqxGPPVKENk",
  projectId: "bloomies-cdf07",
  storageBucket: "bloomies-cdf07.firebasestorage.app",
  messagingSenderId: "466127716446",
  appId: "1:466127716446:web:6808bf63cd0f02bc5634cf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to get all products
async function getProducts() {
  try {
    const productsCollection = collection(db, 'products');
    const productsSnapshot = await getDocs(productsCollection);

    if (productsSnapshot.empty) {
      console.log('No products found in the database');
      return [];
    }

    const products = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(`Found ${products.length} products:`);
    products.forEach(product => {
      console.log(`- ${product.id}: ${product.name}`);
    });

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

// Run the function
getProducts()
  .then(() => console.log('Done'))
  .catch(error => console.error('Error:', error));
