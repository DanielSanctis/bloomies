import { Link } from 'wouter';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-brown mb-8">My Wishlist</h1>

      {items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-brown/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <p className="mt-4 text-brown/70 text-lg">Your wishlist is empty</p>
          <p className="mt-2 text-brown/60">Add items to your wishlist by clicking the heart icon on products</p>
          <Link href="/shop" className="mt-6 inline-block px-6 py-3 bg-brown text-cream rounded-md hover:bg-opacity-90 transition-colors">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative">
                <Link href={`/product/${item.id}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-64 object-cover cursor-pointer"
                  />
                </Link>
                <button 
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm text-red-500"
                  onClick={() => removeFromWishlist(item.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <Link href={`/product/${item.id}`}>
                  <h3 className="text-lg font-semibold text-brown mb-2 cursor-pointer hover:text-opacity-80">{item.name}</h3>
                </Link>
                <div className="flex justify-between items-center">
                  <span className="text-brown font-medium">₹{item.price}</span>
                  <button
                    onClick={() => {
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: 1,
                        image: item.image
                      });
                    }}
                    className="px-3 py-1 bg-brown text-cream rounded-md hover:bg-opacity-90 transition-colors text-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
