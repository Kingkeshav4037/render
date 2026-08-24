import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { GenericDataTable, ColumnDef } from '../components/GenericDataTable';
import { JSONEditorModal } from '../components/JSONEditorModal';
import { Plus, Sparkles, MapPin } from 'lucide-react';

export const AuroraCMS = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editRow, setEditRow] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    // Fetch northern locations or viewpoints suited for Aurora
    const { data } = await supabase
      .from('locations')
      .select('*')
      .gte('lat', 65.0)
      .order('name');
      
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);


  const columns: ColumnDef[] = [
    { key: 'name', header: 'Aurora Hotspot', render: (val) => <div className="font-bold text-navy-900">{val}</div> },
    { key: 'region', header: 'Region', render: (val) => val || 'Northern Norway' },
    { 
      key: 'coordinates', 
      header: 'Coordinates', 
      render: (_, row) => (
        <span className="flex items-center gap-1 font-mono text-xs text-slate-500">
          <MapPin size={12} className="text-violet-600" /> {row.lat?.toFixed(2)}°N, {row.lng?.toFixed(2)}°E
        </span>
      )
    },
    { 
      key: 'status', 
      header: 'Status', 
      render: (val) => (
        <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
          val === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {val}
        </span>
      )
    },
    { key: 'featured', header: 'Featured Spot', render: (val) => val ? '✨ Prime Spot' : 'Standard' }
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="text-violet-600" /> Aurora Observatories & Destinations
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage Arctic Circle aurora observation viewpoints, dark sky spots, and forecasts.</p>
        </div>
        <button 
          onClick={() => {
            setEditRow({ name: '', type: 'VIEWPOINT', region: 'Troms & Finnmark', lat: 69.64, lng: 18.95, status: 'PUBLISHED', featured: true });
            setIsModalOpen(true);
          }}
          className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-violet-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus size={18} /> Add Aurora Hotspot
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-slate-500">Loading aurora destinations...</div>
      ) : (
        <GenericDataTable 
          title="Aurora Viewpoints Database (Above 65°N)"
          data={items}
          columns={columns}
          onEdit={(row) => {
            setEditRow(row);
            setIsModalOpen(true);
          }}
        />
      )}

      <JSONEditorModal
        isOpen={isModalOpen}
        title={editRow?.id ? `Edit ${editRow.name}` : 'New Aurora Destination'}
        initialData={editRow}
        onClose={() => setIsModalOpen(false)}
        onSave={async (data) => {
          if (data.id) {
            const { error } = await supabase.from('locations').update(data).eq('id', data.id);
            if (error) throw error;
          } else {
            const { error } = await supabase.from('locations').insert(data);
            if (error) throw error;
          }
          fetchItems();
        }}
      />
    </div>
  );
};
