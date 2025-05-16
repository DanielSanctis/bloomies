import { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useProduct, useRelatedProducts } from '../hooks/useProducts';
import QuickView from '../components/ui/QuickView';

const ProductDetail = () => {
  const [, params] = useRoute('/product/:id');
  const productId = params?.id || '';
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

  console.log('Product ID from route:', productId);

  // Fetch product data using our custom hooks
  const { product, isLoading: isLoadingProduct, error } = useProduct(productId);
  const { relatedProducts, isLoading: isLoadingRelated } = useRelatedProducts(productId);

  console.log('Product data:', product);
  console.log('Error:', error);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [personalizedNotes, setPersonalizedNotes] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [showShippingInfo, setShowShippingInfo] = useState(false);

  // Set selected image when product loads
  if (product && !selectedImage) {
    if (product.images && product.images.length > 0) {
      setSelectedImage(product.images[0]);
    } else if (product.image) {
      setSelectedImage(product.image);
    }
  }

  // Show loading state
  if (isLoadingProduct) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-brown/70">Loading product...</p>
        </div>
      </div>
    );
  }

  // Show not found state
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-brown/70">Product not found</p>
          <Link href="/shop" className="mt-4 inline-block px-4 py-2 bg-brown text-cream rounded-md hover:bg-opacity-90 transition-colors">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
      personalizedNotes: personalizedNotes.trim() || undefined,
    });
  };

  const handleQuickView = (productToView: any) => {
    setQuickViewProduct(productToView);
    setIsQuickViewOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brown">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/shop" className="hover:text-brown">Products</Link>
        <span className="mx-2">›</span>
        <span className="text-brown">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Images */}
        <div className="relative">
          {/* Sale Badge */}
          {product.salePercentage && (
            <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-sm font-bold px-2 py-1">
              Sale {product.salePercentage}%
            </div>
          )}

          <div className="bg-white overflow-hidden mb-4">
            <div className="aspect-portrait w-full">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="eager"
                style={{ width: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {product.images ? (
              // If product has images array, use it
              product.images.map((image, index) => (
                <div
                  key={index}
                  className={`cursor-pointer border overflow-hidden ${
                    selectedImage === image ? 'border-brown' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="aspect-portrait w-full">
                    <img
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  </div>
                </div>
              ))
            ) : (
              // Otherwise use image and image2 properties
              <>
                {product.image && (
                  <div
                    className={`cursor-pointer border overflow-hidden ${
                      selectedImage === product.image ? 'border-brown' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedImage(product.image)}
                  >
                    <div className="aspect-portrait w-full">
                      <img
                        src={product.image}
                        alt={`${product.name} - Image 1`}
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                    </div>
                  </div>
                )}
                {product.image2 && (
                  <div
                    className={`cursor-pointer border overflow-hidden ${
                      selectedImage === product.image2 ? 'border-brown' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedImage(product.image2)}
                  >
                    <div className="aspect-portrait w-full">
                      <img
                        src={product.image2}
                        alt={`${product.name} - Image 2`}
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-brown mb-3">{product.name}</h1>
              <p className="text-gray-700 leading-relaxed text-sm">{product.description}</p>
            </div>

            <div className="border-t border-b border-gray-200 py-4">
              <div className="flex items-center mb-3">
                <span className="text-gray-600 w-28 text-sm">Availability:</span>
                <span className="text-gray-800 font-medium text-sm">In Stock</span>
              </div>

              <div className="flex items-center">
                <span className="text-gray-600 w-28 text-sm">Price:</span>
                <div>
                  {product.oldPrice ? (
                    <>
                      <span className="text-gray-400 line-through mr-2 text-sm">Rs. {product.oldPrice.toFixed(2)}</span>
                      <span className="text-lg font-semibold text-brown">Rs. {product.price.toFixed(2)}</span>
                    </>
                  ) : (
                    <span className="text-lg font-semibold text-brown">Rs. {product.price.toFixed(2)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div>
              <h2 className="text-sm font-medium text-brown mb-2">Product Details</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-700 pl-2">
                {product.details?.slice(0, 3).map((detail, index) => (
                  <li key={index} className="text-xs">{detail}</li>
                ))}
              </ul>
            </div>

            {/* Personalized Notes */}
            <div>
              <label htmlFor="personalizedNotes" className="block text-gray-700 mb-2 font-medium text-sm">
                Personalized Notes / Request (30-40 Words Only)
              </label>
              <textarea
                id="personalizedNotes"
                className="w-full border border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-brown text-sm"
                rows={3}
                value={personalizedNotes}
                onChange={(e) => setPersonalizedNotes(e.target.value)}
                maxLength={40}
                placeholder="Add your personalized message here (max 40 words)"
              ></textarea>
            </div>

            {/* Subtotal, Quantity, Add to Cart */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="text-gray-700 mb-2 flex justify-between items-center">
                <span className="text-base">Subtotal:</span>
                <span className="font-semibold text-base">Rs. {(product.price * quantity).toFixed(2)}</span>
              </div>

              <div className="flex items-center mb-3">
                <span className="text-gray-700 mr-4 font-medium text-base">Quantity:</span>
                <div className="flex items-center border border-gray-300">
                  <button
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 text-sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val > 0) setQuantity(val);
                    }}
                    className="w-10 text-center py-1.5 border-x border-gray-300 text-sm"
                  />
                  <button
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 text-sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mb-3">
                <button
                  onClick={handleAddToCart}
                  className="px-5 py-2.5 bg-brown text-white uppercase font-bold text-xs hover:bg-brown-dark transition-colors flex-grow"
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => product && (isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image
                  }))}
                  className="p-2.5 border border-gray-300 hover:bg-gray-100 transition-colors"
                  aria-label={isInWishlist(product?.id || '') ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isInWishlist(product?.id || '') ? 'text-red-500 fill-current' : 'text-gray-600'}`} viewBox="0 0 24 24" stroke="currentColor" fill="none">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isInWishlist(product?.id || '') ? 0 : 1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

                <button
                  className="p-2.5 border border-gray-300 hover:bg-gray-100 transition-colors"
                  aria-label="Share"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>

              {/* Viewing Indicator */}
              <div className="flex items-center text-gray-600 text-sm border-t border-gray-100 pt-2 pb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{Math.floor(Math.random() * 100) + 50} customers are viewing this product</span>
              </div>
            </div>

            {/* Addons Section */}
            <div className="mt-2 pt-3 border-t border-gray-200">
              <h3 className="text-base font-medium text-brown mb-3">ADDONS</h3>
              <div className="space-y-3">
                {/* Gift Wrap */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 flex-shrink-0">
                    <img
                      src="/images/gift-wrap.jpg"
                      alt="Gift Wrap"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-sm font-medium text-brown">Gift Wrap</h4>
                    <p className="text-gray-500 text-sm">Rs. 49.00</p>
                  </div>
                  <div className="w-24 flex-shrink-0">
                    <button
                      className="w-full py-1 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                      onClick={() => addToCart({
                        id: 'gift-wrap',
                        name: 'Gift Wrap',
                        price: 49,
                        quantity: 1,
                        image: '/images/gift-wrap.jpg'
                      })}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>

                {/* Lights */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 flex-shrink-0">
                    <img
                      src="/images/lights.jpg"
                      alt="Lights"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-sm font-medium text-brown">Lights</h4>
                    <p className="text-gray-500 text-sm">Rs. 99.00</p>
                  </div>
                  <div className="w-24 flex-shrink-0">
                    <button
                      className="w-full py-1 border border-gray-300 text-gray-800 text-sm font-medium hover:bg-gray-100 transition-colors"
                      onClick={() => addToCart({
                        id: 'lights',
                        name: 'Lights',
                        price: 99,
                        quantity: 1,
                        image: '/images/lights.jpg'
                      })}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>

                {/* Forget Me Nots */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 flex-shrink-0">
                    <img
                      src="/images/forget-me-nots.jpg"
                      alt="Forget Me Nots"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-sm font-medium text-brown">Forget Me Nots(Set Of 4)</h4>
                    <p className="text-gray-500 text-sm">Rs. 99.00</p>
                  </div>
                  <div className="w-24 flex-shrink-0">
                    <button
                      className="w-full py-1 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                      onClick={() => addToCart({
                        id: 'forget-me-nots',
                        name: 'Forget Me Nots(Set Of 4)',
                        price: 99,
                        quantity: 1,
                        image: '/images/forget-me-nots.jpg'
                      })}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Instagram Contact */}
            <div className="mt-3 pt-2 border-t border-gray-200">
              <div className="bg-gray-50 p-2 rounded text-center">
                <p className="text-gray-700 text-sm">For Any Customizations Kindly contact us on our Instagram: <a href="https://instagram.com/floreal.inn" className="font-medium">@floreal.inn</a></p>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex items-center gap-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-base font-medium text-gray-800">Built And Shipped Within 24 Working Hours</span>
              </div>

              {/* Collapsible Sections */}
              <div className="mt-4 space-y-6">
                {/* Additional Information */}
                <div className="border-t border-gray-200">
                  <div
                    className="flex items-center justify-between cursor-pointer py-4"
                    onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
                  >
                    <h4 className="font-medium text-gray-800 text-base">Additional Information</h4>
                    <button className="text-gray-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 transition-transform duration-200 ${showAdditionalInfo ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  {showAdditionalInfo && (
                    <div className="pb-3 text-gray-600 text-sm">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr className="border-b border-gray-100">
                            <td className="py-1 font-medium">Materials</td>
                            <td className="py-1">Satin Ribbon, Pipe Cleaner</td>
                          </tr>
                          <tr className="border-b border-gray-100">
                            <td className="py-1 font-medium">Dimensions</td>
                            <td className="py-1">{product.size || 'Varies by product'}</td>
                          </tr>
                          <tr className="border-b border-gray-100">
                            <td className="py-1 font-medium">Care Instructions</td>
                            <td className="py-1">Keep away from direct sunlight and moisture</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Shipping & Return */}
                <div className="border-t border-gray-200">
                  <div
                    className="flex items-center justify-between cursor-pointer py-4"
                    onClick={() => setShowShippingInfo(!showShippingInfo)}
                  >
                    <h4 className="font-medium text-gray-800 text-base">Shipping & Return</h4>
                    <button className="text-gray-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 transition-transform duration-200 ${showShippingInfo ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  {showShippingInfo && (
                    <div className="pb-3 text-gray-600 text-sm">
                      <p className="mb-1">• All orders are processed and shipped within 24 working hours.</p>
                      <p className="mb-1">• Free shipping on orders above Rs. 1000 within India.</p>
                      <p className="mb-1">• Standard shipping takes 3-5 business days depending on your location.</p>
                      <p className="mb-1">• We currently only ship within India.</p>
                      <p className="mb-1">• Returns accepted within 7 days of delivery for manufacturing defects only.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {!isLoadingRelated && relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-brown mb-6 text-center">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map(relatedProduct => (
              <div key={relatedProduct.id} className="group">
                {/* Product Card */}
                <div className="relative bg-white overflow-hidden shadow-md">
                  <Link href={`/product/${relatedProduct.id}`}>
                    <div className="relative w-full overflow-hidden aspect-portrait">
                      {/* Primary Image */}
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover cursor-pointer absolute top-0 left-0 transition-opacity duration-300 group-hover:opacity-0"
                        loading="eager"
                      />
                      {/* Secondary Image (shown on hover) */}
                      <img
                        src={relatedProduct.image2 || relatedProduct.image}
                        alt={`${relatedProduct.name} - alternate view`}
                        className="w-full h-full object-cover cursor-pointer absolute top-0 left-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                        loading="eager"
                      />
                    </div>
                  </Link>

                  {/* Product Name Overlay - Only visible on hover */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white text-sm font-medium">{relatedProduct.name}</h3>
                  </div>

                  {/* Action Buttons - Only visible on hover */}
                  <div className="absolute top-2 right-2 action-buttons-container opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* Wishlist Button */}
                    {isInWishlist(relatedProduct.id) ? (
                      <button
                        className="action-button bg-white shadow-md text-red-500 hover:text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromWishlist(relatedProduct.id);
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
                            id: relatedProduct.id,
                            name: relatedProduct.name,
                            price: relatedProduct.price,
                            image: relatedProduct.image
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
                        handleQuickView(relatedProduct);
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
                          id: relatedProduct.id,
                          name: relatedProduct.name,
                          price: relatedProduct.price,
                          quantity: 1,
                          image: relatedProduct.image
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
                  <Link href={`/product/${relatedProduct.id}`}>
                    <h3 className="text-base font-medium text-brown cursor-pointer hover:text-opacity-80">{relatedProduct.name}</h3>
                  </Link>

                  {/* Price */}
                  <div className="mt-1">
                    {relatedProduct.oldPrice ? (
                      <>
                        <span className="text-gray-400 line-through mr-2">₹{relatedProduct.oldPrice}</span>
                        <span className="text-brown font-semibold">₹{relatedProduct.price}</span>
                      </>
                    ) : (
                      <span className="text-brown font-semibold">₹{relatedProduct.price}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickView
          product={quickViewProduct}
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductDetail;
