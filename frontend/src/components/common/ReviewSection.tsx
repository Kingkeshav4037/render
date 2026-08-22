import React, { useState } from 'react';
import { Star, MessageSquare, Image as ImageIcon, Send, User } from 'lucide-react';
import { useReviews, useAverageRating, useCreateReview } from '../../hooks/useReviews';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';

interface Props {
  productType: string;
  productId: string;
}

export const ReviewSection: React.FC<Props> = ({ productType, productId }) => {
  const { user } = useAuthStore();
  const { data: reviews = [], isLoading } = useReviews(productType, productId);
  const { data: stats } = useAverageRating(productType, productId);
  const createReview = useCreateReview();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(5);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // Photo upload handling would go here, currently mocked
  const [photos, setPhotos] = useState<string[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("Please log in to leave a review.");
    if (!title || !description) return;
    
    setIsSubmitting(true);
    try {
      await createReview.mutateAsync({
        product_type: productType,
        product_id: productId,
        rating,
        title,
        description,
        photos
      });
      setTitle('');
      setDescription('');
      setRating(5);
      setPhotos([]);
    } catch (error) {
      console.error(error);
      alert("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (ratingValue: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} size={16} fill={i < ratingValue ? "currentColor" : "none"} className={i < ratingValue ? "text-yellow-400" : "text-gray-300"} />
    ));
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mt-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-navy-900 flex items-center gap-2">
            <MessageSquare size={24} className="text-blue-500" /> Reviews
          </h2>
          {stats && stats.count > 0 && (
            <p className="text-gray-500 mt-2 flex items-center gap-2 font-medium">
              <span className="text-xl text-navy-900 font-bold">{stats.average.toFixed(1)}</span>
              <span className="flex">{renderStars(Math.round(stats.average))}</span>
              <span>({stats.count} reviews)</span>
            </p>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Review Form */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 sticky top-24">
            <h3 className="font-bold text-navy-900 mb-4">Write a Review</h3>
            {user ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-2">Rating</label>
                  <div className="flex gap-1">
                    {Array(5).fill(0).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setRating(i + 1)}
                        onMouseEnter={() => setHoverRating(i + 1)}
                        onMouseLeave={() => setHoverRating(rating)}
                        className={`transition-colors ${i < hoverRating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        <Star size={28} fill={i < hoverRating ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Review Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-navy-900 focus:ring-0 outline-none"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Share your experience..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-navy-900 focus:ring-0 outline-none resize-none"
                  ></textarea>
                </div>
                <div className="flex items-center gap-4">
                  <button type="button" className="p-3 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-navy-900 hover:border-gray-300 transition-colors flex items-center gap-2 text-sm font-bold">
                    <ImageIcon size={18} /> Add Photos
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-navy-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-navy-800 transition-colors disabled:opacity-70"
                  >
                    {isSubmitting ? 'Posting...' : <><Send size={18} /> Post Review</>}
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-gray-500 text-sm">Please sign in to leave a review.</p>
            )}
          </div>
        </div>

        {/* Review List */}
        <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            <p className="text-gray-500 animate-pulse">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <div className="text-center p-12 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
              <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="font-bold text-navy-900 mb-2">No reviews yet</h3>
              <p className="text-gray-500 text-sm">Be the first to share your experience!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="p-6 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    {review.profiles?.avatar_url ? (
                      <img src={review.profiles.avatar_url} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <User size={20} />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-navy-900 text-sm">{review.profiles?.full_name || 'Anonymous'}</h4>
                      <p className="text-xs text-gray-400">{formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}</p>
                    </div>
                  </div>
                  <div className="flex">{renderStars(review.rating)}</div>
                </div>
                <h5 className="font-bold text-navy-900 mb-2">{review.title}</h5>
                <p className="text-gray-600 text-sm leading-relaxed">{review.description}</p>
                {review.photos && review.photos.length > 0 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {review.photos.map((photo, idx) => (
                      <img key={idx} src={photo} alt="Review" className="w-24 h-24 object-cover rounded-xl border border-gray-100" />
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
