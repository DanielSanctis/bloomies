import { useState } from 'react';
import { useLocation } from 'wouter';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

// Step types
type Step = 'size' | 'flowers' | 'colors' | 'addons' | 'requests' | 'contact';

// Form data type
interface FormData {
  size: string;
  flowers: string[];
  colors: string[];
  addons: string[];
  requests: string;
  name: string;
  email: string;
  phone: string;
}

const Custom = () => {
  const [currentStep, setCurrentStep] = useState<Step>('size');
  const [formData, setFormData] = useState<FormData>({
    size: '',
    flowers: [],
    colors: [],
    addons: [],
    requests: '',
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { currentUser } = useAuth();
  const [, setLocation] = useLocation();

  // Options for each step
  const sizeOptions = [
    { id: 'small', name: 'Small', price: 999, description: 'Perfect for a desk or small space' },
    { id: 'medium', name: 'Medium', price: 1499, description: 'Ideal for a coffee table or gift' },
    { id: 'large', name: 'Large', price: 1999, description: 'Statement piece for special occasions' },
    { id: 'extra-large', name: 'Extra Large', price: 2499, description: 'Luxurious arrangement for grand displays' },
  ];

  const flowerOptions = [
    { id: 'roses', name: 'Roses' },
    { id: 'lilies', name: 'Lilies' },
    { id: 'tulips', name: 'Tulips' },
    { id: 'orchids', name: 'Orchids' },
    { id: 'sunflowers', name: 'Sunflowers' },
    { id: 'daisies', name: 'Daisies' },
    { id: 'carnations', name: 'Carnations' },
    { id: 'peonies', name: 'Peonies' },
  ];

  const colorOptions = [
    { id: 'red', name: 'Red', color: '#FF0000' },
    { id: 'pink', name: 'Pink', color: '#FFC0CB' },
    { id: 'white', name: 'White', color: '#FFFFFF' },
    { id: 'yellow', name: 'Yellow', color: '#FFFF00' },
    { id: 'purple', name: 'Purple', color: '#800080' },
    { id: 'blue', name: 'Blue', color: '#0000FF' },
    { id: 'orange', name: 'Orange', color: '#FFA500' },
    { id: 'green', name: 'Green', color: '#008000' },
  ];

  const addonOptions = [
    { id: 'vase', name: 'Decorative Vase', price: 499 },
    { id: 'card', name: 'Personalized Card', price: 99 },
    { id: 'chocolates', name: 'Box of Chocolates', price: 299 },
    { id: 'fairy-lights', name: 'Fairy Lights', price: 199 },
    { id: 'glitter', name: 'Glitter Accents', price: 149 },
    { id: 'ribbon', name: 'Premium Ribbon', price: 99 },
  ];

  // Handle form field changes
  const handleSizeChange = (size: string) => {
    setFormData(prev => ({ ...prev, size }));
  };

  const handleFlowerToggle = (flower: string) => {
    setFormData(prev => {
      const flowers = prev.flowers.includes(flower)
        ? prev.flowers.filter(f => f !== flower)
        : [...prev.flowers, flower];
      return { ...prev, flowers };
    });
  };

  const handleColorToggle = (color: string) => {
    setFormData(prev => {
      const colors = prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color];
      return { ...prev, colors };
    });
  };

  const handleAddonToggle = (addon: string) => {
    setFormData(prev => {
      const addons = prev.addons.includes(addon)
        ? prev.addons.filter(a => a !== addon)
        : [...prev.addons, addon];
      return { ...prev, addons };
    });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Navigation between steps
  const nextStep = () => {
    switch (currentStep) {
      case 'size':
        if (!formData.size) {
          setError('Please select a size');
          return;
        }
        setCurrentStep('flowers');
        break;
      case 'flowers':
        if (formData.flowers.length === 0) {
          setError('Please select at least one flower type');
          return;
        }
        setCurrentStep('colors');
        break;
      case 'colors':
        if (formData.colors.length === 0) {
          setError('Please select at least one color');
          return;
        }
        setCurrentStep('addons');
        break;
      case 'addons':
        setCurrentStep('requests');
        break;
      case 'requests':
        setCurrentStep('contact');
        break;
      case 'contact':
        submitForm();
        break;
    }
    setError('');
  };

  const prevStep = () => {
    switch (currentStep) {
      case 'flowers':
        setCurrentStep('size');
        break;
      case 'colors':
        setCurrentStep('flowers');
        break;
      case 'addons':
        setCurrentStep('colors');
        break;
      case 'requests':
        setCurrentStep('addons');
        break;
      case 'contact':
        setCurrentStep('requests');
        break;
    }
    setError('');
  };

  // Calculate total price
  const calculateTotal = () => {
    const sizePrice = sizeOptions.find(option => option.id === formData.size)?.price || 0;
    const addonPrice = formData.addons.reduce((total, addon) => {
      const price = addonOptions.find(option => option.id === addon)?.price || 0;
      return total + price;
    }, 0);

    return sizePrice + addonPrice;
  };

  // Submit form to Firestore
  const submitForm = async () => {
    // Validate contact info
    if (!formData.name || !formData.email || !formData.phone) {
      setError('Please fill in all contact information');
      return;
    }

    try {
      setLoading(true);

      // Add to Firestore
      await addDoc(collection(db, 'customBouquets'), {
        ...formData,
        userId: currentUser?.uid || null,
        createdAt: new Date(),
        totalPrice: calculateTotal(),
        status: 'pending',
      });

      setSuccess(true);

      // Reset form after successful submission
      setFormData({
        size: '',
        flowers: [],
        colors: [],
        addons: [],
        requests: '',
        name: '',
        email: '',
        phone: '',
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 'size':
        return (
          <div>
            <h2 className="text-2xl font-semibold text-brown mb-6">Choose Your Base Size</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sizeOptions.map(option => (
                <div
                  key={option.id}
                  className={`border p-4 cursor-pointer transition-colors ${
                    formData.size === option.id ? 'border-brown bg-beige/50' : 'border-beige hover:bg-beige/20'
                  }`}
                  onClick={() => handleSizeChange(option.id)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-lg">{option.name}</h3>
                    <span className="font-medium">₹{option.price}</span>
                  </div>
                  <p className="text-brown/70">{option.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'flowers':
        return (
          <div>
            <h2 className="text-2xl font-semibold text-brown mb-6">Select Flower Types</h2>
            <p className="mb-4 text-brown/70">Choose one or more flower types for your arrangement.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {flowerOptions.map(option => (
                <div
                  key={option.id}
                  className={`border p-4 cursor-pointer transition-colors ${
                    formData.flowers.includes(option.id) ? 'border-brown bg-beige/50' : 'border-beige hover:bg-beige/20'
                  }`}
                  onClick={() => handleFlowerToggle(option.id)}
                >
                  <h3 className="font-medium text-center">{option.name}</h3>
                </div>
              ))}
            </div>
          </div>
        );

      case 'colors':
        return (
          <div>
            <h2 className="text-2xl font-semibold text-brown mb-6">Select Color Palette</h2>
            <p className="mb-4 text-brown/70">Choose one or more colors for your arrangement.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {colorOptions.map(option => (
                <div
                  key={option.id}
                  className={`border p-4 cursor-pointer transition-colors ${
                    formData.colors.includes(option.id) ? 'border-brown bg-beige/50' : 'border-beige hover:bg-beige/20'
                  }`}
                  onClick={() => handleColorToggle(option.id)}
                >
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className="w-6 h-6 border border-gray-300"
                      style={{ backgroundColor: option.color }}
                    ></div>
                    <h3 className="font-medium">{option.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'addons':
        return (
          <div>
            <h2 className="text-2xl font-semibold text-brown mb-6">Add Optional Extras</h2>
            <p className="mb-4 text-brown/70">Enhance your arrangement with these optional add-ons.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {addonOptions.map(option => (
                <div
                  key={option.id}
                  className={`border p-4 cursor-pointer transition-colors ${
                    formData.addons.includes(option.id) ? 'border-brown bg-beige/50' : 'border-beige hover:bg-beige/20'
                  }`}
                  onClick={() => handleAddonToggle(option.id)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{option.name}</h3>
                    <span className="font-medium">₹{option.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'requests':
        return (
          <div>
            <h2 className="text-2xl font-semibold text-brown mb-6">Special Requests</h2>
            <p className="mb-4 text-brown/70">Add any special instructions or requests for your custom bouquet.</p>
            <textarea
              name="requests"
              value={formData.requests}
              onChange={handleTextChange}
              placeholder="E.g., I'd like this to be inspired by a fantasy theme, or I need this for a wedding..."
              className="w-full px-4 py-2 border border-beige focus:outline-none focus:ring-2 focus:ring-brown/50 h-40"
            ></textarea>
          </div>
        );

      case 'contact':
        return (
          <div>
            <h2 className="text-2xl font-semibold text-brown mb-6">Contact Information</h2>
            <p className="mb-4 text-brown/70">Please provide your contact details so we can discuss your custom bouquet.</p>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-brown mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleTextChange}
                  required
                  className="w-full px-4 py-2 border border-beige focus:outline-none focus:ring-2 focus:ring-brown/50"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-brown mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleTextChange}
                  required
                  className="w-full px-4 py-2 border border-beige focus:outline-none focus:ring-2 focus:ring-brown/50"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-brown mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleTextChange}
                  required
                  className="w-full px-4 py-2 border border-beige focus:outline-none focus:ring-2 focus:ring-brown/50"
                />
              </div>
            </div>

            <div className="mt-8 p-4 bg-beige/30">
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Base Size:</span>
                  <span>{sizeOptions.find(option => option.id === formData.size)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Flowers:</span>
                  <span>{formData.flowers.map(f => flowerOptions.find(option => option.id === f)?.name).join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Colors:</span>
                  <span>{formData.colors.map(c => colorOptions.find(option => option.id === c)?.name).join(', ')}</span>
                </div>
                {formData.addons.length > 0 && (
                  <div className="flex justify-between">
                    <span>Add-ons:</span>
                    <span>{formData.addons.map(a => addonOptions.find(option => option.id === a)?.name).join(', ')}</span>
                  </div>
                )}
                <div className="border-t border-beige pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Estimated Total:</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  // Success message after form submission
  if (success) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white shadow-md p-8">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h2 className="text-2xl font-bold text-brown mt-4 mb-2">Request Submitted Successfully!</h2>
            <p className="text-brown/70 mb-6">
              Thank you for your custom bouquet request. Our team will review your request and contact you within 24-48 hours to discuss details and pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setLocation('/')}
                className="px-6 py-3 bg-brown text-cream hover:bg-opacity-90 transition-colors"
              >
                Return to Home
              </button>
              <button
                onClick={() => {
                  setSuccess(false);
                  setCurrentStep('size');
                }}
                className="px-6 py-3 border border-brown text-brown hover:bg-brown/10 transition-colors"
              >
                Create Another Request
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white shadow-md overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-beige px-6 py-4">
          <div className="flex justify-between">
            {['size', 'flowers', 'colors', 'addons', 'requests', 'contact'].map((step, index) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 flex items-center justify-center ${
                    currentStep === step
                      ? 'bg-brown text-cream'
                      : ['size', 'flowers', 'colors', 'addons', 'requests', 'contact'].indexOf(currentStep) > index
                        ? 'bg-brown/70 text-cream'
                        : 'bg-beige/70 text-brown'
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-xs mt-1 hidden sm:block">{step.charAt(0).toUpperCase() + step.slice(1)}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 h-1 bg-beige/50">
            <div
              className="h-1 bg-brown transition-all"
              style={{
                width: `${
                  ((['size', 'flowers', 'colors', 'addons', 'requests', 'contact'].indexOf(currentStep) + 1) / 6) * 100
                }%`
              }}
            ></div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700">
              {error}
            </div>
          )}

          {renderStep()}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 'size'}
              className={`px-4 py-2 border border-brown ${
                currentStep === 'size'
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-brown/10 transition-colors'
              }`}
            >
              Back
            </button>
            <button
              type="button"
              onClick={nextStep}
              disabled={loading}
              className="px-4 py-2 bg-brown text-cream hover:bg-opacity-90 transition-colors disabled:opacity-50"
            >
              {currentStep === 'contact' ? (loading ? 'Submitting...' : 'Submit Request') : 'Next Step'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Custom;
