import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { GenericDataTable, ColumnDef } from '../components/GenericDataTable';
import { JSONEditorModal } from '../components/JSONEditorModal';
import { Plus, Languages } from 'lucide-react';

export const TranslationsCMS = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editRow, setEditRow] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('content_translations')
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
      key: 'language_code', 
      header: 'Language', 
      render: (val) => (
        <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-md text-xs font-bold uppercase">
          {val}
        </span>
      )
    },
    { 
      key: 'entity_type', 
      header: 'Entity Type', 
      render: (val) => (
        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-semibold uppercase">
          {val}
        </span>
      )
    },
    { key: 'field_name', header: 'Field Name', render: (val) => <span className="font-mono text-xs text-blue-600">{val}</span> },
    { key: 'translated_text', header: 'Translated Text', render: (val) => <div className="text-xs text-slate-800 truncate max-w-xs">{val}</div> },
    { key: 'entity_id', header: 'Entity ID', render: (val) => <span className="font-mono text-xs text-slate-400 truncate max-w-[100px] block">{val}</span> }
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Languages className="text-amber-600" /> Internationalization & Translations CMS
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage multi-language translations for destinations, wildlife, dishes, stays, and activities.
          </p>
        </div>
        <button 
          onClick={() => {
            setEditRow({
              entity_type: 'location',
              entity_id: '',
              language_code: 'no',
              field_name: 'description',
              translated_text: ''
            });
            setIsModalOpen(true);
          }}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus size={18} /> Add Translation
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-slate-500">Loading translations...</div>
      ) : (
        <GenericDataTable 
          title="Content Translations Database"
          data={items}
          columns={columns}
          onEdit={(row) => {
            setEditRow(row);
            setIsModalOpen(true);
          }}
          onDelete={async (row) => {
            if (confirm('Delete translation entry?')) {
              await supabase.from('content_translations').delete().eq('id', row.id);
              fetchItems();
            }
          }}
        />
      )}

      <JSONEditorModal
        isOpen={isModalOpen}
        title={editRow?.id ? 'Edit Translation' : 'New Content Translation'}
        initialData={editRow}
        onClose={() => setIsModalOpen(false)}
        onSave={async (data) => {
          if (data.id) {
            const { error } = await supabase.from('content_translations').update(data).eq('id', data.id);
            if (error) throw error;
          } else {
            const { error } = await supabase.from('content_translations').insert(data);
            if (error) throw error;
          }
          fetchItems();
        }}
      />
    </div>
  );
};
