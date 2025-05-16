import { Link } from 'wouter';
import { useWishlist, WishlistItem } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

const WishlistSidebar = () => {
  const { items, isOpen, toggleWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={toggleWishlist}
      />

      {/* Sidebar */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-6 sm:px-6 border-b border-beige">
              <h2 className="text-lg font-medium text-brown">My Wishlist</h2>
              <button
                type="button"
                className="text-brown hover:text-opacity-70"
                onClick={toggleWishlist}
              >
                <span className="sr-only">Close panel</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Wishlist Items */}
            <div className="flex-1 py-6 px-4 sm:px-6 overflow-auto">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-brown/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <p className="mt-4 text-brown/70">Your wishlist is empty</p>
                  <Link href="/shop" className="mt-4 inline-block px-4 py-2 bg-brown text-cream rounded-md hover:bg-opacity-90 transition-colors">
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-beige">
                  {items.map((item) => (
                    <WishlistItemComponent
                      key={item.id}
                      item={item}
                      removeItem={removeFromWishlist}
                      addToCart={() => {
                        addToCart({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          quantity: 1,
                          image: item.image
                        });
                      }}
                    />
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-beige py-6 px-4 sm:px-6">
                <div className="mt-6">
                  <Link 
                    href="/profile/wishlist" 
                    className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-cream bg-brown hover:bg-opacity-90"
                    onClick={toggleWishlist}
                  >
                    View Full Wishlist
                  </Link>
                </div>
                <div className="mt-6 flex justify-center text-sm text-center text-brown">
                  <p>
                    or{' '}
                    <button
                      type="button"
                      className="font-medium hover:text-opacity-70"
                      onClick={toggleWishlist}
                    >
                      Continue Shopping<span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Wishlist Item Component
interface WishlistItemProps {
  item: WishlistItem;
  removeItem: (id: string) => Promise<void>;
  addToCart: () => Promise<void>;
}

const WishlistItemComponent = ({ item, removeItem, addToCart }: WishlistItemProps) => {
  return (
    <li className="py-6 flex">
      {/* Item Image */}
      <div className="flex-shrink-0 w-24 h-24 border border-beige rounded-md overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-center object-cover"
        />
      </div>

      {/* Item Details */}
      <div className="ml-4 flex-1 flex flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-brown">
            <Link href={`/product/${item.id}`}>
              {item.name}
            </Link>
            <p className="ml-4">₹{item.price}</p>
          </div>
        </div>
        <div className="flex-1 flex items-end justify-between text-sm">
          <div className="flex space-x-2">
            <button
              onClick={() => addToCart()}
              className="px-3 py-1 bg-brown text-cream rounded-md hover:bg-opacity-90 transition-colors text-sm"
            >
              Add to Cart
            </button>
            <button
              type="button"
              className="font-medium text-brown/70 hover:text-brown"
              onClick={() => removeItem(item.id)}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default WishlistSidebar;
