import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { supabase } from '../../../../lib/supabase';
import { useAdmin } from '../../../../hooks/useAdmin';
import { Loader2, Save, ArrowLeft } from 'lucide-react';

export const PlaceEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasPermission } = useAdmin();
  
  const canPublish = hasPermission('content', 'publish');
  const isNew = id === 'new';

  const { data: place, isLoading } = useQuery({
    queryKey: ['admin-place', id],
    queryFn: async () => {
      if (isNew) return null;
      const { data, error } = await supabase.from('locations').select('*').eq('id', id as string).single();
      if (error) throw error;
      return data;
    },
    enabled: !isNew,
  });

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    values: place || {
      name: '',
      slug: '',
      description: '',
      region: '',
      type: 'PLACE',
      status: 'DRAFT'
    }
  });

  const onSubmit = async (data: any) => {
    try {
      if (isNew) {
        await supabase.from('locations').insert([data]);
      } else {
        await supabase.from('locations').update(data).eq('id', id as string);
      }
      navigate('/admin/content');
    } catch (error) {
      console.error(error);
      alert('Error saving place');
    }
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-blue-600" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/content')} className="text-gray-500 hover:text-gray-900">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-navy-900">{isNew ? 'New Place' : 'Edit Place'}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow border border-gray-200 p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input {...register('name')} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input {...register('slug')} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea {...register('description')} rows={4} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
            <input {...register('region')} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select {...register('status')} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" disabled={!canPublish && !isNew}>
              <option value="DRAFT">Draft</option>
              <option value="IN_REVIEW">In Review</option>
              {canPublish && <option value="PUBLISHED">Published</option>}
              {canPublish && <option value="ARCHIVED">Archived</option>}
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Place
          </button>
        </div>
      </form>
    </div>
  );
};
