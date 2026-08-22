import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { Camera, Mail, Phone, Globe, Edit2, Check } from 'lucide-react';

export const ProfileOverview = () => {
  const { user, profile } = useAuthStore();
  const [completion, setCompletion] = useState(80);

  // Mock completion calculation
  useEffect(() => {
    let score = 50;
    if (profile?.fullName) score += 10;
    if (profile?.phone) score += 10;
    if (profile?.country) score += 10;
    if (profile?.avatarUrl) score += 20;
    setCompletion(score);
  }, [profile]);

  return (
    <div className="space-y-12">
      {/* Header & Avatar */}
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-100">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-display font-bold text-gray-300">
                {profile?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <button className="absolute bottom-0 right-0 w-10 h-10 bg-navy-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-aurora-green hover:text-navy-900 transition-colors opacity-0 group-hover:opacity-100">
            <Camera size={16} />
          </button>
        </div>
        
        <div className="flex-1">
          <h2 className="text-3xl font-display font-bold text-navy-900 mb-2">{profile?.fullName || 'Traveler'}</h2>
          <p className="text-gray-500 font-medium">Oslo, Norway • Member since 2026</p>
        </div>
      </div>

      {/* Completion Tracker */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-navy-900 mb-1">Your Profile</h3>
            <p className="text-sm text-gray-500">Add your travel preferences to improve recommendations.</p>
          </div>
          <span className="text-2xl font-display font-black text-navy-900">{completion}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-aurora-green transition-all duration-1000 ease-out"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      {/* Personal Information */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-navy-900">Personal Information</h3>
          <button className="text-sm font-bold text-aurora-green hover:text-navy-900 transition-colors flex items-center gap-2">
            <Edit2 size={14} /> Edit
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
              <Mail size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Email Address</p>
              <p className="font-medium text-navy-900">{user?.email}</p>
            </div>
          </div>
          
          <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
              <Phone size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Phone Number</p>
              <p className="font-medium text-navy-900">{profile?.phone || 'Add phone number'}</p>
            </div>
          </div>
          
          <div className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
              <Globe size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Country/Region</p>
              <p className="font-medium text-navy-900">{profile?.country || 'Norway'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
