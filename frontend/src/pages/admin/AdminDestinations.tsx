import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, MapPin, X, Save, RefreshCw, Sparkles, CheckCircle2, Archive } from 'lucide-react';
import { mapService, Location } from '../../services/map/mapService';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const AdminDestinations = () => {
  const [destinations, setDestinations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    type: 'CITY' | 'ATTRACTION' | 'FJORD' | 'NATIONAL_PARK';
    region: string;
    latitude: number;
    longitude: number;
    description: string;
    image_url: string;
    status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  }>({
    name: '',
    slug: '',
    type: 'CITY',
    region: 'Western Norway',
    latitude: 60.3913,
    longitude: 5.3221,
    description: '',
    image_url: '',
    status: 'PUBLISHED'
  });

  const fetchDestinations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mapService.fetchLocationsInBounds(57, 4, 71, 31);
      setDestinations(data || []);
    } catch (err: any) {
      console.error("Failed to load destinations", err);
      setError(err?.message || 'Unable to retrieve destination records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    mapService.fetchLocationsInBounds(57, 4, 71, 31)
      .then(data => {
        if (!ignore) setDestinations(data || []);
      })
      .catch((err: any) => {
        console.error("Failed to load destinations", err);
        if (!ignore) setError(err?.message || 'Unable to retrieve destination records.');
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleOpenModal = (dest?: Location) => {
    if (dest) {
      setEditingId(dest.id);
      setFormData({
        name: dest.name,
        slug: (dest as any).slug || generateSlug(dest.name),
        type: dest.type as any,
        region: (dest as any).region || 'Western Norway',
        latitude: dest.latitude,
        longitude: dest.longitude,
        description: dest.description || '',
        image_url: (dest as any).image_url || '',
        status: ((dest as any).status as any) || 'PUBLISHED'
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        slug: '',
        type: 'CITY',
        region: 'Western Norway',
        latitude: 60.3913,
        longitude: 5.3221,
        description: '',
        image_url: '',
        status: 'PUBLISHED'
      });
    }
    setIsModalOpen(true);
  };

  const handleAutoSlug = () => {
    if (formData.name) {
      setFormData(prev => ({ ...prev, slug: generateSlug(prev.name) }));
      toast.info('Generated URL slug from destination name');
    }
  };

  const handleSave = async () => {
    if (!formData.name?.trim()) {
      toast.error('Destination name is required');
      return;
    }

    const calculatedSlug = formData.slug?.trim() || generateSlug(formData.name);

    // Validate coordinates
    if (formData.latitude < 55 || formData.latitude > 75 || formData.longitude < 2 || formData.longitude > 35) {
      toast.warning('Coordinates appear outside standard Norwegian territory (57°N-71°N, 4°E-31°E)');
    }

    setSaving(true);
    try {
      // Check slug uniqueness
      if (!editingId) {
        const { data: existing } = await (supabase as any)
          .from('locations')
          .select('id')
          .eq('slug', calculatedSlug)
          .maybeSingle();

        if (existing) {
          toast.error(`A destination with slug "${calculatedSlug}" already exists.`);
          setSaving(false);
          return;
        }
      }

      if (editingId) {
        const { error: dbErr } = await (supabase as any)
          .from('locations')
          .update({
            name: formData.name,
            slug: calculatedSlug,
            type: formData.type,
            region: formData.region,
            latitude: formData.latitude,
            longitude: formData.longitude,
            description: formData.description,
            status: formData.status
          })
          .eq('id', editingId);

        if (dbErr) throw dbErr;
        toast.success(`Destination "${formData.name}" updated successfully`);
      } else {
        const { error: dbErr } = await (supabase as any)
          .from('locations')
          .insert({
            name: formData.name,
            slug: calculatedSlug,
            type: formData.type,
            region: formData.region,
            latitude: formData.latitude,
            longitude: formData.longitude,
            description: formData.description,
            status: formData.status
          });

        if (dbErr) throw dbErr;
        toast.success(`Destination "${formData.name}" added to Norway directory`);
      }

      setIsModalOpen(false);
      await fetchDestinations();
    } catch (err: any) {
      console.error('Failed to save destination:', err);
      toast.error(err?.message || 'Failed to save destination');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (dest: Location, nextStatus: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED') => {
    try {
      const { error: dbErr } = await (supabase as any)
        .from('locations')
        .update({ status: nextStatus })
        .eq('id', dest.id);

      if (dbErr) throw dbErr;

      setDestinations(prev => prev.map(d => d.id === dest.id ? { ...d, status: nextStatus } : d));
      toast.success(`Destination "${dest.name}" marked as ${nextStatus}`);
    } catch {
      toast.error('Failed to update destination status');
    }
  };

  const handleDelete = async (dest: Location) => {
    if (!window.confirm(`Are you sure you want to delete "${dest.name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      const { error: dbErr } = await (supabase as any)
        .from('locations')
        .delete()
        .eq('id', dest.id);

      if (dbErr) throw dbErr;

      setDestinations(prev => prev.filter(d => d.id !== dest.id));
      toast.success(`Destination "${dest.name}" removed successfully`);
    } catch (err: any) {
      console.error('Failed to delete destination:', err);
      toast.error(err?.message || 'Failed to delete destination');
    }
  };

  const filteredDestinations = destinations.filter(d => {
    const matchesSearch = 
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      d.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ((d as any).region && (d as any).region.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = typeFilter === 'ALL' || d.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || ((d as any).status || 'PUBLISHED') === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <MapPin className="text-aurora-green" />
            Destination Management
          </h1>
          <p className="text-slate-400 mt-1">Authoritative Norway location directory, GPS coordinates, and publishing states.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchDestinations}
            disabled={loading}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="Refresh database"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-aurora-green text-navy-900 font-bold py-2.5 px-5 rounded-lg flex items-center gap-2 hover:bg-green-400 transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] cursor-pointer"
          >
            <Plus size={18} />
            Add Location
          </button>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        {/* Filter Controls Bar */}
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or type (e.g. Bergen, Fjord)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-aurora-green font-semibold"
            >
              <option value="ALL">All Types</option>
              <option value="CITY">City</option>
              <option value="FJORD">Fjord</option>
              <option value="NATIONAL_PARK">National Park</option>
              <option value="ATTRACTION">Attraction</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-aurora-green font-semibold"
            >
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 text-xs uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Name & Slug</th>
                <th className="px-6 py-4">Type & Region</th>
                <th className="px-6 py-4">Coordinates</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                [1, 2, 3, 4, 5].map(n => (
                  <tr key={n} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-32" /></td>
                    <td className="px-6 py-4"><div className="h-5 bg-slate-800 rounded w-20" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-28" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-16" /></td>
                    <td className="px-6 py-4 text-right"><div className="h-6 bg-slate-800 rounded w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <p className="text-red-400 text-sm mb-3">{error}</p>
                    <button
                      onClick={fetchDestinations}
                      className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Try Again
                    </button>
                  </td>
                </tr>
              ) : filteredDestinations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <p className="text-slate-400 text-sm mb-3">
                      {searchTerm ? `No destinations found matching "${searchTerm}".` : 'No destinations available.'}
                    </p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-aurora-green rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Clear Search
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredDestinations.map(dest => {
                  const status = (dest as any).status || 'PUBLISHED';
                  return (
                    <tr key={dest.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-white text-sm">{dest.name}</div>
                        <div className="text-xs font-mono text-slate-500 mt-0.5">/destinations/{(dest as any).slug || generateSlug(dest.name)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-xs border border-slate-700 font-medium">
                            {dest.type}
                          </span>
                          <span className="text-xs text-slate-400">{(dest as any).region || 'Norway'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-slate-400">
                        {dest.latitude.toFixed(4)}, {dest.longitude.toFixed(4)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                          status === 'DRAFT' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                          'bg-slate-700 text-slate-300 border border-slate-600'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-1.5">
                          {status !== 'PUBLISHED' && (
                            <button
                              onClick={() => handleToggleStatus(dest, 'PUBLISHED')}
                              title="Publish Live"
                              className="p-1.5 text-slate-400 hover:text-emerald-400 transition-colors rounded hover:bg-slate-800"
                            >
                              <CheckCircle2 size={16} />
                            </button>
                          )}
                          {status !== 'ARCHIVED' && (
                            <button
                              onClick={() => handleToggleStatus(dest, 'ARCHIVED')}
                              title="Archive Destination"
                              className="p-1.5 text-slate-400 hover:text-amber-400 transition-colors rounded hover:bg-slate-800"
                            >
                              <Archive size={16} />
                            </button>
                          )}
                          <button 
                            onClick={() => handleOpenModal(dest)}
                            title="Edit Destination"
                            className="p-1.5 text-slate-400 hover:text-aurora-green transition-colors rounded hover:bg-slate-800"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(dest)}
                            title="Delete Destination"
                            className="p-1.5 text-slate-400 hover:text-red-400 transition-colors rounded hover:bg-slate-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                <X size={20} />
              </button>
              
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <MapPin className="text-aurora-green" size={20} />
                {editingId ? 'Edit Destination' : 'Add New Destination'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Destination Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Geirangerfjord"
                    value={formData.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        name: val,
                        slug: prev.slug || generateSlug(val)
                      }));
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-aurora-green text-sm"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-slate-400 uppercase">URL Slug</label>
                    <button
                      type="button"
                      onClick={handleAutoSlug}
                      className="text-[11px] font-bold text-aurora-green hover:underline flex items-center gap-1"
                    >
                      <Sparkles size={11} /> Auto-generate
                    </button>
                  </div>
                  <input 
                    type="text" 
                    placeholder="e.g. geirangerfjord"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: generateSlug(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-white font-mono text-sm focus:outline-none focus:border-aurora-green"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Category Type</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-aurora-green text-sm"
                    >
                      <option value="CITY">City</option>
                      <option value="ATTRACTION">Attraction</option>
                      <option value="FJORD">Fjord</option>
                      <option value="NATIONAL_PARK">National Park</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Publishing State</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-aurora-green text-sm"
                    >
                      <option value="PUBLISHED">Published Live</option>
                      <option value="DRAFT">Draft</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Geographic Region</label>
                  <select 
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-aurora-green text-sm"
                  >
                    <option value="Western Norway">Western Norway (Vestlandet)</option>
                    <option value="Northern Norway">Northern Norway (Nord-Norge)</option>
                    <option value="Eastern Norway">Eastern Norway (Østlandet)</option>
                    <option value="Southern Norway">Southern Norway (Sørlandet)</option>
                    <option value="Trøndelag">Trøndelag</option>
                    <option value="Svalbard">Svalbard</option>
                  </select>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Latitude (57° - 71° N)</label>
                    <input 
                      type="number" 
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => setFormData({...formData, latitude: parseFloat(e.target.value) || 0})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-aurora-green text-sm font-mono"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Longitude (4° - 31° E)</label>
                    <input 
                      type="number" 
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => setFormData({...formData, longitude: parseFloat(e.target.value) || 0})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-aurora-green text-sm font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Description</label>
                  <textarea 
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    placeholder="Scenic highlights, accessibility, and visitor tips..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-aurora-green resize-none text-sm"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-aurora-green text-navy-900 px-5 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-green-400 transition-colors disabled:opacity-50 text-sm cursor-pointer"
                >
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
