// @ts-nocheck
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { Loader2, Search, UserCheck, UserX, Shield, Edit } from 'lucide-react';
import { useAdmin } from '../../../hooks/useAdmin';

export const UserManager = () => {
  const { hasPermission } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  
  const canUpdateUsers = hasPermission('users', 'update');
  const canSuspendUsers = hasPermission('users', 'suspend');

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['admin-users', searchTerm],
    queryFn: async () => {
      let query = supabase.from('profiles').select('*');
      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }
      const { data, error } = await query.limit(50);
      if (error) throw error;
      return data;
    },
  });

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!canUpdateUsers) return;
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    if (!error) refetch();
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-blue-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">User Management</h1>
          <p className="text-gray-500">Manage user accounts and application roles.</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users?.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">{user.full_name?.charAt(0) || user.email?.charAt(0)}</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.full_name || 'No Name'}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role || 'USER'}
                    disabled={!canUpdateUsers || user.role === 'SUPER_ADMIN'}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    <option value="USER">User</option>
                    <option value="PROVIDER">Provider</option>
                    <option value="MODERATOR">Moderator</option>
                    <option value="DATA_MANAGER">Data Manager</option>
                    <option value="ANALYST">Analyst</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button className="text-blue-600 hover:text-blue-900" title="Edit Profile">
                    <Edit className="w-4 h-4 inline" />
                  </button>
                  <button className="text-purple-600 hover:text-purple-900" title="Admin Permissions">
                    <Shield className="w-4 h-4 inline" />
                  </button>
                  {canSuspendUsers && (
                    <button className="text-red-600 hover:text-red-900" title="Suspend User">
                      <UserX className="w-4 h-4 inline" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {users?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

