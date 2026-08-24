import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { GenericDataTable, ColumnDef } from '../components/GenericDataTable';
import { JSONEditorModal } from '../components/JSONEditorModal';
import { Plus, Leaf, Image as ImageIcon } from 'lucide-react';

export const AdminWildlifeCMS = () => {
  const [species, setSpecies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editRow, setEditRow] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSpecies = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('wildlife_species')
      .select('*, content_media(media_url)')
      .order('common_name');

    if (!error && data) {
      setSpecies(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSpecies();
  }, []);


  const columns: ColumnDef[] = [
    {
      key: 'common_name',
      header: 'Species',
      render: (_, row) => {
        const imgUrl = row.content_media?.[0]?.media_url;
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 shrink-0 overflow-hidden border border-slate-200">
              {imgUrl ? (
                <img src={imgUrl} alt={row.common_name} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon size={16} />
              )}
            </div>
            <div>
              <div className="font-bold text-slate-900">{row.common_name}</div>
              <div className="text-xs text-slate-500 italic font-serif">{row.scientific_name}</div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'conservation_status',
      header: 'Conservation Status',
      render: (val) => (
        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
          val === 'Vulnerable' || val === 'Endangered' 
            ? 'bg-amber-100 text-amber-800' 
            : 'bg-emerald-100 text-emerald-800'
        }`}>
          {val || 'Protected'}
        </span>
      )
    },
    {
      key: 'slug',
      header: 'Slug',
      render: (val) => <span className="font-mono text-xs text-slate-600">{val}</span>
    },
    {
      key: 'source_name',
      header: 'Source',
      render: (val) => <span className="text-xs text-slate-500">{val || 'Artsdatabanken'}</span>
    }
  ];

  if (loading) {
    return <div className="p-8 text-slate-500">Loading wildlife species...</div>;
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Leaf className="text-emerald-600" /> Wildlife CMS
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage Norwegian fauna species, scientific classification, conservation status, and media.
          </p>
        </div>
        <button 
          onClick={() => {
            setEditRow({
              common_name: '',
              scientific_name: '',
              slug: '',
              conservation_status: 'Least Concern',
              description: ''
            });
            setIsModalOpen(true);
          }}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus size={18} /> Add Species
        </button>
      </div>

      <GenericDataTable
        title="Species Directory"
        data={species}
        columns={columns}
        onEdit={(row) => {
          setEditRow(row);
          setIsModalOpen(true);
        }}
        onDelete={async (row) => {
          if (confirm(`Delete ${row.common_name}?`)) {
            await supabase.from('wildlife_species').delete().eq('id', row.id);
            fetchSpecies();
          }
        }}
      />

      <JSONEditorModal
        isOpen={isModalOpen}
        title={editRow?.id ? `Edit ${editRow.common_name}` : 'New Species'}
        initialData={editRow}
        onClose={() => setIsModalOpen(false)}
        onSave={async (data) => {
          if (data.id) {
            const { error } = await supabase
              .from('wildlife_species')
              .update(data)
              .eq('id', data.id);
            if (error) throw error;
          } else {
            const { error } = await supabase
              .from('wildlife_species')
              .insert(data);
            if (error) throw error;
          }
          fetchSpecies();
        }}
      />
    </div>
  );
};
