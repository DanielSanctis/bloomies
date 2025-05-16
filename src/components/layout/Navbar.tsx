import { Link, useLocation } from 'wouter';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useSearch } from '../../context/SearchContext';
import SearchBar from '../ui/SearchBar';
import { useState, useEffect } from 'react';
import { createCustomEvent, SHOP_VIEW_CHANGED } from '../../utils/events';

const Navbar = () => {
  const { currentUser, signOut } = useAuth();
  const { toggleCart, totalItems } = useCart();
  const { toggleWishlist, totalItems: wishlistItems } = useWishlist();
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [location] = useLocation();

  return (
    <nav className="navbar-elegant sticky top-0 z-40 bg-cream border-b border-beige py-4 transition-all duration-300">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="handwritten text-4xl text-primary-dark">Bloomies</span>
          <i className="fas fa-seedling ml-2 text-xl text-accent-dark"></i>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8">
          {/* Shop Dropdown */}
          <div className="relative">
            <Link
              href="/shop"
              className="nav-link text-brown hover:text-brown-light transition-colors font-body text-sm uppercase tracking-wider flex items-center"
              onClick={() => {
                window.localStorage.setItem('shopView', 'product');
                // Dispatch event to update Shop component if we're already on the shop page
                if (location === '/shop') {
                  createCustomEvent(SHOP_VIEW_CHANGED, { viewMode: 'product' });
                }
              }}
              onMouseEnter={() => setShopDropdownOpen(true)}
            >
              Shop
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>

            {/* Dropdown Menu */}
            {shopDropdownOpen && (
              <div
                className="absolute left-0 mt-2 w-56 bg-white shadow-card rounded-md py-1 z-10"
                onMouseLeave={() => setShopDropdownOpen(false)}
              >
                <Link
                  href="/shop"
                  className="block px-4 py-2 text-sm text-brown hover:bg-cream-light transition-colors"
                  onClick={() => {
                    window.localStorage.setItem('shopView', 'product');
                    // Dispatch event to update Shop component if we're already on the shop page
                    if (location === '/shop') {
                      createCustomEvent(SHOP_VIEW_CHANGED, { viewMode: 'product' });
                    }
                    setShopDropdownOpen(false);
                  }}
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    Shop by Product
                  </span>
                </Link>
                <Link
                  href="/shop"
                  className="block px-4 py-2 text-sm text-brown hover:bg-cream-light transition-colors"
                  onClick={() => {
                    window.localStorage.setItem('shopView', 'category');
                    // Dispatch event to update Shop component if we're already on the shop page
                    if (location === '/shop') {
                      createCustomEvent(SHOP_VIEW_CHANGED, { viewMode: 'category' });
                    }
                    setShopDropdownOpen(false);
                  }}
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Shop by Category
                  </span>
                </Link>
              </div>
            )}
          </div>

          <Link href="/custom" className="nav-link text-brown hover:text-brown-light transition-colors font-body text-sm uppercase tracking-wider">
            Custom Bouquets
          </Link>
          <Link href="/about-us" className="nav-link text-brown hover:text-brown-light transition-colors font-body text-sm uppercase tracking-wider">
            About Us
          </Link>
          <Link href="/contact" className="nav-link text-brown hover:text-brown-light transition-colors font-body text-sm uppercase tracking-wider">
            Contact
          </Link>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <SearchBar />

          {/* Wishlist Icon */}
          <button
            onClick={toggleWishlist}
            className="relative p-2 text-brown hover:text-brown-light transition-all duration-300 group"
            aria-label="Open wishlist"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 heart-icon transform transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {wishlistItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-brown text-cream rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium shadow-md transform transition-transform group-hover:scale-110">
                {wishlistItems}
              </span>
            )}
          </button>

          {/* Cart Icon */}
          <button
            onClick={toggleCart}
            className="relative p-2 text-brown hover:text-brown-light transition-all duration-300 group"
            aria-label="Open cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-brown text-cream rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium shadow-md transform transition-transform group-hover:scale-110">
                {totalItems}
              </span>
            )}
          </button>

          {/* User Profile / Auth */}
          {currentUser ? (
            <div className="relative group">
              <button className="p-2 text-brown hover:text-brown-light transition-all duration-300 group" aria-label="User profile">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              <div className="absolute right-0 mt-2 w-56 bg-white shadow-card rounded-md py-1 z-10 hidden group-hover:block transform origin-top-right transition-all duration-200 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100">
                <div className="px-4 py-3 border-b border-beige">
                  <p className="text-sm font-medium text-brown">Signed in as</p>
                  <p className="text-xs text-brown-light truncate">{currentUser.email}</p>
                </div>
                <Link href="/user-profile" className="block px-4 py-2 text-sm text-brown hover:bg-cream-light transition-colors">
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </span>
                </Link>
                <Link href="/orders" className="block px-4 py-2 text-sm text-brown hover:bg-cream-light transition-colors">
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    My Orders
                  </span>
                </Link>
                <Link href="/wishlist" className="block px-4 py-2 text-sm text-brown hover:bg-cream-light transition-colors">
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    My Wishlist
                  </span>
                </Link>
                <div className="border-t border-beige mt-1 pt-1">
                  <button
                    onClick={signOut}
                    className="block w-full text-left px-4 py-2 text-sm text-brown hover:bg-cream-light transition-colors"
                  >
                    <span className="flex items-center text-brown-dark">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link href="/auth" className="p-2 text-brown hover:text-brown-light transition-all duration-300 group" aria-label="Sign in">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden relative">
            <button
              className="p-2 text-brown hover:text-brown-light transition-all duration-300 group"
              aria-label="Menu"
              onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Mobile Menu Dropdown */}
            {shopDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white shadow-card rounded-md py-1 z-10">
                <Link
                  href="/shop"
                  className="block px-4 py-2 text-sm text-brown hover:bg-cream-light transition-colors font-semibold"
                  onClick={() => {
                    window.localStorage.setItem('shopView', 'product');
                    // Dispatch event to update Shop component if we're already on the shop page
                    if (location === '/shop') {
                      createCustomEvent(SHOP_VIEW_CHANGED, { viewMode: 'product' });
                    }
                    setShopDropdownOpen(false);
                  }}
                >
                  <span className="flex items-center">
                    Shop by Product
                  </span>
                </Link>
                <Link
                  href="/shop"
                  className="block px-4 py-2 text-sm text-brown hover:bg-cream-light transition-colors"
                  onClick={() => {
                    window.localStorage.setItem('shopView', 'category');
                    // Dispatch event to update Shop component if we're already on the shop page
                    if (location === '/shop') {
                      createCustomEvent(SHOP_VIEW_CHANGED, { viewMode: 'category' });
                    }
                    setShopDropdownOpen(false);
                  }}
                >
                  <span className="flex items-center">
                    Shop by Category
                  </span>
                </Link>
                <Link
                  href="/custom"
                  className="block px-4 py-2 text-sm text-brown hover:bg-cream-light transition-colors"
                  onClick={() => setShopDropdownOpen(false)}
                >
                  <span className="flex items-center">
                    Custom Bouquets
                  </span>
                </Link>
                <Link
                  href="/about-us"
                  className="block px-4 py-2 text-sm text-brown hover:bg-cream-light transition-colors"
                  onClick={() => setShopDropdownOpen(false)}
                >
                  <span className="flex items-center">
                    About Us
                  </span>
                </Link>
                <Link
                  href="/contact"
                  className="block px-4 py-2 text-sm text-brown hover:bg-cream-light transition-colors"
                  onClick={() => setShopDropdownOpen(false)}
                >
                  <span className="flex items-center">
                    Contact
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
