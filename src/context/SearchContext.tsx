import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { products } from '../data/products';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  toggleSearch: () => void;
  handleSearch: (e: React.FormEvent) => void;
  searchResults: any[];
  isSearching: boolean;
}

const SearchContext = createContext<SearchContextType | null>(null);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider = ({ children }: SearchProviderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [, navigate] = useLocation();
  const [isShopPage] = useRoute('/shop');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Real-time search as user types
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setIsSearching(true);

      // Filter products based on search query
      const filtered = products.filter(product => {
        const searchLower = searchQuery.toLowerCase();
        const nameMatch = product.name.toLowerCase().includes(searchLower);
        const typeMatch = product.type.toLowerCase().includes(searchLower);
        const flowerTypeMatch = product.flowerType ? product.flowerType.toLowerCase().includes(searchLower) : false;
        const occasionMatch = product.categories.occasion ? product.categories.occasion.toLowerCase().includes(searchLower) : false;
        const fandomMatch = product.categories.fandom ? product.categories.fandom.toLowerCase().includes(searchLower) : false;

        return nameMatch || typeMatch || flowerTypeMatch || occasionMatch || fandomMatch;
      });

      setSearchResults(filtered);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchQuery('');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // If already on shop page, just update the URL with the search query
      if (isShopPage) {
        navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      }
      setIsSearchOpen(false);
    }
  };

  const value = {
    searchQuery,
    setSearchQuery,
    isSearchOpen,
    toggleSearch,
    handleSearch,
    searchResults,
    isSearching
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};
