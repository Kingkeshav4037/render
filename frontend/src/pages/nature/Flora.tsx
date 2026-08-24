import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO } from '../../components/shared/SEO';
import { Container } from '../../components/layout/Container';
import { floraService, FloraSpecies } from '../../services/floraService';
import { Search, Trees, Flower2, ShieldAlert, Sparkles, MapPin, Calendar, BookOpen, X, Info, Leaf, AlertCircle, RefreshCw } from 'lucide-react';
import { OptimizedImage } from '../../components/shared/OptimizedImage';

export const Flora = () => {
  const [floraList, setFloraList] = useState<FloraSpecies[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeSpecies, setActiveSpecies] = useState<FloraSpecies | null>(null);

  const loadFlora = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await floraService.getAllFlora();
      setFloraList(data);
    } catch (err: any) {
      console.error('Failed to load flora:', err);
      setError(err?.message || 'Unable to load Norwegian botanical catalog. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadFlora();
  }, [loadFlora]);

  const categories = [
    { id: 'All', label: 'All Botanical Species', icon: Leaf },
    { id: 'Trees', label: 'Boreal Trees & Forests', icon: Trees },
    { id: 'Berries', label: 'Wild Berries & Foraging', icon: Sparkles },
    { id: 'Alpine', label: 'Arctic & Alpine Flora', icon: Flower2 },
    { id: 'Orchids', label: 'Rare & Protected Orchids', icon: ShieldAlert },
  ];

  const filteredFlora = floraList.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || (item.category?.toLowerCase() === selectedCategory.toLowerCase());
    const matchesSearch = 
      (item.common_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.norwegian_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.scientific_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.latin_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.habitat?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (item.distribution_region?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-nordic-sage/10 text-nordic-charcoal font-sans pb-28">
      <SEO
        title="Flora, Trees & Botanical Heritage of Norway | SmartLife"
        description="Explore Norway's ancient boreal forests, alpine wildflowers, arctic cloudberries, and protected native orchids under Allemannsretten."
      />

      {/* Cinematic Hero */}
      <div className="relative h-[65vh] min-h-[460px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1448375240586-882707db888b?q=norway+forest+spruce&w=1920')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-900/60 to-navy-900/40"></div>
        </div>

        <Container className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-aurora-green/20 border border-aurora-green/40 text-aurora-green font-bold text-xs uppercase tracking-widest mb-6 backdrop-blur-md">
              <Leaf className="w-4 h-4" /> Nordic Botanical Heritage
            </div>

            <h1 className="text-4xl md:text-6xl font-display font-black text-white uppercase tracking-wider mb-4 drop-shadow-md">
              Norway's Flora & Forests
            </h1>

            <p className="text-white/80 max-w-2xl text-base md:text-lg font-medium mb-8">
              From the resilient Scots Pines of the taiga to amber-gold Arctic cloudberries and high-alpine glacier buttercups.
            </p>

            {/* Search Bar */}
            <div className="w-full max-w-lg relative shadow-2xl">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by English, Norwegian (*Molte, Furu*), or Scientific name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/95 backdrop-blur-md text-navy-900 placeholder-gray-400 font-medium text-sm border-0 focus:ring-4 focus:ring-aurora-green/50 outline-none transition-all"
              />
            </div>
          </motion.div>
        </Container>
      </div>

      {/* Main Content Container */}
      <Container className="mt-10">
        
        {/* Right to Roam (Allemannsretten) Foraging Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-3xl p-6 sm:p-8 mb-12 shadow-xl border border-emerald-700/40 relative overflow-hidden"
        >
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-aurora-green text-xs font-black uppercase tracking-widest">
                <Info className="w-4 h-4" /> Allemannsretten — The Right to Roam
              </div>
              <h2 className="text-2xl font-display font-bold">Norway's Foraging Freedoms & Protections</h2>
              <p className="text-white/80 text-sm max-w-2xl">
                Under Norwegian law, you are freely entitled to harvest wild berries, spruce shoots, mushrooms, and herbs for personal consumption. Protected species like the Lady's Slipper Orchid must never be picked or disturbed.
              </p>
            </div>
            <div className="inline-flex items-center gap-3 bg-white/10 px-5 py-3 rounded-2xl border border-white/20 text-xs font-bold text-white shrink-0">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <span>Leave No Trace Policy</span>
            </div>
          </div>
        </motion.div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2.5 mb-10 justify-center">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                  isSelected
                    ? 'bg-navy-900 text-aurora-green border border-navy-900 shadow-md transform -translate-y-0.5'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Botanical Species Grid */}
        {loading ? (
          <div className="py-24 flex flex-col justify-center items-center gap-3">
            <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-800 rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Loading Botanical Catalog...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl p-14 text-center border border-red-200 shadow-sm max-w-lg mx-auto">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-navy-900 mb-2">Failed to Load Flora</h3>
            <p className="text-gray-600 text-xs mb-6 leading-relaxed">{error}</p>
            <button
              onClick={() => loadFlora()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-navy-900 hover:bg-aurora-green hover:text-navy-900 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              <RefreshCw size={14} /> Try Again
            </button>
          </div>
        ) : filteredFlora.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-200 shadow-sm">
            <Leaf className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
            <h3 className="text-2xl font-display font-bold text-navy-900 mb-2">No botanical species match your search</h3>
            <p className="text-gray-500 text-sm mb-6">Try searching for common names like "Spruce", "Pine", "Cloudberry", or "Bilberry".</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
              className="px-6 py-3 bg-navy-900 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-aurora-green hover:text-navy-900 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {filteredFlora.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                onClick={() => setActiveSpecies(item)}
                className="bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-emerald-600/40 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative h-52 overflow-hidden bg-gray-100">
                    <OptimizedImage
                      src={item.image_url}
                      alt={item.common_name}
                      category="flora"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3.5 left-3.5 z-10">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-navy-900/80 text-white backdrop-blur-md border border-white/20">
                        {item.category}
                      </span>
                    </div>
                    <div className="absolute top-3.5 right-3.5 z-10">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm ${
                        (item.foraging_status?.includes('Edible') || !item.is_protected)
                          ? 'bg-emerald-600/90 text-white'
                          : 'bg-amber-600/90 text-white'
                      }`}>
                        {item.foraging_status || (item.is_protected ? 'Protected' : 'Wild / Forageable')}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest mb-1 flex items-center justify-between">
                      <span>{item.norwegian_name}</span>
                      <span className="italic font-serif text-gray-400 capitalize">{item.scientific_name || item.latin_name}</span>
                    </div>

                    <h3 className="text-xl font-display font-bold text-navy-900 group-hover:text-emerald-700 transition-colors mb-2">
                      {item.common_name}
                    </h3>

                    <p className="text-gray-600 text-xs line-clamp-3 leading-relaxed mb-4">
                      {item.description}
                    </p>

                    <div className="space-y-1.5 pt-3 border-t border-gray-100 text-[11px] text-gray-500">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">{item.distribution_region}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{item.flowering_season || item.blooming_season || 'Summer'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-6 pb-6 pt-2">
                  <div className="w-full py-2.5 bg-gray-50 group-hover:bg-emerald-50 text-navy-900 group-hover:text-emerald-800 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors text-center border border-gray-100 flex items-center justify-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> View Botanical Profile
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Container>

      {/* Botanical Species Detail Modal */}
      <AnimatePresence>
        {activeSpecies && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-200 relative my-8"
            >
              <button
                onClick={() => setActiveSpecies(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 bg-navy-900/60 hover:bg-navy-900 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-64 sm:h-72">
                <OptimizedImage
                  src={activeSpecies.image_url}
                  alt={activeSpecies.common_name}
                  category="flora"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-900/40 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-aurora-green text-navy-900">
                      {activeSpecies.category}
                    </span>
                    <span className="text-xs font-semibold text-white/80">
                      Norwegian: <strong>{activeSpecies.norwegian_name}</strong>
                    </span>
                  </div>
                  <h2 className="text-3xl font-display font-black">{activeSpecies.common_name}</h2>
                  <p className="italic text-xs font-serif text-white/70">{activeSpecies.scientific_name || activeSpecies.latin_name}</p>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Botanical Overview</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{activeSpecies.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Habitat & Distribution
                    </div>
                    <div className="text-xs font-semibold text-navy-900">{activeSpecies.habitat}</div>
                    <div className="text-[11px] text-gray-500 mt-1">{activeSpecies.distribution_region}</div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Season & Foraging Status
                    </div>
                    <div className="text-xs font-semibold text-navy-900">{activeSpecies.flowering_season || activeSpecies.blooming_season || 'Summer'}</div>
                    <div className={`text-[11px] font-bold mt-1 ${
                      (activeSpecies.foraging_status?.includes('Edible') || !activeSpecies.is_protected) ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      {activeSpecies.foraging_status || (activeSpecies.is_protected ? 'Protected Species' : 'Wild & Forageable')}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Ecological Role in Nordic Biomes</h4>
                  <p className="text-xs text-gray-600 leading-relaxed bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100">
                    {activeSpecies.ecological_role}
                  </p>
                </div>

                {activeSpecies.traditional_uses && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Traditional Norwegian & Sami Uses</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{activeSpecies.traditional_uses}</p>
                  </div>
                )}

                {activeSpecies.foraging_tips && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Foraging & Observation Advice</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{activeSpecies.foraging_tips}</p>
                  </div>
                )}
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setActiveSpecies(null)}
                  className="px-6 py-2.5 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Flora;
