import React from 'react';
import { useLocation, useRoute } from 'wouter';

// View types
export type ViewType = 'list' | 'grid' | 'dense-grid';
export type SortOption = 'featured' | 'best-selling' | 'a-z' | 'z-a' | 'price-low-high' | 'price-high-low' | 'date-old-new' | 'date-new-old';

interface ShopControlBarProps {
  viewType: ViewType;
  setViewType: (type: ViewType) => void;
  itemsPerPage: number;
  setItemsPerPage: (count: number) => void;
  sortBy: SortOption;
  setSortBy: (option: SortOption) => void;
}

const ShopControlBar: React.FC<ShopControlBarProps> = ({
  viewType,
  setViewType,
  itemsPerPage,
  setItemsPerPage,
  sortBy,
  setSortBy
}) => {
  const [location, setLocation] = useLocation();

  // Update URL with current settings
  const updateUrlParams = (params: Record<string, string>) => {
    const url = new URL(window.location.href);

    // Update or add new parameters
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    // Update the URL without refreshing the page
    window.history.pushState({}, '', url.toString());
  };

  // Handle view type change
  const handleViewChange = (type: ViewType) => {
    setViewType(type);
    updateUrlParams({ view: type });
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const count = parseInt(e.target.value);
    setItemsPerPage(count);

    // Reset to page 1 when items per page changes
    const url = new URL(window.location.href);
    url.searchParams.set('perPage', count.toString());
    url.searchParams.set('page', '1');
    window.history.pushState({}, '', url.toString());
  };

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const option = e.target.value as SortOption;
    setSortBy(option);

    // Reset to page 1 when sorting changes
    const url = new URL(window.location.href);
    url.searchParams.set('sort', option);
    url.searchParams.set('page', '1');
    window.history.pushState({}, '', url.toString());
  };

  return (
    <div className="w-full bg-white shadow-sm rounded-lg mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-3">
        {/* View Toggle */}
        <div className="flex items-center">
          <span className="text-xs font-medium text-brown-dark uppercase mr-3">View as</span>
          <div className="flex space-x-1">
            {/* List View */}
            <button
              className={`p-2 rounded-md transition-all ${viewType === 'list' ? 'bg-beige/30 border border-brown/20' : 'hover:bg-beige/10'}`}
              onClick={() => handleViewChange('list')}
              aria-label="Switch to List View"
              title="List View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>



            {/* Grid View */}
            <button
              className={`p-2 rounded-md transition-all ${viewType === 'grid' ? 'bg-beige/30 border border-brown/20' : 'hover:bg-beige/10'}`}
              onClick={() => handleViewChange('grid')}
              aria-label="Switch to Grid View"
              title="Grid View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
            </button>

            {/* Dense Grid */}
            <button
              className={`p-2 rounded-md transition-all ${viewType === 'dense-grid' ? 'bg-beige/30 border border-brown/20' : 'hover:bg-beige/10'}`}
              onClick={() => handleViewChange('dense-grid')}
              aria-label="Switch to Dense Grid View"
              title="Dense Grid View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM10 5a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V5zM16 5a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V5zM4 11a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zM10 11a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2zM16 11a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2zM4 17a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zM10 17a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2zM16 17a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Items Per Page */}
        <div className="flex items-center">
          <label htmlFor="itemsPerPage" className="text-xs font-medium text-brown-dark uppercase mr-3">
            Items per page
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="bg-cream border border-beige rounded-md px-3 py-1.5 text-sm text-brown focus:outline-none focus:ring-1 focus:ring-brown"
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={25}>25</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="flex items-center">
          <label htmlFor="sortBy" className="text-xs font-medium text-brown-dark uppercase mr-3">
            Sort by
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={handleSortChange}
            className="bg-cream border border-beige rounded-md px-3 py-1.5 text-sm text-brown focus:outline-none focus:ring-1 focus:ring-brown"
          >
            <optgroup label="Popularity">
              <option value="featured">Featured</option>
              <option value="best-selling">Best selling</option>
            </optgroup>
            <optgroup label="Alphabetical">
              <option value="a-z">Alphabetically, A-Z</option>
              <option value="z-a">Alphabetically, Z-A</option>
            </optgroup>
            <optgroup label="Price">
              <option value="price-low-high">Price, low to high</option>
              <option value="price-high-low">Price, high to low</option>
            </optgroup>
            <optgroup label="Date">
              <option value="date-old-new">Date, old to new</option>
              <option value="date-new-old">Date, new to old</option>
            </optgroup>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ShopControlBar;
