import { Users, Shield, MoreVertical, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setUsers(data || []);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Users className="text-aurora-green" /> User Management
          </h1>
          <p className="text-slate-400 mt-2">Manage roles, access levels, and account status.</p>
        </div>
        <button className="px-4 py-2 bg-aurora-green text-navy-900 font-bold rounded-lg hover:bg-green-400 transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)]">
          Invite User
        </button>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/80 text-slate-400 uppercase text-xs border-b border-slate-800">
            <tr>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Last Active</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  <Loader className="w-6 h-6 animate-spin mx-auto mb-2" />
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No users found in the system.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-aurora-green font-bold uppercase">
                        {(user.full_name || user.email || '?').charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.full_name || 'No Name'}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center w-max gap-1.5 ${
                      user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                      user.role === 'DATA_MANAGER' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {user.role === 'ADMIN' && <Shield size={12} />}
                      {user.role || 'USER'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-aurora-green shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                      <span>Active</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {new Date(user.updated_at || user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-500 hover:text-white transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
