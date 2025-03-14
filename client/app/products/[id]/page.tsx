import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import VirtualTryOn from '@/components/products/VirtualTryOn';
import ProductReviews from '@/components/products/ProductReviews';
import RelatedProducts from '@/components/products/RelatedProducts';
import ProductDetails from '@/components/products/ProductDetails';

export const generateMetadata = ({ params }: { params: { id: string } }): Metadata => {
  // In a real app, fetch the product data based on the ID
  const product = getProductById(parseInt(params.id));

  return {
    title: `${product.name} | ThriftX`,
    description: product.description,
    openGraph: {
      images: [{ url: product.images[0], width: 1200, height: 630, alt: product.name }],
    },
  };
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  // In a real app, fetch the product data based on the ID
  const product = getProductById(parseInt(params.id));

  return (
    <main className="pt-24 pb-16">
      <div className="container-custom">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-primary-600">Products</Link>
            <span className="mx-2">/</span>
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-primary-600">
              {product.category.name}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div>
            <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
              <Image 
                src={product.images[0]} 
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(1).map((image, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden cursor-pointer">
                  <Image 
                    src={image} 
                    alt={`${product.name} - Image ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6">
              <Link 
                href={`/vendors/${product.vendor.slug}`} 
                className="text-primary-600 hover:underline"
              >
                {product.vendor.name}
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-accent-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center">
                  <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="ml-3 text-lg text-gray-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="ml-3 bg-primary-100 text-primary-800 text-sm font-medium px-2 py-1 rounded">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% Off
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Free shipping on orders over $50
                </p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="font-semibold text-lg mb-2">Description</h2>
                <p className="text-gray-700">{product.description}</p>
              </div>

              {/* Condition */}
              <div className="mb-6">
                <h2 className="font-semibold text-lg mb-2">Condition</h2>
                <p className="text-gray-700">{product.condition}</p>
                <div className="mt-2 flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary-600 h-2.5 rounded-full" 
                      style={{ width: `${product.conditionPercentage}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">{product.conditionPercentage}%</span>
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <h2 className="font-semibold text-lg mb-2">Size</h2>
                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size.value}
                      disabled={!size.available}
                      className={`py-2 border rounded-md text-center ${
                        size.available 
                          ? 'border-gray-300 hover:border-primary-500 hover:bg-primary-50' 
                          : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {size.value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="mb-8">
                <h2 className="font-semibold text-lg mb-2">Color</h2>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      className="w-10 h-10 rounded-full border-2 border-white ring-2 ring-gray-300 hover:ring-primary-500 focus:outline-none focus:ring-primary-500"
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button className="btn-primary py-3 px-8 flex-1 flex items-center justify-center gap-2">
                  <ShoppingBagIcon className="w-5 h-5" />
                  Add to Cart
                </button>
                <button className="btn-outline py-3 px-8 flex items-center justify-center gap-2">
                  <HeartIcon className="w-5 h-5" />
                  Add to Wishlist
                </button>
              </div>

              {/* Virtual Try-On Button */}
              <button className="w-full btn-secondary py-3 flex items-center justify-center gap-2 mb-8">
                <CameraIcon className="w-5 h-5" />
                Try it On Virtually
              </button>

              {/* Shipping & Returns */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-start gap-4 mb-4">
                  <TruckIcon className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium">Free Shipping</h3>
                    <p className="text-sm text-gray-600">
                      Free standard shipping on orders over $50. Estimated delivery: 3-5 business days.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <RefreshIcon className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium">Easy Returns</h3>
                    <p className="text-sm text-gray-600">
                      Not the right fit? Return within 30 days for a full refund.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Virtual Try-On Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Virtual Try-On</h2>
          <VirtualTryOn product={product} />
        </div>

        {/* Product Details Tabs */}
        <div className="mb-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button className="border-b-2 border-primary-500 py-4 px-1 text-primary-600 font-medium">
                Details
              </button>
              <button className="border-b-2 border-transparent py-4 px-1 text-gray-500 hover:text-gray-700 font-medium">
                Reviews ({product.reviewCount})
              </button>
              <button className="border-b-2 border-transparent py-4 px-1 text-gray-500 hover:text-gray-700 font-medium">
                Shipping & Returns
              </button>
            </nav>
          </div>
          <div className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-4">Product Details</h3>
                <ul className="space-y-3 text-gray-700">
                  {product.details.map((detail, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="w-5 h-5 text-primary-600 mr-2 mt-0.5" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">Measurements</h3>
                <table className="w-full text-sm">
                  <tbody>
                    {product.measurements.map((measurement, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                        <td className="py-2 px-4 font-medium">{measurement.name}</td>
                        <td className="py-2 px-4">{measurement.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Vendor Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">About the Vendor</h2>
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-shrink-0">
                <div className="relative w-24 h-24 rounded-full overflow-hidden">
                  <Image 
                    src={product.vendor.avatar} 
                    alt={product.vendor.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">{product.vendor.name}</h3>
                    <p className="text-gray-600">{product.vendor.location}</p>
                    <div className="flex items-center mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(product.vendor.rating) ? 'text-accent-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {product.vendor.rating} ({product.vendor.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                  <Link href={`/vendors/${product.vendor.slug}`} className="btn-outline">
                    View Profile
                  </Link>
                </div>
                <p className="mt-4 text-gray-700">{product.vendor.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <ProductReviews productId={parseInt(params.id)} />
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <RelatedProducts productId={parseInt(params.id)} />
        </div>
      </div>
    </main>
  );
}

// Mock function to get product by ID
function getProductById(id: number) {
  return {
    id,
    name: 'Vintage Levi\'s Denim Jacket',
    description: 'Authentic vintage Levi\'s denim jacket from the 1970s in excellent condition. Perfect addition to any vintage collection.',
    price: 129.99,
    originalPrice: 159.99,
    rating: 4.8,
    reviewCount: 256,
    condition: 'Excellent',
    conditionPercentage: 100,
    category: {
      name: 'Jacket',
      slug: 'jacket',
    },
    images: [
      '/images/products/denim-jacket-1.jpg',
      '/images/products/denim-jacket-2.jpg',
      '/images/products/denim-jacket-3.jpg',
      '/images/products/denim-jacket-4.jpg',
      '/images/products/denim-jacket-5.jpg',
    ],
    sizes: [
      { value: 'M', available: true },
    ],
    colors: [
      { name: 'Blue', hex: '#0000FF' },
    ],
    details: [
      'Material: 100% Cotton Denim',
      'Vintage 1970s era',
      'Classic Type III trucker style',
      'Iconic red tab',
      'Button-up front',
      'Two chest pockets with button flaps',
      'Side hand pockets',
      'Button cuffs',
      'Adjustable button waist tabs',
    ],
    measurements: [
      { name: 'Chest', value: '21" (42" circumference)' },
      { name: 'Length', value: '24"' },
      { name: 'Shoulder', value: '18"' },
      { name: 'Sleeve', value: '24"' },
      { name: 'Waist', value: '20" (40" circumference)' },
    ],
    vendor: {
      id: 123,
      name: 'Vintage Treasures',
      slug: 'vintage-treasures',
      avatar: '/images/sellers/vintage-treasures.jpg',
      location: 'Portland, OR',
      description: 'Specializing in authentic vintage clothing from the 60s-90s. Each piece is hand-selected for quality and style.',
      rating: 4.8,
      reviewCount: 256,
      productCount: 78,
    },
  };
}

// Icon components
const StarIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
  </svg>
);

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

const CameraIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

const TruckIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="1" y="3" width="15" height="13"></rect>
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
    <circle cx="5.5" cy="18.5" r="2.5"></circle>
    <circle cx="18.5" cy="18.5" r="2.5"></circle>
  </svg>
);

const RefreshIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M23 4v6h-6"></path>
    <path d="M1 20v-6h6"></path>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
);

const CheckIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
); 