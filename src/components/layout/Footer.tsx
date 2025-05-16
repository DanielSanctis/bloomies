import { Link } from 'wouter';

const Footer = () => {
  return (
    <footer className="bg-beige text-brown py-16 border-t border-beige-dark">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="col-span-1">
            <div className="mb-4">
              <span className="handwritten text-4xl text-primary-dark">Bloomies</span>
            </div>
            <p className="mt-4 text-brown-dark font-body text-sm leading-relaxed">
              Handcrafted pipe cleaner and satin ribbon floral arrangements for every occasion. Elegant, long-lasting, and uniquely designed.
            </p>
            <div className="mt-6 flex">
              <a href="https://www.instagram.com/bloomieess/" target="_blank" rel="noopener noreferrer" className="social-icon text-brown hover:text-brown-light transition-all duration-300 flex items-center" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span className="text-sm">@bloomieess</span>
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-heading font-semibold mb-5 text-brown">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/shop" className="footer-link text-brown-dark text-sm hover:text-brown-light">
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="footer-link text-brown-dark text-sm hover:text-brown-light"
                  onClick={() => window.localStorage.setItem('shopView', 'category')}
                >
                  Shop by Category
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="footer-link text-brown-dark text-sm hover:text-brown-light"
                  onClick={() => window.localStorage.setItem('shopView', 'product')}
                >
                  Shop by Product
                </Link>
              </li>
              <li>
                <Link href="/custom" className="footer-link text-brown-dark text-sm hover:text-brown-light">
                  Custom Creations
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-heading font-semibold mb-5 text-brown">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about-us" className="footer-link text-brown-dark text-sm hover:text-brown-light">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="footer-link text-brown-dark text-sm hover:text-brown-light">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="footer-link text-brown-dark text-sm hover:text-brown-light">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="footer-link text-brown-dark text-sm hover:text-brown-light">
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1">
            <h3 className="text-lg font-heading font-semibold mb-5 text-brown">Stay Connected</h3>
            <p className="mb-4 text-brown-dark text-sm">Subscribe for updates and special offers.</p>
            <form className="flex flex-col space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="input-elegant w-full px-4 py-3 bg-cream-light border border-beige focus:outline-none focus:ring-2 focus:ring-brown/30 transition-all duration-300"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-brown-light/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <button
                type="submit"
                className="btn px-4 py-3 bg-brown text-cream hover:bg-brown-dark transition-all duration-300 shadow-sm"
              >
                <span className="btn-content">Subscribe</span>
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-beige-dark text-center">
          <p className="text-sm text-brown-dark">&copy; {new Date().getFullYear()} Bloomies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
