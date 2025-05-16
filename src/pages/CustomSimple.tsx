import { useState, useRef } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

interface FormData {
  occasion: string;
  otherOccasion: string;
  description: string;
  email: string;
  phone: string;
  instagram: string;
}

const CustomSimple = () => {
  const [formData, setFormData] = useState<FormData>({
    occasion: '',
    otherOccasion: '',
    description: '',
    email: '',
    phone: '',
    instagram: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const { currentUser } = useAuth();

  // Occasion options - keeping only the most essential
  const occasionOptions = [
    { value: '', label: 'Select an occasion' },
    { value: 'wedding', label: 'Wedding' },
    { value: 'birthday', label: 'Birthday' },
    { value: 'anniversary', label: 'Anniversary' },
    { value: 'sympathy', label: 'Sympathy' },
    { value: 'love', label: 'Love & Romance' },
    { value: 'other', label: 'Other (please specify)' },
  ];

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Limit to 5 files
      if (e.target.files.length > 5) {
        setError('You can only upload a maximum of 5 images.');
        return;
      }

      // Check file types
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      for (let i = 0; i < e.target.files.length; i++) {
        if (!validTypes.includes(e.target.files[i].type)) {
          setError('Only image files (JPEG, PNG, GIF, WEBP) are allowed.');
          return;
        }
      }

      setSelectedFiles(e.target.files);
      setError('');
    }
  };

  // Submit form to Firestore
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.description) {
      setError('Please provide a description of your custom bouquet.');
      return;
    }

    if (formData.occasion === 'other' && !formData.otherOccasion) {
      setError('Please specify the occasion.');
      return;
    }

    if (!formData.email && !formData.phone) {
      setError('Please provide at least one contact method (email or phone).');
      return;
    }

    // Basic email validation if provided
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address.');
        return;
      }
    }

    // Basic phone validation if provided
    if (formData.phone) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(formData.phone.replace(/[^0-9]/g, ''))) {
        setError('Please enter a valid 10-digit phone number.');
        return;
      }
    }

    try {
      setLoading(true);
      setError('');

      // In a real implementation, you would upload the files to Firebase Storage
      // and get the download URLs to store in Firestore
      const fileNames = selectedFiles
        ? Array.from(selectedFiles).map(file => file.name)
        : [];

      // Add to Firestore
      await addDoc(collection(db, 'customBouquetRequests'), {
        userId: currentUser?.uid || null,
        occasion: formData.occasion === 'other' ? 'other' : formData.occasion,
        otherOccasion: formData.occasion === 'other' ? formData.otherOccasion : '',
        description: formData.description,
        email: formData.email,
        phone: formData.phone,
        instagram: formData.instagram,
        inspirationImages: fileNames, // In a real implementation, this would be download URLs
        createdAt: new Date(),
        status: 'new',
      });

      // Show success message
      setSuccess(true);

      // Reset form
      setFormData({
        occasion: '',
        otherOccasion: '',
        description: '',
        email: '',
        phone: '',
        instagram: '',
      });
      setSelectedFiles(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while submitting your request');
    } finally {
      setLoading(false);
    }
  };

  // Success message
  if (success) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h2 className="text-2xl font-bold text-brown mt-4 mb-2">Request Submitted Successfully!</h2>
            <p className="text-brown/70 mb-6">
              Thank you for your custom bouquet request. Our team will review your request and contact you within 24-48 hours to discuss details and pricing.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="px-6 py-3 bg-brown text-cream rounded-md hover:bg-opacity-90 transition-colors"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-brown mb-4">Custom Bouquet Request</h1>
        <p className="text-brown/80 mb-8">
          Describe your dream bouquet and our designers will create something special just for you.
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Occasion */}
          <div>
            <label htmlFor="occasion" className="block text-brown mb-2">
              Occasion
            </label>
            <select
              id="occasion"
              name="occasion"
              value={formData.occasion}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-cream border border-beige rounded-md focus:outline-none focus:ring-2 focus:ring-brown/50"
            >
              {occasionOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Show text field for "Other" occasion */}
            {formData.occasion === 'other' && (
              <div className="mt-3">
                <label htmlFor="otherOccasion" className="block text-brown mb-2">
                  Please specify the occasion
                </label>
                <input
                  type="text"
                  id="otherOccasion"
                  name="otherOccasion"
                  value={formData.otherOccasion}
                  onChange={handleChange}
                  placeholder="Enter the occasion"
                  className="w-full px-4 py-2 bg-cream border border-beige rounded-md focus:outline-none focus:ring-2 focus:ring-brown/50"
                  required
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-brown mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              placeholder="Describe what you're looking for in detail. Include colors, style, flowers you like, and any themes you want incorporated."
              className="w-full px-4 py-2 bg-cream border border-beige rounded-md focus:outline-none focus:ring-2 focus:ring-brown/50"
              required
            ></textarea>
            <p className="text-sm text-brown/70 mt-1">
              The more details you provide, the better our designers can match your vision.
            </p>
          </div>

          {/* Inspiration Images */}
          <div>
            <label className="block text-brown mb-2">
              Inspiration Images
            </label>
            <div className="flex items-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                accept="image/*"
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="px-4 py-2 bg-cream border border-beige rounded-md cursor-pointer hover:bg-beige/20 transition-colors"
              >
                Choose files
              </label>
              <span className="ml-3 text-sm text-brown/70">
                {selectedFiles
                  ? `${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''} selected`
                  : 'No file chosen'}
              </span>
            </div>
            <p className="text-sm text-brown/70 mt-1">
              Upload photos of bouquets you like or inspiration images. Max 5 images.
            </p>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-brown mb-4">
              Contact Information <span className="text-red-500">*</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-brown mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-2 bg-cream border border-beige rounded-md focus:outline-none focus:ring-2 focus:ring-brown/50"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-brown mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(123) 456-7890"
                  className="w-full px-4 py-2 bg-cream border border-beige rounded-md focus:outline-none focus:ring-2 focus:ring-brown/50"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="instagram" className="block text-brown mb-2">
                Instagram Username
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 bg-beige/50 border border-r-0 border-beige rounded-l-md text-brown">
                  @
                </span>
                <input
                  type="text"
                  id="instagram"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="your_instagram_handle"
                  className="flex-1 px-4 py-2 bg-cream border border-beige rounded-r-md focus:outline-none focus:ring-2 focus:ring-brown/50"
                />
              </div>
            </div>

            <p className="text-sm text-brown/70 mt-4">
              Please provide at least one way for us to contact you about your custom order. We'll discuss pricing details during consultation.
            </p>
          </div>

          {/* Divider */}
          <hr className="border-beige" />

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-yellow-400 text-brown rounded-full font-semibold hover:bg-yellow-500 transition-colors disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomSimple;
