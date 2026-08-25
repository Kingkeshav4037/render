import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { GenericDataTable, ColumnDef } from '../components/GenericDataTable';
import { JSONEditorModal } from '../components/JSONEditorModal';
import { Plus, Utensils, Coffee, Image as ImageIcon, CheckCircle, XCircle, Star, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { getFoodImage } from '../../../services/foodService';

export const FoodCMS = () => {
  const [activeTab, setActiveTab] = useState<'restaurants' | 'foods'>('restaurants');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editRow, setEditRow] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'restaurants') {
        const { data, error } = await supabase
          .from('restaurants')
          .select('*, locations(name)')
          .order('name');
        if (error) throw error;
        setItems(data || []);
      } else {
        const { data, error } = await supabase
          .from('foods')
          .select('*')
          .order('name');
        if (error) throw error;
        setItems(data || []);
      }
    } catch (err: any) {
      console.error('Failed to load food CMS items:', err);
      toast.error('Failed to retrieve items from database');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const restaurantColumns: ColumnDef[] = [
    { 
      key: 'name', 
      header: 'Restaurant', 
      render: (val, row) => (
        <div className="flex items-center gap-3">
          {row.image_url ? (
            <img src={row.image_url} alt={val} className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Utensils size={18} />
            </div>
          )}
          <div>
            <div className="font-bold text-slate-900">{val}</div>
            <div className="text-[11px] text-slate-400 font-mono">{row.locations?.name || 'Norway'}</div>
          </div>
        </div>
      )
    },
    { 
      key: 'type', 
      header: 'Type', 
      render: (val) => (
        <span className="px-2 py-0.5 bg-amber-50 text-amber-800 rounded text-xs font-bold uppercase">
          {val?.replace(/_/g, ' ')}
        </span>
      )
    },
    { 
      key: 'status', 
      header: 'Status', 
      render: (val) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
          val === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
        }`}>
          {val || 'PUBLISHED'}
        </span>
      )
    },
    { 
      key: 'rating', 
      header: 'Rating', 
      render: (val) => val ? (
        <span className="text-amber-600 font-bold text-xs flex items-center gap-1">
          <Star size={12} className="fill-amber-400 text-amber-400" /> {val}
        </span>
      ) : '—' 
    },
    { key: 'price_range', header: 'Price Level', render: (val) => <span className="font-mono text-xs text-slate-700">{val || '$$$'}</span> }
  ];

  const foodColumns: ColumnDef[] = [
    { 
      key: 'name', 
      header: 'Traditional Dish', 
      render: (val, row) => {
        const img = row.image_url || getFoodImage(val);
        return (
          <div className="flex items-center gap-3">
            <img src={img} alt={val} className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0" />
            <div>
              <div className="font-bold text-slate-900">{val}</div>
              <div className="text-[11px] text-slate-400 font-mono">/food/{row.slug || row.id}</div>
            </div>
          </div>
        );
      } 
    },
    { 
      key: 'category', 
      header: 'Category', 
      render: (val, row) => (
        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-semibold uppercase">
          {val || row.dish_type || 'TRADITIONAL'}
        </span>
      )
    },
    {
      key: 'price',
      header: 'Portion Price',
      render: (val, row) => (
        <span className="font-bold text-slate-900 text-xs">
          {val || row.price_nok || 245} NOK
        </span>
      )
    },
    { 
      key: 'status', 
      header: 'Availability', 
      render: (val, row) => {
        const isAvailable = row.status !== 'ARCHIVED' && row.status !== 'DRAFT' && row.is_available !== false;
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
            isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
          }`}>
            {isAvailable ? <CheckCircle size={12} /> : <XCircle size={12} />}
            {isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}
          </span>
        );
      }
    },
    { 
      key: 'featured', 
      header: 'Featured', 
      render: (val) => val ? (
        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-xs font-bold">⭐ Featured</span>
      ) : <span className="text-slate-400 text-xs">Standard</span>
    }
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Utensils className="text-amber-600" /> Food & Dining Manager
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage culinary specialties, traditional dishes, price points, and restaurants.</p>
        </div>
        <button 
          onClick={() => {
            if (activeTab === 'restaurants') {
              setEditRow({ name: '', type: 'FINE_DINING', price_range: '3', rating: 4.5, status: 'PUBLISHED' });
            } else {
              setEditRow({ 
                name: '', 
                slug: '', 
                price: 245, 
                category: 'Traditional', 
                description: '', 
                status: 'PUBLISHED',
                is_available: true,
                featured: false 
              });
            }
            setIsModalOpen(true);
          }}
          className="bg-amber-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-amber-700 transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <Plus size={18} /> {activeTab === 'restaurants' ? 'Add Restaurant' : 'Add Dish'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('restaurants')}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'restaurants'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Utensils size={16} /> Restaurants ({activeTab === 'restaurants' ? items.length : '50+'})
        </button>
        <button
          onClick={() => setActiveTab('foods')}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'foods'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Coffee size={16} /> Traditional Foods ({activeTab === 'foods' ? items.length : '30+'})
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-slate-500 font-medium">Loading dining items...</div>
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
            if (window.confirm(`Delete ${row.name}?`)) {
              try {
                const { error } = await supabase.from(activeTab).delete().eq('id', row.id);
                if (error) throw error;
                toast.success(`${row.name} deleted successfully`);
                fetchItems();
              } catch (err: any) {
                toast.error(err?.message || 'Failed to delete item');
              }
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
          try {
            if (data.id) {
              const { error } = await supabase.from(activeTab).update(data).eq('id', data.id);
              if (error) throw error;
              toast.success('Item updated successfully');
            } else {
              const { error } = await supabase.from(activeTab).insert(data);
              if (error) throw error;
              toast.success('Item created successfully');
            }
            fetchItems();
          } catch (err: any) {
            toast.error(err?.message || 'Failed to save item');
            throw err;
          }
        }}
      />
    </div>
  );
};
