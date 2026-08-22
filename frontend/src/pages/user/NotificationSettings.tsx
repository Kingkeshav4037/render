import { useState } from 'react';
import { Bell, Smartphone, Mail, AlertTriangle, CloudRain, Sun, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    push: {
      auroraAlerts: true,
      weatherWarnings: true,
      bookingUpdates: true,
      promotions: false
    },
    email: {
      auroraAlerts: false,
      weatherWarnings: true,
      bookingUpdates: true,
      promotions: true
    },
    sms: {
      auroraAlerts: true,
      weatherWarnings: false,
      bookingUpdates: true,
      promotions: false
    }
  });

  const toggleSetting = (channel: 'push' | 'email' | 'sms', key: keyof typeof settings.push) => {
    setSettings(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [key]: !prev[channel][key]
      }
    }));
  };

  const saveSettings = () => {
    // In production, sync to Supabase user profile
    // Save logic goes here
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900 mb-2 flex items-center gap-3">
          <Bell className="w-8 h-8 text-aurora-green" />
          Notification Preferences
        </h1>
        <p className="text-gray-600 text-lg">Manage how you receive alerts for weather, bookings, and the Northern Lights.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200 p-4">
          <div className="col-span-1 font-bold text-navy-900 text-sm uppercase tracking-wider">Alert Type</div>
          <div className="col-span-1 flex flex-col items-center justify-center font-bold text-navy-900 text-sm uppercase tracking-wider">
            <Smartphone className="w-5 h-5 mb-1 text-blue-500" /> Push
          </div>
          <div className="col-span-1 flex flex-col items-center justify-center font-bold text-navy-900 text-sm uppercase tracking-wider">
            <Mail className="w-5 h-5 mb-1 text-purple-500" /> Email
          </div>
          <div className="col-span-1 flex flex-col items-center justify-center font-bold text-navy-900 text-sm uppercase tracking-wider">
            <Bell className="w-5 h-5 mb-1 text-green-500" /> SMS
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-100">
          
          <SettingRow 
            title="Aurora Alerts" 
            description="High probability of Northern Lights in your area."
            icon={<Sun className="w-5 h-5 text-aurora-green" />}
            settingKey="auroraAlerts"
            settings={settings}
            onToggle={toggleSetting}
          />
          
          <SettingRow 
            title="Weather Warnings" 
            description="Severe weather or road closures."
            icon={<CloudRain className="w-5 h-5 text-blue-400" />}
            settingKey="weatherWarnings"
            settings={settings}
            onToggle={toggleSetting}
          />

          <SettingRow 
            title="Booking Updates" 
            description="Confirmations, reminders, and cancellations."
            icon={<Calendar className="w-5 h-5 text-orange-400" />}
            settingKey="bookingUpdates"
            settings={settings}
            onToggle={toggleSetting}
          />

          <SettingRow 
            title="Promotions" 
            description="Special offers and new destinations."
            icon={<AlertTriangle className="w-5 h-5 text-purple-400" />}
            settingKey="promotions"
            settings={settings}
            onToggle={toggleSetting}
          />

        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button 
          onClick={saveSettings}
          className="bg-navy-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-aurora-green hover:text-navy-900 transition-colors shadow-md"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};

// Helper Component
const SettingRow = ({ title, description, icon, settingKey, settings, onToggle }: any) => {
  return (
    <div className="grid grid-cols-4 p-4 items-center hover:bg-gray-50 transition-colors">
      <div className="col-span-1 flex items-start gap-3">
        <div className="mt-1 bg-gray-100 p-2 rounded-lg">{icon}</div>
        <div>
          <h4 className="font-bold text-navy-900 text-sm">{title}</h4>
          <p className="text-xs text-gray-500 mt-0.5 pr-2 leading-tight">{description}</p>
        </div>
      </div>
      
      <div className="col-span-1 flex justify-center">
        <Toggle 
          isActive={settings.push[settingKey]} 
          onClick={() => onToggle('push', settingKey)} 
        />
      </div>
      <div className="col-span-1 flex justify-center">
        <Toggle 
          isActive={settings.email[settingKey]} 
          onClick={() => onToggle('email', settingKey)} 
        />
      </div>
      <div className="col-span-1 flex justify-center">
        <Toggle 
          isActive={settings.sms[settingKey]} 
          onClick={() => onToggle('sms', settingKey)} 
        />
      </div>
    </div>
  );
};

const Toggle = ({ isActive, onClick }: { isActive: boolean, onClick: () => void }) => {
  return (
    <button 
      onClick={onClick}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ease-in-out focus:outline-none ${isActive ? 'bg-aurora-green' : 'bg-gray-300'}`}
    >
      <motion.div 
        layout
        className="absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm"
        animate={{ x: isActive ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
};
