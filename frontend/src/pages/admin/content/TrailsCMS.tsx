import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { GenericDataTable, ColumnDef } from '../components/GenericDataTable';
import { JSONEditorModal } from '../components/JSONEditorModal';
import { Plus, Mountain } from 'lucide-react';

export const TrailsCMS = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editRow, setEditRow] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('trails')
      .select('*, locations(name)')
      .order('name');
      
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);


  const columns: ColumnDef[] = [
    { key: 'name', header: 'Trail Name', render: (val) => <div className="font-bold text-navy-900">{val}</div> },
    { key: 'locations.name', header: 'Location', render: (_, row) => row.locations?.name || 'Norway' },
    { 
      key: 'difficulty', 
      header: 'Difficulty', 
      render: (val) => (
        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${
          val === 'Easy' ? 'bg-green-100 text-green-700' :
          val === 'Moderate' ? 'bg-blue-100 text-blue-700' :
          val === 'Hard' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
        }`}>
          {val || 'Moderate'}
        </span>
      )
    },
    { key: 'distance_km', header: 'Distance', render: (val) => val ? `${val} km` : '—' },
    { key: 'elevation_gain_m', header: 'Elevation Gain', render: (val) => val ? `${val} m` : '—' },
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
    }
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Mountain className="text-purple-600" /> Hiking Trails Manager
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage hiking trails, routes, difficulties, and elevation metrics.</p>
        </div>
        <button 
          onClick={() => {
            setEditRow({ name: '', difficulty: 'Moderate', distance_km: 10, elevation_gain_m: 500, status: 'PUBLISHED' });
            setIsModalOpen(true);
          }}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus size={18} /> Add Trail
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-slate-500">Loading trails...</div>
      ) : (
        <GenericDataTable 
          title="Trails Database"
          data={items}
          columns={columns}
          onEdit={(row) => {
            setEditRow(row);
            setIsModalOpen(true);
          }}
          onDelete={async (row) => {
            if (confirm(`Delete trail ${row.name}?`)) {
              await supabase.from('trails').delete().eq('id', row.id);
              fetchItems();
            }
          }}
        />
      )}

      <JSONEditorModal
        isOpen={isModalOpen}
        title={editRow?.id ? `Edit ${editRow.name}` : 'New Hiking Trail'}
        initialData={editRow}
        onClose={() => setIsModalOpen(false)}
        onSave={async (data) => {
          if (data.id) {
            const { error } = await supabase.from('trails').update(data).eq('id', data.id);
            if (error) throw error;
          } else {
            const { error } = await supabase.from('trails').insert(data);
            if (error) throw error;
          }
          fetchItems();
        }}
      />
    </div>
  );
};
