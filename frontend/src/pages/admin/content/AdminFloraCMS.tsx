import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { GenericDataTable, ColumnDef } from '../components/GenericDataTable';
import { JSONEditorModal } from '../components/JSONEditorModal';
import { Plus, Trees, Leaf, Image as ImageIcon, ShieldAlert, Sparkles } from 'lucide-react';
import { toast } from '../../../store/useToastStore';

export const AdminFloraCMS = () => {
  const [species, setSpecies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editRow, setEditRow] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSpecies();
  }, []);

  const fetchSpecies = async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('flora_species')
        .select('*')
        .order('common_name');

      if (!error && data) {
        setSpecies(data);
      }
    } catch (err) {
      console.warn('Failed to fetch flora species from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedJson: any) => {
    try {
      if (updatedJson.id) {
        const { error } = await (supabase as any)
          .from('flora_species')
          .update({
            ...updatedJson,
            updated_at: new Date().toISOString()
          })
          .eq('id', updatedJson.id);

        if (error) throw error;
        toast.success(`Updated ${updatedJson.common_name}`);
      } else {
        const { error } = await (supabase as any)
          .from('flora_species')
          .insert([{
            ...updatedJson,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);

        if (error) throw error;
        toast.success(`Created ${updatedJson.common_name}`);
      }
      setIsModalOpen(false);
      fetchSpecies();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to save botanical species');
    }
  };

  const handleDelete = async (row: any) => {
    if (!window.confirm(`Are you sure you want to delete "${row.common_name}"?`)) return;
    try {
      const { error } = await (supabase as any)
        .from('flora_species')
        .delete()
        .eq('id', row.id);

      if (error) throw error;
      toast.info(`Deleted ${row.common_name}`);
      fetchSpecies();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to delete species');
    }
  };

  const columns: ColumnDef[] = [
    {
      key: 'common_name',
      header: 'Botanical Species',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 shrink-0 overflow-hidden border border-slate-200">
            {row.image_url ? (
              <img src={row.image_url} alt={row.common_name} className="w-full h-full object-cover" />
            ) : (
              <ImageIcon size={16} />
            )}
          </div>
          <div>
            <div className="font-bold text-slate-900">{row.common_name}</div>
            <div className="text-xs text-slate-500 italic font-serif">
              {row.scientific_name} {row.norwegian_name && `(${row.norwegian_name})`}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
      render: (val) => (
        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-semibold">
          {val || 'General'}
        </span>
      )
    },
    {
      key: 'habitat',
      header: 'Habitat & Region',
      render: (_, row) => (
        <div className="text-xs text-slate-600 max-w-xs truncate">
          <span className="font-medium text-slate-800">{row.habitat}</span>
          {row.distribution_region && <div className="text-slate-400">{row.distribution_region}</div>}
        </div>
      )
    },
    {
      key: 'conservation_status',
      header: 'Status',
      render: (val) => {
        const isProtected = val?.toLowerCase().includes('protect') || val?.toLowerCase().includes('vulnerable');
        return (
          <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
            isProtected ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
          }`}>
            {isProtected && <ShieldAlert size={11} />}
            {val || 'Common'}
          </span>
        );
      }
    },
    {
      key: 'foraging_status',
      header: 'Foraging (Allemannsretten)',
      render: (val) => (
        <span className="text-xs text-slate-600 font-medium">
          {val || 'Non-edible'}
        </span>
      )
    }
  ];

  if (loading) {
    return <div className="p-8 text-slate-500">Loading botanical flora database...</div>;
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Trees className="text-emerald-600" /> Norway Flora & Botanical CMS
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage Norwegian trees, boreal forests, alpine wildflowers, arctic berries, and protected native orchids.
          </p>
        </div>
        <button 
          onClick={() => {
            setEditRow({
              common_name: '',
              norwegian_name: '',
              scientific_name: '',
              category: 'Trees',
              habitat: 'Boreal forest',
              distribution_region: 'Across Norway',
              flowering_season: 'May – July',
              foraging_status: 'Not Recommended',
              conservation_status: 'Common / Least Concern',
              description: '',
              ecological_role: '',
              traditional_uses: '',
              foraging_tips: '',
              image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800'
            });
            setIsModalOpen(true);
          }}
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus size={18} /> Add Botanical Species
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <GenericDataTable
          title="Botanical Species Registry"
          data={species}
          columns={columns}
          onEdit={(row) => {
            setEditRow(row);
            setIsModalOpen(true);
          }}
          onDelete={handleDelete}
        />
      </div>

      <JSONEditorModal
        isOpen={isModalOpen}
        title={editRow?.id ? `Edit Species: ${editRow.common_name}` : 'New Botanical Species'}
        initialData={editRow}
        onSave={handleSave}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
