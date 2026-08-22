import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Image as ImageIcon, 
  DollarSign, 
  CalendarDays, 
  ShieldCheck, 
  Eye, 
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  UploadCloud,
  X
} from 'lucide-react';
import { toast } from 'sonner';

const WIZARD_STEPS = [
  { id: 1, title: 'Type', icon: Building2 },
  { id: 2, title: 'Basics', icon: Building2 },
  { id: 3, title: 'Location', icon: MapPin },
  { id: 4, title: 'Media', icon: ImageIcon },
  { id: 5, title: 'Pricing', icon: DollarSign },
  { id: 6, title: 'Availability', icon: CalendarDays },
  { id: 7, title: 'Policies', icon: ShieldCheck },
  { id: 8, title: 'Preview', icon: Eye },
];

export const CreateListingWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    type: 'HOTEL',
    name: '',
    description: '',
    address: '',
    city: '',
    basePrice: '',
    capacity: '',
    cancellationPolicy: 'FLEXIBLE',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/provider/listings');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      toast.success('Listing submitted for review successfully!');
      navigate('/provider/listings');
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Wizard Progress Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-slate-900">Create New Listing</h1>
            <button onClick={() => navigate('/provider/listings')} className="text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full z-0"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-500 rounded-full z-0 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (WIZARD_STEPS.length - 1)) * 100}%` }}
            ></div>
            
            {WIZARD_STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isActive ? 'border-blue-500 bg-blue-500 text-white' : 
                    isCompleted ? 'border-blue-500 bg-blue-50 text-blue-500' : 
                    'border-slate-200 bg-white text-slate-400'
                  }`}>
                    {isCompleted ? <CheckCircle2 size={16} /> : <Icon size={14} />}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider hidden sm:block ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-slate-50 flex items-center justify-center p-4 py-8">
        <div className="bg-white max-w-2xl w-full rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 min-h-[400px]">
          
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">What type of listing are you adding?</h2>
                <p className="text-slate-500">This helps us customize the rest of your setup.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'HOTEL', title: 'Accommodation', desc: 'Hotels, cabins, resorts' },
                  { id: 'ACTIVITY', title: 'Activity / Tour', desc: 'Guided tours, rentals, experiences' },
                  { id: 'RESTAURANT', title: 'Dining', desc: 'Restaurants, cafes, local food' },
                  { id: 'TRANSPORT', title: 'Transport', desc: 'Ferries, buses, transfers' },
                ].map(type => (
                  <label key={type.id} className={`p-4 border rounded-xl cursor-pointer transition-all ${formData.type === type.id ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-slate-200 hover:border-blue-300'}`}>
                    <input type="radio" name="type" value={type.id} checked={formData.type === type.id} onChange={handleChange} className="hidden" />
                    <div className="font-bold text-slate-900 mb-1">{type.title}</div>
                    <div className="text-sm text-slate-500">{type.desc}</div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Basic Information</h2>
                <p className="text-slate-500">Provide the fundamental details of your offering.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Listing Title</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Arctic Panorama Glass Igloo" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={5} placeholder="Describe the experience..." className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 resize-none"></textarea>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Where is this located?</h2>
                <p className="text-slate-500">Customers need to know exactly where to go.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Street Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">City / Region</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500" />
                </div>
                {/* Mock Map View */}
                <div className="h-48 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 mt-4">
                  <MapPin size={32} className="mb-2 opacity-50" />
                  <span className="text-sm font-medium ml-2">Map Preview (Mock)</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Upload Media</h2>
                <p className="text-slate-500">High-quality images significantly increase conversion rates.</p>
              </div>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Click to upload or drag & drop</h3>
                <p className="text-slate-500 text-sm">SVG, PNG, JPG or GIF (max. 10MB)</p>
              </div>
              <div className="text-sm text-slate-500 italic text-center">
                (Media upload mocked for prototype)
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Set your Pricing</h2>
                <p className="text-slate-500">Configure your base rates and seasonal rules.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Base Price (NOK)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500" placeholder="e.g. 1500" />
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <h4 className="text-sm font-bold text-blue-900 mb-1">Smart Pricing Recommendation</h4>
                  <p className="text-xs text-blue-700">Similar {formData.type.toLowerCase()}s in your area charge between NOK 1,200 - 1,800 during summer.</p>
                </div>
              </div>
            </div>
          )}

          {currentStep > 5 && currentStep < 8 && (
             <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
               <div className="text-center py-12">
                 <h2 className="text-2xl font-bold text-slate-900 mb-2">Step {currentStep} Configuration</h2>
                 <p className="text-slate-500 mb-6">This section is dynamically loaded based on business type ({formData.type}).</p>
                 <div className="inline-block px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-mono">
                   [Mock UI for {WIZARD_STEPS.find(s => s.id === currentStep)?.title}]
                 </div>
               </div>
             </div>
          )}

          {currentStep === 8 && (
            <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Review & Submit</h2>
                <p className="text-slate-500">Here's a quick preview of your listing before it goes to moderation.</p>
              </div>
              
              {/* Preview Card */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="h-48 bg-slate-200 relative">
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    NOK {formData.basePrice || '0'}
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-1">{formData.type}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{formData.name || 'Untitled Listing'}</h3>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">{formData.description || 'No description provided.'}</p>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin size={16} /> {formData.city || 'Location pending'}, {formData.address}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Footer Navigation */}
      <div className="bg-white border-t border-slate-200 py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center z-10 sticky bottom-0">
        <button 
          onClick={handleBack} 
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-2"
        >
          {currentStep === 1 ? 'Cancel' : <><ChevronLeft size={18} /> Back</>}
        </button>
        
        {currentStep < WIZARD_STEPS.length ? (
          <button 
            onClick={handleNext} 
            className="bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            Continue <ChevronRight size={18} />
          </button>
        ) : (
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-8 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 flex items-center gap-2"
          >
            {isSubmitting ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Submitting...</>
            ) : (
              'Submit for Review'
            )}
          </button>
        )}
      </div>
    </div>
  );
};
