import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { GenericDataTable, ColumnDef } from '../components/GenericDataTable';
import { JSONEditorModal } from '../components/JSONEditorModal';
import { MapPin, Plus } from 'lucide-react';

export const PlacesCMS = () => {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [editRow, setEditRow] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    // Fetch canonical locations table from Phase A
    const { data } = await supabase
      .from('locations')
      .select('*')
      .order('name');
      
    if (data) setLocations(data);
    setLoading(false);
  };

  const columns: ColumnDef[] = [
    { key: 'name', header: 'Name', render: (val) => <div className="font-bold text-navy-900">{val}</div> },
    { key: 'type', header: 'Type', render: (val) => (
      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-bold uppercase">{val}</span>
    )},
    { key: 'status', header: 'Status', render: (val) => (
      <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
        val === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 
        val === 'DRAFT' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
      }`}>
        {val}
      </span>
    )},
    { key: 'coordinates', header: 'Coordinates', render: (_, row) => (
      row.latitude && row.longitude ? (
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MapPin size={12} /> {row.latitude.toFixed(4)}, {row.longitude.toFixed(4)}
        </div>
      ) : <span className="text-gray-400 italic">No coordinates</span>
    )}
  ];

  if (loading) return <div>Loading CMS...</div>;

  return (
    <div className="space-y-6 p-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">Places & Geography Manager</h1>
          <p className="text-gray-500 mt-1">Manage the canonical location hierarchy of Norway.</p>
        </div>
        <button className="bg-navy-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-navy-800 transition-colors flex items-center gap-2">
          <Plus size={18} /> Add New Place
        </button>
      </div>

      <GenericDataTable 
        title="Norway Locations Database"
        data={locations}
        columns={columns}
        onEdit={(row) => {
          setEditRow(row);
          setIsModalOpen(true);
        }}
      />
      
      <JSONEditorModal 
        isOpen={isModalOpen}
        title="Edit Location"
        initialData={editRow}
        onClose={() => setIsModalOpen(false)}
        onSave={async (data) => {
          const { error } = await supabase.from('locations').update(data).eq('id', data.id);
          if (error) throw error;
          fetchLocations(); // refresh
        }}
      />
    </div>
  );
};
