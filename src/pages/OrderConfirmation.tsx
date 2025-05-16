import { useEffect } from 'react';
import { useRoute, Link, useLocation } from 'wouter';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../hooks/useOrders';

const OrderConfirmation = () => {
  const { currentUser } = useAuth();
  const [, navigate] = useLocation();
  const [, params] = useRoute('/order-confirmation/:id');
  const orderId = params?.id || '';

  const { order, isLoading, error } = useOrder(orderId);

  // If user is not logged in, redirect to login page
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // If no order ID, redirect to home
  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading order details. The order may not exist.</p>
          <Link
            href="/"
            className="px-4 py-2 bg-brown text-white rounded-sm hover:bg-brown/90 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-sm shadow-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-brown mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your order. We've received your order and will begin processing it right away.
          </p>
        </div>

        <div className="border-t border-b border-gray-200 py-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="font-medium text-gray-700">Order Number:</span>
            <span className="text-gray-800">#{order.id?.substring(0, 8)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-medium text-gray-700">Order Date:</span>
            <span className="text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-medium text-gray-700">Order Status:</span>
            <span className="text-gray-800 capitalize">{order.status}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-medium text-gray-700">Payment Method:</span>
            <span className="text-gray-800 capitalize">{order.paymentInfo.method}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Order Total:</span>
            <span className="text-gray-800">Rs. {order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-medium text-brown mb-4">Order Summary</h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-sm overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-xs">
                      No Image
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">
                    Rs. {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Subtotal</span>
              <span>Rs. {order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Shipping</span>
              <span>{order.shippingCost === 0 ? 'Free' : `Rs. ${order.shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between font-medium text-gray-800 mt-2 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>Rs. {order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-medium text-brown mb-4">Shipping Information</h2>
          <div className="bg-gray-50 p-4 rounded-sm">
            <p className="text-gray-800">{order.shippingInfo.fullName}</p>
            <p className="text-gray-800">{order.shippingInfo.address}</p>
            <p className="text-gray-800">{order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.pincode}</p>
            <p className="text-gray-800">{order.shippingInfo.phone}</p>
            <p className="text-gray-800">{order.shippingInfo.email}</p>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-gray-600">
            You will receive an email confirmation shortly at <span className="font-medium">{order.shippingInfo.email}</span>
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href={`/order/${order.id}`}
              className="px-4 py-2 bg-brown text-white rounded-sm hover:bg-brown/90 transition-colors"
            >
              View Order Details
            </Link>
            <Link
              href="/shop"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-sm hover:bg-gray-300 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
