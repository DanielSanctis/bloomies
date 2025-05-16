import { Link } from 'wouter';

const AboutUs = () => {
  return (
    <div className="bg-cream">
      {/* Hero Section */}
      <section className="relative bg-beige py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-brown mb-6">
              Our Story
            </h1>
            <p className="text-lg font-body text-brown/80 mb-8">
              Bloomies was born from a passion for creating beautiful, long-lasting floral arrangements that bring joy without the maintenance and waste of traditional flowers.
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1596438459194-f275f413d6ff"
                alt="Our Mission"
                className="rounded-lg shadow-md w-full h-auto"
              />
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-heading font-bold text-brown mb-6">Our Mission</h2>
              <p className="font-body text-brown/80 mb-4">
                At Bloomies, we believe that beauty should be sustainable and accessible to everyone. Our mission is to create stunning synthetic floral arrangements that capture the essence and beauty of real flowers while offering longevity and value.
              </p>
              <p className="font-body text-brown/80 mb-4">
                We're committed to craftsmanship, creativity, and customer satisfaction. Each arrangement is meticulously designed and handcrafted to ensure the highest quality and attention to detail.
              </p>
              <p className="font-body text-brown/80">
                Our goal is to bring joy and beauty into your homes and special occasions with arrangements that last as long as your memories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-beige/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-brown text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-brown/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-semibold text-brown text-center mb-2">Craftsmanship</h3>
              <p className="font-body text-brown/70 text-center">
                We take pride in the quality of our work. Each arrangement is handcrafted with precision and care to ensure exceptional quality and beauty.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-brown/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-semibold text-brown text-center mb-2">Sustainability</h3>
              <p className="font-body text-brown/70 text-center">
                Our synthetic arrangements reduce waste and provide a sustainable alternative to fresh flowers that require constant replacement.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-brown/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-semibold text-brown text-center mb-2">Creativity</h3>
              <p className="font-body text-brown/70 text-center">
                We embrace creativity and innovation in our designs, constantly exploring new ideas and pushing the boundaries of what's possible with synthetic flowers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-brown text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Priya Sharma"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-heading font-semibold text-brown mb-1">Priya Sharma</h3>
                <p className="font-body text-brown/70 mb-4">Founder & Creative Director</p>
                <p className="font-body text-brown/80">
                  With over 15 years of experience in floral design, Priya founded Bloomies with a vision to create beautiful, sustainable arrangements that last.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Rahul Patel"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-heading font-semibold text-brown mb-1">Rahul Patel</h3>
                <p className="font-body text-brown/70 mb-4">Head of Operations</p>
                <p className="font-body text-brown/80">
                  Rahul ensures that every Bloomies arrangement is crafted to perfection and delivered with care. His attention to detail is unmatched.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Ananya Kapoor"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-heading font-semibold text-brown mb-1">Ananya Kapoor</h3>
                <p className="font-body text-brown/70 mb-4">Lead Designer</p>
                <p className="font-body text-brown/80">
                  Ananya brings creativity and innovation to our designs. Her background in fine arts and passion for flowers creates truly unique arrangements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-16 bg-beige/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-brown text-center mb-12">Our Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brown text-cream rounded-full flex items-center justify-center mb-4 mx-auto text-xl font-bold">1</div>
              <h3 className="text-xl font-heading font-semibold text-brown mb-2">Design</h3>
              <p className="font-body text-brown/70">
                Our designers create beautiful arrangements inspired by nature, trends, and customer preferences.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-brown text-cream rounded-full flex items-center justify-center mb-4 mx-auto text-xl font-bold">2</div>
              <h3 className="text-xl font-heading font-semibold text-brown mb-2">Selection</h3>
              <p className="font-body text-brown/70">
                We carefully select premium synthetic materials that look and feel like real flowers.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-brown text-cream rounded-full flex items-center justify-center mb-4 mx-auto text-xl font-bold">3</div>
              <h3 className="text-xl font-heading font-semibold text-brown mb-2">Crafting</h3>
              <p className="font-body text-brown/70">
                Each arrangement is handcrafted with precision and attention to detail by our skilled artisans.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-brown text-cream rounded-full flex items-center justify-center mb-4 mx-auto text-xl font-bold">4</div>
              <h3 className="text-xl font-heading font-semibold text-brown mb-2">Delivery</h3>
              <p className="font-body text-brown/70">
                We carefully package and deliver your arrangement to ensure it arrives in perfect condition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-beige p-8 md:p-12 text-center">
            <h2 className="text-3xl font-heading font-bold text-brown mb-4">Ready to Experience Bloomies?</h2>
            <p className="text-lg font-body text-brown/80 mb-8 max-w-2xl mx-auto">
              Explore our collection of handcrafted synthetic floral arrangements or create your own custom bouquet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop" className="px-6 py-3 bg-brown text-cream hover:bg-opacity-90 transition-colors">
                Shop Collection
              </Link>
              <Link href="/custom" className="px-6 py-3 border border-brown text-brown hover:bg-brown/10 transition-colors">
                Create Custom Bouquet
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
