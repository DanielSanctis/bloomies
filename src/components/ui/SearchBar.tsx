import React, { useRef, useEffect } from 'react';
import { useSearch } from '../../context/SearchContext';
import { Link } from 'wouter';

const SearchBar: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    isSearchOpen,
    toggleSearch,
    handleSearch,
    searchResults,
    isSearching
  } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input when the search bar opens
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close search on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        toggleSearch();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isSearchOpen, toggleSearch]);

  // Format price to currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price / 100);
  };

  return (
    <>
      {/* Search Icon Button */}
      <button
        onClick={toggleSearch}
        className="p-2 text-brown hover:text-brown-light transition-all duration-300 group"
        aria-label="Search"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-brown bg-opacity-20 z-50 flex items-start justify-center pt-20 px-4">
          <div className="bg-white shadow-lg w-full max-w-2xl p-4 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-brown">Search Products</h3>
              <button
                onClick={toggleSearch}
                className="text-brown hover:text-brown-light transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSearch} className="relative">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full p-3 border border-beige rounded-md focus:outline-none focus:ring-2 focus:ring-brown focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-3 top-3 text-brown hover:text-brown-light transition-colors"
                aria-label="Submit search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            {/* Real-time Search Results */}
            <div className="mt-4">
              {isSearching ? (
                <div className="text-center py-4">
                  <div className="spinner"></div>
                  <p className="text-brown mt-2">Searching...</p>
                </div>
              ) : searchQuery.trim().length > 0 ? (
                <>
                  {searchResults.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto">
                      <h4 className="text-sm font-medium text-brown-dark mb-2">
                        {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
                      </h4>
                      <ul className="divide-y divide-beige">
                        {searchResults.map(product => (
                          <li key={product.id} className="py-2">
                            <Link
                              href={`/product/${product.id}`}
                              onClick={toggleSearch}
                              className="flex items-center hover:bg-cream-light p-2 rounded transition-colors"
                            >
                              <div className="w-16 h-16 bg-beige rounded overflow-hidden flex-shrink-0">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                  loading="eager"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                                  }}
                                />
                              </div>
                              <div className="ml-4 flex-grow">
                                <h5 className="font-medium text-brown">{product.name}</h5>
                                <div className="flex justify-between items-center mt-1">
                                  <span className="text-sm text-brown-light">{product.type}</span>
                                  <span className="font-medium text-brown">{formatPrice(product.price)}</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 text-center">
                        <button
                          onClick={handleSearch}
                          className="text-sm text-brown-dark hover:text-brown transition-colors underline"
                        >
                          View all results
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-brown">No products found matching "{searchQuery}"</p>
                      <p className="text-sm text-brown-light mt-2">Try a different search term</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-sm text-brown-light">
                  <p>Try searching for: "bouquet", "rose", "fantasy", etc.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchBar;
