import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, MapPin, X, Save } from 'lucide-react';
import { mapService, Location } from '../../services/map/mapService';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminDestinations = () => {
  const [destinations, setDestinations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Location>>({
    name: '',
    type: 'CITY',
    latitude: 60,
    longitude: 10,
    description: ''
  });

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      // In a real app, we'd fetch all locations or paginate
      const data = await mapService.fetchLocationsInBounds(57, 4, 71, 31);
      setDestinations(data);
    } catch (err) {
      console.error("Failed to load destinations", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (dest?: Location) => {
    if (dest) {
      setEditingId(dest.id);
      setFormData(dest);
    } else {
      setEditingId(null);
      setFormData({ name: '', type: 'CITY', latitude: 60, longitude: 10, description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    // Mock save operation
    setIsModalOpen(false);
    // In production, call supabase insert/update here
    fetchDestinations(); // Refresh
  };

  const filteredDestinations = destinations.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <MapPin className="text-aurora-green" />
            Destination Management
          </h1>
          <p className="text-slate-400 mt-1">Add, edit, and categorize locations for the Smart Map.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-aurora-green text-navy-900 font-bold py-2.5 px-5 rounded-lg flex items-center gap-2 hover:bg-green-400 transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)]"
        >
          <Plus size={18} />
          Add Location
        </button>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or type..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-aurora-green transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 text-xs uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Coordinates</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-500 animate-pulse">Loading destinations...</td>
                </tr>
              ) : filteredDestinations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-500">No destinations found.</td>
                </tr>
              ) : (
                filteredDestinations.map(dest => (
                  <tr key={dest.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{dest.name}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs border border-slate-700">
                        {dest.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-slate-400">
                      {dest.latitude.toFixed(4)}, {dest.longitude.toFixed(4)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400 max-w-xs truncate">
                      {dest.description || 'No description'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(dest)}
                          className="p-1.5 text-slate-400 hover:text-aurora-green transition-colors rounded hover:bg-slate-800"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-red-400 transition-colors rounded hover:bg-slate-800">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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
              className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                <X size={20} />
              </button>
              
              <h2 className="text-xl font-bold text-white mb-6">
                {editingId ? 'Edit Destination' : 'Add New Destination'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-aurora-green"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-aurora-green"
                  >
                    <option value="CITY">City</option>
                    <option value="ATTRACTION">Attraction</option>
                    <option value="FJORD">Fjord</option>
                    <option value="NATIONAL_PARK">National Park</option>
                  </select>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Latitude</label>
                    <input 
                      type="number" 
                      value={formData.latitude}
                      onChange={(e) => setFormData({...formData, latitude: parseFloat(e.target.value)})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-aurora-green"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Longitude</label>
                    <input 
                      type="number" 
                      value={formData.longitude}
                      onChange={(e) => setFormData({...formData, longitude: parseFloat(e.target.value)})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-aurora-green"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Description</label>
                  <textarea 
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-aurora-green resize-none"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="bg-aurora-green text-navy-900 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-green-400 transition-colors"
                >
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
