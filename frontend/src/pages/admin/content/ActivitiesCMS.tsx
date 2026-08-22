import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { GenericDataTable, ColumnDef } from '../components/GenericDataTable';
import { Plus } from 'lucide-react';

export const ActivitiesCMS = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('activities')
      .select('*, locations(name)')
      .order('name');
      
    if (data) setItems(data);
    setLoading(false);
  };

  const columns: ColumnDef[] = [
    { key: 'name', header: 'Name', render: (val) => <div className="font-bold text-navy-900">{val}</div> },
    { key: 'type', header: 'Type', render: (val) => (
      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-bold uppercase">{val}</span>
    )},
    { key: 'locations.name', header: 'Location', render: (_, row) => row.locations?.name || 'Unknown' },
    { key: 'status', header: 'Status', render: (val) => (
      <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
        val === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 
        val === 'DRAFT' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
      }`}>
        {val}
      </span>
    )},
    { key: 'price', header: 'Price', render: (_, row) => `${row.price} ${row.currency}` }
  ];

  if (loading) return <div>Loading CMS...</div>;

  return (
    <div className="space-y-6 p-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">Activities Manager</h1>
          <p className="text-gray-500 mt-1">Manage tours, hikes, and experiences.</p>
        </div>
        <button className="bg-navy-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-navy-800 transition-colors flex items-center gap-2">
          <Plus size={18} /> Add New Activity
        </button>
      </div>

      <GenericDataTable 
        title="Activities Database"
        data={items}
        columns={columns}
        onEdit={(row) => {}}
      />
    </div>
  );
};
