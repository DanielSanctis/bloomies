import { useState, useEffect, useCallback } from 'react';
import { useLocation, Link } from 'wouter';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useSearch } from '../context/SearchContext';
import { SHOP_VIEW_CHANGED } from '../utils/events';
import QuickView from '../components/ui/QuickView';
import ShopControlBar, { ViewType, SortOption } from '../components/shop/ShopControlBar';
import ProductListView from '../components/shop/ProductListView';
import ProductGridView from '../components/shop/ProductGridView';
import CompareTray from '../components/shop/CompareTray';
import Pagination from '../components/shop/Pagination';
import { products } from '../data/products';

// Product types
const productTypes = ['bouquet', 'single flower'];

// Flower types
const flowerTypes = ['pipe cleaner', 'satin ribbon'];

// Bouquet sizes
const bouquetSizes = ['small', 'large'];

// Filter options
const filterOptions = {
  occasion: ['romance', 'celebrations', 'sympathy', 'thanks', 'wedding', 'birthday'],
  fandom: ['fantasy', 'superheroes', 'anime', 'gaming'],
};

const Shop = () => {
  const [location] = useLocation();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Parse URL query parameters
  const params = new URLSearchParams(location.split('?')[1] || '');

  // State for view mode - get initial value from localStorage
  const initialViewMode = window.localStorage.getItem('shopView') as 'product' | 'category' || 'product';
  const [viewMode, setViewMode] = useState<'product' | 'category'>(initialViewMode);
  const [selectedCategory, setSelectedCategory] = useState<'occasion' | 'fandom' | null>(null);

  // Get search query from URL
  const searchQuery = params.get('search') || '';
  const { setSearchQuery } = useSearch();

  // Update search context with URL search query
  useEffect(() => {
    if (searchQuery) {
      setSearchQuery(searchQuery);
    }
  }, [searchQuery, setSearchQuery]);

  // Listen for shop view change events from the navbar
  useEffect(() => {
    const handleViewModeEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.viewMode) {
        setViewMode(customEvent.detail.viewMode);
      }
    };

    window.addEventListener(SHOP_VIEW_CHANGED, handleViewModeEvent);

    return () => {
      window.removeEventListener(SHOP_VIEW_CHANGED, handleViewModeEvent);
    };
  }, []);

  // Initialize state from URL parameters
  useEffect(() => {
    const url = new URL(window.location.href);

    // Get view type from URL
    const viewParam = url.searchParams.get('view') as ViewType | null;
    if (viewParam) {
      // If compact-list is selected, default to grid view since we removed compact-list
      if (viewParam === 'compact-list') {
        setViewType('grid');
      } else if (['list', 'grid', 'dense-grid'].includes(viewParam)) {
        setViewType(viewParam);
      }
    }

    // Get items per page from URL
    const perPageParam = url.searchParams.get('perPage');
    if (perPageParam) {
      const perPage = parseInt(perPageParam);
      if ([10, 15, 20, 25, 30, 50].includes(perPage)) {
        setItemsPerPage(perPage);
      }
    }

    // Get sort option from URL
    const sortParam = url.searchParams.get('sort') as SortOption | null;
    if (sortParam) {
      setSortBy(sortParam);
    }

    // Get comparing products from URL
    const compareParam = url.searchParams.get('compare');
    if (compareParam) {
      const productIds = compareParam.split(',');
      const productsToCompare = mockProducts.filter(p => productIds.includes(p.id));
      setComparingProducts(productsToCompare);
    }

    // Get current page from URL
    const pageParam = url.searchParams.get('page');
    if (pageParam) {
      const page = parseInt(pageParam);
      if (!isNaN(page) && page > 0) {
        setCurrentPage(page);
      }
    }
  }, []);

  // State for filters
  const [filters, setFilters] = useState({
    occasion: params.get('occasion') || '',
    fandom: params.get('fandom') || '',
    productType: '',
    flowerType: '',
    bouquetSize: '',
    priceRange: [0, 5000],
    search: searchQuery,
  });

  // State for products
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [currentPage, setCurrentPage] = useState(1);

  // State for Quick View
  const [quickViewProduct, setQuickViewProduct] = useState<typeof products[0] | null>(null);

  // State for shop control bar
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  // State for compare functionality
  const [comparingProducts, setComparingProducts] = useState<typeof products[0][]>([]);

  // Apply filters and sorting when they change
  useEffect(() => {
    // First, filter the products
    let filtered = products.filter(product => {
      // Check if product matches all active filters
      if (filters.occasion && product.categories.occasion !== filters.occasion) return false;
      if (filters.fandom && product.categories.fandom !== filters.fandom) return false;
      if (filters.productType && product.type !== filters.productType) return false;
      if (filters.flowerType && (!product.flowerType || product.flowerType !== filters.flowerType)) return false;
      if (filters.bouquetSize && (!product.size || product.size !== filters.bouquetSize)) return false;
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) return false;

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const nameMatch = product.name.toLowerCase().includes(searchLower);
        const typeMatch = product.type.toLowerCase().includes(searchLower);
        const flowerTypeMatch = product.flowerType ? product.flowerType.toLowerCase().includes(searchLower) : false;
        const occasionMatch = product.categories.occasion ? product.categories.occasion.toLowerCase().includes(searchLower) : false;
        const fandomMatch = product.categories.fandom ? product.categories.fandom.toLowerCase().includes(searchLower) : false;

        if (!(nameMatch || typeMatch || flowerTypeMatch || occasionMatch || fandomMatch)) {
          return false;
        }
      }

      return true;
    });

    // Then, sort the filtered products
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          // Featured products are sorted by ID for this demo
          return parseInt(a.id) - parseInt(b.id);

        case 'best-selling':
          // For demo purposes, let's assume higher-priced items are best sellers
          return b.price - a.price;

        case 'a-z':
          return a.name.localeCompare(b.name);

        case 'z-a':
          return b.name.localeCompare(a.name);

        case 'price-low-high':
          return a.price - b.price;

        case 'price-high-low':
          return b.price - a.price;

        case 'date-old-new':
          // For demo purposes, let's use ID as a proxy for date
          return parseInt(a.id) - parseInt(b.id);

        case 'date-new-old':
          // For demo purposes, let's use ID as a proxy for date
          return parseInt(b.id) - parseInt(a.id);

        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [filters, sortBy]);

  // Handle filter changes
  const handleFilterChange = (category: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category as keyof typeof prev] === value ? '' : value,
    }));

    // Reset to page 1 when filters change
    setCurrentPage(1);

    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('page', '1');
    window.history.pushState({}, '', url.toString());
  };

  // Handle price range change
  const handlePriceChange = (value: [number, number]) => {
    setFilters(prev => ({
      ...prev,
      priceRange: value,
    }));
  };

  // Handle add to cart
  const handleAddToCart = (product: typeof products[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
  };

  // Handle opening quick view
  const handleQuickView = (product: typeof products[0]) => {
    setQuickViewProduct(product);
  };

  // Handle compare toggle
  const handleCompareToggle = useCallback((product: typeof products[0], isComparing: boolean) => {
    setComparingProducts(prev => {
      if (isComparing) {
        // Add to compare (max 4 products)
        if (prev.length >= 4) {
          alert('You can compare up to 4 products at a time.');
          return prev;
        }
        return [...prev, product];
      } else {
        // Remove from compare
        return prev.filter(p => p.id !== product.id);
      }
    });

    // Update URL
    const url = new URL(window.location.href);
    const updatedProducts = isComparing
      ? [...comparingProducts, product]
      : comparingProducts.filter(p => p.id !== product.id);

    if (updatedProducts.length > 0) {
      url.searchParams.set('compare', updatedProducts.map(p => p.id).join(','));
    } else {
      url.searchParams.delete('compare');
    }

    window.history.pushState({}, '', url.toString());
  }, [comparingProducts]);

  // Handle view mode change
  const handleViewModeChange = (mode: 'product' | 'category') => {
    setViewMode(mode);
    // Save view mode to localStorage
    window.localStorage.setItem('shopView', mode);
    // Reset filters when changing view mode
    setFilters({
      occasion: '',
      fandom: '',
      productType: '',
      flowerType: '',
      bouquetSize: '',
      priceRange: [0, 5000],
      search: searchQuery,
    });
    setSelectedCategory(null);
  };

  // Handle category selection
  const handleCategorySelect = (category: 'occasion' | 'fandom') => {
    setSelectedCategory(category);
  };

  // Get paginated products
  const getPaginatedProducts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('page', page.toString());
    window.history.pushState({}, '', url.toString());
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickView
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      {/* Compare Tray */}
      {comparingProducts.length > 0 && (
        <CompareTray
          products={comparingProducts}
          removeProduct={(id) => handleCompareToggle(
            comparingProducts.find(p => p.id === id) as typeof products[0],
            false
          )}
        />
      )}

      {searchQuery ? (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brown">Search Results</h1>
          <p className="text-brown-dark mt-2">Showing results for: "{searchQuery}"</p>
        </div>
      ) : (
        <h1 className="text-3xl font-bold text-brown mb-8">Shop Our Collection</h1>
      )}

      {/* View Mode Tabs - Enhanced for better visibility */}
      <div className="mb-8">
        <div className="flex justify-center bg-cream rounded-lg p-2 shadow-sm">
          <button
            className={`px-8 py-3 font-medium rounded-md transition-all duration-300 ${
              viewMode === 'product'
                ? 'bg-white text-brown shadow-md'
                : 'text-brown-light hover:bg-cream-dark hover:text-brown'
            }`}
            onClick={() => handleViewModeChange('product')}
          >
            <span className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Shop by Product
            </span>
          </button>
          <button
            className={`px-8 py-3 font-medium rounded-md transition-all duration-300 ${
              viewMode === 'category'
                ? 'bg-white text-brown shadow-md'
                : 'text-brown-light hover:bg-cream-dark hover:text-brown'
            }`}
            onClick={() => handleViewModeChange('category')}
          >
            <span className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Shop by Category
            </span>
          </button>
        </div>
      </div>

      {/* Shop Control Bar */}
      {viewMode === 'product' && (
        <ShopControlBar
          viewType={viewType}
          setViewType={setViewType}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      )}

      {viewMode === 'product' ? (
        // Product View
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-brown mb-4">Filters</h2>

              {/* Product Type Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-brown mb-2">Product Type</h3>
                <div className="space-y-2">
                  {productTypes.map(option => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.productType === option}
                        onChange={() => handleFilterChange('productType', option)}
                        className="mr-2"
                      />
                      <span className="capitalize">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Flower Type Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-brown mb-2">Flower Type</h3>
                <div className="space-y-2">
                  {flowerTypes.map(option => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.flowerType === option}
                        onChange={() => handleFilterChange('flowerType', option)}
                        className="mr-2"
                      />
                      <span className="capitalize">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Bouquet Size Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-brown mb-2">Bouquet Size</h3>
                <div className="space-y-2">
                  {bouquetSizes.map(option => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.bouquetSize === option}
                        onChange={() => handleFilterChange('bouquetSize', option)}
                        className="mr-2"
                      />
                      <span className="capitalize">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h3 className="font-medium text-brown mb-2">Price Range</h3>
                <div className="flex items-center justify-between mb-2">
                  <span>₹{filters.priceRange[0]}</span>
                  <span>₹{filters.priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange([filters.priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Products Display */}
          <div className="w-full md:w-3/4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-brown/70">No products match your filters. Try adjusting your criteria.</p>
              </div>
            ) : (
              <>
                {/* Product Views */}
                <div>
                  {viewType === 'list' && (
                    <ProductListView
                      products={getPaginatedProducts()}
                      onQuickView={handleQuickView}
                      onCompareToggle={handleCompareToggle}
                      comparingProducts={comparingProducts.map(p => p.id)}
                    />
                  )}

                  {viewType === 'grid' && (
                    <ProductGridView
                      products={getPaginatedProducts()}
                      onQuickView={handleQuickView}
                      onCompareToggle={handleCompareToggle}
                      comparingProducts={comparingProducts.map(p => p.id)}
                      isDense={false}
                    />
                  )}

                  {viewType === 'dense-grid' && (
                    <ProductGridView
                      products={getPaginatedProducts()}
                      onQuickView={handleQuickView}
                      onCompareToggle={handleCompareToggle}
                      comparingProducts={comparingProducts.map(p => p.id)}
                      isDense={true}
                    />
                  )}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredProducts.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      ) : (
        // Category View
        <div>
          {!selectedCategory ? (
            // Category Selection
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* By Occasion */}
              <div
                className="bg-white rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleCategorySelect('occasion')}
              >
                <div className="h-64 bg-beige/30 flex items-center justify-center">
                  <h2 className="text-2xl font-semibold text-brown">By Occasion</h2>
                </div>
                <div className="p-6">
                  <p className="text-brown/70">Find the perfect flowers for any special moment</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {filterOptions.occasion.slice(0, 4).map(option => (
                      <span key={option} className="px-3 py-1 bg-beige/50 rounded-full text-sm text-brown capitalize">
                        {option}
                      </span>
                    ))}
                    <span className="px-3 py-1 bg-beige/50 rounded-full text-sm text-brown">
                      +{filterOptions.occasion.length - 4} more
                    </span>
                  </div>
                </div>
              </div>

              {/* By Fandom */}
              <div
                className="bg-white rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleCategorySelect('fandom')}
              >
                <div className="h-64 bg-beige/30 flex items-center justify-center">
                  <h2 className="text-2xl font-semibold text-brown">By Fandom</h2>
                </div>
                <div className="p-6">
                  <p className="text-brown/70">Themed arrangements inspired by your favorite fandoms</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {filterOptions.fandom.map(option => (
                      <span key={option} className="px-3 py-1 bg-beige/50 rounded-full text-sm text-brown capitalize">
                        {option}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Category Products
            <div>
              <button
                onClick={() => setSelectedCategory(null)}
                className="flex items-center text-brown mb-6 hover:text-opacity-70"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Categories
              </button>

              <h2 className="text-2xl font-semibold text-brown mb-6">
                {selectedCategory === 'occasion' ? 'Shop by Occasion' : 'Shop by Fandom'}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {selectedCategory === 'occasion' ? (
                  filterOptions.occasion.map(option => (
                    <button
                      key={option}
                      className={`px-4 py-2 rounded-md capitalize ${
                        filters[selectedCategory] === option
                          ? 'bg-brown text-cream'
                          : 'bg-beige/30 text-brown hover:bg-beige/50'
                      }`}
                      onClick={() => handleFilterChange(selectedCategory, option)}
                    >
                      {option}
                    </button>
                  ))
                ) : (
                  filterOptions.fandom.map(option => (
                    <button
                      key={option}
                      className={`px-4 py-2 rounded-md capitalize ${
                        filters[selectedCategory] === option
                          ? 'bg-brown text-cream'
                          : 'bg-beige/30 text-brown hover:bg-beige/50'
                      }`}
                      onClick={() => handleFilterChange(selectedCategory, option)}
                    >
                      {option}
                    </button>
                  ))
                )}
              </div>

              {/* Product Grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-brown/70">No products found in this category. Try selecting a different option.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="group">
                      {/* Product Card */}
                      <div className={`relative bg-white overflow-hidden shadow-md ${
                        comparingProducts.some(p => p.id === product.id) ? 'ring-2 ring-brown/30' : ''
                      }`}>
                        {/* Product Image with hover effect */}
                        <Link href={`/product/${product.id}`}>
                          <div className="relative w-full overflow-hidden aspect-portrait">
                            {/* Primary Image */}
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover cursor-pointer absolute top-0 left-0 transition-opacity duration-300 group-hover:opacity-0"
                              loading="eager"
                            />
                            {/* Secondary Image (shown on hover) */}
                            <img
                              src={product.image2 || product.image}
                              alt={`${product.name} - alternate view`}
                              className="w-full h-full object-cover cursor-pointer absolute top-0 left-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                              loading="eager"
                            />
                          </div>
                        </Link>

                        {/* Sale Badge */}
                        {product.salePercentage && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1">
                            Sale {product.salePercentage}%
                          </div>
                        )}

                        {/* Product Name Overlay - Only visible on hover */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <h3 className="text-white text-sm font-medium">{product.name}</h3>
                        </div>

                        {/* Action Buttons - Only visible on hover */}
                        <div className="absolute top-2 right-2 action-buttons-container opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {/* Wishlist Button */}
                          {isInWishlist(product.id) ? (
                            <button
                              className="action-button bg-white shadow-sm text-red-500 hover:text-red-600"
                              onClick={() => removeFromWishlist(product.id)}
                              aria-label="Remove from wishlist"
                            >
                              <span className="label text-xs font-medium">Wishlist</span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                              </svg>
                            </button>
                          ) : (
                            <button
                              className="action-button bg-white shadow-sm text-brown hover:text-opacity-70"
                              onClick={() => addToWishlist({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                image: product.image
                              })}
                              aria-label="Add to wishlist"
                            >
                              <span className="label text-xs font-medium">Wishlist</span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </button>
                          )}

                          {/* Quick View Button */}
                          <button
                            className="action-button bg-white shadow-sm text-brown hover:text-brown-dark"
                            onClick={() => handleQuickView(product)}
                            aria-label="Quick view"
                          >
                            <span className="label text-xs font-medium">Quick View</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          {/* Compare Button */}
                          <button
                            className={`action-button bg-white shadow-sm ${
                              comparingProducts.some(p => p.id === product.id)
                                ? 'text-brown'
                                : 'text-brown-light hover:text-brown'
                            }`}
                            onClick={() => handleCompareToggle(product, !comparingProducts.some(p => p.id === product.id))}
                            aria-label={`${comparingProducts.some(p => p.id === product.id) ? 'Remove from' : 'Add to'} comparison`}
                          >
                            <span className="label text-xs font-medium">Compare</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </button>
                        </div>

                        {/* Add to Cart Button - Only visible on hover */}
                        <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="w-full py-3 bg-white text-brown font-medium hover:bg-brown hover:text-white transition-colors border-t border-gray-200"
                          >
                            ADD TO CART
                          </button>
                        </div>
                      </div>

                      {/* Product Details Outside Card */}
                      <div className="mt-3 text-center">
                        <Link href={`/product/${product.id}`}>
                          <h3 className="text-base font-medium text-brown cursor-pointer hover:text-opacity-80">{product.name}</h3>
                        </Link>

                        {/* Price */}
                        <div className="mt-1">
                          {product.oldPrice ? (
                            <>
                              <span className="text-gray-400 line-through mr-2">₹{product.oldPrice}</span>
                              <span className="text-brown font-semibold">₹{product.price}</span>
                            </>
                          ) : (
                            <span className="text-brown font-semibold">₹{product.price}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Shop;
