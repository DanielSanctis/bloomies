import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '../context/AuthContext';
import { useUserOrders } from '../hooks/useOrders';
import { OrderStatus } from '../services/orderService';

const OrderHistory = () => {
  const { currentUser } = useAuth();
  const [, navigate] = useLocation();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const { orders, isLoading, loadMore, hasMore } = useUserOrders({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    limit: 10,
    sortBy: 'createdAt',
    sortDirection: 'desc'
  });

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/profile" className="text-brown hover:underline mr-2">
          My Account
        </Link>
        <span className="text-gray-500 mx-2">/</span>
        <h1 className="text-2xl font-bold text-brown">Order History</h1>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-cream/30 p-4 rounded-sm">
        <h2 className="text-lg font-medium text-brown mb-3">Filter Orders</h2>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-sm ${statusFilter === 'all' ? 'bg-brown text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
            onClick={() => setStatusFilter('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-sm ${statusFilter === 'pending' ? 'bg-brown text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 rounded-sm ${statusFilter === 'processing' ? 'bg-brown text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
            onClick={() => setStatusFilter('processing')}
          >
            Processing
          </button>
          <button
            className={`px-4 py-2 rounded-sm ${statusFilter === 'shipped' ? 'bg-brown text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
            onClick={() => setStatusFilter('shipped')}
          >
            Shipped
          </button>
          <button
            className={`px-4 py-2 rounded-sm ${statusFilter === 'delivered' ? 'bg-brown text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
            onClick={() => setStatusFilter('delivered')}
          >
            Delivered
          </button>
          <button
            className={`px-4 py-2 rounded-sm ${statusFilter === 'cancelled' ? 'bg-brown text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
            onClick={() => setStatusFilter('cancelled')}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-sm shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Loading orders...</p>
          </div>
        ) : orders.length > 0 ? (
          <div>
            <div className="hidden md:grid md:grid-cols-5 bg-gray-50 p-4 border-b border-gray-200">
              <div className="font-medium text-gray-700">Order ID</div>
              <div className="font-medium text-gray-700">Date</div>
              <div className="font-medium text-gray-700">Status</div>
              <div className="font-medium text-gray-700">Total</div>
              <div className="font-medium text-gray-700">Actions</div>
            </div>

            <div className="divide-y divide-gray-200">
              {orders.map((order) => (
                <div key={order.id} className="p-4 md:grid md:grid-cols-5 md:items-center">
                  <div className="mb-2 md:mb-0">
                    <span className="md:hidden font-medium text-gray-700 mr-2">Order ID:</span>
                    <span>#{order.id?.substring(0, 8)}</span>
                  </div>

                  <div className="mb-2 md:mb-0">
                    <span className="md:hidden font-medium text-gray-700 mr-2">Date:</span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="mb-2 md:mb-0">
                    <span className="md:hidden font-medium text-gray-700 mr-2">Status:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>

                  <div className="mb-2 md:mb-0">
                    <span className="md:hidden font-medium text-gray-700 mr-2">Total:</span>
                    <span>Rs. {order.total.toFixed(2)}</span>
                  </div>

                  <div>
                    <Link
                      href={`/order/${order.id}`}
                      className="text-brown hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="p-4 border-t border-gray-200 text-center">
                <button
                  onClick={loadMore}
                  className="px-4 py-2 bg-brown text-white rounded-sm hover:bg-brown/90 transition-colors"
                >
                  Load More Orders
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <Link
              href="/shop"
              className="px-4 py-2 bg-brown text-white rounded-sm hover:bg-brown/90 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
