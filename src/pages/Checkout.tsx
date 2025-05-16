import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

type CheckoutStep = 'shipping' | 'payment' | 'confirmation';

interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  specialInstructions: string;
}

interface PaymentInfo {
  method: 'upi' | 'cod' | 'googlepay';
  upiId?: string;
}

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    specialInstructions: '',
  });
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: 'upi',
    upiId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState('');

  const { items, subtotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const [, setLocation] = useLocation();

  // Calculate shipping cost and total (only shipping within India)
  const shippingCost = subtotal > 1000 ? 0 : 99; // Free shipping for orders over ₹1000 within India
  const total = subtotal + shippingCost;

  // Handle shipping form changes
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  // Handle payment form changes
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'method') {
      setPaymentInfo(prev => ({ ...prev, method: value as 'upi' | 'cod' }));
    } else {
      setPaymentInfo(prev => ({ ...prev, [name]: value }));
    }
  };

  // Validate shipping info
  const validateShippingInfo = () => {
    if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.phone ||
        !shippingInfo.address || !shippingInfo.city || !shippingInfo.state || !shippingInfo.pincode) {
      setError('Please fill in all required fields');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingInfo.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Basic phone validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(shippingInfo.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }

    // Basic pincode validation
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(shippingInfo.pincode)) {
      setError('Please enter a valid 6-digit pincode');
      return false;
    }

    return true;
  };

  // Validate payment info
  const validatePaymentInfo = () => {
    if (paymentInfo.method === 'upi' && !paymentInfo.upiId) {
      setError('Please enter your UPI ID');
      return false;
    }

    // Basic UPI ID validation
    if (paymentInfo.method === 'upi') {
      const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
      if (!upiRegex.test(paymentInfo.upiId || '')) {
        setError('Please enter a valid UPI ID (e.g., name@upi)');
        return false;
      }
    }

    // Google Pay doesn't need additional validation as it handles it internally

    return true;
  };

  // Handle next step
  const handleNextStep = () => {
    setError('');

    if (currentStep === 'shipping') {
      if (validateShippingInfo()) {
        setCurrentStep('payment');
      }
    } else if (currentStep === 'payment') {
      if (validatePaymentInfo()) {
        handlePlaceOrder();
      }
    }
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    try {
      setLoading(true);

      // Create order object
      const order = {
        userId: currentUser?.uid || null,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingInfo,
        paymentInfo,
        subtotal,
        shippingCost,
        total,
        status: 'pending',
        createdAt: new Date(),
      };

      // Save order to Firestore
      const docRef = await addDoc(collection(db, 'orders'), order);
      setOrderId(docRef.id);

      // Clear cart
      clearCart();

      // Move to confirmation step
      setCurrentStep('confirmation');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while placing your order');
    } finally {
      setLoading(false);
    }
  };

  // Generate QR code for UPI payment (mock implementation)
  const generateUpiQrCode = () => {
    // In a real implementation, this would generate a QR code for the UPI payment
    // For now, we'll just return a placeholder image
    return 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg';
  };

  // Add useEffect to initialize Google Pay
  useEffect(() => {
    if (paymentInfo.method === 'googlepay') {
      // Load Google Pay script
      const script = document.createElement('script');
      script.src = 'https://pay.google.com/gp/p/js/pay.js';
      script.async = true;
      script.onload = initializeGooglePay;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [paymentInfo.method]);

  // Initialize Google Pay
  const initializeGooglePay = () => {
    if (!window.google || !window.google.payments) return;

    const googlePayClient = new window.google.payments.api.PaymentsClient({
      environment: 'TEST' // Change to 'PRODUCTION' when going live
    });

    const googlePayButton = googlePayClient.createButton({
      onClick: processGooglePayPayment,
      buttonType: 'buy'
    });

    const buttonContainer = document.getElementById('google-pay-button');
    if (buttonContainer) {
      buttonContainer.innerHTML = '';
      buttonContainer.appendChild(googlePayButton);
    }
  };

  // Process Google Pay payment
  const processGooglePayPayment = async () => {
    try {
      setLoading(true);

      // In a real implementation, you would process the payment here
      // For now, we'll simulate a successful payment

      // Create order object
      const order = {
        userId: currentUser?.uid || null,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingInfo,
        paymentInfo: { method: 'googlepay' },
        subtotal,
        shippingCost,
        total,
        status: 'paid',
        createdAt: new Date(),
      };

      // Save order to Firestore
      const docRef = await addDoc(collection(db, 'orders'), order);
      setOrderId(docRef.id);

      // Clear cart
      clearCart();

      // Move to confirmation step
      setCurrentStep('confirmation');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing your payment');
    } finally {
      setLoading(false);
    }
  };

  // Render shipping form
  const renderShippingForm = () => {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-brown mb-6">Shipping Information</h2>
        <div className="mb-4 p-3 bg-cream-light border-l-4 border-brown">
          <p className="text-sm text-brown">
            <strong>Note:</strong> We currently only ship within India. All orders are processed and shipped from our facility in India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="fullName" className="block text-sm font-medium text-brown mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={shippingInfo.fullName}
              onChange={handleShippingChange}
              className="w-full px-4 py-2 border border-beige rounded-md focus:outline-none focus:ring-2 focus:ring-brown/50"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-brown mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={shippingInfo.email}
              onChange={handleShippingChange}
              className="w-full px-4 py-2 border border-beige rounded-md focus:outline-none focus:ring-2 focus:ring-brown/50"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-brown mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={shippingInfo.phone}
              onChange={handleShippingChange}
              className="w-full px-4 py-2 border border-beige rounded-md focus:outline-none focus:ring-2 focus:ring-brown/50"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-brown mb-1">
              Address *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={shippingInfo.address}
              onChange={handleShippingChange}
              className="w-full px-4 py-2 border border-beige rounded-md focus:outline-none focus:ring-2 focus:ring-brown/50"
              required
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-brown mb-1">
              City *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={shippingInfo.city}
              onChange={handleShippingChange}
              className="w-full px-4 py-2 border border-beige rounded-md focus:outline-none focus:ring-2 focus:ring-brown/50"
              required
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-brown mb-1">
              State *
            </label>
            <select
              id="state"
              name="state"
              value={shippingInfo.state}
              onChange={handleShippingChange}
              className="w-full px-4 py-2 border border-beige rounded-md focus:outline-none focus:ring-2 focus:ring-brown/50"
              required
            >
              <option value="">Select State</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Arunachal Pradesh">Arunachal Pradesh</option>
              <option value="Assam">Assam</option>
              <option value="Bihar">Bihar</option>
              <option value="Chhattisgarh">Chhattisgarh</option>
              <option value="Goa">Goa</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Haryana">Haryana</option>
              <option value="Himachal Pradesh">Himachal Pradesh</option>
              <option value="Jharkhand">Jharkhand</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Kerala">Kerala</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Manipur">Manipur</option>
              <option value="Meghalaya">Meghalaya</option>
              <option value="Mizoram">Mizoram</option>
              <option value="Nagaland">Nagaland</option>
              <option value="Odisha">Odisha</option>
              <option value="Punjab">Punjab</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Sikkim">Sikkim</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Telangana">Telangana</option>
              <option value="Tripura">Tripura</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Uttarakhand">Uttarakhand</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Delhi">Delhi</option>
            </select>
          </div>

          <div>
            <label htmlFor="pincode" className="block text-sm font-medium text-brown mb-1">
              Pincode *
            </label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={shippingInfo.pincode}
              onChange={handleShippingChange}
              className="w-full px-4 py-2 border border-beige rounded-md focus:outline-none focus:ring-2 focus:ring-brown/50"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="specialInstructions" className="block text-sm font-medium text-brown mb-1">
              Special Instructions (Optional)
            </label>
            <textarea
              id="specialInstructions"
              name="specialInstructions"
              value={shippingInfo.specialInstructions}
              onChange={handleShippingChange}
              rows={3}
              className="w-full px-4 py-2 border border-beige rounded-md focus:outline-none focus:ring-2 focus:ring-brown/50"
            ></textarea>
          </div>
        </div>
      </div>
    );
  };

  // Render payment form
  const renderPaymentForm = () => {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-brown mb-6">Payment Method</h2>

        <div className="space-y-4">
          {/* UPI Payment option */}
          <div>
            <label className="flex items-center">
              <input
                type="radio"
                name="method"
                value="upi"
                checked={paymentInfo.method === 'upi'}
                onChange={handlePaymentChange}
                className="mr-2"
              />
              <span>UPI Payment</span>
            </label>

            {/* UPI payment details - existing code */}
            {paymentInfo.method === 'upi' && (
              <div className="mt-4 ml-6">
                <label htmlFor="upiId" className="block text-sm font-medium text-brown mb-1">
                  UPI ID *
                </label>
                <input
                  type="text"
                  id="upiId"
                  name="upiId"
                  value={paymentInfo.upiId}
                  onChange={handlePaymentChange}
                  placeholder="yourname@upi"
                  className="w-full px-4 py-2 border border-beige rounded-md focus:outline-none focus:ring-2 focus:ring-brown/50"
                  required
                />

                <div className="mt-4 p-4 bg-beige/30 rounded-lg">
                  <h3 className="font-semibold mb-2">Scan QR Code to Pay</h3>
                  <div className="flex justify-center">
                    <img
                      src={generateUpiQrCode()}
                      alt="UPI QR Code"
                      className="w-48 h-48 object-contain bg-white p-2 rounded-md"
                    />
                  </div>
                  <p className="text-sm text-center mt-2">
                    Scan this QR code with any UPI app to make payment
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Google Pay option */}
          <div>
            <label className="flex items-center">
              <input
                type="radio"
                name="method"
                value="googlepay"
                checked={paymentInfo.method === 'googlepay'}
                onChange={handlePaymentChange}
                className="mr-2"
              />
              <span className="flex items-center">
                Google Pay
                <svg className="h-5 w-5 ml-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </span>
            </label>

            {paymentInfo.method === 'googlepay' && (
              <div className="mt-4 ml-6">
                <div id="google-pay-button" className="mt-4"></div>
                <p className="text-sm text-brown/70 mt-2">
                  Click the Google Pay button to complete your payment securely.
                </p>
              </div>
            )}
          </div>

          {/* Cash on Delivery option - existing code */}
          <div>
            <label className="flex items-center">
              <input
                type="radio"
                name="method"
                value="cod"
                checked={paymentInfo.method === 'cod'}
                onChange={handlePaymentChange}
                className="mr-2"
              />
              <span>Cash on Delivery</span>
            </label>

            {paymentInfo.method === 'cod' && (
              <div className="mt-2 ml-6 text-sm text-brown/70">
                <p>Pay with cash upon delivery. Additional ₹50 will be charged for COD orders.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render confirmation
  const renderConfirmation = () => {
    return (
      <div className="text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <h2 className="text-2xl font-bold text-brown mt-4 mb-2">Order Placed Successfully!</h2>
        <p className="text-brown/70 mb-2">
          Thank you for your order. Your order number is <span className="font-semibold">{orderId}</span>.
        </p>
        <p className="text-brown/70 mb-6">
          We'll send you an email confirmation shortly with your order details.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setLocation('/')}
            className="px-6 py-3 bg-brown text-cream rounded-md hover:bg-opacity-90 transition-colors"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => setLocation('/profile/orders')}
            className="px-6 py-3 border border-brown text-brown rounded-md hover:bg-brown/10 transition-colors"
          >
            View Order
          </button>
        </div>
      </div>
    );
  };

  // Check if cart is empty
  if (items.length === 0 && currentStep !== 'confirmation') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-brown/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-2xl font-bold text-brown mt-4 mb-2">Your Cart is Empty</h2>
            <p className="text-brown/70 mb-6">
              Add some items to your cart before proceeding to checkout.
            </p>
            <button
              onClick={() => setLocation('/shop')}
              className="px-6 py-3 bg-brown text-cream rounded-md hover:bg-opacity-90 transition-colors"
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Progress Steps */}
            {currentStep !== 'confirmation' && (
              <div className="mb-8">
                <div className="flex justify-between">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep === 'shipping' || currentStep === 'payment' ? 'bg-brown text-cream' : 'bg-beige/70 text-brown'
                    }`}>
                      1
                    </div>
                    <span className="text-xs mt-1">Shipping</span>
                  </div>
                  <div className="flex-1 flex items-center mx-4">
                    <div className={`h-1 w-full ${
                      currentStep === 'shipping' || currentStep === 'payment' ? 'bg-brown' : 'bg-beige/70'
                    }`}></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep === 'payment' ? 'bg-brown text-cream' : 'bg-beige/70 text-brown'
                    }`}>
                      2
                    </div>
                    <span className="text-xs mt-1">Payment</span>
                  </div>
                  <div className="flex-1 flex items-center mx-4">
                    <div className={`h-1 w-full ${
                      currentStep === 'confirmation' as CheckoutStep ? 'bg-brown' : 'bg-beige/70'
                    }`}></div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep === 'confirmation' as CheckoutStep ? 'bg-brown text-cream' : 'bg-beige/70 text-brown'
                    }`}>
                      3
                    </div>
                    <span className="text-xs mt-1">Confirmation</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {/* Step Content */}
            {currentStep === 'shipping' && renderShippingForm()}
            {currentStep === 'payment' && renderPaymentForm()}
            {currentStep === 'confirmation' && renderConfirmation()}

            {/* Navigation Buttons */}
            {currentStep !== 'confirmation' && (
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => currentStep === 'payment' ? setCurrentStep('shipping') : setLocation('/cart')}
                  className="px-4 py-2 border border-brown rounded-md hover:bg-brown/10 transition-colors"
                >
                  {currentStep === 'payment' ? 'Back to Shipping' : 'Back to Cart'}
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={loading}
                  className="px-4 py-2 bg-brown text-cream rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Processing...' : currentStep === 'shipping' ? 'Continue to Payment' : 'Place Order'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        {currentStep !== 'confirmation' && (
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-brown mb-4">Order Summary</h2>

              <div className="divide-y divide-beige">
                {items.map(item => (
                  <div key={item.id} className="py-3 flex">
                    <div className="flex-shrink-0 w-16 h-16 border border-beige rounded-md overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-center object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-brown">{item.name}</h3>
                      <p className="mt-1 text-sm text-brown/70">Qty: {item.quantity}</p>
                      <p className="mt-1 text-sm font-medium text-brown">₹{item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}</span>
                </div>
                {paymentInfo.method === 'cod' && (
                  <div className="flex justify-between text-sm">
                    <span>COD Charge</span>
                    <span>₹50.00</span>
                  </div>
                )}
                <div className="pt-2 border-t border-beige">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{(total + (paymentInfo.method === 'cod' ? 50 : 0)).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;




