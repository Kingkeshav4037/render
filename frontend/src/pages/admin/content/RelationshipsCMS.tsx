import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { GenericDataTable, ColumnDef } from '../components/GenericDataTable';
import { JSONEditorModal } from '../components/JSONEditorModal';
import { Plus, Network } from 'lucide-react';

export const RelationshipsCMS = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editRow, setEditRow] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('content_relationships')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);


  const columns: ColumnDef[] = [
    { 
      key: 'source_type', 
      header: 'Source Entity', 
      render: (val, row) => (
        <div>
          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-bold uppercase">{val}</span>
          <div className="font-mono text-xs text-slate-400 mt-0.5 truncate max-w-[120px]">{row.source_id}</div>
        </div>
      )
    },
    { 
      key: 'relationship_type', 
      header: 'Relationship', 
      render: (val) => (
        <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-md text-xs font-bold font-mono uppercase">
          {val}
        </span>
      )
    },
    { 
      key: 'target_type', 
      header: 'Target Entity', 
      render: (val, row) => (
        <div>
          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs font-bold uppercase">{val}</span>
          <div className="font-mono text-xs text-slate-400 mt-0.5 truncate max-w-[120px]">{row.target_id}</div>
        </div>
      )
    },
    { 
      key: 'status', 
      header: 'Status', 
      render: (val) => (
        <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
          val === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {val || 'PUBLISHED'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Network className="text-indigo-600" /> Content Graph & Relationships
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Link destinations to nearby activities, restaurants, stays, wildlife habitats, and events.
          </p>
        </div>
        <button 
          onClick={() => {
            setEditRow({
              source_type: 'location',
              source_id: '',
              relationship_type: 'related_activity',
              target_type: 'activity',
              target_id: '',
              status: 'PUBLISHED'
            });
            setIsModalOpen(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus size={18} /> Add Relationship
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-slate-500">Loading relationships graph...</div>
      ) : (
        <GenericDataTable 
          title="Entity Relationship Graph"
          data={items}
          columns={columns}
          onEdit={(row) => {
            setEditRow(row);
            setIsModalOpen(true);
          }}
          onDelete={async (row) => {
            if (confirm('Delete relationship?')) {
              await supabase.from('content_relationships').delete().eq('id', row.id);
              fetchItems();
            }
          }}
        />
      )}

      <JSONEditorModal
        isOpen={isModalOpen}
        title={editRow?.id ? 'Edit Relationship' : 'New Entity Relationship'}
        initialData={editRow}
        onClose={() => setIsModalOpen(false)}
        onSave={async (data) => {
          if (data.id) {
            const { error } = await supabase.from('content_relationships').update(data).eq('id', data.id);
            if (error) throw error;
          } else {
            const { error } = await supabase.from('content_relationships').insert(data);
            if (error) throw error;
          }
          fetchItems();
        }}
      />
    </div>
  );
};
