import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

// Mock product data (would come from Firestore in a real implementation)
const mockProducts = [
  {
    id: '1',
    name: 'Elegant Rose Bouquet',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1561181286-d5c73431a97f?w=500&h=500&fit=crop&q=80',
    description: 'A beautiful arrangement of handcrafted roses that will last forever.',
    type: 'bouquet',
    flowerType: 'satin ribbon',
    size: 'large',
    categories: {
      occasion: 'romance',
      fandom: ''
    }
  },
  {
    id: '2',
    name: 'Fantasy Garden Bouquet',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1596438459194-f275f413d6ff?w=500&h=500&fit=crop&q=80',
    description: 'Inspired by fantasy gardens, this bouquet features a mix of colorful flowers.',
    type: 'bouquet',
    flowerType: 'pipe cleaner',
    size: 'large',
    categories: {
      occasion: '',
      fandom: 'fantasy'
    }
  },
  {
    id: '3',
    name: 'Single Eternal Rose',
    price: 499,
    image: 'https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?w=500&h=500&fit=crop&q=80',
    description: 'A single handcrafted rose that will never wilt or fade.',
    type: 'single',
    flowerType: 'satin ribbon',
    size: 'small',
    categories: {
      occasion: 'romance',
      fandom: ''
    }
  },
  {
    id: '4',
    name: 'Sci-Fi Adventure Bouquet',
    price: 2199,
    image: 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=500&h=500&fit=crop&q=80',
    description: 'A futuristic arrangement inspired by science fiction adventures.',
    type: 'bouquet',
    flowerType: 'pipe cleaner',
    size: 'large',
    categories: {
      occasion: '',
      fandom: 'sci-fi'
    }
  },
  {
    id: '5',
    name: 'Celebration Bouquet',
    price: 1699,
    image: 'https://images.unsplash.com/photo-1599733594230-6b823276abcc?w=500&h=500&fit=crop&q=80',
    description: 'Perfect for birthdays, anniversaries, or any special celebration.',
    type: 'bouquet',
    flowerType: 'satin ribbon',
    size: 'large',
    categories: {
      occasion: 'celebrations',
      fandom: ''
    }
  },
  {
    id: '6',
    name: 'Mystical Forest Bouquet',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=500&h=500&fit=crop&q=80',
    description: 'Inspired by enchanted forests, featuring unique and magical flowers.',
    type: 'bouquet',
    flowerType: 'pipe cleaner',
    size: 'large',
    categories: {
      occasion: '',
      fandom: 'fantasy'
    }
  },
  {
    id: '7',
    name: 'Single Fantasy Flower',
    price: 599,
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=500&h=500&fit=crop&q=80',
    description: 'A single handcrafted fantasy flower that brings magic to any space.',
    type: 'single',
    flowerType: 'pipe cleaner',
    size: 'small',
    categories: {
      occasion: '',
      fandom: 'fantasy'
    }
  },
  {
    id: '8',
    name: 'Wedding Bouquet',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1562158074-d49fbeffcc91?w=500&h=500&fit=crop&q=80',
    description: 'A beautiful wedding bouquet that you can keep as a memento forever.',
    type: 'bouquet',
    flowerType: 'satin ribbon',
    size: 'large',
    categories: {
      occasion: 'wedding',
      fandom: ''
    }
  }
];

const Compare = () => {
  const [location] = useLocation();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState<typeof mockProducts>([]);

  useEffect(() => {
    // Get product IDs from URL
    const url = new URL(window.location.href);
    const ids = url.searchParams.get('ids')?.split(',') || [];

    // Filter products based on IDs
    const productsToCompare = mockProducts.filter(product => ids.includes(product.id));
    setProducts(productsToCompare);
  }, [location]);

  const handleAddToCart = (product: typeof mockProducts[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
  };

  const handleWishlistToggle = (product: typeof mockProducts[0]) => {
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
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/shop" className="flex items-center text-brown hover:text-opacity-70">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Shop
        </Link>
        <h1 className="text-3xl font-bold text-brown mt-4">Compare Products</h1>
      </div>

      {products.length < 2 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-brown-dark mb-4">Please select at least 2 products to compare.</p>
          <Link href="/shop" className="inline-block px-4 py-2 bg-brown text-cream rounded-md hover:bg-brown-dark transition-colors">
            Return to Shop
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left text-brown font-semibold w-1/4">Product</th>
                {products.map(product => (
                  <th key={product.id} className="p-4 text-center">
                    <div className="flex flex-col items-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded-md mb-2"
                      />
                      <Link href={`/product/${product.id}`} className="text-brown hover:text-brown-dark font-medium">
                        {product.name}
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Price */}
              <tr className="border-b bg-cream/30">
                <td className="p-4 font-medium text-brown">Price</td>
                {products.map(product => (
                  <td key={product.id} className="p-4 text-center font-semibold text-brown">
                    ₹{product.price}
                  </td>
                ))}
              </tr>

              {/* Type */}
              <tr className="border-b">
                <td className="p-4 font-medium text-brown">Type</td>
                {products.map(product => (
                  <td key={product.id} className="p-4 text-center capitalize">
                    {product.type}
                  </td>
                ))}
              </tr>

              {/* Flower Type */}
              <tr className="border-b bg-cream/30">
                <td className="p-4 font-medium text-brown">Flower Type</td>
                {products.map(product => (
                  <td key={product.id} className="p-4 text-center capitalize">
                    {product.flowerType}
                  </td>
                ))}
              </tr>

              {/* Size */}
              <tr className="border-b">
                <td className="p-4 font-medium text-brown">Size</td>
                {products.map(product => (
                  <td key={product.id} className="p-4 text-center capitalize">
                    {product.size}
                  </td>
                ))}
              </tr>

              {/* Occasion */}
              <tr className="border-b bg-cream/30">
                <td className="p-4 font-medium text-brown">Occasion</td>
                {products.map(product => (
                  <td key={product.id} className="p-4 text-center capitalize">
                    {product.categories?.occasion || '-'}
                  </td>
                ))}
              </tr>

              {/* Fandom */}
              <tr className="border-b">
                <td className="p-4 font-medium text-brown">Fandom</td>
                {products.map(product => (
                  <td key={product.id} className="p-4 text-center capitalize">
                    {product.categories?.fandom || '-'}
                  </td>
                ))}
              </tr>

              {/* Description */}
              <tr className="border-b bg-cream/30">
                <td className="p-4 font-medium text-brown">Description</td>
                {products.map(product => (
                  <td key={product.id} className="p-4 text-center">
                    {product.description}
                  </td>
                ))}
              </tr>

              {/* Actions */}
              <tr>
                <td className="p-4 font-medium text-brown">Actions</td>
                {products.map(product => (
                  <td key={product.id} className="p-4">
                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full py-2 bg-brown text-cream hover:bg-brown-dark transition-colors text-sm"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleWishlistToggle(product)}
                        className={`w-full py-2 border transition-colors text-sm ${
                          isInWishlist(product.id)
                            ? 'border-red-500 text-red-500 hover:bg-red-50'
                            : 'border-brown text-brown hover:bg-cream'
                        }`}
                      >
                        {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      </button>
                      <Link
                        href={`/product/${product.id}`}
                        className="w-full py-2 border border-brown-light text-brown-light rounded-md hover:bg-cream transition-colors text-sm text-center"
                      >
                        View Details
                      </Link>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Compare;
