import { useRoute, Link, useLocation } from 'wouter';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../hooks/useOrders';
import { OrderStatus } from '../services/orderService';

const OrderDetail = () => {
  const { currentUser } = useAuth();
  const [, navigate] = useLocation();
  const [, params] = useRoute('/order/:id');
  const orderId = params?.id || '';

  const { order, isLoading, error } = useOrder(orderId);

  // If user is not logged in, redirect to login page
  if (!currentUser) {
    navigate('/login');
    return null;
  }

  // Get status badge color
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get payment method display name
  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'cod':
        return 'Cash on Delivery';
      case 'upi':
        return 'UPI';
      case 'razorpay':
        return 'Razorpay';
      case 'googlepay':
        return 'Google Pay';
      default:
        return method;
    }
  };

  // Get payment status badge color
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading order details. The order may not exist or you may not have permission to view it.</p>
          <Link
            href="/orders"
            className="px-4 py-2 bg-brown text-white rounded-sm hover:bg-brown/90 transition-colors"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/orders" className="text-brown hover:underline mr-2">
          Order History
        </Link>
        <span className="text-gray-500 mx-2">/</span>
        <h1 className="text-2xl font-bold text-brown">Order #{order.id?.substring(0, 8)}</h1>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-6 rounded-sm shadow-sm mb-6">
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium text-brown mb-2">Order Summary</h2>
            <p className="text-gray-600">
              Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Shipping Address</h3>
            <p className="text-gray-600">{order.shippingInfo.fullName}</p>
            <p className="text-gray-600">{order.shippingInfo.address}</p>
            <p className="text-gray-600">{order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.pincode}</p>
            <p className="text-gray-600">{order.shippingInfo.phone}</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-800 mb-2">Payment Information</h3>
            <p className="text-gray-600">Method: {getPaymentMethodName(order.paymentInfo.method)}</p>
            <p className="text-gray-600">
              Status:
              <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentInfo.status)}`}>
                {order.paymentInfo.status.charAt(0).toUpperCase() + order.paymentInfo.status.slice(1)}
              </span>
            </p>
            {order.paymentInfo.transactionId && (
              <p className="text-gray-600">Transaction ID: {order.paymentInfo.transactionId}</p>
            )}
          </div>

          <div>
            <h3 className="font-medium text-gray-800 mb-2">Order Total</h3>
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>Rs. {order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping:</span>
              <span>Rs. {order.shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium text-gray-800 mt-2 pt-2 border-t border-gray-200">
              <span>Total:</span>
              <span>Rs. {order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-sm shadow-sm overflow-hidden">
        <h2 className="text-lg font-medium text-brown p-6 border-b border-gray-200">
          Order Items ({order.items.length})
        </h2>

        <div className="divide-y divide-gray-200">
          {order.items.map((item, index) => (
            <div key={index} className="p-6 flex flex-col md:flex-row">
              <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-sm overflow-hidden mb-4 md:mb-0 md:mr-6">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                    No Image
                  </div>
                )}
              </div>

              <div className="flex-grow">
                <h3 className="font-medium text-gray-800">{item.name}</h3>
                <p className="text-gray-600 mt-1">Quantity: {item.quantity}</p>
                {item.personalizedNotes && (
                  <p className="text-gray-600 mt-1">
                    <span className="font-medium">Personalized Note:</span> {item.personalizedNotes}
                  </p>
                )}
              </div>

              <div className="mt-4 md:mt-0 text-right">
                <p className="font-medium text-gray-800">Rs. {(item.price * item.quantity).toFixed(2)}</p>
                <p className="text-gray-600 text-sm">Rs. {item.price.toFixed(2)} each</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Timeline */}
      {order.status !== 'cancelled' && (
        <div className="mt-8 bg-white p-6 rounded-sm shadow-sm">
          <h2 className="text-lg font-medium text-brown mb-6">Order Timeline</h2>

          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            <div className="relative z-10 mb-8">
              <div className="flex items-center">
                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${order.status !== 'pending' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-800">Order Placed</h3>
                  <p className="text-gray-600 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10 mb-8">
              <div className="flex items-center">
                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${order.status !== 'pending' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-800">Processing</h3>
                  <p className="text-gray-600 text-sm">
                    {order.status !== 'pending' ? 'Your order is being processed' : 'Waiting to be processed'}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10 mb-8">
              <div className="flex items-center">
                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${order.status === 'shipped' || order.status === 'delivered' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {order.status === 'shipped' || order.status === 'delivered' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-sm">3</span>
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-800">Shipped</h3>
                  <p className="text-gray-600 text-sm">
                    {order.status === 'shipped' || order.status === 'delivered' ? (
                      order.shippedAt ? `Shipped on ${new Date(order.shippedAt).toLocaleDateString()}` : 'Your order has been shipped'
                    ) : (
                      'Waiting to be shipped'
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center">
                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${order.status === 'delivered' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {order.status === 'delivered' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-sm">4</span>
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-800">Delivered</h3>
                  <p className="text-gray-600 text-sm">
                    {order.status === 'delivered' ? (
                      order.deliveredAt ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}` : 'Your order has been delivered'
                    ) : (
                      'Waiting to be delivered'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
