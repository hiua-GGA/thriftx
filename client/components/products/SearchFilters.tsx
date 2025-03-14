'use client';

import { useState } from 'react';

interface SearchFiltersProps {
  isMobile?: boolean;
}

const SearchFilters = ({ isMobile = false }: SearchFiltersProps) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(!isMobile);
  const [priceRange, setPriceRange] = useState([0, 500]);

  return (
    <div className="bg-white rounded-xl shadow-soft p-6">
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Mobile Filter Toggle */}
      {isMobile && (
        <button
          className="flex items-center justify-between w-full mb-4 font-medium"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
        >
          <span>Filters</span>
          <ChevronDownIcon className={`w-5 h-5 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
        </button>
      )}

      {/* Filter Sections */}
      {isFiltersOpen && (
        <div className="space-y-6">
          {/* Categories */}
          <div>
            <h3 className="font-medium mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`category-${category.id}`} className="ml-2 text-sm text-gray-700">
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-medium mb-3">Price Range</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">${priceRange[0]}</span>
                <span className="text-sm text-gray-500">${priceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex gap-4">
                <div>
                  <label htmlFor="min-price" className="sr-only">Minimum Price</label>
                  <input
                    type="number"
                    id="min-price"
                    placeholder="Min"
                    min="0"
                    max={priceRange[1]}
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="max-price" className="sr-only">Maximum Price</label>
                  <input
                    type="number"
                    id="max-price"
                    placeholder="Max"
                    min={priceRange[0]}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="font-medium mb-3">Size</h3>
            <div className="grid grid-cols-4 gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  className="border border-gray-300 rounded-md py-1 text-sm hover:border-primary-500 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <h3 className="font-medium mb-3">Color</h3>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color.name}
                  className="w-8 h-8 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Condition */}
          <div>
            <h3 className="font-medium mb-3">Condition</h3>
            <div className="space-y-2">
              {conditions.map((condition) => (
                <div key={condition} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`condition-${condition}`}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`condition-${condition}`} className="ml-2 text-sm text-gray-700">
                    {condition}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Vendors */}
          <div>
            <h3 className="font-medium mb-3">Vendors</h3>
            <div className="space-y-2">
              {vendors.map((vendor) => (
                <div key={vendor.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`vendor-${vendor.id}`}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`vendor-${vendor.id}`} className="ml-2 text-sm text-gray-700">
                    {vendor.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3 className="font-medium mb-3">Rating</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center">
                  <input
                    type="radio"
                    id={`rating-${rating}`}
                    name="rating"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <label htmlFor={`rating-${rating}`} className="ml-2 text-sm text-gray-700 flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-4 h-4 ${i < rating ? 'text-accent-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="ml-1">{rating === 1 ? '& Up' : `& Up`}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Apply Filters Button */}
          <div className="pt-4">
            <button className="w-full btn-primary py-2">
              Apply Filters
            </button>
            <button className="w-full text-primary-600 text-sm mt-2 hover:underline">
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;

// Sample data
const categories = [
  { id: 1, name: 'Clothing' },
  { id: 2, name: 'Accessories' },
  { id: 3, name: 'Footwear' },
  { id: 4, name: 'Vintage' },
  { id: 5, name: 'Designer' },
  { id: 6, name: 'Sustainable' },
];

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'];

const colors = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Gray', hex: '#808080' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Green', hex: '#008000' },
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Pink', hex: '#FFC0CB' },
  { name: 'Brown', hex: '#A52A2A' },
];

const conditions = [
  'New with tags',
  'Like new',
  'Good',
  'Fair',
  'Vintage',
];

const vendors = [
  { id: 1, name: 'Retro Finds' },
  { id: 2, name: 'Urban Thrift' },
  { id: 3, name: 'Luxe Second Life' },
  { id: 4, name: 'Vintage Treasures' },
  { id: 5, name: 'Eco Closet' },
];

// Icon components
const SearchIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const ChevronDownIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const StarIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
  </svg>
); 