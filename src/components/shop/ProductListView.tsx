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
  description?: string;
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

interface ProductListViewProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onCompareToggle: (product: Product, isComparing: boolean) => void;
  comparingProducts: string[];
}

const ProductListView: React.FC<ProductListViewProps> = ({
  products,
  onQuickView,
  onCompareToggle,
  comparingProducts
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

  return (
    <div className="space-y-6">
      {products.map(product => (
        <div
          key={product.id}
          className={`bg-white shadow-md overflow-hidden group ${
            comparingProducts.includes(product.id) ? 'ring-2 ring-brown/30' : ''
          }`}
        >
          <div className="flex flex-col md:flex-row">
            {/* Product Image - Left Side with 4:5 aspect ratio */}
            <div className="relative w-full md:w-1/3 md:min-w-[250px]">
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
            </div>

            {/* Product Details - Right Side */}
            <div className="p-6 flex flex-col flex-grow">
              {/* Product Title */}
              <Link href={`/product/${product.id}`}>
                <h3 className="text-lg font-semibold text-brown mb-2 cursor-pointer hover:text-opacity-80">{product.name}</h3>
              </Link>

              {/* Product Description */}
              {product.description && (
                <p className="text-brown-dark mb-4 line-clamp-3">{product.description}</p>
              )}

              {/* Product Attributes */}
              <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
                {product.type && (
                  <div className="flex">
                    <span className="font-medium w-24">Type:</span>
                    <span className="capitalize">{product.type}</span>
                  </div>
                )}

                {product.flowerType && (
                  <div className="flex">
                    <span className="font-medium w-24">Flower Type:</span>
                    <span className="capitalize">{product.flowerType}</span>
                  </div>
                )}

                {product.size && (
                  <div className="flex">
                    <span className="font-medium w-24">Size:</span>
                    <span className="capitalize">{product.size}</span>
                  </div>
                )}

                {product.categories?.occasion && (
                  <div className="flex">
                    <span className="font-medium w-24">Occasion:</span>
                    <span className="capitalize">{product.categories.occasion}</span>
                  </div>
                )}

                {product.categories?.fandom && (
                  <div className="flex">
                    <span className="font-medium w-24">Fandom:</span>
                    <span className="capitalize">{product.categories.fandom}</span>
                  </div>
                )}
              </div>

              {/* Price and Action Buttons */}
              <div className="mt-auto">
                {/* Price */}
                <div className="flex flex-col mb-4">
                  {product.oldPrice ? (
                    <div>
                      <span className="text-gray-400 line-through mr-2">₹{product.oldPrice}</span>
                      <span className="text-brown font-semibold text-xl">₹{product.price}</span>
                    </div>
                  ) : (
                    <span className="text-brown font-semibold text-xl">₹{product.price}</span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="px-6 py-3 bg-brown text-cream hover:bg-brown-dark transition-colors w-full sm:max-w-xs"
                  >
                    ADD TO CART
                  </button>

                  {/* Compare Checkbox */}
                  <div className="flex items-center mt-2 sm:mt-0">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={comparingProducts.includes(product.id)}
                        onChange={() => handleCompareToggle(product)}
                      />
                      <div className={`w-5 h-5 border mr-2 flex items-center justify-center transition-colors ${
                        comparingProducts.includes(product.id)
                          ? 'bg-brown border-brown'
                          : 'border-brown-light'
                      }`}>
                        {comparingProducts.includes(product.id) && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-brown">Compare</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductListView;
