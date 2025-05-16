import { Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { SearchProvider } from './context/SearchContext';
import Layout from './components/layout/Layout';
import SplashScreen from './components/ui/SplashScreen';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Auth from './pages/Auth';
import CustomSimple from './pages/CustomSimple';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import UserProfile from './pages/UserProfile';
import OrderHistory from './pages/OrderHistory';
import OrderDetail from './pages/OrderDetail';
import OrderConfirmation from './pages/OrderConfirmation';
import Profile from './pages/Profile';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Wishlist from './pages/Wishlist';
import Compare from './pages/Compare';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <SearchProvider>
              <>
                <SplashScreen duration={2500} />
                <Layout>
                  <Switch>
                    <Route path="/" component={Home} />
                    <Route path="/shop" component={Shop} />
                    <Route path="/product/:id" component={ProductDetail} />
                    <Route path="/auth" component={Auth} />
                    <Route path="/custom" component={CustomSimple} />
                    <Route path="/checkout" component={Checkout} />
                    <Route path="/profile/:tab?" component={Profile} />
                    <Route path="/user-profile" component={UserProfile} />
                    <Route path="/orders" component={OrderHistory} />
                    <Route path="/order/:id" component={OrderDetail} />
                    <Route path="/order-confirmation/:id" component={OrderConfirmation} />
                    <Route path="/wishlist" component={Wishlist} />
                    <Route path="/compare" component={Compare} />
                    <Route path="/about-us" component={AboutUs} />
                    <Route path="/contact" component={Contact} />
                    <Route>
                      <div className="container mx-auto px-4 py-20 text-center">
                        <h1 className="text-4xl font-bold text-brown mb-4">404 - Page Not Found</h1>
                        <p className="text-brown/70 mb-8">The page you are looking for doesn't exist or has been moved.</p>
                        <a href="/" className="px-6 py-3 bg-brown text-cream rounded-md hover:bg-opacity-90 transition-colors">
                          Go Home
                        </a>
                      </div>
                    </Route>
                  </Switch>
                </Layout>
              </>
            </SearchProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
