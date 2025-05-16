import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CartSidebar from '../cart/CartSidebar';
import WishlistSidebar from '../wishlist/WishlistSidebar';
import PromotionalBanner from '../ui/PromotionalBanner';
import RecentPurchasePopup from '../ui/RecentPurchasePopup';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <PromotionalBanner
        messages={[
          "GET 10% off on PREPAID Orders!",
          "Free shipping on orders over ₹2000!"
        ]}
        codes={["CodeFloral10", "FREESHIP"]}
        transitionDuration={8}
      />
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <CartSidebar />
      <WishlistSidebar />
      <RecentPurchasePopup />
      <Footer />
    </div>
  );
};

export default Layout;
