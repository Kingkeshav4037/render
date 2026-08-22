import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  TrendingUp, 
  ShieldCheck, 
  Globe2, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const ProviderLanding = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-navy-900 tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm">N</span>
            SmartLife <span className="text-slate-400 font-normal">for Business</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-navy-900">Sign in</Link>
            <Link to="/provider/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
              Become a Provider
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            Grow your Norwegian experience business.
          </h1>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            Join thousands of hotels, guides, and attractions powering Norway's experience economy. Reach global travelers, manage bookings seamlessly, and grow your revenue with intelligent tools.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/provider/register" className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl text-base font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-600/25 flex items-center justify-center gap-2">
              Start your application <ArrowRight size={20} />
            </Link>
            <Link to="/contact" className="w-full sm:w-auto bg-white text-slate-700 border border-slate-300 px-8 py-4 rounded-xl text-base font-bold hover:bg-slate-50 transition-colors flex items-center justify-center">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to operate</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">A complete business operating system designed specifically for the Norwegian hospitality and experience industry.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Globe2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Reach Travelers</h3>
              <p className="text-slate-600">Get listed on Norway's premier smart tourism platform and reach high-intent global travelers.</p>
            </div>
            
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Building2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Manage Bookings</h3>
              <p className="text-slate-600">A powerful PMS and reservation system to handle availability, capacity, and operations.</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Analyze Performance</h3>
              <p className="text-slate-600">Detailed analytics on views, conversion rates, revenue, and customer demographics.</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Secure Payouts</h3>
              <p className="text-slate-600">Automated, secure financial routing with clear reporting on platform fees and taxes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Steps */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">How it works</h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="mt-1"><CheckCircle2 className="text-blue-400" /></div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">1. Register your business</h4>
                    <p className="text-slate-400">Tell us about your company. We verify all providers to maintain a high-quality ecosystem.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1"><CheckCircle2 className="text-blue-400" /></div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">2. Create your listings</h4>
                    <p className="text-slate-400">Add photos, descriptions, pricing, and availability. Our wizard makes it easy for any business type.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1"><CheckCircle2 className="text-blue-400" /></div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">3. Start accepting bookings</h4>
                    <p className="text-slate-400">Once approved, your listings go live. Manage everything from our powerful operational dashboard.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mock Dashboard Preview */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-emerald-400 rounded-2xl blur-3xl opacity-20"></div>
              <div className="relative bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs font-medium text-slate-400">provider.smartlife.no</div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-sm text-slate-400 mb-1">Today's Revenue</div>
                      <div className="text-3xl font-bold text-white">NOK 48,250</div>
                    </div>
                    <div className="text-sm text-emerald-400 font-medium">+12% vs yesterday</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600">
                      <div className="text-xs text-slate-400 mb-1">Bookings</div>
                      <div className="text-xl font-bold text-white">126</div>
                    </div>
                    <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600">
                      <div className="text-xs text-slate-400 mb-1">Pending Requests</div>
                      <div className="text-xl font-bold text-white">8</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
};
