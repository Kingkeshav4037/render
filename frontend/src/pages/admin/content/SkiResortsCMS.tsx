import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { GenericDataTable, ColumnDef } from '../components/GenericDataTable';
import { JSONEditorModal } from '../components/JSONEditorModal';
import { Plus, Snowflake } from 'lucide-react';

export const SkiResortsCMS = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editRow, setEditRow] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('winter_resorts')
      .select('*, locations(name)')
      .order('name');
      
    if (data) setItems(data);
    setLoading(false);
  };

  const columns: ColumnDef[] = [
    { key: 'name', header: 'Resort Name', render: (val) => <div className="font-bold text-navy-900">{val}</div> },
    { key: 'locations.name', header: 'Location', render: (_, row) => row.locations?.name || 'Norway' },
    { key: 'total_lifts', header: 'Total Lifts', render: (val) => val ?? '—' },
    { key: 'open_lifts', header: 'Open Lifts', render: (val) => val ?? '—' },
    { key: 'snow_depth_cm', header: 'Snow Depth', render: (val) => val ? `${val} cm` : '—' },
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
    { key: 'base_pass_price', header: 'Day Pass', render: (val) => val ? `NOK ${val}` : '—' }
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Snowflake className="text-sky-600" /> Winter & Ski Resorts Manager
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage alpine resorts, ski lifts, snow conditions, and lift pass pricing.</p>
        </div>
        <button 
          onClick={() => {
            setEditRow({ name: '', total_lifts: 15, open_lifts: 12, snow_depth_cm: 85, base_pass_price: 590, status: 'PUBLISHED' });
            setIsModalOpen(true);
          }}
          className="bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-sky-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus size={18} /> Add Ski Resort
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-slate-500">Loading ski resorts...</div>
      ) : (
        <GenericDataTable 
          title="Ski Resorts Database"
          data={items}
          columns={columns}
          onEdit={(row) => {
            setEditRow(row);
            setIsModalOpen(true);
          }}
          onDelete={async (row) => {
            if (confirm(`Delete resort ${row.name}?`)) {
              await supabase.from('winter_resorts').delete().eq('id', row.id);
              fetchItems();
            }
          }}
        />
      )}

      <JSONEditorModal
        isOpen={isModalOpen}
        title={editRow?.id ? `Edit ${editRow.name}` : 'New Ski Resort'}
        initialData={editRow}
        onClose={() => setIsModalOpen(false)}
        onSave={async (data) => {
          if (data.id) {
            const { error } = await supabase.from('winter_resorts').update(data).eq('id', data.id);
            if (error) throw error;
          } else {
            const { error } = await supabase.from('winter_resorts').insert(data);
            if (error) throw error;
          }
          fetchItems();
        }}
      />
    </div>
  );
};
