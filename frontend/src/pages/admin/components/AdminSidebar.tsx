import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Map, Utensils, Home, Briefcase, Car, Shield, 
  Users, CreditCard, Activity, UploadCloud, Settings, AlertTriangle
} from 'lucide-react';

export const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-navy-900 text-gray-300 flex flex-col min-h-screen">
      <div className="h-16 flex items-center px-6 border-b border-navy-800">
        <span className="text-white font-bold text-lg tracking-tight">Norway SmartLife <span className="text-aurora-green">Admin</span></span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <NavSection title="Overview">
          <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" to="/admin" />
          <NavItem icon={<Activity size={18} />} label="System Health" to="/admin/health" />
        </NavSection>

        <NavSection title="Content Ecosystem">
          <NavItem icon={<Map size={18} />} label="Places & Geography" to="/admin/content/places" />
          <NavItem icon={<Home size={18} />} label="Accommodations" to="/admin/content/stays" />
          <NavItem icon={<Briefcase size={18} />} label="Activities" to="/admin/content/activities" />
          <NavItem icon={<Utensils size={18} />} label="Food & Restaurants" to="/admin/content/food" />
          <NavItem icon={<Car size={18} />} label="Events" to="/admin/content/events" />
          <NavItem icon={<CreditCard size={18} />} label="Deals & Packages" to="/admin/content/deals" />
          <NavItem icon={<Car size={18} />} label="Infrastructure" to="/admin/content/infrastructure" />
        </NavSection>

        <NavSection title="Commerce">
          <NavItem icon={<CreditCard size={18} />} label="Bookings" to="/admin/bookings" />
          <NavItem icon={<CreditCard size={18} />} label="Payments" to="/admin/payments" />
        </NavSection>

        <NavSection title="Users & Moderation">
          <NavItem icon={<Users size={18} />} label="User Management" to="/admin/users" />
          <NavItem icon={<Shield size={18} />} label="Reviews & Reports" to="/admin/reviews" />
        </NavSection>

        <NavSection title="Operations">
          <NavItem icon={<UploadCloud size={18} />} label="Data Import" to="/admin/operations/import" />
          <NavItem icon={<AlertTriangle size={18} />} label="Live Alerts" to="/admin/operations/alerts" />
          <NavItem icon={<Settings size={18} />} label="Settings" to="/admin/settings" />
          <NavItem icon={<Activity size={18} />} label="Smart Infrastructure" to="/admin/infrastructure" />
        </NavSection>
      </div>
    </aside>
  );
};

const NavSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="mb-6">
    <div className="px-6 mb-2 text-xs font-bold uppercase tracking-wider text-navy-400">
      {title}
    </div>
    <div className="space-y-1">
      {children}
    </div>
  </div>
);

const NavItem = ({ icon, label, to }: { icon: React.ReactNode, label: string, to: string }) => (
  <NavLink 
    to={to}
    end={to === '/admin'}
    className={({ isActive }) => `flex items-center gap-3 px-6 py-2 transition-colors ${
      isActive 
        ? 'bg-navy-800 text-white border-l-2 border-aurora-green' 
        : 'hover:bg-navy-800/50 hover:text-white border-l-2 border-transparent'
    }`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </NavLink>
);
