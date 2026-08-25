import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { GenericDataTable, ColumnDef } from '../components/GenericDataTable';
import { JSONEditorModal } from '../components/JSONEditorModal';
import { MapPin, Plus, Eye, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export const PlacesCMS = () => {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [editRow, setEditRow] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('name');
        
      if (error) throw error;
      if (data) setLocations(data);
    } catch (err: any) {
      console.warn('Error fetching places:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const columns: ColumnDef[] = [
    { 
      key: 'name', 
      header: 'Place & Destination', 
      render: (val, row) => (
        <div className="flex items-center gap-3">
          {row.image_url || row.hero_image_url ? (
            <img 
              src={row.image_url || row.hero_image_url} 
              alt={val} 
              className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0" 
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ImageIcon size={18} />
            </div>
          )}
          <div>
            <div className="font-bold text-slate-900">{val}</div>
            <div className="text-[11px] text-slate-400 font-mono">/destinations/{row.slug || val?.toLowerCase().replace(/\s+/g, '-')}</div>
          </div>
        </div>
      ) 
    },
    { 
      key: 'type', 
      header: 'Type & Region', 
      render: (val, row) => (
        <div className="space-y-0.5">
          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-bold uppercase">{val}</span>
          <div className="text-[11px] text-slate-400">{row.region || 'Norway'}</div>
        </div>
      )
    },
    { 
      key: 'status', 
      header: 'Status', 
      render: (val) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
          val === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' : 
          val === 'DRAFT' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
        }`}>
          {val || 'PUBLISHED'}
        </span>
      )
    },
    { 
      key: 'coordinates', 
      header: 'Coordinates', 
      render: (_, row) => (
        row.latitude && row.longitude ? (
          <div className="flex items-center gap-1 text-xs text-slate-500 font-mono">
            <MapPin size={12} className="text-slate-400" /> {Number(row.latitude).toFixed(4)}, {Number(row.longitude).toFixed(4)}
          </div>
        ) : <span className="text-slate-400 italic text-xs">No GPS</span>
      )
    },
    {
      key: 'preview',
      header: 'Public Link',
      render: (_, row) => (
        <a 
          href={`/destinations/${row.slug || row.id}`} 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
          title="Preview public destination page"
        >
          <Eye size={13} /> Preview <ExternalLink size={11} />
        </a>
      )
    }
  ];

  if (loading) return <div className="p-8 text-slate-500 font-medium">Loading CMS places directory...</div>;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <MapPin className="text-blue-600" /> Places & Geography Manager
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage the canonical location hierarchy of Norway for travel guides and the Smart Map.</p>
        </div>
        <button 
          onClick={() => {
            setEditRow({
              name: '',
              slug: '',
              type: 'CITY',
              region: 'Western Norway',
              latitude: 60.3913,
              longitude: 5.3221,
              description: '',
              status: 'PUBLISHED'
            });
            setIsModalOpen(true);
          }}
          className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm text-sm cursor-pointer"
        >
          <Plus size={18} /> Add New Place
        </button>
      </div>

      <GenericDataTable 
        title="Norway Locations Database"
        data={locations}
        columns={columns}
        onEdit={(row) => {
          setEditRow(row);
          setIsModalOpen(true);
        }}
        onDelete={async (row) => {
          if (window.confirm(`Delete place "${row.name}"?`)) {
            const { error } = await supabase.from('locations').delete().eq('id', row.id);
            if (error) {
              toast.error('Failed to delete location');
            } else {
              toast.success(`Location "${row.name}" deleted`);
              fetchLocations();
            }
          }
        }}
      />
      
      <JSONEditorModal 
        isOpen={isModalOpen}
        title={editRow?.id ? `Edit Location: ${editRow?.name}` : 'Create New Location'}
        initialData={editRow}
        onClose={() => setIsModalOpen(false)}
        onSave={async (data) => {
          if (data.id) {
            const { error } = await (supabase as any).from('locations').update(data).eq('id', data.id);
            if (error) throw error;
            toast.success(`Location "${data.name}" updated successfully`);
          } else {
            const { error } = await (supabase as any).from('locations').insert(data);
            if (error) throw error;
            toast.success(`Location "${data.name}" created successfully`);
          }
          fetchLocations();
        }}
      />
    </div>
  );
};
