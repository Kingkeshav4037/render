import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { GenericDataTable, ColumnDef } from '../components/GenericDataTable';
import { JSONEditorModal } from '../components/JSONEditorModal';
import { Plus, Car } from 'lucide-react';

export const RoadTripsCMS = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editRow, setEditRow] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('road_trips')
      .select('*')
      .order('name');
      
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);


  const columns: ColumnDef[] = [
    { key: 'name', header: 'Route Name', render: (val) => <div className="font-bold text-navy-900">{val}</div> },
    { key: 'slug', header: 'Slug', render: (val) => <span className="font-mono text-xs text-slate-500">{val}</span> },
    { key: 'distance_km', header: 'Distance', render: (val) => val ? `${val} km` : '—' },
    { key: 'duration_days', header: 'Duration', render: (val) => val ? `${val} days` : '—' },
    { key: 'season', header: 'Best Season', render: (val) => val || 'Summer' },
    { 
      key: 'difficulty', 
      header: 'Difficulty', 
      render: (val) => (
        <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase bg-slate-100 text-slate-700">
          {val || 'Moderate'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Car className="text-emerald-600" /> Scenic Road Trips Manager
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage Norwegian Scenic Routes, driving itineraries, and viewpoints.</p>
        </div>
        <button 
          onClick={() => {
            setEditRow({ name: '', slug: '', distance_km: 250, duration_days: 3, season: 'June–September', difficulty: 'Easy' });
            setIsModalOpen(true);
          }}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus size={18} /> Add Road Trip
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-slate-500">Loading road trips...</div>
      ) : (
        <GenericDataTable 
          title="Road Trips Database"
          data={items}
          columns={columns}
          onEdit={(row) => {
            setEditRow(row);
            setIsModalOpen(true);
          }}
          onDelete={async (row) => {
            if (confirm(`Delete road trip ${row.name}?`)) {
              await supabase.from('road_trips').delete().eq('id', row.id);
              fetchItems();
            }
          }}
        />
      )}

      <JSONEditorModal
        isOpen={isModalOpen}
        title={editRow?.id ? `Edit ${editRow.name}` : 'New Scenic Road Trip'}
        initialData={editRow}
        onClose={() => setIsModalOpen(false)}
        onSave={async (data) => {
          if (data.id) {
            const { error } = await supabase.from('road_trips').update(data).eq('id', data.id);
            if (error) throw error;
          } else {
            const { error } = await supabase.from('road_trips').insert(data);
            if (error) throw error;
          }
          fetchItems();
        }}
      />
    </div>
  );
};
