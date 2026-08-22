import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { GenericDataTable, ColumnDef } from '../components/GenericDataTable';
import { JSONEditorModal } from '../components/JSONEditorModal';
import { Plus, Utensils, Coffee } from 'lucide-react';

export const FoodCMS = () => {
  const [activeTab, setActiveTab] = useState<'restaurants' | 'foods'>('restaurants');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editRow, setEditRow] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const fetchItems = async () => {
    setLoading(true);
    if (activeTab === 'restaurants') {
      const { data } = await supabase
        .from('restaurants')
        .select('*, locations(name)')
        .order('name');
      if (data) setItems(data);
    } else {
      const { data } = await supabase
        .from('foods')
        .select('*')
        .order('name');
      if (data) setItems(data);
    }
    setLoading(false);
  };

  const restaurantColumns: ColumnDef[] = [
    { key: 'name', header: 'Name', render: (val) => <div className="font-bold text-navy-900">{val}</div> },
    { 
      key: 'type', 
      header: 'Type', 
      render: (val) => (
        <span className="px-2 py-1 bg-amber-50 text-amber-800 rounded-md text-xs font-bold uppercase">
          {val?.replace(/_/g, ' ')}
        </span>
      )
    },
    { key: 'locations.name', header: 'Location', render: (_, row) => row.locations?.name || 'Norway' },
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
    { key: 'rating', header: 'Rating', render: (val) => val ? `★ ${val}` : '—' },
    { key: 'price_range', header: 'Price Level', render: (val) => val || '$$' }
  ];

  const foodColumns: ColumnDef[] = [
    { key: 'name', header: 'Dish Name', render: (val) => <div className="font-bold text-navy-900">{val}</div> },
    { key: 'slug', header: 'Slug', render: (val) => <span className="font-mono text-xs text-slate-500">{val}</span> },
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
    { key: 'featured', header: 'Featured', render: (val) => val ? '⭐ Yes' : 'No' }
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Utensils className="text-amber-600" /> Food & Dining Manager
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage culinary specialties, traditional dishes, and restaurants.</p>
        </div>
        <button 
          onClick={() => {
            if (activeTab === 'restaurants') {
              setEditRow({ name: '', type: 'FINE_DINING', price_range: '3', rating: 4.5, status: 'PUBLISHED' });
            } else {
              setEditRow({ name: '', slug: '', description: '', status: 'PUBLISHED' });
            }
            setIsModalOpen(true);
          }}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus size={18} /> {activeTab === 'restaurants' ? 'Add Restaurant' : 'Add Dish'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('restaurants')}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'restaurants'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Utensils size={16} /> Restaurants ({activeTab === 'restaurants' ? items.length : '50+'})
        </button>
        <button
          onClick={() => setActiveTab('foods')}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'foods'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Coffee size={16} /> Traditional Foods ({activeTab === 'foods' ? items.length : '30+'})
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-slate-500">Loading dining items...</div>
      ) : (
        <GenericDataTable
          title={activeTab === 'restaurants' ? 'Establishments Directory' : 'Traditional Foods Database'}
          data={items}
          columns={activeTab === 'restaurants' ? restaurantColumns : foodColumns}
          onEdit={(row) => {
            setEditRow(row);
            setIsModalOpen(true);
          }}
          onDelete={async (row) => {
            if (confirm(`Delete ${row.name}?`)) {
              await supabase.from(activeTab).delete().eq('id', row.id);
              fetchItems();
            }
          }}
        />
      )}

      <JSONEditorModal
        isOpen={isModalOpen}
        title={editRow?.id ? `Edit ${editRow.name}` : `New ${activeTab === 'restaurants' ? 'Restaurant' : 'Food'}`}
        initialData={editRow}
        onClose={() => setIsModalOpen(false)}
        onSave={async (data) => {
          if (data.id) {
            const { error } = await supabase.from(activeTab).update(data).eq('id', data.id);
            if (error) throw error;
          } else {
            const { error } = await supabase.from(activeTab).insert(data);
            if (error) throw error;
          }
          fetchItems();
        }}
      />
    </div>
  );
};
