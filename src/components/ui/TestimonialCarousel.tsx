import React, { useState, useEffect, useRef } from 'react';

interface Testimonial {
  id: number;
  text: string;
  author: string;
  role: string;
  initial: string;
}

const testimonials: Testimonial[] = [
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

// Create a duplicate array for smooth infinite scrolling
const extendedTestimonials = [...testimonials, ...testimonials];

const TestimonialCarousel: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const itemsPerView = 3;
  const totalSlides = testimonials.length;

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      moveToNextSlide();
    }, 3000); // Change every 3 seconds for faster rotation

    return () => clearInterval(interval);
  }, [activeIndex]);

  const moveToNextSlide = () => {
    setIsTransitioning(true);
    const nextIndex = (activeIndex + 1) % totalSlides;
    setActiveIndex(nextIndex);
  };

  const handleDotClick = (index: number) => {
    if (index !== activeIndex) {
      setIsTransitioning(true);
      setActiveIndex(index);
    }
  };

  // Calculate which testimonials to show
  const getVisibleTestimonials = () => {
    // Create a window of testimonials that includes the active index and wraps around
    const result = [];
    for (let i = 0; i < itemsPerView; i++) {
      const index = (activeIndex + i) % extendedTestimonials.length;
      result.push(extendedTestimonials[index]);
    }
    return result;
  };

  const visibleTestimonials = getVisibleTestimonials();

  return (
    <div className="relative overflow-hidden">
      {/* Carousel container */}
      <div
        ref={carouselRef}
        className="relative"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {visibleTestimonials.map((testimonial, index) => (
            <div
              key={`${testimonial.id}-${index}`}
              className={`bg-white p-8 shadow-card hover:shadow-elegant transition-all duration-300 transform hover:-translate-y-1 card-hover ${
                isTransitioning ? 'animate-slide-in' : ''
              }`}
              onAnimationEnd={() => {
                if (index === itemsPerView - 1) {
                  setIsTransitioning(false);
                }
              }}
            >
              <div className="flex items-center mb-6">
                <div className="text-yellow-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <svg className="h-8 w-8 text-beige mb-4 opacity-50" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              <p className="text-brown-dark mb-6 font-body leading-relaxed">
                "{testimonial.text}"
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 bg-beige-dark flex items-center justify-center text-brown font-heading font-semibold text-lg">
                  {testimonial.initial}
                </div>
                <div className="ml-3">
                  <div className="font-medium text-brown font-heading">{testimonial.author}</div>
                  <div className="text-xs text-brown-dark font-body">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center mt-8 space-x-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 transition-all duration-300 ${
              activeIndex === index ? 'bg-brown' : 'bg-beige-dark'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialCarousel;
