import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Leaf, 
  Star, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Plus, 
  Minus, 
  Package, 
  MapPin, 
  Sparkles, 
  AlertCircle,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { shopService, Product } from '../../services/shopService';
import { useCartStore } from '../../store/useCartStore';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { OptimizedImage } from '../../components/shared/OptimizedImage';
import { SEO } from '../../components/shared/SEO';
import { Button } from '../../components/ui/Button';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { FavoriteButton } from '../../components/common/FavoriteButton';
import { recentlyViewedService } from '../../services/recentlyViewedService';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { requireAuth } = useRequireAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);

  const { addItem } = useCartStore();
  const { formatPrice } = useCurrencyStore();

  const loadProduct = async () => {
    if (!id) {
      setError('Product identifier not provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await shopService.getProductById(id);
      if (!data) {
        setError('The requested sustainable product could not be located in our catalog.');
        setProduct(null);
      } else {
        setProduct(data);
        setSelectedImage(data.img || data.gallery?.[0] || '/images/product_charger_1786938528191.jpg');
        // Fetch real related products
        const related = await shopService.getRelatedProducts(data.id, data.category, 3);
        setRelatedProducts(related);
        // Track recently viewed product
        recentlyViewedService.trackView({
          item_type: 'PRODUCT',
          item_id: String(data.id),
          title: data.name,
          image_url: data.img || data.gallery?.[0],
          route: `/shop/${data.id}`,
          metadata: { price: `NOK ${data.price}` }
        }).catch(() => {});
      }
    } catch (err: any) {
      console.error('Failed to load product details:', err);
      setError(err?.message || 'A network error occurred while retrieving product details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setQuantity(1);
    setIsAdded(false);
    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    requireAuth(() => {
      addItem({
        item_type: 'PRODUCT',
        item_id: product.id,
        name: product.name,
        description: `${product.category} • ${product.origin}`,
        unit_price: product.price,
        quantity: quantity,
        image: product.img,
      });
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1600);
    }, { message: 'Sign in to add items to your cart.' });
  };

  const handleBuyNow = () => {
    if (!product) return;
    requireAuth(() => {
      addItem({
        item_type: 'PRODUCT',
        item_id: product.id,
        name: product.name,
        description: `${product.category} • ${product.origin}`,
        unit_price: product.price,
        quantity: quantity,
        image: product.img,
      });
      navigate('/checkout');
    }, { message: 'Sign in to buy and checkout.' });
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-deep-night pt-32 pb-24 flex flex-col items-center justify-center text-snow">
        <div className="w-10 h-10 border-4 border-arctic-gold border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest text-snow/60">Loading Nordic Eco-Product...</p>
      </div>
    );
  }

  // 2. Error / Not Found State
  if (error || !product) {
    return (
      <div className="min-h-screen bg-deep-night text-snow pt-32 pb-24 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-midnight border border-white/10 p-10 text-center rounded-3xl shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-display font-bold text-snow mb-2">Product Not Found</h2>
          <p className="text-sm text-snow/60 mb-8 leading-relaxed">
            {error || 'We could not find the item you are looking for. It may have been discontinued or moved.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="secondary" onClick={loadProduct} className="flex-1 flex items-center justify-center gap-2">
              <RefreshCw size={14} /> Retry
            </Button>
            <Link 
              to="/shop" 
              className="flex-1 py-3 px-4 bg-arctic-gold text-deep-night font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-snow transition-colors flex items-center justify-center gap-1.5"
            >
              Browse Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.img];

  return (
    <div className="min-h-screen bg-deep-night text-snow font-sans pb-24 selection:bg-arctic-gold/30">
      <SEO 
        title={`${product.name} — Sustainable Nordic Marketplace`}
        description={product.description}
        ogImage={product.img}
      />

      {/* Breadcrumb Navigation */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-28 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-snow/60">
          <Link to="/shop" className="hover:text-arctic-gold transition-colors flex items-center gap-1">
            <ArrowLeft size={14} /> Shop
          </Link>
          <ChevronRight size={14} />
          <span className="text-snow/40">{product.category}</span>
          <ChevronRight size={14} />
          <span className="text-arctic-gold truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      {/* Main Product Layout */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Gallery (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative h-[420px] md:h-[540px] bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <OptimizedImage
                src={selectedImage || product.img}
                alt={product.name}
                category="product"
                className="w-full h-full object-cover"
                containerClassName="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-night/60 via-transparent to-transparent pointer-events-none" />

              {/* Badges */}
              <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                <span className="bg-arctic-gold text-deep-night px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md shadow-md">
                  {product.category}
                </span>
                <span className="bg-midnight/90 backdrop-blur-md text-emerald-300 border border-emerald-500/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md flex items-center gap-1">
                  <Leaf size={12} /> {Math.abs(product.co2)} kg CO₂ Offset
                </span>
              </div>

              <div className="absolute top-6 right-6 bg-deep-night/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1 z-10">
                <Star size={14} className="text-arctic-gold fill-arctic-gold" />
                <span className="text-xs font-bold text-snow">{product.rating}</span>
                <span className="text-[10px] text-snow/50">(48 reviews)</span>
              </div>
            </div>

            {/* Thumbnail Row */}
            {gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                {gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`w-24 h-24 rounded-2xl overflow-hidden border transition-all shrink-0 cursor-pointer ${
                      selectedImage === imgUrl 
                        ? 'border-arctic-gold ring-2 ring-arctic-gold/40' 
                        : 'border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <OptimizedImage
                      src={imgUrl}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      category="product"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Pricing & Purchase Card (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            
            <div>
              <div className="flex items-center gap-2 text-xs text-snow/50 uppercase font-bold tracking-widest mb-2">
                <MapPin size={14} className="text-arctic-gold" /> {product.origin}
              </div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-snow leading-tight">
                  {product.name}
                </h1>
                <FavoriteButton 
                  itemType="PRODUCT" 
                  itemId={product.id} 
                  className="bg-white/10 hover:bg-white/20 text-white shadow-xl backdrop-blur-md p-3" 
                  size={22} 
                />
              </div>
              <p className="text-snow/70 text-sm leading-relaxed font-sans">
                {product.description}
              </p>
            </div>

            {/* Price Box */}
            <div className="bg-midnight border border-white/10 p-6 rounded-3xl space-y-6 shadow-xl">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-snow/50 block">Price in NOK</span>
                  <div className="text-3xl md:text-4xl font-display font-black text-snow">
                    {formatPrice(product.price * quantity)}
                  </div>
                </div>
                <div className="text-right">
                  {isOutOfStock ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                      Out of Stock
                    </span>
                  ) : isLowStock ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Only {product.stock} left in stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      In Stock ({product.stock} units)
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Controls */}
              {!isOutOfStock && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-snow/50 mb-2">Select Quantity</label>
                  <div className="flex items-center justify-between bg-deep-night border border-white/10 rounded-2xl p-1.5">
                    <button
                      type="button"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      aria-label="Decrease quantity"
                      className="w-10 h-10 flex items-center justify-center text-snow/70 hover:text-snow hover:bg-white/10 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-bold text-base text-snow">{quantity}</span>
                    <button
                      type="button"
                      disabled={quantity >= product.stock}
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      aria-label="Increase quantity"
                      className="w-10 h-10 flex items-center justify-center text-snow/70 hover:text-snow hover:bg-white/10 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className={`flex-1 py-4 px-6 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-snow border border-white/10'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check size={16} /> Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={16} /> Add to Cart
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  className="flex-1 py-4 px-6 bg-arctic-gold hover:bg-snow text-deep-night rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>Buy Now</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* Guarantees */}
              <div className="border-t border-white/10 pt-4 space-y-3 text-xs text-snow/60">
                <div className="flex items-center gap-2.5">
                  <Truck size={16} className="text-arctic-gold shrink-0" />
                  <span>Free carbon-neutral shipping on orders over 500 NOK</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                  <span>{product.warranty}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <RefreshCw size={16} className="text-arctic-gold shrink-0" />
                  <span>30-Day Hassle-Free Returns across Norway</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Detailed Tabs: Specifications, Features, Materials */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Technical Specifications */}
          <div className="bg-midnight border border-white/10 p-8 rounded-3xl space-y-4">
            <h3 className="text-lg font-display font-bold text-snow flex items-center gap-2">
              <Layers size={18} className="text-arctic-gold" />
              Technical Specifications
            </h3>
            <div className="space-y-3 pt-2">
              {Object.entries(product.specs).map(([key, val]) => (
                <div key={key} className="flex justify-between text-xs pb-2 border-b border-white/5 last:border-0">
                  <span className="text-snow/50 font-bold uppercase">{key}</span>
                  <span className="text-snow font-medium text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Features */}
          <div className="bg-midnight border border-white/10 p-8 rounded-3xl space-y-4">
            <h3 className="text-lg font-display font-bold text-snow flex items-center gap-2">
              <Sparkles size={18} className="text-arctic-gold" />
              Key Features
            </h3>
            <ul className="space-y-2.5 pt-2">
              {product.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-snow/80">
                  <Check size={14} className="text-arctic-gold shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Eco Materials & Circularity */}
          <div className="bg-midnight border border-white/10 p-8 rounded-3xl space-y-4">
            <h3 className="text-lg font-display font-bold text-snow flex items-center gap-2">
              <Leaf size={18} className="text-emerald-400" />
              Circularity & Materials
            </h3>
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-emerald-200 leading-relaxed mb-4">
              {product.materials}
            </div>
            <p className="text-xs text-snow/60 leading-relaxed">
              Every component is designed in alignment with Nordic circular economy standards. Disassembly and recyclability documentation is included with your order.
            </p>
          </div>

        </div>

        {/* Real Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 border-t border-white/10 pt-16">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-arctic-gold block mb-1">Curated For You</span>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-snow">Related Nordic Products</h2>
              </div>
              <Link to="/shop" className="text-xs font-bold uppercase tracking-widest text-snow/60 hover:text-arctic-gold transition-colors flex items-center gap-1">
                View All <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/shop/${rel.id}`}
                  className="bg-midnight border border-white/10 hover:border-arctic-gold/50 rounded-3xl overflow-hidden transition-all group flex flex-col"
                >
                  <div className="h-56 bg-black relative overflow-hidden">
                    <OptimizedImage
                      src={rel.img}
                      alt={rel.name}
                      category="product"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute top-4 right-4 bg-deep-night/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-snow flex items-center gap-1 border border-white/10">
                      <Star size={12} className="text-arctic-gold fill-arctic-gold" /> {rel.rating}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-arctic-gold block mb-1">
                        {rel.category}
                      </span>
                      <h4 className="text-lg font-bold text-snow group-hover:text-arctic-gold transition-colors mb-2">
                        {rel.name}
                      </h4>
                      <p className="text-xs text-snow/60 line-clamp-2 leading-relaxed">
                        {rel.description}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5">
                      <span className="text-xl font-display font-bold text-snow">
                        {formatPrice(rel.price)}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-arctic-gold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        View Item <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;
