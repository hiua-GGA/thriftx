'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductReviewsProps {
  productId: number;
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const [activeFilter, setActiveFilter] = useState<number | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  // In a real app, this would be fetched from an API
  const reviews = getReviewsForProduct(productId);
  
  // Calculate rating distribution
  const ratingCounts = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(review => Math.floor(review.rating) === rating).length,
    percentage: (reviews.filter(review => Math.floor(review.rating) === rating).length / reviews.length) * 100
  }));
  
  // Calculate average rating
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  
  // Filter reviews based on active filter
  const filteredReviews = activeFilter 
    ? reviews.filter(review => Math.floor(review.rating) === activeFilter) 
    : reviews;

  return (
    <div className="bg-white rounded-xl shadow-soft p-6 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Rating Summary */}
        <div className="lg:col-span-1">
          <div className="text-center mb-6">
            <div className="text-5xl font-bold mb-2">{averageRating.toFixed(1)}</div>
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <StarIcon 
                  key={i} 
                  className={`w-5 h-5 ${i < Math.floor(averageRating) ? 'text-accent-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <div className="text-sm text-gray-500">Based on {reviews.length} reviews</div>
          </div>
          
          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingCounts.map(({ rating, count, percentage }) => (
              <button
                key={rating}
                className={`w-full flex items-center p-2 rounded-md hover:bg-gray-50 ${
                  activeFilter === rating ? 'bg-gray-50' : ''
                }`}
                onClick={() => setActiveFilter(activeFilter === rating ? null : rating)}
              >
                <div className="flex items-center w-12">
                  <span className="text-sm font-medium">{rating}</span>
                  <StarIcon className="w-4 h-4 text-accent-400 ml-1" />
                </div>
                <div className="flex-grow mx-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-accent-400 h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm text-gray-500 w-8 text-right">{count}</div>
              </button>
            ))}
          </div>
          
          {/* Write Review Button */}
          <button 
            className="w-full btn-primary mt-6"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            Write a Review
          </button>
        </div>
        
        {/* Reviews List */}
        <div className="lg:col-span-2">
          {/* Active Filters */}
          {activeFilter && (
            <div className="mb-4 flex items-center">
              <span className="text-sm text-gray-600 mr-2">Filtered by:</span>
              <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                <span className="mr-2">{activeFilter} Star</span>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setActiveFilter(null)}
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          
          {/* Review Form */}
          {showReviewForm && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-4">Write Your Review</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button key={rating} className="p-1">
                      <StarIcon className="w-6 h-6 text-gray-300 hover:text-accent-400" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="review-title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="review-title"
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Summarize your experience"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="review-content" className="block text-sm font-medium text-gray-700 mb-1">
                  Review
                </label>
                <textarea
                  id="review-content"
                  rows={4}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="What did you like or dislike about this product?"
                ></textarea>
              </div>
              <div className="flex justify-end gap-2">
                <button 
                  className="btn-outline"
                  onClick={() => setShowReviewForm(false)}
                >
                  Cancel
                </button>
                <button className="btn-primary">
                  Submit Review
                </button>
              </div>
            </div>
          )}
          
          {/* Reviews */}
          <div className="space-y-6">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No reviews match your filter.</p>
                <button 
                  className="text-primary-600 hover:underline mt-2"
                  onClick={() => setActiveFilter(null)}
                >
                  Clear filter
                </button>
              </div>
            ) : (
              filteredReviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                        <Image 
                          src={review.userAvatar} 
                          alt={review.userName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{review.userName}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(review.rating) ? 'text-accent-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <h4 className="font-medium mb-2">{review.title}</h4>
                  <p className="text-gray-700 mb-4">{review.content}</p>
                  
                  {/* Review Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 mb-4">
                      {review.images.map((image, index) => (
                        <div key={index} className="relative w-16 h-16 rounded-md overflow-hidden">
                          <Image 
                            src={image} 
                            alt={`Review image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Helpful Button */}
                  <div className="flex items-center">
                    <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
                      <ThumbUpIcon className="w-4 h-4 mr-1" />
                      Helpful ({review.helpfulCount})
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Pagination */}
          {filteredReviews.length > 5 && (
            <div className="mt-8 flex justify-center">
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
                <button className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50">
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;

// Mock function to get reviews for a product
function getReviewsForProduct(productId: number) {
  return [
    {
      id: 1,
      productId,
      userName: 'Sarah J.',
      userAvatar: '/images/testimonial-1.jpg',
      rating: 5,
      title: 'Perfect vintage find!',
      content: 'This jacket is exactly what I was looking for! The condition is excellent for a vintage piece, and it fits true to size. The color is slightly more faded than in the photos, but I actually prefer it that way - gives it more character.',
      date: '2023-03-15',
      helpfulCount: 12,
      images: ['/images/review-1-1.jpg', '/images/review-1-2.jpg']
    },
    {
      id: 2,
      productId,
      userName: 'Michael T.',
      userAvatar: '/images/testimonial-2.jpg',
      rating: 4,
      title: 'Great quality, slightly small',
      content: 'The quality of this jacket is outstanding, especially considering its age. My only complaint is that it runs a bit small. I usually wear a medium, but this fits more like a small. Still wearable, but a bit snug in the shoulders.',
      date: '2023-02-28',
      helpfulCount: 8,
      images: []
    },
    {
      id: 3,
      productId,
      userName: 'Aisha K.',
      userAvatar: '/images/testimonial-3.jpg',
      rating: 5,
      title: 'Shipping was fast and item as described',
      content: 'I received my order much faster than expected, and the jacket was exactly as described. The seller included a nice handwritten note, which was a lovely touch. Would definitely buy from this vendor again!',
      date: '2023-02-10',
      helpfulCount: 5,
      images: ['/images/review-3-1.jpg']
    },
    {
      id: 4,
      productId,
      userName: 'David L.',
      userAvatar: '/images/user-1.jpg',
      rating: 3,
      title: 'Decent, but has some flaws',
      content: 'The jacket is generally good, but there were a few small stains that weren\'t mentioned in the description. They\'re not very noticeable, but I would have appreciated knowing about them beforehand. The fit is good though, and it\'s still a nice piece.',
      date: '2023-01-25',
      helpfulCount: 3,
      images: []
    },
    {
      id: 5,
      productId,
      userName: 'Emma R.',
      userAvatar: '/images/user-2.jpg',
      rating: 5,
      title: 'Absolutely love it!',
      content: 'This jacket has quickly become my favorite piece in my wardrobe. It goes with everything and I get compliments every time I wear it. The vintage look is perfect - not too worn, but with just enough character to show its history.',
      date: '2023-01-12',
      helpfulCount: 15,
      images: ['/images/review-5-1.jpg', '/images/review-5-2.jpg', '/images/review-5-3.jpg']
    },
    {
      id: 6,
      productId,
      userName: 'James W.',
      userAvatar: '/images/user-3.jpg',
      rating: 4,
      title: 'Good value for money',
      content: 'For the price, this is an excellent find. The denim is thick and durable, and the stitching is still strong despite its age. It\'s a bit boxy in the fit compared to modern jackets, but that\'s to be expected with vintage pieces.',
      date: '2022-12-30',
      helpfulCount: 7,
      images: []
    }
  ];
}

// Icon components
const StarIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
  </svg>
);

const XIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ThumbUpIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
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