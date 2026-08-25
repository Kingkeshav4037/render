import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { useAdmin } from '../../../hooks/useAdmin';
import { Loader2, Plus, Edit, Trash2, CheckCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ContentManager = () => {
  const { hasPermission } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  
  const canUpdate = hasPermission('content', 'update');
  const canCreate = hasPermission('content', 'create');

  const { data: places, isLoading } = useQuery({
    queryKey: ['admin-destinations', searchTerm],
    queryFn: async () => {
      let query = supabase.from('locations').select('*').order('created_at', { ascending: false });
      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }
      const { data, error } = await query.limit(50);
      if (error) throw error;
      return data as any[];
    }
  });

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-blue-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Content Manager</h1>
          <p className="text-gray-500">Manage Norway destinations, activities, and places.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search places..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
          {canCreate && (
            <Link 
              to="/admin/content/places/new"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Place
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Place</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {places?.map((place) => (
              <tr key={place.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {place.hero_image_url ? (
                      <img src={place.hero_image_url} alt={place.name} className="w-10 h-10 rounded object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-gray-200 flex-shrink-0" />
                    )}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{place.name}</div>
                      <div className="text-sm text-gray-500">{place.region || 'Norway'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium uppercase">
                    {place.type || 'DESTINATION'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                    <CheckCircle className="w-4 h-4" /> PUBLISHED
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  {canUpdate && (
                    <Link to={`/admin/content/places/${place.id}/edit`} className="text-blue-600 hover:text-blue-900" title="Edit">
                      <Edit className="w-4 h-4 inline" />
                    </Link>
                  )}
                  {hasPermission('content', 'delete') && (
                    <button className="text-red-600 hover:text-red-900" title="Delete">
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {places?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No content found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
