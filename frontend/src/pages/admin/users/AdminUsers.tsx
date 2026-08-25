import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, ShieldAlert, ShieldCheck, MoreVertical, RefreshCw, UserCheck, UserX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useAuthStore } from '../../../store/useAuthStore';
import { toast } from 'sonner';

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'ACTIVE' | 'SUSPENDED';
  joined: string;
  bookings: number;
}

const FALLBACK_USERS: AdminUserRecord[] = [
  { id: 'usr-101', name: 'Andreas Solberg', email: 'andreas@example.com', role: 'USER', status: 'ACTIVE', joined: 'Oct 12, 2026', bookings: 4 },
  { id: 'usr-102', name: 'Kari Nordmann', email: 'kari.n@example.com', role: 'USER', status: 'ACTIVE', joined: 'Sep 28, 2026', bookings: 12 },
  { id: 'usr-103', name: 'James Wilson', email: 'james.w@example.com', role: 'USER', status: 'SUSPENDED', joined: 'Aug 14, 2026', bookings: 0 },
  { id: 'usr-104', name: 'Lofoten Admin', email: 'admin@lofoten.no', role: 'PROVIDER', status: 'ACTIVE', joined: 'Jan 05, 2026', bookings: 0 },
];

export const AdminUsers = () => {
  const { user: currentAuthUser, profile: currentProfile } = useAuthStore();
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !profiles || profiles.length === 0) {
        setUsers(FALLBACK_USERS);
        return;
      }

      // Format profiles
      const formatted: AdminUserRecord[] = profiles.map((p: any) => ({
        id: p.id,
        name: p.full_name || p.email?.split('@')[0] || 'Traveler',
        email: p.email || 'N/A',
        role: p.role || 'USER',
        status: p.status === 'SUSPENDED' ? 'SUSPENDED' : 'ACTIVE',
        joined: p.created_at ? new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
        bookings: 0
      }));

      setUsers(formatted);
    } catch (err) {
      console.warn('Notice loading admin users:', err);
      setUsers(FALLBACK_USERS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    // 1. Prevent self-privilege escalation
    if (userId === currentAuthUser?.id && currentProfile?.role !== 'SUPER_ADMIN') {
      toast.error('You cannot modify your own administrative role');
      return;
    }

    try {
      const { error } = await (supabase as any)
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      // 2. Audit log entry
      try {
        await (supabase as any).from('audit_logs').insert({
          action: 'UPDATE_ROLE',
          resource_type: 'PROFILE',
          resource_id: userId,
          actor_id: currentAuthUser?.id || null,
          details: { new_role: newRole, target_user: userId }
        });
      } catch (auditErr) {
        console.warn('Audit log write notice:', auditErr);
      }

      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success(`User role updated to ${newRole}`);
    } catch (err: any) {
      console.error('Failed to update role:', err);
      toast.error(err?.message || 'Failed to update user role');
    }
  };

  const handleToggleStatus = async (user: AdminUserRecord) => {
    const nextStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    
    if (nextStatus === 'SUSPENDED') {
      if (!window.confirm(`Are you sure you want to suspend account access for ${user.name}? The user will be blocked from authenticated services.`)) {
        return;
      }
    }

    try {
      const { error } = await (supabase as any)
        .from('profiles')
        .update({ status: nextStatus })
        .eq('id', user.id);

      if (error) throw error;

      // Audit log entry
      try {
        await (supabase as any).from('audit_logs').insert({
          action: 'UPDATE_USER_STATUS',
          resource_type: 'PROFILE',
          resource_id: user.id,
          actor_id: currentAuthUser?.id || null,
          details: { new_status: nextStatus, target_user: user.name }
        });
      } catch (auditErr) {
        console.warn('Audit log write notice:', auditErr);
      }

      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: nextStatus } : u));
      toast.success(`User ${user.name} is now ${nextStatus}`);
    } catch (err: any) {
      console.error('Failed to update user status:', err);
      toast.error(err?.message || 'Failed to update user status');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Governance & Access</h1>
          <p className="text-slate-500 text-sm mt-1">Manage platform accounts, security statuses, and system roles.</p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Refresh Users
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by name, email or ID..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Roles</option>
              <option value="USER">Traveler (USER)</option>
              <option value="PROVIDER">Provider (B2B)</option>
              <option value="MODERATOR">Moderator</option>
              <option value="DATA_MANAGER">Data Manager</option>
              <option value="ANALYST">Analyst</option>
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="SUSPENDED">Suspended Only</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Joined</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [1, 2, 3, 4].map(n => (
                  <tr key={n} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-36" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-20" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-16" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-24" /></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 bg-slate-100 rounded w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <Link to={`/admin/users/${user.id}`} className="font-bold text-blue-600 hover:underline">{user.name}</Link>
                          <div className="text-xs text-slate-500 font-mono mt-0.5">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="USER">USER</option>
                        <option value="PROVIDER">PROVIDER</option>
                        <option value="MODERATOR">MODERATOR</option>
                        <option value="DATA_MANAGER">DATA_MANAGER</option>
                        <option value="ANALYST">ANALYST</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1 text-xs font-bold uppercase tracking-wider
                        ${user.status === 'ACTIVE' ? 'text-emerald-600' : 'text-red-600'}
                      `}>
                        {user.status === 'ACTIVE' ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{user.joined}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          title={user.status === 'ACTIVE' ? 'Suspend User' : 'Activate User'}
                          className={`p-1.5 rounded transition-colors ${
                            user.status === 'ACTIVE'
                              ? 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          {user.status === 'ACTIVE' ? <UserX size={16} /> : <UserCheck size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
