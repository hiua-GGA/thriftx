import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-900 to-primary-700 text-white">
        <div className="container-custom py-20 md:py-32 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Discover Unique Fashion That Tells a Story
            </h1>
            <p className="text-lg md:text-xl mb-8 text-primary-100">
              Shop sustainable, pre-loved clothing and accessories from verified vendors. 
              Give fashion a second life while expressing your unique style.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="btn-accent px-8 py-3 text-base">
                Shop Now
              </Link>
              <Link href="/vendors" className="btn bg-white text-primary-800 hover:bg-primary-50 px-8 py-3 text-base">
                Meet Our Vendors
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute right-0 top-0 w-1/2 h-full bg-pattern opacity-10"></div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our curated collections of pre-loved items, each carefully selected for quality and style.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                href={`/products?category=${category.slug}`}
                className="group relative overflow-hidden rounded-xl aspect-square"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                <div className="absolute bottom-0 left-0 p-4 z-20">
                  <h3 className="text-white text-xl font-semibold">{category.name}</h3>
                </div>
                <div className="w-full h-full relative">
                  <Image 
                    src={category.image} 
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Trending Now</h2>
              <p className="text-gray-600 max-w-2xl">
                Discover our most popular items that are flying off the shelves.
              </p>
            </div>
            <Link href="/products" className="btn-outline">
              View All
            </Link>
          </div>
          
          <div className="responsive-grid">
            {featuredProducts.map((product) => (
              <div key={product.id} className="card group">
                <div className="relative overflow-hidden rounded-lg aspect-square mb-4">
                  <Link href={`/products/${product.id}`}>
                    <Image 
                      src={product.image} 
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </Link>
                  <div className="absolute top-2 right-2 z-10">
                    <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                      <HeartIcon className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                <div>
                  <Link href={`/vendors/${product.vendorSlug}`} className="text-sm text-primary-600 hover:underline">
                    {product.vendorName}
                  </Link>
                  <h3 className="font-medium text-lg mt-1 mb-2">
                    <Link href={`/products/${product.id}`} className="hover:text-primary-600 transition-colors">
                      {product.name}
                    </Link>
                  </h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-lg">${product.price.toFixed(2)}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <button className="btn-primary p-2 rounded-full">
                      <ShoppingBagIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Virtual Try-On Banner */}
      <section className="py-16 bg-secondary-50">
        <div className="container-custom">
          <div className="bg-white rounded-2xl overflow-hidden shadow-soft">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Try Before You Buy with Our Virtual Fitting Room
                </h2>
                <p className="text-gray-600 mb-6">
                  Upload your photo and see how our items look on you before making a purchase.
                  Our AI-powered technology ensures you find the perfect fit every time.
                </p>
                <Link href="/virtual-try-on" className="btn-secondary self-start">
                  Try It Now
                </Link>
              </div>
              <div className="relative h-64 md:h-auto">
                <Image 
                  src="/images/virtual-try-on.jpg" 
                  alt="Virtual Try-On"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vendors */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Vendors</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Shop from trusted sellers who curate unique collections with passion and expertise.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredVendors.map((vendor) => (
              <Link 
                key={vendor.id} 
                href={`/vendors/${vendor.slug}`}
                className="card hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    <Image 
                      src={vendor.avatar} 
                      alt={vendor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{vendor.name}</h3>
                    <p className="text-gray-600 text-sm">{vendor.location}</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-600 line-clamp-2">{vendor.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <StarIcon className="w-5 h-5 text-accent-400" />
                    <span className="ml-1 font-medium">{vendor.rating}</span>
                    <span className="ml-1 text-gray-500">({vendor.reviewCount})</span>
                  </div>
                  <span className="text-sm text-gray-500">{vendor.productCount} products</span>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/vendors" className="btn-outline">
              View All Vendors
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. See what our community has to say about their ThriftX experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="card">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon 
                          key={i} 
                          className={`w-4 h-4 ${i < testimonial.rating ? 'text-accent-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{testimonial.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="py-16 bg-primary-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Fashion with a Conscience
              </h2>
              <p className="text-gray-700 mb-6">
                At ThriftX, we're committed to promoting sustainable fashion. By giving pre-loved items a second life, 
                we reduce waste and minimize the environmental impact of the fashion industry.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary-100 p-2 rounded-full mt-1">
                    <LeafIcon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Reduced Carbon Footprint</h3>
                    <p className="text-gray-600">
                      Each pre-loved item purchased saves approximately 6 pounds of CO2 emissions compared to buying new.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary-100 p-2 rounded-full mt-1">
                    <RecycleIcon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Less Waste</h3>
                    <p className="text-gray-600">
                      We've helped divert over 10,000 pounds of textiles from landfills in the past year alone.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary-100 p-2 rounded-full mt-1">
                    <HeartHandIcon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Supporting Communities</h3>
                    <p className="text-gray-600">
                      We partner with local charities to donate a portion of our proceeds to community initiatives.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden">
              <Image 
                src="/images/sustainability.jpg" 
                alt="Sustainable Fashion"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-white">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay in the Loop</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Subscribe to our newsletter for exclusive deals, new arrivals, and sustainable fashion tips.
            </p>
          </div>
          
          <form className="flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="input-field flex-grow py-3"
              required
            />
            <button type="submit" className="btn-primary py-3 px-8">
              Subscribe
            </button>
          </form>
          <p className="text-gray-500 text-sm mt-4 text-center">
            By subscribing, you agree to our Privacy Policy and consent to receive updates from ThriftX.
          </p>
        </div>
      </section>
    </main>
  );
}

// Placeholder data
const categories = [
  { id: 1, name: 'Clothing', slug: 'clothing', image: '/images/category-clothing.jpg' },
  { id: 2, name: 'Accessories', slug: 'accessories', image: '/images/category-accessories.jpg' },
  { id: 3, name: 'Footwear', slug: 'footwear', image: '/images/category-footwear.jpg' },
  { id: 4, name: 'Vintage', slug: 'vintage', image: '/images/category-vintage.jpg' },
];

const featuredProducts = [
  { 
    id: 1, 
    name: 'Vintage Denim Jacket', 
    price: 45.99, 
    originalPrice: 89.99, 
    image: '/images/product-1.jpg',
    vendorName: 'Retro Finds',
    vendorSlug: 'retro-finds'
  },
  { 
    id: 2, 
    name: 'Leather Crossbody Bag', 
    price: 38.50, 
    originalPrice: null, 
    image: '/images/product-2.jpg',
    vendorName: 'Urban Thrift',
    vendorSlug: 'urban-thrift'
  },
  { 
    id: 3, 
    name: 'Cashmere Sweater', 
    price: 52.99, 
    originalPrice: 120.00, 
    image: '/images/product-3.jpg',
    vendorName: 'Luxe Second Life',
    vendorSlug: 'luxe-second-life'
  },
  { 
    id: 4, 
    name: 'Vintage Silk Scarf', 
    price: 18.99, 
    originalPrice: null, 
    image: '/images/product-4.jpg',
    vendorName: 'Retro Finds',
    vendorSlug: 'retro-finds'
  },
];

const featuredVendors = [
  {
    id: 1,
    name: 'Retro Finds',
    slug: 'retro-finds',
    avatar: '/images/vendor-1.jpg',
    location: 'Portland, OR',
    description: 'Specializing in authentic vintage clothing from the 60s-90s. Each piece is hand-selected for quality and style.',
    rating: 4.8,
    reviewCount: 156,
    productCount: 78
  },
  {
    id: 2,
    name: 'Urban Thrift',
    slug: 'urban-thrift',
    avatar: '/images/vendor-2.jpg',
    location: 'Brooklyn, NY',
    description: 'Contemporary second-hand fashion with an urban edge. Curated selection of streetwear and designer pieces.',
    rating: 4.7,
    reviewCount: 203,
    productCount: 124
  },
  {
    id: 3,
    name: 'Luxe Second Life',
    slug: 'luxe-second-life',
    avatar: '/images/vendor-3.jpg',
    location: 'Miami, FL',
    description: 'Premium pre-loved designer items at a fraction of the retail price. Authenticity guaranteed.',
    rating: 4.9,
    reviewCount: 89,
    productCount: 45
  },
];

const testimonials = [
  {
    id: 1,
    name: 'Sarah J.',
    avatar: '/images/testimonial-1.jpg',
    rating: 5,
    comment: 'I found the most amazing vintage Levi's jacket on ThriftX! The quality was exactly as described, and the shipping was super fast. Will definitely be shopping here again!'
  },
  {
    id: 2,
    name: 'Michael T.',
    avatar: '/images/testimonial-2.jpg',
    rating: 4,
    comment: 'Great platform for finding unique pieces. I love that I can support small vendors while also shopping sustainably. The virtual try-on feature is a game-changer!'
  },
  {
    id: 3,
    name: 'Aisha K.',
    avatar: '/images/testimonial-3.jpg',
    rating: 5,
    comment: 'ThriftX has completely changed how I shop for clothes. The quality of items I've received has been outstanding, and I love knowing I'm reducing fashion waste.'
  },
];

// Icon components (simplified for this example)
const HeartIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const ShoppingBagIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

const StarIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
  </svg>
);

const LeafIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 22l10-10"></path>
    <path d="M16 8l-4 4"></path>
    <path d="M22 2l-5 5"></path>
    <path d="M18 12l-6 6"></path>
    <path d="M8 16l-4 4"></path>
    <path d="M12 18l-6 6"></path>
    <path d="M22 2c-2 0-6 0-9 3s-5 7-5 9c0 3 3 6 6 6 2 0 6-2 9-5s3-7 3-9c0-3-3-4-4-4z"></path>
  </svg>
);

const RecycleIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"></path>
    <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"></path>
    <path d="m14 16-3 3 3 3"></path>
    <path d="M8.293 13.596 4.875 9.5l3.418-4.096"></path>
    <path d="m7.79 9.5 9.275 .014"></path>
    <path d="m12.143 5.5 7.935-.001a1.83 1.83 0 0 1 1.556.89 1.784 1.784 0 0 1 0 1.775l-4.668 8.085"></path>
    <path d="m16.158 10.5-2.158-5 2.158-5"></path>
  </svg>
);

const HeartHandIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
    <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"></path>
    <path d="m18 15-2-2"></path>
    <path d="m15 18-2-2"></path>
  </svg>
); 