import React from 'react';
import { UserProfile } from '../../../../types/profile';
import { Camera, CheckCircle, Shield, Award } from 'lucide-react';

interface Props {
  profile: UserProfile;
  completionScore: number;
}

export const ProfileOverview: React.FC<Props> = ({ profile, completionScore }) => {
  return (
    <div className="p-8">
      {/* Header Profile Card */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 pb-8 border-b border-gray-100">
        
        <div className="relative group cursor-pointer">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt="Profile" className="w-32 h-32 rounded-full object-cover shadow-md" />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-500 shadow-md">
              <span className="text-4xl font-bold">{profile.fullName.charAt(0)}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="text-white" size={24} />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold text-navy-900 mb-1">{profile.fullName}</h2>
          <p className="text-gray-500 font-medium mb-4">{profile.email}</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${
              profile.phoneVerified ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              {profile.phoneVerified ? <CheckCircle size={14} /> : <Shield size={14} />}
              {profile.phoneVerified ? 'Phone Verified' : 'Phone Unverified'}
            </div>
            <div className="px-3 py-1 rounded-full text-xs font-bold border bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
              <Award size={14} /> Norway Explorer
            </div>
          </div>
        </div>

      </div>

      {/* Completion Score Section */}
      <div className="py-8">
        <h3 className="text-lg font-bold text-navy-900 mb-4">Profile Completion</h3>
        <div className="flex items-center gap-4 mb-2">
          <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${
                completionScore === 100 ? 'bg-aurora-green' : 'bg-blue-500'
              }`}
              style={{ width: `${completionScore}%` }}
            />
          </div>
          <span className="text-lg font-bold text-navy-900 w-12 text-right">{completionScore}%</span>
        </div>
        <p className="text-sm text-gray-500">
          {completionScore === 100 
            ? "Your profile is fully optimized for personalized AI recommendations."
            : "Complete your travel preferences, food requirements, and emergency contacts to unlock perfect AI trip planning."}
        </p>
      </div>

      {/* Traveler Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <StatCard value="12" label="Places Visited" />
        <StatCard value="3" label="Fjords Explored" />
        <StatCard value="24" label="Reviews" />
        <StatCard value="5" label="Saved Trips" />
      </div>

    </div>
  );
};

const StatCard = ({ value, label }: { value: string, label: string }) => (
  <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
    <div className="text-2xl font-bold text-navy-900 mb-1">{value}</div>
    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</div>
  </div>
);
