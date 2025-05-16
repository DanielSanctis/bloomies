import { Link } from 'wouter';
import { useCart, CartItem } from '../../context/CartContext';

const CartSidebar = () => {
  const { items, isOpen, toggleCart, updateItemQuantity, removeItem, subtotal } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={toggleCart}
      />

      {/* Sidebar */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen max-w-md">
          <div className="h-full flex flex-col bg-cream shadow-xl overflow-y-scroll">
            {/* Header */}
            <div className="px-4 py-6 bg-beige sm:px-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-brown">Shopping Cart</h2>
                <button
                  type="button"
                  className="text-brown hover:text-opacity-70"
                  onClick={toggleCart}
                >
                  <span className="sr-only">Close panel</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="mt-1 text-sm text-brown/70">
                {items.length === 0
                  ? 'Your cart is empty'
                  : `You have ${items.length} item${items.length > 1 ? 's' : ''} in your cart`
                }
              </p>
            </div>

            {/* Cart Items */}
            <div className="flex-1 py-6 px-4 sm:px-6 overflow-auto">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-brown/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="mt-4 text-brown/70">Your cart is empty</p>
                  <Link href="/shop" className="mt-4 inline-block px-4 py-2 bg-brown text-cream rounded-md hover:bg-opacity-90 transition-colors">
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-beige">
                  {items.map((item) => (
                    <CartItemComponent
                      key={item.id}
                      item={item}
                      updateQuantity={updateItemQuantity}
                      removeItem={removeItem}
                    />
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-beige py-6 px-4 sm:px-6">
                <div className="flex justify-between text-base font-medium text-brown">
                  <p>Subtotal</p>
                  <p>₹{subtotal.toFixed(2)}</p>
                </div>
                <p className="mt-0.5 text-sm text-brown/70">Shipping and taxes calculated at checkout.</p>
                <div className="mt-6">
                  <Link
                    href="/checkout"
                    className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-cream bg-brown hover:bg-opacity-90"
                    onClick={toggleCart}
                  >
                    Checkout
                  </Link>
                </div>
                <div className="mt-6 flex justify-center text-sm text-center text-brown/70">
                  <p>
                    or{' '}
                    <button
                      type="button"
                      className="text-brown font-medium hover:text-opacity-70"
                      onClick={toggleCart}
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

// Cart Item Component
interface CartItemProps {
  item: CartItem;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
}

const CartItemComponent = ({ item, updateQuantity, removeItem }: CartItemProps) => {
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
            <h3>
              <Link href={`/product/${item.id}`}>
                {item.name}
              </Link>
            </h3>
            <p className="ml-4">₹{item.price.toFixed(2)}</p>
          </div>

          {/* Personalized Notes */}
          {item.personalizedNotes && (
            <div className="mt-1 text-xs text-gray-500">
              <span className="font-medium">Note:</span> {item.personalizedNotes}
            </div>
          )}
        </div>
        <div className="flex-1 flex items-end justify-between text-sm mt-2">
          {/* Quantity Controls */}
          <div className="flex items-center border border-beige rounded-md">
            <button
              className="px-2 py-1 text-brown"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              -
            </button>
            <span className="px-2 py-1 text-brown">{item.quantity}</span>
            <button
              className="px-2 py-1 text-brown"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              +
            </button>
          </div>

          {/* Remove Button */}
          <div className="flex">
            <button
              type="button"
              className="font-medium text-brown hover:text-opacity-70"
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

export default CartSidebar;
