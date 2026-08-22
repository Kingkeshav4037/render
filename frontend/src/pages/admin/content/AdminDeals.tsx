import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Deal } from '../../../services/dealService';
import { Plus, Trash, Edit, Tag } from 'lucide-react';

export const AdminDeals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    const { data } = await supabase.from('deals').select('*').order('created_at', { ascending: false });
    setDeals((data as any) || []);
    setLoading(false);
  };

  const deleteDeal = async (id: string) => {
    if (!confirm('Are you sure you want to delete this deal?')) return;
    await supabase.from('deals').delete().eq('id', id);
    fetchDeals();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Deals</h1>
        <button className="bg-navy-900 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={20} /> Add Deal
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>)}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Deal Name</th>
                <th className="p-4 font-semibold text-gray-600">Price</th>
                <th className="p-4 font-semibold text-gray-600">Discount</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deals.map(deal => (
                <tr key={deal.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="p-4 font-medium">{deal.name}</td>
                  <td className="p-4">
                    NOK {deal.price}
                    {deal.original_price > deal.price && (
                      <span className="text-gray-400 line-through text-xs ml-2">NOK {deal.original_price}</span>
                    )}
                  </td>
                  <td className="p-4">
                    {deal.discount_percentage ? (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">
                        {deal.discount_percentage}% OFF
                      </span>
                    ) : '-'}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      deal.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {deal.status}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-navy-900"><Edit size={18} /></button>
                    <button onClick={() => deleteDeal(deal.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash size={18} /></button>
                  </td>
                </tr>
              ))}
              {deals.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No deals found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
