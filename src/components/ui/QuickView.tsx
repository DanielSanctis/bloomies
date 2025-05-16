import React from 'react';
import { Link } from 'wouter';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  salePercentage?: number;
  image: string;
  image2?: string; // Second image for hover effect
  description?: string;
  type?: string;
  flowerType?: string;
  size?: string;
  categories?: {
    occasion?: string;
    fandom?: string;
  };
}

interface QuickViewProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const QuickView: React.FC<QuickViewProps> = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [personalizedNotes, setPersonalizedNotes] = React.useState('');

  if (!isOpen) return null;

  // Generate a short description if none exists
  const description = product.description ||
    `This beautiful ${product.type || 'item'} is handcrafted with ${product.flowerType || 'premium materials'}
    and designed to last forever. Perfect for any occasion, it brings elegance and charm to any space.`;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      personalizedNotes: personalizedNotes.trim() || undefined,
    });
  };

  const handleWishlistToggle = () => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-brown hover:text-brown-dark z-10"
          aria-label="Close quick view"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Product Image with hover effect */}
          <div className="w-full md:w-1/2 relative group">
            <div className="relative w-full overflow-hidden aspect-portrait">
              {/* Primary Image */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-300 group-hover:opacity-0"
                loading="eager"
              />
              {/* Secondary Image (shown on hover) */}
              <img
                src={product.image2 || product.image}
                alt={`${product.name} - alternate view`}
                className="w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                loading="eager"
              />
            </div>

            {/* Sale Badge - If product has a sale percentage */}
            {product.salePercentage && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1">
                Sale {product.salePercentage}%
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
            <h2 className="text-2xl font-heading font-semibold text-brown mb-2">{product.name}</h2>

            <div className="text-xl font-medium text-brown mb-4">
              {product.oldPrice ? (
                <>
                  <span className="text-gray-400 line-through mr-2">₹{product.oldPrice.toFixed(2)}</span>
                  <span className="text-brown font-semibold">₹{product.price.toFixed(2)}</span>
                </>
              ) : (
                <span>₹{product.price.toFixed(2)}</span>
              )}
            </div>

            <div className="mb-6 text-brown-dark">
              <p className="mb-4">{description}</p>

              {/* Product Attributes */}
              <div className="space-y-2 mb-6">
                {product.type && (
                  <div className="flex">
                    <span className="font-medium w-32">Type:</span>
                    <span className="capitalize">{product.type}</span>
                  </div>
                )}

                {product.flowerType && (
                  <div className="flex">
                    <span className="font-medium w-32">Flower Type:</span>
                    <span className="capitalize">{product.flowerType}</span>
                  </div>
                )}

                {product.size && (
                  <div className="flex">
                    <span className="font-medium w-32">Size:</span>
                    <span className="capitalize">{product.size}</span>
                  </div>
                )}

                {product.categories?.occasion && (
                  <div className="flex">
                    <span className="font-medium w-32">Occasion:</span>
                    <span className="capitalize">{product.categories.occasion}</span>
                  </div>
                )}

                {product.categories?.fandom && (
                  <div className="flex">
                    <span className="font-medium w-32">Fandom:</span>
                    <span className="capitalize">{product.categories.fandom}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Personalized Notes */}
            <div className="mb-6">
              <label htmlFor="quickViewPersonalizedNotes" className="block text-gray-700 mb-2">
                Personalized Notes / Request (30-40 Words Only)
              </label>
              <textarea
                id="quickViewPersonalizedNotes"
                className="w-full border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-brown"
                rows={2}
                value={personalizedNotes}
                onChange={(e) => setPersonalizedNotes(e.target.value)}
                maxLength={40}
                placeholder="Add your personalized message here (max 40 words)"
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto flex flex-col space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full py-3 bg-brown text-cream hover:bg-brown-dark transition-colors"
              >
                ADD TO CART
              </button>

              <div className="flex space-x-3">
                <button
                  onClick={handleWishlistToggle}
                  className={`flex-1 py-3 border transition-colors flex items-center justify-center ${
                    isInWishlist(product.id)
                      ? 'border-red-500 text-red-500 hover:bg-red-50'
                      : 'border-brown text-brown hover:bg-cream'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill={isInWishlist(product.id) ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {isInWishlist(product.id) ? 'REMOVE FROM WISHLIST' : 'ADD TO WISHLIST'}
                </button>

                <Link
                  href={`/product/${product.id}`}
                  className="flex-1 py-3 border border-brown text-brown hover:bg-cream transition-colors flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  VIEW DETAILS
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickView;
