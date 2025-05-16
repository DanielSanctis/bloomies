import { useState, useRef, ChangeEvent } from 'react';
import { useLocation, Link } from 'wouter';
import { useAuth } from '../context/AuthContext';
import { useUserProfile, useUserAddresses, useUserContact } from '../hooks/useUserProfile';
import { useUserOrders } from '../hooks/useOrders';

const UserProfile = () => {
  const { currentUser, signOut } = useAuth();
  const [, navigate] = useLocation();
  const {
    profile,
    updateProfile,
    isUpdating,
    uploadImage,
    isUploading
  } = useUserProfile();

  const { address, updateAddress } = useUserAddresses();
  const { contactInfo, updateContactInfo } = useUserContact();
  const { orders, isLoading: isLoadingOrders } = useUserOrders({ limit: 5 });

  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [displayName, setDisplayName] = useState(contactInfo?.displayName || '');
  const [phone, setPhone] = useState(contactInfo?.phone || '');
  const [addressLine, setAddressLine] = useState(address?.address || '');
  const [city, setCity] = useState(address?.city || '');
  const [state, setState] = useState(address?.state || '');
  const [pincode, setPincode] = useState(address?.pincode || '');

  // File upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle profile image upload
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadImage(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Update contact info
    updateContactInfo({
      displayName,
      phone
    });

    // Update address
    updateAddress({
      address: addressLine,
      city,
      state,
      pincode
    });

    setIsEditing(false);
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // If user is not logged in, redirect to login page
  if (!currentUser) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-brown mb-6">My Account</h1>

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center mb-8 bg-cream/30 p-6 rounded-sm">
        <div className="relative mb-4 md:mb-0 md:mr-6">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
            {contactInfo?.profileImageUrl ? (
              <img
                src={contactInfo.profileImageUrl}
                alt={contactInfo.displayName || 'Profile'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-beige text-brown">
                {contactInfo?.displayName ? contactInfo.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 bg-brown text-white p-1 rounded-full"
            disabled={isUploading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            accept="image/*"
          />
        </div>

        <div className="text-center md:text-left">
          <h2 className="text-xl font-semibold text-brown">{contactInfo?.displayName || 'User'}</h2>
          <p className="text-gray-600">{contactInfo?.email}</p>
          {contactInfo?.phone && <p className="text-gray-600">{contactInfo.phone}</p>}
        </div>

        <div className="ml-auto mt-4 md:mt-0">
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-sm hover:bg-gray-300 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            className={`py-4 px-1 ${activeTab === 'profile' ? 'border-b-2 border-brown font-medium text-brown' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`py-4 px-1 ${activeTab === 'orders' ? 'border-b-2 border-brown font-medium text-brown' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
          <button
            className={`py-4 px-1 ${activeTab === 'wishlist' ? 'border-b-2 border-brown font-medium text-brown' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('wishlist')}
          >
            Wishlist
          </button>
        </nav>
      </div>

      {/* Profile Tab Content */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 rounded-sm shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-brown">Personal Information</h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-brown hover:text-brown/80"
              >
                Edit
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={contactInfo?.email || ''}
                    disabled
                    className="w-full p-2 border border-gray-300 rounded-sm bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-sm"
                  />
                </div>
              </div>

              <h3 className="text-lg font-medium text-brown mt-8 mb-4">Shipping Address</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-sm"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-sm hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 bg-brown text-white rounded-sm hover:bg-brown/90 transition-colors"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{contactInfo?.displayName || 'Not set'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{contactInfo?.email || 'Not set'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{contactInfo?.phone || 'Not set'}</p>
                </div>
              </div>

              <h3 className="text-lg font-medium text-brown mt-8 mb-4">Shipping Address</h3>

              {address?.address ? (
                <div>
                  <p className="font-medium">{address.address}</p>
                  <p className="font-medium">{address.city}, {address.state} {address.pincode}</p>
                </div>
              ) : (
                <p className="text-gray-500">No shipping address saved</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Orders Tab Content */}
      {activeTab === 'orders' && (
        <div className="bg-white p-6 rounded-sm shadow-sm">
          <h3 className="text-lg font-medium text-brown mb-4">Recent Orders</h3>

          {isLoadingOrders ? (
            <p className="text-gray-500">Loading orders...</p>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-200 p-4 rounded-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Order #{order.id?.substring(0, 8)}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm font-medium mt-1">
                        Status: <span className="capitalize">{order.status}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Rs. {order.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{order.items.length} items</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link href={`/order/${order.id}`} className="text-brown hover:underline text-sm">
                      View Order Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">You haven't placed any orders yet.</p>
          )}

          <div className="mt-6">
            <Link href="/orders" className="text-brown hover:underline">
              View All Orders
            </Link>
          </div>
        </div>
      )}

      {/* Wishlist Tab Content */}
      {activeTab === 'wishlist' && (
        <div className="bg-white p-6 rounded-sm shadow-sm">
          <h3 className="text-lg font-medium text-brown mb-4">My Wishlist</h3>

          {/* Wishlist content will be implemented separately */}
          <p className="text-gray-500">Your wishlist items will appear here.</p>

          <div className="mt-6">
            <Link href="/wishlist" className="text-brown hover:underline">
              Go to Wishlist
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
