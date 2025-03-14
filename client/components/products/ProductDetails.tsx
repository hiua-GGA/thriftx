'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Tab } from '@headlessui/react';
import VirtualTryOn from './VirtualTryOn';
import SizeGuide from './SizeGuide';
import ProductReviews from './ProductReviews';

interface ProductDetailsProps {
  product: {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    description: string;
    images: string[];
    category: string;
    condition: string;
    brand: string;
    size: string;
    color: string;
    material: string;
    era: string;
    seller: {
      id: number;
      name: string;
      avatar: string;
      rating: number;
      reviewCount: number;
      isVerified: boolean;
    };
    tags: string[];
    inStock: boolean;
    measurements?: {
      [key: string]: string;
    };
  };
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;
  
  const handleAddToCart = () => {
    // In a real app, this would dispatch to a cart state manager
    console.log('Added to cart:', { ...product, quantity });
    // Show toast notification
  };
  
  const handleBuyNow = () => {
    // Add to cart and redirect to checkout
    handleAddToCart();
    // In a real app, redirect to checkout
    console.log('Buy now clicked');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
            <Image 
              src={product.images[selectedImage]} 
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.originalPrice && (
              <div className="absolute top-4 left-4 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {discountPercentage}% OFF
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`relative aspect-square rounded-md overflow-hidden border-2 ${
                  selectedImage === index ? 'border-primary-600' : 'border-transparent'
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <Image 
                  src={image} 
                  alt={`${product.name} - view ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div>
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <Link href={`/category/${product.category.toLowerCase()}`} className="text-sm text-primary-600 hover:underline">
                {product.category}
              </Link>
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-sm text-gray-500">{product.condition}</span>
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            <div className="flex items-baseline mb-4">
              <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="ml-2 text-lg text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>
            
            {/* Seller Info */}
            <div className="flex items-center mb-6">
              <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                <Image 
                  src={product.seller.avatar} 
                  alt={product.seller.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center">
                  <span className="font-medium">{product.seller.name}</span>
                  {product.seller.isVerified && (
                    <VerifiedIcon className="w-4 h-4 text-primary-600 ml-1" />
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="flex mr-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon 
                        key={i} 
                        className={`w-3.5 h-3.5 ${i < Math.floor(product.seller.rating) ? 'text-accent-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span>({product.seller.reviewCount})</span>
                </div>
              </div>
            </div>
            
            {/* Product Attributes */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Brand</h3>
                <p className="font-medium">{product.brand}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Size</h3>
                <p className="font-medium">{product.size}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Color</h3>
                <p className="font-medium">{product.color}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Material</h3>
                <p className="font-medium">{product.material}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Era</h3>
                <p className="font-medium">{product.era}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Condition</h3>
                <p className="font-medium">{product.condition}</p>
              </div>
            </div>
            
            {/* Quantity Selector */}
            <div className="mb-6">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center">
                <button 
                  className="w-10 h-10 rounded-l-md border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 h-10 border-t border-b border-gray-300 text-center focus:ring-0 focus:outline-none"
                />
                <button 
                  className="w-10 h-10 rounded-r-md border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col space-y-3 mb-8">
              <button 
                className="btn-primary py-3"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button 
                className="btn-outline py-3"
                onClick={handleBuyNow}
                disabled={!product.inStock}
              >
                Buy Now
              </button>
            </div>
            
            {/* Product Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag, index) => (
                <Link 
                  key={index} 
                  href={`/search?tag=${tag}`}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-3 py-1 rounded-full"
                >
                  {tag}
                </Link>
              ))}
            </div>
            
            {/* Shipping & Returns */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                  <TruckIcon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium">Free Shipping</h3>
                  <p className="text-sm text-gray-500">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                  <RefreshIcon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium">Easy Returns</h3>
                  <p className="text-sm text-gray-500">30 day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Description & Tabs */}
      <div className="mt-12">
        <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
          <Tab.List className="flex space-x-1 border-b border-gray-200">
            <Tab 
              className={({ selected }) => 
                `py-3 px-5 text-sm font-medium focus:outline-none ${
                  selected 
                    ? 'text-primary-600 border-b-2 border-primary-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`
              }
            >
              Description
            </Tab>
            <Tab 
              className={({ selected }) => 
                `py-3 px-5 text-sm font-medium focus:outline-none ${
                  selected 
                    ? 'text-primary-600 border-b-2 border-primary-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`
              }
            >
              Measurements
            </Tab>
            <Tab 
              className={({ selected }) => 
                `py-3 px-5 text-sm font-medium focus:outline-none ${
                  selected 
                    ? 'text-primary-600 border-b-2 border-primary-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`
              }
            >
              Size Guide
            </Tab>
            <Tab 
              className={({ selected }) => 
                `py-3 px-5 text-sm font-medium focus:outline-none ${
                  selected 
                    ? 'text-primary-600 border-b-2 border-primary-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`
              }
            >
              Virtual Try-On
            </Tab>
            <Tab 
              className={({ selected }) => 
                `py-3 px-5 text-sm font-medium focus:outline-none ${
                  selected 
                    ? 'text-primary-600 border-b-2 border-primary-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`
              }
            >
              Reviews
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-6">
            <Tab.Panel>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
              </div>
            </Tab.Panel>
            <Tab.Panel>
              {product.measurements ? (
                <div className="bg-white rounded-xl shadow-soft p-6 md:p-8">
                  <h3 className="text-xl font-semibold mb-6">Item Measurements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.measurements).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">{key}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                    <p>All measurements are taken with the item laid flat and are approximate. Please allow for a 0.5-1" margin of error.</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No measurement details available for this item.</p>
                </div>
              )}
            </Tab.Panel>
            <Tab.Panel>
              <SizeGuide productType={product.category} />
            </Tab.Panel>
            <Tab.Panel>
              <VirtualTryOn product={product} />
            </Tab.Panel>
            <Tab.Panel>
              <ProductReviews productId={product.id} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default ProductDetails;

// Icon components
const StarIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
  </svg>
);

const VerifiedIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
);

const MinusIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const PlusIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
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