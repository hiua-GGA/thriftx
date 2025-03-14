import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/products/ProductCard';
import SearchFilters from '@/components/products/SearchFilters';

export const metadata: Metadata = {
  title: 'Products | ThriftX',
  description: 'Browse our collection of pre-loved clothing, accessories, and more. Filter by category, price, and condition to find your perfect match.',
};

export default function ProductsPage() {
  return (
    <main className="pt-24 pb-16">
      <div className="container-custom">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Browse Products</h1>
          <div className="flex flex-wrap items-center text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Products</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters - Desktop */}
          <div className="hidden lg:block">
            <SearchFilters />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Mobile Search and Filters */}
            <div className="lg:hidden mb-6">
              <SearchFilters isMobile />
            </div>

            {/* Sort and View Options */}
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium text-gray-900">1-24</span> of <span className="font-medium text-gray-900">256</span> products
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <label htmlFor="sort" className="text-sm text-gray-700 mr-2">Sort by:</label>
                  <select 
                    id="sort" 
                    className="text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-md bg-primary-50 text-primary-600">
                    <GridIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-md text-gray-400 hover:bg-gray-100">
                    <ListIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                <span className="mr-2">Category: Clothing</span>
                <button className="text-gray-500 hover:text-gray-700">
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                <span className="mr-2">Price: $25-$100</span>
                <button className="text-gray-500 hover:text-gray-700">
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                <span className="mr-2">Size: M</span>
                <button className="text-gray-500 hover:text-gray-700">
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
              <button className="text-primary-600 text-sm hover:underline">
                Clear All
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center gap-1">
                <button className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50">
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-md bg-primary-600 text-white flex items-center justify-center">
                  1
                </button>
                <button className="w-10 h-10 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center">
                  2
                </button>
                <button className="w-10 h-10 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center">
                  3
                </button>
                <span className="w-10 h-10 flex items-center justify-center text-gray-500">...</span>
                <button className="w-10 h-10 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center">
                  12
                </button>
                <button className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50">
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Sample product data
const products = [
  {
    id: 1,
    name: 'Vintage Denim Jacket',
    price: 45.99,
    originalPrice: 89.99,
    image: '/images/product-1.jpg',
    vendorName: 'Retro Finds',
    vendorSlug: 'retro-finds',
    rating: 4.5,
    reviewCount: 28,
    isNew: true,
  },
  {
    id: 2,
    name: 'Leather Crossbody Bag',
    price: 38.50,
    originalPrice: null,
    image: '/images/product-2.jpg',
    vendorName: 'Urban Thrift',
    vendorSlug: 'urban-thrift',
    rating: 4.2,
    reviewCount: 15,
    isNew: false,
  },
  {
    id: 3,
    name: 'Cashmere Sweater',
    price: 52.99,
    originalPrice: 120.00,
    image: '/images/product-3.jpg',
    vendorName: 'Luxe Second Life',
    vendorSlug: 'luxe-second-life',
    rating: 4.8,
    reviewCount: 42,
    isNew: false,
  },
  {
    id: 4,
    name: 'Vintage Silk Scarf',
    price: 18.99,
    originalPrice: null,
    image: '/images/product-4.jpg',
    vendorName: 'Retro Finds',
    vendorSlug: 'retro-finds',
    rating: 4.0,
    reviewCount: 12,
    isNew: true,
  },
  {
    id: 5,
    name: 'Classic Leather Belt',
    price: 24.99,
    originalPrice: 45.00,
    image: '/images/product-5.jpg',
    vendorName: 'Urban Thrift',
    vendorSlug: 'urban-thrift',
    rating: 4.3,
    reviewCount: 19,
    isNew: false,
  },
  {
    id: 6,
    name: 'Wool Peacoat',
    price: 89.99,
    originalPrice: 199.99,
    image: '/images/product-6.jpg',
    vendorName: 'Luxe Second Life',
    vendorSlug: 'luxe-second-life',
    rating: 4.7,
    reviewCount: 31,
    isNew: true,
  },
];

// Icon components
const GridIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const ListIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

const XIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ChevronLeftIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRightIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
); 