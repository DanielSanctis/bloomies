import { useState, useEffect } from 'react';
import { useRoute, Link, useLocation } from 'wouter';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

// Mock order data (would come from Firestore in a real implementation)
const mockOrders = [
  {
    id: 'order1',
    createdAt: new Date('2023-04-15'),
    status: 'delivered',
    total: 2998,
    items: [
      {
        id: '1',
        name: 'Elegant Rose Bouquet',
        price: 1499,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1561181286-d5c73431a97f',
      },
      {
        id: '2',
        name: 'Celebration Bouquet',
        price: 1499,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6',
      },
    ],
  },
  {
    id: 'order2',
    createdAt: new Date('2023-05-20'),
    status: 'processing',
    total: 1799,
    items: [
      {
        id: '7',
        name: 'Autumn Harvest',
        price: 1799,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1596438459194-f275f413d6ff',
      },
    ],
  },
];

// Mock wishlist data (would come from Firestore in a real implementation)
const mockWishlist = [
  {
    id: '3',
    name: 'Fantasy Realm Arrangement',
    price: 2299,
    image: 'https://images.unsplash.com/photo-1596438459194-f275f413d6ff',
  },
  {
    id: '5',
    name: 'Superhero Inspired Bouquet',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1561181286-d5c73431a97f',
  },
  {
    id: '8',
    name: 'Cute Critters Arrangement',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166',
  },
];

type ProfileTab = 'info' | 'orders' | 'wishlist';

interface UserProfile {
  displayName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

const Profile = () => {
  const [, params] = useRoute('/profile/:tab?');
  const tab = (params?.tab || 'info') as ProfileTab;

  const [, setLocation] = useLocation();
  const { currentUser, signOut } = useAuth();

  const [profile, setProfile] = useState<UserProfile>({
    displayName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [orders] = useState(mockOrders);
  const [wishlist] = useState(mockWishlist);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));

          if (userDoc.exists()) {
            setProfile({
              displayName: userDoc.data().displayName || '',
              email: userDoc.data().email || '',
              phone: userDoc.data().phone || '',
              address: userDoc.data().address || '',
              city: userDoc.data().city || '',
              state: userDoc.data().state || '',
              pincode: userDoc.data().pincode || '',
            });
          } else {
            // Initialize with data from auth
            setProfile({
              displayName: currentUser.displayName || '',
              email: currentUser.email || '',
              phone: '',
              address: '',
              city: '',
              state: '',
              pincode: '',
            });
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  // Handle profile form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError('');

      await updateDoc(doc(db, 'users', currentUser.uid), {
        displayName: profile.displayName,
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        pincode: profile.pincode,
        updatedAt: new Date(),
      });

      setIsEditing(false);
      setSuccess('Profile updated successfully');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating your profile');
    } finally {
      setLoading(false);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      setLocation('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while signing out');
    }
  };

  // Redirect to login if not authenticated
  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-brown/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h2 className="text-2xl font-bold text-brown mt-4 mb-2">Please Sign In</h2>
            <p className="text-brown/70 mb-6">
              You need to be signed in to view your profile.
            </p>
            <Link href="/auth">
              <a className="px-6 py-3 bg-brown text-cream rounded-md hover:bg-opacity-90 transition-colors">
                Sign In
              </a>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render profile info tab
  const renderProfileInfo = () => {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-brown">Personal Information</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 border border-brown text-brown rounded-md hover:bg-brown/10 transition-colors"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-brown mb-1">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={profile.displayName}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-beige rounded-md focus:outline-none focus:ring-2 focus:ring-brown/50"
              />
            ) : (
              <p className="px-4 py-2 bg-beige/20 rounded-md">{profile.displayName || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-brown mb-1">
              Email Address
            </label>
            <p className="px-4 py-2 bg-beige/20 rounded-md">{profile.email}</p>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-brown mb-1">
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-beige rounded-md focus:outline-none focus:ring-2 focus:ring-brown/50"
              />
            ) : (
              <p className="px-4 py-2 bg-beige/20 rounded-md">{profile.phone || 'Not provided'}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-brown mb-1">
              Address
            </label>
            {isEditing ? (
              <input
                type="text"
                id="address"
                name="address"
                value={profile.address}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-beige rounded-md focus:outline-none focus:ring-2 focus:ring-brown/50"
              />
            ) : (
              <p className="px-4 py-2 bg-beige/20 rounded-md">{profile.address || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-brown mb-1">
              City
            </label>
            {isEditing ? (
              <input
                type="text"
                id="city"
                name="city"
                value={profile.city}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-beige rounded-md focus:outline-none focus:ring-2 focus:ring-brown/50"
              />
            ) : (
              <p className="px-4 py-2 bg-beige/20 rounded-md">{profile.city || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-brown mb-1">
              State
            </label>
            {isEditing ? (
              <select
                id="state"
                name="state"
                value={profile.state}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-beige rounded-md focus:outline-none focus:ring-2 focus:ring-brown/50"
              >
                <option value="">Select State</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                <option value="Assam">Assam</option>
                <option value="Bihar">Bihar</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Goa">Goa</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Haryana">Haryana</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Manipur">Manipur</option>
                <option value="Meghalaya">Meghalaya</option>
                <option value="Mizoram">Mizoram</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Odisha">Odisha</option>
                <option value="Punjab">Punjab</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Sikkim">Sikkim</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Tripura">Tripura</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Delhi">Delhi</option>
              </select>
            ) : (
              <p className="px-4 py-2 bg-beige/20 rounded-md">{profile.state || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label htmlFor="pincode" className="block text-sm font-medium text-brown mb-1">
              Pincode
            </label>
            {isEditing ? (
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={profile.pincode}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-beige rounded-md focus:outline-none focus:ring-2 focus:ring-brown/50"
              />
            ) : (
              <p className="px-4 py-2 bg-beige/20 rounded-md">{profile.pincode || 'Not provided'}</p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleUpdateProfile}
              disabled={loading}
              className="px-6 py-2 bg-brown text-cream rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}

        <div className="mt-12 pt-6 border-t border-beige">
          <h2 className="text-xl font-semibold text-brown mb-4">Account Settings</h2>

          <div className="space-y-4">
            <div>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render orders tab
  const renderOrders = () => {
    if (orders.length === 0) {
      return (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-brown/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h2 className="text-xl font-semibold text-brown mt-4 mb-2">No Orders Yet</h2>
          <p className="text-brown/70 mb-6">
            You haven't placed any orders yet.
          </p>
          <Link href="/shop">
            <a className="px-6 py-3 bg-brown text-cream rounded-md hover:bg-opacity-90 transition-colors">
              Start Shopping
            </a>
          </Link>
        </div>
      );
    }

    return (
      <div>
        <h2 className="text-2xl font-semibold text-brown mb-6">Your Orders</h2>

        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-beige/50 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <p className="text-sm text-brown/70">Order #{order.id}</p>
                  <p className="text-sm text-brown/70">
                    Placed on {order.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.status === 'delivered'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'processing'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="divide-y divide-beige">
                  {order.items.map(item => (
                    <div key={item.id} className="py-4 flex">
                      <div className="flex-shrink-0 w-16 h-16 border border-beige rounded-md overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-center object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-sm font-medium text-brown">
                          <Link href={`/product/${item.id}`}>
                            <a className="hover:underline">{item.name}</a>
                          </Link>
                        </h3>
                        <p className="mt-1 text-sm text-brown/70">Qty: {item.quantity}</p>
                        <p className="mt-1 text-sm font-medium text-brown">₹{item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <div className="text-sm font-medium text-brown">
                    Total: <span className="text-lg">₹{order.total.toFixed(2)}</span>
                  </div>
                  <Link href={`/order/${order.id}`}>
                    <a className="px-4 py-2 border border-brown text-brown rounded-md hover:bg-brown/10 transition-colors">
                      View Details
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render wishlist tab
  const renderWishlist = () => {
    if (wishlist.length === 0) {
      return (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-brown/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h2 className="text-xl font-semibold text-brown mt-4 mb-2">Your Wishlist is Empty</h2>
          <p className="text-brown/70 mb-6">
            Save items you love to your wishlist.
          </p>
          <Link href="/shop">
            <a className="px-6 py-3 bg-brown text-cream rounded-md hover:bg-opacity-90 transition-colors">
              Start Shopping
            </a>
          </Link>
        </div>
      );
    }

    return (
      <div>
        <h2 className="text-2xl font-semibold text-brown mb-6">Your Wishlist</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map(item => (
            <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative">
                <Link href={`/product/${item.id}`}>
                  <a>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-64 object-cover"
                    />
                  </a>
                </Link>
                <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm text-red-500 hover:text-opacity-70">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <Link href={`/product/${item.id}`}>
                  <a>
                    <h3 className="text-lg font-semibold text-brown mb-2">{item.name}</h3>
                  </a>
                </Link>
                <div className="flex justify-between items-center">
                  <span className="text-brown font-medium">₹{item.price.toFixed(2)}</span>
                  <button className="px-3 py-1 bg-brown text-cream rounded-md hover:bg-opacity-90 transition-colors text-sm">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 bg-beige/50">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-brown text-cream flex items-center justify-center text-xl font-semibold">
                  {profile.displayName ? profile.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-semibold text-brown">{profile.displayName || 'User'}</h2>
                  <p className="text-sm text-brown/70">{profile.email}</p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <nav className="space-y-1">
                <Link href="/profile/info">
                  <a className={`block px-4 py-2 rounded-md ${
                    tab === 'info' ? 'bg-brown text-cream' : 'text-brown hover:bg-beige/50'
                  }`}>
                    Personal Information
                  </a>
                </Link>
                <Link href="/profile/orders">
                  <a className={`block px-4 py-2 rounded-md ${
                    tab === 'orders' ? 'bg-brown text-cream' : 'text-brown hover:bg-beige/50'
                  }`}>
                    My Orders
                  </a>
                </Link>
                <Link href="/profile/wishlist">
                  <a className={`block px-4 py-2 rounded-md ${
                    tab === 'wishlist' ? 'bg-brown text-cream' : 'text-brown hover:bg-beige/50'
                  }`}>
                    My Wishlist
                  </a>
                </Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          <div className="bg-white rounded-lg shadow-md p-6">
            {tab === 'info' && renderProfileInfo()}
            {tab === 'orders' && renderOrders()}
            {tab === 'wishlist' && renderWishlist()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
