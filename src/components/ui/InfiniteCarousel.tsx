import React from 'react';

interface Testimonial {
  id: number;
  text: string;
  author: string;
  role: string;
  initial: string;
}

interface InfiniteCarouselProps {
  items: Testimonial[];
  speed?: number; // seconds for one complete cycle
  gap?: number; // gap between items in pixels
  direction?: 'left' | 'right';
}

const InfiniteCarousel: React.FC<InfiniteCarouselProps> = ({
  items,
  speed = 30,
  gap = 24,
  direction = 'left'
}) => {
  // Double the items to create a seamless loop
  const allItems = [...items, ...items];

  return (
    <div className="relative overflow-hidden w-full">
      <div className="carousel-container">
        <div
          className="flex animate-carousel"
          style={{
            animationDuration: `${speed}s`,
            animationDirection: direction === 'left' ? 'normal' : 'reverse',
            gap: `${gap}px`,
            width: 'fit-content'
          }}
        >
          {/* First set of items */}
          {items.map((item, index) => (
            <div
              key={`original-${item.id}-${index}`}
              className="carousel-item flex-shrink-0 w-[350px] md:w-[400px]"
            >
              <TestimonialCard testimonial={item} />
            </div>
          ))}

          {/* Duplicated set for seamless looping */}
          {items.map((item, index) => (
            <div
              key={`clone-${item.id}-${index}`}
              className="carousel-item flex-shrink-0 w-[350px] md:w-[400px]"
            >
              <TestimonialCard testimonial={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Testimonial Card Component
const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => {
  return (
    <div className="bg-white p-8 shadow-card hover:shadow-elegant transition-shadow duration-300 h-full">
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
        <div className="h-10 w-10 rounded-full bg-beige-dark flex items-center justify-center text-brown font-heading font-semibold text-lg">
          {testimonial.initial}
        </div>
        <div className="ml-3">
          <div className="font-medium text-brown font-heading">{testimonial.author}</div>
          <div className="text-xs text-brown-dark font-body">{testimonial.role}</div>
        </div>
      </div>
    </div>
  );
};

export default InfiniteCarousel;
