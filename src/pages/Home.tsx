import { Link } from 'wouter';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import InfiniteCarousel from '../components/ui/InfiniteCarousel';
import QuickView from '../components/ui/QuickView';
import { useState } from 'react';
import { products } from '../data/products';

const Home = () => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  // State for Quick View
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);

  // Handle opening quick view
  const handleQuickView = (product: any) => {
    setQuickViewProduct(product);
  };

  // Testimonial data
  const testimonials = [
    {
      id: 1,
      text: "The Fantasy-themed bouquet I ordered for my sister's birthday was absolutely stunning! The attention to detail was incredible, and it's been months and it still looks fresh.",
      author: "Priya S.",
      role: "Loyal Customer",
      initial: "P"
    },
    {
      id: 2,
      text: "I used the custom bouquet builder to create an arrangement for my wedding. The team at Bloomies was so helpful, and the final product exceeded my expectations!",
      author: "Rahul M.",
      role: "Wedding Customer",
      initial: "R"
    },
    {
      id: 3,
      text: "I've ordered from Bloomies multiple times, and they never disappoint. The quality is outstanding, and their customer service is top-notch. Highly recommend!",
      author: "Ananya K.",
      role: "Repeat Customer",
      initial: "A"
    },
    {
      id: 4,
      text: "The Sci-Fi themed bouquet was perfect for my husband's birthday. He's a huge fan and was thrilled with the unique design. Will definitely order again!",
      author: "Meera J.",
      role: "First-time Customer",
      initial: "M"
    },
    {
      id: 5,
      text: "I was skeptical about synthetic flowers at first, but these are absolutely gorgeous! They look so realistic and I love that they'll last forever.",
      author: "Vikram P.",
      role: "New Customer",
      initial: "V"
    }
  ];

  return (
    <div>
      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickView
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
      {/* Hero Section */}
      <section className="hero-section relative bg-beige py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596438459194-f275f413d6ff?w=1200&auto=format')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl hero-content animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-heading font-semibold text-brown mb-6 leading-tight">
              Handcrafted <span className="text-accent-dark">Forever</span> <br />
              <span className="text-brown-dark">Bouquets</span>
            </h1>
            <p className="text-lg font-body text-brown-dark mb-10 max-w-2xl leading-relaxed">
              Bloomies creates beautiful, long-lasting synthetic floral arrangements for every occasion,
              from romantic gestures to fandom-inspired designs that will never wilt or fade.
            </p>
            <div className="flex flex-wrap gap-5">
              <Link
                href="/shop"
                className="btn group px-8 py-4 bg-brown text-cream hover:bg-brown-dark transition-all duration-300 shadow-elegant"
                onClick={() => {
                  window.localStorage.setItem('shopView', 'product');
                }}
              >
                <span className="btn-content flex items-center">
                  Shop Collection
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Link>
              <Link href="/custom" className="btn group px-8 py-4 border-2 border-brown text-brown rounded-md hover:bg-cream-light transition-all duration-300">
                <span className="btn-content">
                  Create Custom Bouquet
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-brown text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category 1 */}
            <Link href="/shop?occasion=romance" className="block group relative overflow-hidden cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1561181286-d5c73431a97f"
                alt="Romance & Love"
                className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brown/70 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-xl font-semibold text-cream mb-2">Romance & Love</h3>
                  <span className="text-cream hover:underline inline-block">
                    Shop Now
                  </span>
                </div>
              </div>
            </Link>

            {/* Category 2 */}
            <Link href="/shop?occasion=celebrations" className="block group relative overflow-hidden rounded-lg cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1531058020387-3be344556be6"
                alt="Celebrations"
                className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brown/70 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-xl font-semibold text-cream mb-2">Celebrations</h3>
                  <span className="text-cream hover:underline inline-block">
                    Shop Now
                  </span>
                </div>
              </div>
            </Link>

            {/* Category 3 */}
            <Link href="/shop?fandom=fantasy" className="block group relative overflow-hidden rounded-lg cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1596438459194-f275f413d6ff"
                alt="Fandom Inspired"
                className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brown/70 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-xl font-semibold text-cream mb-2">Fandom Inspired</h3>
                  <span className="text-cream hover:underline inline-block">
                    Shop Now
                  </span>
                </div>
              </div>
            </Link>

            {/* Category 4 */}
            <Link href="/custom" className="block group relative overflow-hidden rounded-lg cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1591886960571-74d43a9d4166"
                alt="Custom Creations"
                className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brown/70 to-transparent flex items-end p-6">
                <div>
                  <h3 className="text-xl font-semibold text-cream mb-2">Custom Creations</h3>
                  <span className="text-cream hover:underline inline-block">
                    Design Yours
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold text-brown mb-4">Best Sellers</h2>
            <div className="w-24 h-1 bg-beige mx-auto mb-6"></div>
            <p className="text-brown-dark max-w-2xl mx-auto">Our most popular arrangements that customers love</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Best seller products */}
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="group">
                {/* Product Card */}
                <div className="relative bg-white overflow-hidden shadow-md">
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
                        className="action-button bg-white shadow-md text-red-500 hover:text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromWishlist(product.id);
                        }}
                        aria-label="Remove from wishlist"
                      >
                        <span className="label text-xs font-medium">Wishlist</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        className="action-button bg-white shadow-md text-brown hover:text-brown-light"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToWishlist({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image: product.image
                          });
                        }}
                        aria-label="Add to wishlist"
                      >
                        <span className="label text-xs font-medium">Wishlist</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    )}

                    {/* Quick View Button */}
                    <button
                      className="action-button bg-white shadow-md text-brown hover:text-brown-dark"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickView(product);
                      }}
                      aria-label="Quick view"
                    >
                      <span className="label text-xs font-medium">Quick View</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>

                  {/* Add to Cart Button - Only visible on hover */}
                  <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          quantity: 1,
                          image: product.image
                        });
                      }}
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
          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="btn inline-flex items-center px-6 py-3 border-2 border-brown text-brown hover:bg-cream-light transition-all duration-300"
              onClick={() => {
                window.localStorage.setItem('shopView', 'product');
              }}
            >
              <span className="btn-content">
                View All Products
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Custom Bouquet CTA */}
      <section className="py-24 bg-beige relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=1200&auto=format')] bg-cover bg-center opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold text-brown mb-6">Create Your Custom Bouquet</h2>
            <div className="w-24 h-1 bg-cream mx-auto mb-8"></div>
            <p className="text-lg font-body text-brown-dark mb-10 leading-relaxed">
              Design a one-of-a-kind arrangement that perfectly matches your style, occasion, or fandom preference.
              Our custom bouquet builder makes it easy to create something truly special that will last forever.
            </p>
            <Link href="/custom" className="btn group px-8 py-4 bg-brown text-cream hover:bg-brown-dark transition-all duration-300 shadow-elegant inline-block">
              <span className="btn-content flex items-center justify-center">
                Start Designing
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-cream-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold text-brown mb-4">What Our Customers Say</h2>
            <div className="w-24 h-1 bg-beige mx-auto mb-6"></div>
            <p className="text-brown-dark max-w-2xl mx-auto">Real experiences from our valued customers</p>
          </div>
          <div className="overflow-hidden py-4">
            <InfiniteCarousel
              items={testimonials}
              speed={30}
              gap={24}
              direction="left"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
