import React from 'react';
import { Link } from 'react-router-dom';
import { CinematicBackground } from '../design/backgrounds/CinematicBackground';

export const Sitemap = () => {
  return (
    <div className="min-h-screen bg-deep-night font-sans pb-32 text-snow selection:bg-aurora-green selection:text-deep-night relative">
      <CinematicBackground gradient="aurora" />

      <div className="pt-32 pb-12 px-6 md:px-12 max-w-[1440px] mx-auto border-b border-white/10 relative z-10">
        <h1 className="text-4xl md:text-5xl font-display font-light text-snow tracking-tight">
          Platform <span className="font-bold text-arctic-gold">Sitemap</span>.
        </h1>
        <p className="mt-4 text-lg text-snow/60 max-w-2xl">
          A comprehensive directory of the Norway SmartLife ecosystem. Navigate to any public, administrative, or operational dashboard.
        </p>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        
        {/* Category: Discovery */}
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md">
          <h2 className="text-sm font-bold uppercase tracking-widest text-arctic-gold mb-6 border-b border-white/10 pb-4">Discovery</h2>
          <ul className="space-y-4">
            <li><Link to="/home" className="text-snow/80 hover:text-white font-medium hover:underline">Platform Home</Link></li>
            <li><Link to="/explore" className="text-snow/80 hover:text-white font-medium hover:underline">Destinations Hub</Link></li>
            <li><Link to="/nature" className="text-snow/80 hover:text-white font-medium hover:underline">Nature & National Parks</Link></li>
            <li><Link to="/wildlife" className="text-snow/80 hover:text-white font-medium hover:underline">Arctic Wildlife</Link></li>
            <li><Link to="/flora" className="text-snow/80 hover:text-white font-medium hover:underline">Plants & Trees</Link></li>
            <li><Link to="/history" className="text-snow/80 hover:text-white font-medium hover:underline">History & Heritage</Link></li>
            <li><Link to="/aurora" className="text-snow/80 hover:text-white font-medium hover:underline">Aurora Forecast</Link></li>
            <li><Link to="/smart-city" className="text-snow/80 hover:text-white font-medium hover:underline">Smart City Hub</Link></li>
            <li><Link to="/map" className="text-snow/80 hover:text-white font-medium hover:underline">Interactive Map</Link></li>
          </ul>
        </div>

        {/* Category: Experiences */}
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md">
          <h2 className="text-sm font-bold uppercase tracking-widest text-arctic-gold mb-6 border-b border-white/10 pb-4">Experiences</h2>
          <ul className="space-y-4">
            <li><Link to="/activities" className="text-snow/80 hover:text-white font-medium hover:underline">Activities</Link></li>
            <li><Link to="/trails" className="text-snow/80 hover:text-white font-medium hover:underline">Hiking Trails</Link></li>
            <li><Link to="/winter" className="text-snow/80 hover:text-white font-medium hover:underline">Winter Sports</Link></li>
            <li><Link to="/road-trips" className="text-snow/80 hover:text-white font-medium hover:underline">Scenic Road Trips</Link></li>
            <li><Link to="/events" className="text-snow/80 hover:text-white font-medium hover:underline">Local Events</Link></li>
            <li><Link to="/guides" className="text-snow/80 hover:text-white font-medium hover:underline">Travel Guides</Link></li>
            <li><Link to="/stay" className="text-snow/80 hover:text-white font-medium hover:underline">Stays & Lodges</Link></li>
            <li><Link to="/food" className="text-snow/80 hover:text-white font-medium hover:underline">Food & Dining</Link></li>
            <li><Link to="/shop" className="text-snow/80 hover:text-white font-medium hover:underline">Marketplace</Link></li>
          </ul>
        </div>

        {/* Category: Smart Mobility */}
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md">
          <h2 className="text-sm font-bold uppercase tracking-widest text-arctic-gold mb-6 border-b border-white/10 pb-4">Smart Mobility</h2>
          <ul className="space-y-4">
            <li><Link to="/travel" className="text-snow/80 hover:text-white font-medium hover:underline">Transport Hub</Link></li>
            <li><Link to="/mobility/ev" className="text-snow/80 hover:text-white font-medium hover:underline">EV Charging Network</Link></li>
            <li><Link to="/mobility/ferry" className="text-snow/80 hover:text-white font-medium hover:underline">Smart Ferries</Link></li>
            <li><Link to="/live" className="text-snow/80 hover:text-white font-medium hover:underline">Live Weather & Transit</Link></li>
            <li><Link to="/safety" className="text-snow/80 hover:text-white font-medium hover:underline">Safety Alerts</Link></li>
            <li><Link to="/infrastructure" className="text-snow/80 hover:text-white font-medium hover:underline">Infrastructure Index</Link></li>
            <li><Link to="/infrastructure/energy" className="text-snow/80 hover:text-white font-medium hover:underline">Energy Dashboard</Link></li>
            <li><Link to="/infrastructure/iot" className="text-snow/80 hover:text-white font-medium hover:underline">IoT Sensor Network</Link></li>
          </ul>
        </div>

        {/* Category: Traveler Portal */}
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md">
          <h2 className="text-sm font-bold uppercase tracking-widest text-arctic-gold mb-6 border-b border-white/10 pb-4">Traveler Portal</h2>
          <ul className="space-y-4">
            <li><Link to="/dashboard" className="text-snow/80 hover:text-white font-medium hover:underline">My Norway (Dashboard)</Link></li>
            <li><Link to="/planner" className="text-snow/80 hover:text-white font-medium hover:underline">AI Trip Planner</Link></li>
            <li><Link to="/assistant" className="text-snow/80 hover:text-white font-medium hover:underline">Travel Assistant</Link></li>
            <li><Link to="/user/bookings" className="text-snow/80 hover:text-white font-medium hover:underline">My Bookings</Link></li>
            <li><Link to="/wallet" className="text-snow/80 hover:text-white font-medium hover:underline">Digital Wallet</Link></li>
            <li><Link to="/invoices" className="text-snow/80 hover:text-white font-medium hover:underline">Tax Invoices</Link></li>
            <li><Link to="/expenses" className="text-snow/80 hover:text-white font-medium hover:underline">Expenses & Budget</Link></li>
            <li><Link to="/user/travel-history" className="text-snow/80 hover:text-white font-medium hover:underline">Travel History</Link></li>
            <li><Link to="/profile" className="text-snow/80 hover:text-white font-medium hover:underline">Profile Settings</Link></li>
            <li><Link to="/settings/notifications" className="text-snow/80 hover:text-white font-medium hover:underline">Notification Settings</Link></li>
            <li><Link to="/reviews" className="text-snow/80 hover:text-white font-medium hover:underline">My Reviews</Link></li>
          </ul>
        </div>

        {/* Category: Backend CMS & Administration */}
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md lg:col-span-2">
          <h2 className="text-sm font-bold uppercase tracking-widest text-arctic-gold mb-6 border-b border-white/10 pb-4">Backend CMS & Administration</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ul className="space-y-4">
              <li><Link to="/admin" className="text-snow/80 hover:text-white font-medium hover:underline">Command Center</Link></li>
              <li><Link to="/admin/content/wildlife" className="text-snow/80 hover:text-white font-medium hover:underline">Wildlife CMS</Link></li>
              <li><Link to="/admin/content/flora" className="text-snow/80 hover:text-white font-medium hover:underline">Flora & Botany CMS</Link></li>
              <li><Link to="/admin/content/places" className="text-snow/80 hover:text-white font-medium hover:underline">Destinations CMS</Link></li>
              <li><Link to="/admin/content/stays" className="text-snow/80 hover:text-white font-medium hover:underline">Accommodations CMS</Link></li>
              <li><Link to="/admin/content/activities" className="text-snow/80 hover:text-white font-medium hover:underline">Activities CMS</Link></li>
              <li><Link to="/admin/content/trails" className="text-snow/80 hover:text-white font-medium hover:underline">Hiking Trails CMS</Link></li>
            </ul>
            <ul className="space-y-4">
              <li><Link to="/admin/content/skiresorts" className="text-snow/80 hover:text-white font-medium hover:underline">Ski Resorts CMS</Link></li>
              <li><Link to="/admin/content/roadtrips" className="text-snow/80 hover:text-white font-medium hover:underline">Road Trips CMS</Link></li>
              <li><Link to="/admin/content/food" className="text-snow/80 hover:text-white font-medium hover:underline">Gastronomy CMS</Link></li>
              <li><Link to="/admin/content/events" className="text-snow/80 hover:text-white font-medium hover:underline">Events CMS</Link></li>
              <li><Link to="/admin/content/deals" className="text-snow/80 hover:text-white font-medium hover:underline">Deals CMS</Link></li>
              <li><Link to="/admin/operations/import" className="text-snow/80 hover:text-white font-medium hover:underline">Data Import Manager</Link></li>
              <li><Link to="/admin/health" className="text-snow/80 hover:text-white font-medium hover:underline">System Health</Link></li>
            </ul>
          </div>
        </div>

        {/* Category: Provider Portal */}
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md lg:col-span-2">
          <h2 className="text-sm font-bold uppercase tracking-widest text-arctic-gold mb-6 border-b border-white/10 pb-4">B2B Provider Portal</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ul className="space-y-4">
              <li><Link to="/provider" className="text-snow/80 hover:text-white font-medium hover:underline">Provider Dashboard</Link></li>
              <li><Link to="/provider/join" className="text-snow/80 hover:text-white font-medium hover:underline">Partner Landing</Link></li>
              <li><Link to="/provider/listings" className="text-snow/80 hover:text-white font-medium hover:underline">Listing Manager</Link></li>
              <li><Link to="/provider/calendar" className="text-snow/80 hover:text-white font-medium hover:underline">Availability Calendar</Link></li>
            </ul>
            <ul className="space-y-4">
              <li><Link to="/provider/finance" className="text-snow/80 hover:text-white font-medium hover:underline">Revenue & Finance</Link></li>
              <li><Link to="/provider/customers" className="text-snow/80 hover:text-white font-medium hover:underline">Customer Directory</Link></li>
              <li><Link to="/provider/messages" className="text-snow/80 hover:text-white font-medium hover:underline">Inbox & Messaging</Link></li>
              <li><Link to="/provider/settings" className="text-snow/80 hover:text-white font-medium hover:underline">Business Settings</Link></li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};
