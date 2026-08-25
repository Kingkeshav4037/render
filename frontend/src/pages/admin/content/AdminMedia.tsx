import React, { useState } from 'react';
import { Image as ImageIcon, Upload, Search, Filter, Folder, Copy, Check, Trash2, Sparkles, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const CURATED_MEDIA = [
  { id: 'm1', name: 'lofoten_hero_summer.jpg', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', size: '2.8 MB', res: '3840x2160', folder: 'Destinations', alt: 'Reinebringen mountain peak view over Reinefjorden', category: 'FJORD' },
  { id: 'm2', name: 'geiranger_seven_sisters.jpg', url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38', size: '3.4 MB', res: '3840x2160', folder: 'Destinations', alt: 'Seven Sisters waterfall cascading into Geirangerfjord', category: 'FJORD' },
  { id: 'm3', name: 'puffin_close_up.jpg', url: 'https://images.unsplash.com/photo-1520638023360-6def43369783', size: '1.4 MB', res: '1920x1080', folder: 'Wildlife', alt: 'Atlantic puffin with colorful beak on sea cliff', category: 'WILDLIFE' },
  { id: 'm4', name: 'norwegian_cloudberry_rubus.jpg', url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c', size: '1.2 MB', res: '1920x1080', folder: 'Flora', alt: 'Golden arctic cloudberry ripened in subarctic marshland', category: 'FLORA' },
  { id: 'm5', name: 'traditional_farikal_dish.jpg', url: 'https://images.unsplash.com/photo-1544025162-d76694265947', size: '2.1 MB', res: '2560x1440', folder: 'Food', alt: 'Traditional Norwegian mutton and cabbage stew', category: 'FOOD' },
  { id: 'm6', name: 'oslo_opera_house.png', url: 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11', size: '3.1 MB', res: '2560x1440', folder: 'Destinations', alt: 'Oslo Opera House white marble slopes facing the fjord', category: 'CITY' },
  { id: 'm7', name: 'norwegian_wool_sweater_handcrafted.jpg', url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105', size: '1.9 MB', res: '1920x1080', folder: 'Products', alt: 'Authentic 100% Norwegian wool Marius pattern knitwear', category: 'PRODUCTS' },
  { id: 'm8', name: 'aurora_borealis_tromso_night.jpg', url: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb', size: '4.1 MB', res: '3840x2160', folder: 'Marketing', alt: 'Vibrant green northern lights shimmering over snowy fjords', category: 'AURORA' },
];

export const AdminMedia = () => {
  const [mediaList, setMediaList] = useState(CURATED_MEDIA);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFolder, setActiveFolder] = useState<string>('All Media');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. File type validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a JPG, PNG, WEBP, or SVG image.');
      return;
    }

    // 2. File size limit (5MB)
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error('File size exceeds maximum limit of 5 MB.');
      return;
    }

    setUploading(true);
    const simulatedUrl = URL.createObjectURL(file);
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

    setTimeout(() => {
      const newMedia = {
        id: 'm_' + Date.now(),
        name: file.name,
        url: simulatedUrl,
        size: sizeMb,
        res: 'Custom',
        folder: activeFolder === 'All Media' ? 'Destinations' : activeFolder,
        alt: file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '),
        category: 'UPLOAD'
      };

      setMediaList(prev => [newMedia, ...prev]);
      setUploading(false);
      toast.success(`Asset "${file.name}" uploaded to ${newMedia.folder} library`);
    }, 800);
  };

  const handleCopyUrl = (item: any) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    toast.success(`Image URL copied for "${item.name}"`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Remove "${name}" from media library?`)) {
      setMediaList(prev => prev.filter(m => m.id !== id));
      toast.success(`Asset "${name}" removed`);
    }
  };

  const filteredMedia = mediaList.filter(media => {
    const matchesSearch = 
      media.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      media.alt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFolder = activeFolder === 'All Media' || media.folder === activeFolder;

    return matchesSearch && matchesFolder;
  });

  const folders = ['All Media', 'Destinations', 'Wildlife', 'Flora', 'Food', 'Products', 'Marketing'];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ImageIcon className="text-blue-600" /> Media Library
          </h1>
          <p className="text-slate-500 text-sm mt-1">High-resolution imagery catalog with entity mappings to prevent repeated image fallbacks.</p>
        </div>
        
        <label className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
          <Upload size={18} />
          <span>{uploading ? 'Processing...' : 'Upload Assets'}</span>
          <input 
            type="file" 
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden" 
          />
        </label>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[520px] flex flex-col md:flex-row">
        
        {/* Sidebar Folders */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50/50 p-4">
          <h3 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider text-slate-400">Entity Categories</h3>
          <ul className="space-y-1 text-sm font-semibold">
            {folders.map(folder => (
              <li 
                key={folder}
                onClick={() => setActiveFolder(folder)}
                className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                  activeFolder === folder 
                    ? 'bg-blue-600 text-white shadow-sm font-bold' 
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Folder size={16} className={activeFolder === folder ? 'text-white' : 'text-slate-400'} />
                  <span>{folder}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeFolder === folder ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {folder === 'All Media' 
                    ? mediaList.length 
                    : mediaList.filter(m => m.folder === folder).length}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Media Grid/List */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search file name or alt text..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="text-xs text-slate-500 font-semibold self-center">
              Showing {filteredMedia.length} visual asset(s) in <span className="text-slate-900 font-bold">{activeFolder}</span>
            </div>
          </div>

          <div className="flex-1 p-5 overflow-y-auto">
            {filteredMedia.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <ImageIcon size={36} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm font-semibold">No media assets found matching criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredMedia.map(media => (
                  <div key={media.id} className="border border-slate-200 rounded-2xl overflow-hidden group hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between bg-white">
                    <div className="h-36 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                      <img 
                        src={media.url} 
                        alt={media.alt} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                        <button 
                          onClick={() => handleCopyUrl(media)}
                          className="p-2 bg-white text-slate-900 text-xs font-bold rounded-lg shadow-sm hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
                          title="Copy Image URL"
                        >
                          {copiedId === media.id ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                          <span>{copiedId === media.id ? 'Copied' : 'Copy'}</span>
                        </button>
                        <button
                          onClick={() => handleDelete(media.id, media.name)}
                          className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
                          title="Delete Asset"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="p-3">
                      <div className="text-xs font-bold text-slate-900 truncate" title={media.name}>{media.name}</div>
                      <div className="text-[11px] text-slate-500 mt-1 line-clamp-1 italic" title={media.alt}>"{media.alt}"</div>
                      <div className="text-[10px] text-slate-400 mt-2 flex justify-between pt-2 border-t border-slate-100 font-medium">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">{media.size}</span>
                        <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold uppercase">{media.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
