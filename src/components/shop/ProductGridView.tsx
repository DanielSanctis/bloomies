import React from 'react';
import { Link } from 'wouter';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  image2?: string; // Second image for hover effect
  salePercentage?: number;
  oldPrice?: number;
  type?: string;
  flowerType?: string;
  size?: string;
  categories?: {
    occasion?: string;
    fandom?: string;
  };
}

interface ProductGridViewProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onCompareToggle: (product: Product, isComparing: boolean) => void;
  comparingProducts: string[];
  isDense?: boolean;
}

const ProductGridView: React.FC<ProductGridViewProps> = ({
  products,
  onQuickView,
  onCompareToggle,
  comparingProducts,
  isDense = false
}) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
  };

  const handleWishlistToggle = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      });
    }
  };

  const handleCompareToggle = (product: Product) => {
    const isCurrentlyComparing = comparingProducts.includes(product.id);
    onCompareToggle(product, !isCurrentlyComparing);
  };

  // Determine grid columns based on view type
  const gridCols = isDense
    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";

  return (
    <div className={`grid ${gridCols} gap-6`}>
      {products.map(product => (
        <div
          key={product.id}
          className="group"
        >
          {/* Product Card */}
          <div className={`relative bg-white overflow-hidden shadow-md ${
            comparingProducts.includes(product.id) ? 'ring-2 ring-brown/30' : ''
          }`}>
            {/* Product Image with hover effect */}
            <Link href={`/product/${product.id}`}>
              <div className="relative w-full overflow-hidden aspect-portrait">
                {/* Primary Image */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover cursor-pointer absolute top-0 left-0 transition-opacity duration-300 group-hover:opacity-0"
                  loading="eager"
                />
                {/* Secondary Image (shown on hover) */}
                <img
                  src={product.image2 || product.image}
                  alt={`${product.name} - alternate view`}
                  className="w-full h-full object-cover cursor-pointer absolute top-0 left-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                  loading="eager"
                />
              </div>
            </Link>

            {/* Sale Badge */}
            {product.salePercentage && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1">
                Sale {product.salePercentage}%
              </div>
            )}

            {/* Product Name Overlay - Only visible on hover */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="text-white text-sm font-medium">{product.name}</h3>
            </div>

            {/* Action Buttons - Only visible on hover */}
            <div className="absolute top-2 right-2 action-buttons-container opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {/* Wishlist Button */}
              {isInWishlist(product.id) ? (
                <button
                  className="action-button bg-white shadow-sm text-red-500 hover:text-red-600"
                  onClick={() => handleWishlistToggle(product)}
                  aria-label="Remove from wishlist"
                >
                  <span className="label text-xs font-medium">Wishlist</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </button>
              ) : (
                <button
                  className="action-button bg-white shadow-sm text-brown hover:text-opacity-70"
                  onClick={() => handleWishlistToggle(product)}
                  aria-label="Add to wishlist"
                >
                  <span className="label text-xs font-medium">Wishlist</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              )}

              {/* Quick View Button */}
              <button
                className="action-button bg-white shadow-sm text-brown hover:text-brown-dark"
                onClick={() => onQuickView(product)}
                aria-label="Quick view"
              >
                <span className="label text-xs font-medium">Quick View</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>

              {/* Compare Button */}
              <button
                className={`action-button bg-white shadow-sm ${
                  comparingProducts.includes(product.id)
                    ? 'text-brown'
                    : 'text-brown-light hover:text-brown'
                }`}
                onClick={() => handleCompareToggle(product)}
                aria-label={`${comparingProducts.includes(product.id) ? 'Remove from' : 'Add to'} comparison`}
              >
                <span className="label text-xs font-medium">Compare</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </button>
            </div>

            {/* Add to Cart Button - Only visible on hover */}
            <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full py-3 bg-white text-brown font-medium hover:bg-brown hover:text-white transition-colors border-t border-gray-200"
              >
                ADD TO CART
              </button>
            </div>
          </div>

          {/* Product Details Outside Card */}
          <div className="mt-3 text-center">
            <Link href={`/product/${product.id}`}>
              <h3 className="text-base font-medium text-brown cursor-pointer hover:text-opacity-80">{product.name}</h3>
            </Link>

            {/* Price */}
            <div className="mt-1">
              {product.oldPrice ? (
                <>
                  <span className="text-gray-400 line-through mr-2">₹{product.oldPrice}</span>
                  <span className="text-brown font-semibold">₹{product.price}</span>
                </>
              ) : (
                <span className="text-brown font-semibold">₹{product.price}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGridView;
