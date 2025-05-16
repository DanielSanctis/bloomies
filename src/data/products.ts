// Product data with local images
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  image2?: string; // Second image for hover effect
  description?: string;
  salePercentage?: number;
  oldPrice?: number;
  type?: string;
  flowerType?: string;
  size?: string;
  categories?: {
    occasion?: string;
    fandom?: string;
  };
  details?: string[];
  relatedProducts?: string[];
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Large Satin Ribbon Rose Bouquet',
    price: 1499,
    oldPrice: 1899,
    salePercentage: 21,
    image: '/images/Large Satin Ribbon Rose Bouquet.jpg',
    image2: '/images/Large Satin Ribbon Rose Bouquet.jpg',
    description: 'A stunning large bouquet featuring elegant satin ribbon roses that captures the essence of romance and elegance. The luxurious satin ribbon material creates a sophisticated look that lasts forever. Perfect for anniversaries, Valentine\'s Day, or any romantic occasion.',
    details: [
      'Contains 24 premium satin ribbon roses',
      'Large size perfect for making a statement',
      'Available in red, pink, or white',
      'Arrangement height: 16 inches',
      'Includes decorative vase',
      'Long-lasting and maintenance-free'
    ],
    categories: {
      occasion: 'romance',
      fandom: '',
    },
    type: 'bouquet',
    flowerType: 'satin ribbon',
    size: 'large',
    relatedProducts: ['2', '3', '7']
  },
  {
    id: '2',
    name: 'Small Pipe Cleaner Celebration Bouquet',
    price: 1899,
    image: '/images/Small Pipe Cleaner Celebration Bouquet.jpg',
    image2: '/images/Small Pipe Cleaner Celebration Bouquet.jpg',
    description: 'A vibrant and joyful small bouquet crafted with colorful pipe cleaner flowers. The unique pipe cleaner material creates fun, textured blooms that add a playful touch to your celebration. Perfect for birthdays, graduations, promotions, or any festive occasion.',
    details: [
      'Contains a variety of colorful pipe cleaner flowers',
      'Small size perfect for desks or small spaces',
      'Arrangement height: 10 inches',
      'Includes decorative ribbon',
      'Bendable and posable flowers',
      'Long-lasting and maintenance-free'
    ],
    categories: {
      occasion: 'celebrations',
      fandom: '',
    },
    type: 'bouquet',
    flowerType: 'pipe cleaner',
    size: 'small',
    relatedProducts: ['1', '4', '8']
  },
  {
    id: '3',
    name: 'Fantasy Realm Pipe Cleaner Single Flower',
    price: 2299,
    image: '/images/Fantasy Realm Pipe Cleaner Single Flower.jpg',
    image2: '/images/Fantasy Realm Pipe Cleaner Single Flower.jpg',
    description: 'A magical single flower inspired by fantasy realms, crafted with intricate pipe cleaner details. This unique piece features vibrant colors and whimsical design elements that transport you to enchanted worlds. Perfect for fantasy enthusiasts and collectors.',
    details: [
      'Handcrafted fantasy-inspired single flower',
      'Intricate pipe cleaner detailing',
      'Height: 12 inches',
      'Includes decorative stand',
      'Vibrant, magical colors',
      'Long-lasting keepsake'
    ],
    categories: {
      occasion: '',
      fandom: 'fantasy',
    },
    type: 'single flower',
    flowerType: 'pipe cleaner',
    relatedProducts: ['5', '8', '6']
  },
  {
    id: '4',
    name: 'Large Satin Ribbon Sympathy Bouquet',
    price: 1699,
    image: '/images/Large Satin Ribbon Sympathy Bouquet.jpg',
    image2: '/images/Large Satin Ribbon Sympathy Bouquet.jpg',
    description: 'A tasteful and elegant large bouquet designed to express sympathy and support. Crafted with delicate satin ribbon flowers in soft, comforting colors, this arrangement offers lasting comfort during difficult times. The premium satin ribbon material creates a refined, respectful tribute.',
    details: [
      'Contains white satin ribbon lilies and subtle accent flowers',
      'Large size suitable for services and memorials',
      'Arrangement height: 18 inches',
      'Includes decorative urn-style pot',
      'Elegant satin ribbon craftsmanship',
      'Long-lasting keepsake'
    ],
    categories: {
      occasion: 'sympathy',
      fandom: '',
    },
    type: 'bouquet',
    flowerType: 'satin ribbon',
    size: 'large',
    relatedProducts: ['1', '7', '6']
  },
  {
    id: '5',
    name: 'Small Pipe Cleaner Superhero Bouquet',
    price: 2499,
    image: '/images/Small Pipe Cleaner Superhero Bouquet.jpg',
    image2: '/images/Small Pipe Cleaner Superhero Bouquet.jpg',
    description: 'A dynamic and colorful bouquet inspired by popular superhero themes. This arrangement features pipe cleaner flowers in bold, iconic colors that celebrate heroic adventures. Perfect for comic book fans, movie enthusiasts, or anyone who appreciates superhero culture.',
    details: [
      'Features flowers in classic superhero color schemes',
      'Small size perfect for display shelves',
      'Arrangement height: 10 inches',
      'Includes themed decorative elements',
      'Bendable and posable flowers',
      'Long-lasting collectible'
    ],
    categories: {
      occasion: '',
      fandom: 'superheroes',
    },
    type: 'bouquet',
    flowerType: 'pipe cleaner',
    size: 'small',
    relatedProducts: ['3', '6', '8']
  },
  {
    id: '6',
    name: 'Large Satin Ribbon Wedding Bouquet',
    price: 1999,
    image: '/images/Large Satin Ribbon Wedding Bouquet.jpg',
    image2: '/images/Large Satin Ribbon Wedding Bouquet.jpg',
    description: 'An exquisite large bouquet designed specifically for weddings and bridal occasions. Crafted with premium satin ribbon flowers in classic white and ivory tones, this elegant arrangement creates a timeless bridal look that will never wilt or fade. Perfect for preserving wedding memories forever.',
    details: [
      'Contains white and ivory satin ribbon roses and lilies',
      'Large size perfect for bridal bouquets',
      'Arrangement height: 14 inches',
      'Includes decorative ribbon wrap and pearl accents',
      'Premium satin ribbon craftsmanship',
      'Everlasting wedding keepsake'
    ],
    categories: {
      occasion: 'wedding',
      fandom: '',
    },
    type: 'bouquet',
    flowerType: 'satin ribbon',
    size: 'large',
    relatedProducts: ['1', '4', '7']
  },
  {
    id: '7',
    name: 'Small Pipe Cleaner Thank You Bouquet',
    price: 1799,
    image: '/images/Small Pipe Cleaner Thank You Bouquet.jpg',
    image2: '/images/Small Pipe Cleaner Thank You Bouquet.jpg',
    description: 'A charming small bouquet designed to express gratitude and appreciation. Crafted with colorful pipe cleaner flowers in cheerful hues, this arrangement conveys heartfelt thanks in a lasting, meaningful way. Perfect for teacher appreciation, thank you gifts, or showing gratitude to someone special.',
    details: [
      'Features a variety of cheerful pipe cleaner flowers',
      'Small size perfect for gifting',
      'Arrangement height: 8 inches',
      'Includes "Thank You" decorative tag',
      'Bright, uplifting colors',
      'Long-lasting token of appreciation'
    ],
    categories: {
      occasion: 'thanks',
      fandom: '',
    },
    type: 'bouquet',
    flowerType: 'pipe cleaner',
    size: 'small',
    relatedProducts: ['2', '6', '1']
  },
  {
    id: '8',
    name: 'Anime Inspired Pipe Cleaner Single Flower',
    price: 1899,
    image: '/images/Anime Inspired Pipe Cleaner Single Flower.jpg',
    image2: '/images/Anime Inspired Pipe Cleaner Single Flower.jpg',
    description: 'A unique single flower inspired by popular anime aesthetics. This intricate pipe cleaner creation captures the vibrant colors and distinctive style of Japanese animation. Perfect for anime enthusiasts, collectors, or as a special gift for fans of the genre.',
    details: [
      'Handcrafted anime-inspired single flower',
      'Intricate pipe cleaner detailing',
      'Height: 10 inches',
      'Includes decorative stand',
      'Vibrant anime-inspired colors',
      'Long-lasting collectible'
    ],
    categories: {
      occasion: '',
      fandom: 'anime',
    },
    type: 'single flower',
    flowerType: 'pipe cleaner',
    relatedProducts: ['3', '5', '6']
  },
  {
    id: '9',
    name: 'Single Red Rose',
    price: 350,
    image: '/images/Single Red Rose.jpg',
    image2: '/images/Single Red Rose.jpg',
    description: 'A classic single red rose crafted with pipe cleaner for everlasting beauty. This timeless symbol of love and affection will never wilt or fade. Perfect for Valentine\'s Day, anniversaries, or as a simple expression of love.',
    details: [
      'Handcrafted single red rose',
      'Pipe cleaner construction',
      'Height: 12 inches',
      'Includes decorative stem with leaves',
      'Classic romantic symbol',
      'Long-lasting keepsake'
    ],
    categories: {
      occasion: 'valentine',
      fandom: '',
    },
    type: 'single flower',
    flowerType: 'pipe cleaner',
    size: 'small',
    relatedProducts: ['1', '3', '7']
  },
  {
    id: '10',
    name: 'Sunflower Arrangement',
    price: 1500,
    image: '/images/Sunflower Arrangement.jpg',
    image2: '/images/Sunflower Arrangement.jpg',
    description: 'A bright and cheerful arrangement featuring handcrafted satin ribbon sunflowers. This vibrant bouquet brings the warmth and joy of sunflowers into any space, with the added benefit of lasting forever. Perfect for birthdays, housewarmings, or adding a touch of sunshine to any room.',
    details: [
      'Contains multiple satin ribbon sunflowers',
      'Large size for maximum impact',
      'Arrangement height: 16 inches',
      'Includes decorative vase',
      'Premium satin ribbon craftsmanship',
      'Everlasting sunshine for your home'
    ],
    categories: {
      occasion: 'birthday',
      fandom: '',
    },
    type: 'bouquet',
    flowerType: 'satin ribbon',
    size: 'large',
    relatedProducts: ['1', '6', '7']
  },
  {
    id: '11',
    name: 'Classic Rose Bouquet',
    price: 1200,
    image: '/images/Classic Rose Bouquet.jpg',
    image2: '/images/Classic Rose Bouquet.jpg',
    description: 'A timeless arrangement of classic roses crafted with pipe cleaners for lasting beauty. This elegant bouquet features the perfect blend of traditional design with modern durability. Perfect for anniversaries, special occasions, or as a meaningful gift that will never fade.',
    details: [
      'Contains 12 handcrafted pipe cleaner roses',
      'Classic design with modern durability',
      'Arrangement height: 14 inches',
      'Includes decorative vase',
      'Available in red, pink, or mixed colors',
      'Everlasting beauty'
    ],
    categories: {
      occasion: 'anniversary',
      fandom: '',
    },
    type: 'bouquet',
    flowerType: 'pipe cleaner',
    size: 'large',
    relatedProducts: ['1', '6', '9']
  },
  {
    id: '12',
    name: 'Sci-Fi Collection',
    price: 2500,
    image: '/images/Sci-Fi Collection.jpg',
    image2: '/images/Sci-Fi Collection.jpg',
    description: 'An out-of-this-world arrangement inspired by science fiction themes. This unique bouquet features satin ribbon flowers with cosmic colors and futuristic design elements. Perfect for sci-fi enthusiasts, space lovers, or as a conversation-starting decorative piece.',
    details: [
      'Features space-inspired satin ribbon flowers',
      'Large statement piece',
      'Arrangement height: 18 inches',
      'Includes themed decorative elements',
      'Cosmic color palette',
      'Long-lasting collectible'
    ],
    categories: {
      occasion: '',
      fandom: 'sci-fi',
    },
    type: 'bouquet',
    flowerType: 'satin ribbon',
    size: 'large',
    relatedProducts: ['3', '5', '8']
  },
  {
    id: '13',
    name: 'Anime Inspired Arrangement',
    price: 1800,
    image: '/images/Anime Inspired Arrangement.jpg',
    image2: '/images/Anime Inspired Arrangement.jpg',
    description: 'A vibrant bouquet inspired by popular anime aesthetics. This arrangement features pipe cleaner flowers in bright, distinctive colors that capture the energy and style of Japanese animation. Perfect for anime fans, collectors, or as a unique decorative piece.',
    details: [
      'Features anime-inspired pipe cleaner flowers',
      'Small size perfect for display shelves',
      'Arrangement height: 12 inches',
      'Includes themed decorative elements',
      'Vibrant anime color palette',
      'Long-lasting collectible'
    ],
    categories: {
      occasion: '',
      fandom: 'anime',
    },
    type: 'bouquet',
    flowerType: 'pipe cleaner',
    size: 'small',
    relatedProducts: ['8', '5', '3']
  },
  {
    id: '14',
    name: 'Fantasy Realm Arrangement',
    price: 2299,
    image: '/images/Fantasy Realm Arrangement.jpg',
    image2: '/images/Fantasy Realm Arrangement.jpg',
    description: 'A magical bouquet inspired by fantasy worlds and enchanted realms. This arrangement features a collection of whimsical flowers crafted with intricate details and mystical elements. Perfect for fantasy enthusiasts, collectors, or as a unique decorative piece.',
    details: [
      'Features fantasy-inspired flowers and elements',
      'Medium size for versatile display',
      'Arrangement height: 14 inches',
      'Includes themed decorative accents',
      'Magical color palette',
      'Long-lasting collectible'
    ],
    categories: {
      occasion: '',
      fandom: 'fantasy',
    },
    type: 'bouquet',
    flowerType: 'mixed',
    size: 'medium',
    relatedProducts: ['3', '5', '12']
  },
  {
    id: '15',
    name: 'Elegant Rose Bouquet',
    price: 1499,
    image: '/images/Elegant Rose Bouquet.jpg',
    image2: '/images/Elegant Rose Bouquet.jpg',
    description: 'A sophisticated arrangement of elegant roses crafted with premium materials. This timeless bouquet combines classic beauty with modern durability for a lasting impression. Perfect for special occasions, gifts, or adding a touch of elegance to any space.',
    details: [
      'Contains 18 handcrafted elegant roses',
      'Sophisticated design',
      'Arrangement height: 16 inches',
      'Includes decorative vase',
      'Premium craftsmanship',
      'Everlasting elegance'
    ],
    categories: {
      occasion: 'romance',
      fandom: '',
    },
    type: 'bouquet',
    flowerType: 'mixed',
    size: 'large',
    relatedProducts: ['1', '11', '6']
  },
  {
    id: '16',
    name: 'Celebration Bouquet',
    price: 1499,
    image: '/images/Celebration Bouquet.jpg',
    image2: '/images/Celebration Bouquet.jpg',
    description: 'A festive and colorful arrangement designed to celebrate special moments. This vibrant bouquet features a mix of cheerful flowers in bright, uplifting colors. Perfect for birthdays, graduations, promotions, or any joyful occasion worth commemorating.',
    details: [
      'Features a variety of celebratory flowers',
      'Medium size for versatile display',
      'Arrangement height: 14 inches',
      'Includes festive decorative elements',
      'Bright, joyful color palette',
      'Long-lasting memento'
    ],
    categories: {
      occasion: 'celebrations',
      fandom: '',
    },
    type: 'bouquet',
    flowerType: 'mixed',
    size: 'medium',
    relatedProducts: ['2', '7', '10']
  },
  {
    id: '17',
    name: 'Autumn Harvest',
    price: 1799,
    image: '/images/Autumn Harvest.jpg',
    image2: '/images/Autumn Harvest.jpg',
    description: 'A warm and inviting arrangement inspired by the colors of fall. This seasonal bouquet features flowers in rich autumn hues of orange, red, and gold. Perfect for fall decorating, Thanksgiving, or adding a cozy touch to any space.',
    details: [
      'Features autumn-inspired flowers',
      'Medium size for versatile display',
      'Arrangement height: 14 inches',
      'Includes seasonal decorative elements',
      'Warm autumn color palette',
      'Long-lasting seasonal decor'
    ],
    categories: {
      occasion: 'seasonal',
      fandom: '',
    },
    type: 'bouquet',
    flowerType: 'mixed',
    size: 'medium',
    relatedProducts: ['10', '4', '7']
  },
  {
    id: '18',
    name: 'Superhero Inspired Bouquet',
    price: 2499,
    image: '/images/Superhero Inspired Bouquet.jpg',
    image2: '/images/Superhero Inspired Bouquet.jpg',
    description: 'A bold and dynamic arrangement inspired by iconic superhero themes. This unique bouquet features flowers in classic superhero colors with special themed elements. Perfect for comic book fans, movie enthusiasts, or adding a touch of heroic flair to any space.',
    details: [
      'Features superhero-themed flowers and elements',
      'Medium size for versatile display',
      'Arrangement height: 14 inches',
      'Includes themed decorative accents',
      'Bold superhero color palette',
      'Long-lasting collectible'
    ],
    categories: {
      occasion: '',
      fandom: 'superheroes',
    },
    type: 'bouquet',
    flowerType: 'mixed',
    size: 'medium',
    relatedProducts: ['5', '12', '13']
  },
  {
    id: '19',
    name: 'Cute Critters Arrangement',
    price: 1899,
    image: '/images/Cute Critters Arrangement.jpg',
    image2: '/images/Cute Critters Arrangement.jpg',
    description: 'A charming arrangement featuring adorable animal-inspired elements. This whimsical bouquet combines cute critter designs with colorful flowers for a playful, heartwarming display. Perfect for children\'s rooms, animal lovers, or adding a touch of fun to any space.',
    details: [
      'Features animal-inspired elements and flowers',
      'Small size perfect for children\'s spaces',
      'Arrangement height: 12 inches',
      'Includes cute critter decorative accents',
      'Playful, cheerful color palette',
      'Long-lasting keepsake'
    ],
    categories: {
      occasion: '',
      fandom: 'animals',
    },
    type: 'bouquet',
    flowerType: 'mixed',
    size: 'small',
    relatedProducts: ['8', '13', '5']
  },
  {
    id: '20',
    name: 'Gaming Inspired Collection',
    price: 2399,
    image: '/images/Fantasy Realm Bouquet.jpg', // Using Fantasy Realm Bouquet as a substitute since we don't have a Gaming Inspired Collection image
    image2: '/images/Fantasy Realm Bouquet.jpg',
    description: 'A unique arrangement inspired by video game aesthetics and themes. This creative bouquet features pixel-style flowers and gaming-inspired elements for a truly distinctive display. Perfect for gamers, streamers, or adding a touch of digital creativity to any space.',
    details: [
      'Features gaming-inspired flowers and elements',
      'Medium size for versatile display',
      'Arrangement height: 14 inches',
      'Includes themed decorative accents',
      'Vibrant gaming-inspired color palette',
      'Long-lasting collectible'
    ],
    categories: {
      occasion: '',
      fandom: 'gaming',
    },
    type: 'bouquet',
    flowerType: 'mixed',
    size: 'medium',
    relatedProducts: ['5', '12', '13']
  },
  {
    id: '21',
    name: 'Sunflower Bouquet',
    price: 329,
    oldPrice: 459,
    salePercentage: 28,
    image: '/images/Sunflower Arrangement.jpg',
    image2: '/images/Sunflower Arrangement.jpg',
    description: 'This Sunflower Bouquet is handcrafted with high quality yarn, featuring 1 sunflower with 2 green leaves and a white ribbon bow. Its premium bouquet packing ensures a beautiful display while the net quantity of 1 bouquet measures 12 inches. Made in India.',
    details: [
      'Contains 1 handcrafted sunflower',
      'Features 2 green leaves and white ribbon bow',
      'Arrangement height: 12 inches',
      'Premium bouquet packing',
      'Handcrafted with high quality yarn',
      'Made in India'
    ],
    categories: {
      occasion: 'birthday',
      fandom: '',
    },
    type: 'bouquet',
    flowerType: 'satin ribbon',
    size: 'small',
    relatedProducts: ['10', '16', '17']
  }
];

// Export a function to get a product by ID
export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

// Export a function to get related products
export const getRelatedProducts = (productId: string): Product[] => {
  const product = getProductById(productId);
  if (!product || !product.relatedProducts) return [];

  return product.relatedProducts
    .map(id => getProductById(id))
    .filter((p): p is Product => p !== undefined);
};
