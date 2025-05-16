import { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Save to Firestore
      await addDoc(collection(db, 'contactMessages'), {
        ...formData,
        createdAt: new Date(),
        status: 'new',
      });

      // Reset form and show success message
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while submitting your message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream">
      {/* Hero Section */}
      <section className="relative bg-beige py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-brown mb-6">
              Contact Us
            </h1>
            <p className="text-lg text-brown/80 mb-8">
              Have questions, feedback, or special requests? We'd love to hear from you. Our team is here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Contact Form */}
            <div className="w-full lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md p-8">
                {success ? (
                  <div className="text-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <h2 className="text-2xl font-bold text-brown mt-4 mb-2">Message Sent Successfully!</h2>
                    <p className="text-brown/70 mb-6">
                      Thank you for reaching out. We'll get back to you as soon as possible.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="px-6 py-3 bg-brown text-cream rounded-md hover:bg-opacity-90 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-semibold text-brown mb-6">Send Us a Message</h2>

                    {error && (
                      <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-brown mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
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
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-beige rounded-md focus:outline-none focus:ring-2 focus:ring-brown/50"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-brown mb-1">
                            Phone Number (Optional)
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-beige rounded-md focus:outline-none focus:ring-2 focus:ring-brown/50"
                          />
                        </div>

                        <div>
                          <label htmlFor="subject" className="block text-sm font-medium text-brown mb-1">
                            Subject
                          </label>
                          <select
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-beige rounded-md focus:outline-none focus:ring-2 focus:ring-brown/50"
                          >
                            <option value="">Select a subject</option>
                            <option value="General Inquiry">General Inquiry</option>
                            <option value="Product Question">Product Question</option>
                            <option value="Custom Order">Custom Order</option>
                            <option value="Order Status">Order Status</option>
                            <option value="Feedback">Feedback</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-6">
                        <label htmlFor="message" className="block text-sm font-medium text-brown mb-1">
                          Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={6}
                          className="w-full px-4 py-2 border border-beige rounded-md focus:outline-none focus:ring-2 focus:ring-brown/50"
                          required
                        ></textarea>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-6 py-3 bg-brown text-cream rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50"
                        >
                          {loading ? 'Sending...' : 'Send Message'}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-semibold text-brown mb-6">Contact Information</h2>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-brown">Address</h3>
                      <p className="text-brown/70 mt-1">
                        123 Flower Street<br />
                        Bangalore, Karnataka 560001<br />
                        India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-brown">Phone</h3>
                      <p className="text-brown/70 mt-1">
                        +91 98765 43210
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-brown">Email</h3>
                      <p className="text-brown/70 mt-1">
                        info@bloomies.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-brown">Business Hours</h3>
                      <p className="text-brown/70 mt-1">
                        Monday - Friday: 9:00 AM - 6:00 PM<br />
                        Saturday: 10:00 AM - 4:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium text-brown mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-brown hover:text-opacity-70 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                      </svg>
                    </a>
                    <a href="https://www.instagram.com/bloomieess/" target="_blank" rel="noopener noreferrer" className="text-brown hover:text-opacity-70 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                    <a href="#" className="text-brown hover:text-opacity-70 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                    </a>
                    <a href="#" className="text-brown hover:text-opacity-70 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-beige/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-brown text-center mb-12">Visit Our Store</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Placeholder for Google Map - In a real implementation, this would be a Google Maps iframe */}
            <div className="h-96 bg-beige/50 flex items-center justify-center">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-brown/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <p className="mt-4 text-brown/70">
                  Google Maps would be embedded here in a production environment
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-brown text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-brown mb-2">How long do your synthetic arrangements last?</h3>
              <p className="text-brown/70">
                Our synthetic arrangements are designed to last for years with proper care. Unlike fresh flowers, they won't wilt or fade, making them a long-lasting investment.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-brown mb-2">Do you offer international shipping?</h3>
              <p className="text-brown/70">
                Currently, we only ship within India. We're working on expanding our shipping options to other countries in the future. Please check back for updates.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-brown mb-2">How do I care for my synthetic arrangement?</h3>
              <p className="text-brown/70">
                Our arrangements require minimal maintenance. Simply dust them occasionally with a soft cloth or use a hair dryer on cool setting to remove dust. Keep them away from direct sunlight to prevent fading.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-brown mb-2">Can I customize an existing arrangement?</h3>
              <p className="text-brown/70">
                Absolutely! We offer customization options for most of our arrangements. You can also use our Custom Bouquet Builder to create a completely unique arrangement tailored to your preferences.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
