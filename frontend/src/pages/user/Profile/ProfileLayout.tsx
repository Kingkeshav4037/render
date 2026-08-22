import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { User, Settings, Map, Shield, Lock } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';

export const ProfileLayout = () => {
  const { profile } = useAuthStore();
  const location = useLocation();

  const navItems = [
    { path: '/profile', label: 'Overview', icon: <User size={18} />, exact: true },
    { path: '/profile/preferences', label: 'Travel Preferences', icon: <Map size={18} /> },
    { path: '/profile/security', label: 'Account Security', icon: <Lock size={18} /> },
    { path: '/profile/privacy', label: 'Privacy Center', icon: <Shield size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans pb-32">
      {/* Editorial Header */}
      <div className="pt-32 pb-12 px-6 md:px-12 max-w-[1440px] mx-auto border-b border-gray-100">
        <h1 className="text-4xl md:text-5xl font-display font-light text-navy-900 tracking-tight">
          Personal <span className="font-bold">Profile</span>.
        </h1>
        <p className="mt-4 text-lg text-gray-500">Manage your identity and Norway SmartLife personalization.</p>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Sidebar Nav */}
        <div className="lg:col-span-3">
          <nav className="sticky top-32 space-y-2">
            {navItems.map((item) => {
              const isActive = item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold tracking-wide transition-all duration-300 ${
                    isActive
                      ? 'bg-navy-900 text-white shadow-lg'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-navy-900'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-gray-100 min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Outlet />
          </div>
        </div>

      </div>
    </div>
  );
};
