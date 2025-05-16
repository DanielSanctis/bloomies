import React from 'react';
import { Link } from 'wouter';

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
}

interface CompareTrayProps {
  products: Product[];
  removeProduct: (id: string) => void;
}

const CompareTray: React.FC<CompareTrayProps> = ({ products, removeProduct }) => {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Tray with selected products */}
      <div className="bg-white rounded-lg shadow-lg p-3 mb-2 max-w-xs w-full">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-brown">Selected Products</h3>
          <span className="text-xs text-brown-light">{products.length} items</span>
        </div>
        
        <div className="max-h-40 overflow-y-auto">
          {products.map(product => (
            <div key={product.id} className="flex items-center py-1 border-b border-beige last:border-0">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-10 h-10 object-cover rounded"
              />
              <div className="ml-2 flex-1 min-w-0">
                <p className="text-xs text-brown truncate">{product.name}</p>
                <p className="text-xs text-brown-light">₹{product.price}</p>
              </div>
              <button 
                onClick={() => removeProduct(product.id)}
                className="ml-1 text-brown-light hover:text-brown"
                aria-label={`Remove ${product.name} from comparison`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Compare button */}
      <Link 
        href={`/compare?ids=${products.map(p => p.id).join(',')}`}
        className={`px-4 py-2 bg-brown text-cream rounded-lg shadow-lg flex items-center ${
          products.length < 2 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brown-dark'
        }`}
        onClick={(e) => {
          if (products.length < 2) {
            e.preventDefault();
          }
        }}
      >
        <span className="mr-2">Compare</span>
        <span className="bg-cream text-brown rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {products.length}
        </span>
      </Link>
    </div>
  );
};

export default CompareTray;
