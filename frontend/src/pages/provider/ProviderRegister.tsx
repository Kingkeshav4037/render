import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, User, ChevronRight, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

type VerificationState = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'VERIFIED' | 'NEEDS_CHANGES';

export const ProviderRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [verificationState, setVerificationState] = useState<VerificationState>('DRAFT');
  
  // Form State
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: 'HOTEL',
    country: 'Norway',
    registrationNumber: '',
    businessEmail: '',
    businessPhone: '',
    website: '',
    contactName: '',
    contactPosition: '',
    contactEmail: '',
    contactPhone: ''
  });

  // Mock checking existing verification state
  useEffect(() => {
    const savedState = localStorage.getItem('mock_provider_verification');
    if (savedState) {
      setVerificationState(savedState as VerificationState);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationState('SUBMITTED');
    localStorage.setItem('mock_provider_verification', 'SUBMITTED');
    toast.success('Application submitted successfully!');
    
    // Simulate admin review process over time
    setTimeout(() => {
      setVerificationState('UNDER_REVIEW');
      localStorage.setItem('mock_provider_verification', 'UNDER_REVIEW');
      
      setTimeout(() => {
        setVerificationState('VERIFIED');
        localStorage.setItem('mock_provider_verification', 'VERIFIED');
      }, 3000);
    }, 2000);
  };

  if (verificationState !== 'DRAFT') {
    return <VerificationStatus state={verificationState} onDashboard={() => navigate('/provider/dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 h-16 flex items-center px-6">
        <Link to="/provider/join" className="text-xl font-bold text-navy-900 tracking-tight flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white text-xs">N</span>
          SmartLife <span className="text-slate-400 font-normal">Business</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white max-w-3xl w-full rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            
            {/* Sidebar Steps */}
            <div className="bg-slate-900 w-full md:w-64 p-8 text-white hidden md:block">
              <h2 className="text-lg font-bold mb-8">Provider Application</h2>
              <div className="space-y-6">
                <div className={`flex items-center gap-3 ${step === 1 ? 'text-white' : 'text-slate-500'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step === 1 ? 'border-blue-500 bg-blue-500' : 'border-slate-700'}`}>1</div>
                  <span className="font-medium">Business Details</span>
                </div>
                <div className={`flex items-center gap-3 ${step === 2 ? 'text-white' : 'text-slate-500'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step === 2 ? 'border-blue-500 bg-blue-500' : 'border-slate-700'}`}>2</div>
                  <span className="font-medium">Primary Contact</span>
                </div>
              </div>
            </div>

            {/* Form Area */}
            <div className="flex-1 p-8">
              <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2); } : handleSubmit}>
                
                {step === 1 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                        <Building2 className="text-blue-600" /> Business Information
                      </h3>
                      <p className="text-slate-500 text-sm mb-6">Enter the official details of your organization.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Business Name</label>
                        <input required type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="e.g. Lofoten Adventures AS" />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Business Type</label>
                        <select required name="businessType" value={formData.businessType} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                          <option value="HOTEL">Hotel / Accommodation</option>
                          <option value="ACTIVITY">Activity / Tour Operator</option>
                          <option value="RESTAURANT">Restaurant / Dining</option>
                          <option value="TRANSPORT">Transport Operator</option>
                          <option value="EV_OPERATOR">EV Charging Operator</option>
                          <option value="EVENT">Event Organizer</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Registration Number</label>
                        <input required type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="Org. nr" />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Website (Optional)</label>
                        <input type="url" name="website" value={formData.website} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="https://" />
                      </div>
                    </div>

                    <div className="pt-6 flex justify-end">
                      <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2">
                        Continue <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                        <User className="text-blue-600" /> Primary Contact
                      </h3>
                      <p className="text-slate-500 text-sm mb-6">Who should we contact regarding this application?</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                        <input required type="text" name="contactName" value={formData.contactName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Position / Title</label>
                        <input required type="text" name="contactPosition" value={formData.contactPosition} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Work Email</label>
                        <input required type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
                        <input required type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                      </div>
                    </div>

                    <div className="pt-6 flex justify-between">
                      <button type="button" onClick={() => setStep(1)} className="text-slate-600 px-4 py-2.5 rounded-lg font-semibold hover:bg-slate-100">
                        Back
                      </button>
                      <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700">
                        Submit Application
                      </button>
                    </div>
                  </div>
                )}

              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- Verification Status Component ---
const VerificationStatus = ({ state, onDashboard }: { state: VerificationState, onDashboard: () => void }) => {
  
  const getStatusContent = () => {
    switch (state) {
      case 'SUBMITTED':
        return {
          icon: <CheckCircle2 className="w-16 h-16 text-blue-500 mb-4" />,
          title: 'Application Submitted',
          desc: 'Your application has been received. Our team will begin the verification process shortly.'
        };
      case 'UNDER_REVIEW':
        return {
          icon: <Clock className="w-16 h-16 text-amber-500 mb-4" />,
          title: 'Under Review',
          desc: 'We are currently reviewing your business details. This usually takes 1-2 business days.'
        };
      case 'NEEDS_CHANGES':
        return {
          icon: <AlertCircle className="w-16 h-16 text-red-500 mb-4" />,
          title: 'Changes Required',
          desc: 'We need a bit more information. Please check your email for details on what to update.'
        };
      case 'VERIFIED':
        return {
          icon: <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />,
          title: 'Account Verified!',
          desc: 'Welcome to Norway SmartLife. You can now access your provider dashboard and start creating listings.',
          action: true
        };
      default: return null;
    }
  };

  const content = getStatusContent();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-sm border border-slate-200 p-8 text-center animate-in zoom-in-95">
        <div className="flex justify-center">{content?.icon}</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{content?.title}</h2>
        <p className="text-slate-600 mb-8">{content?.desc}</p>
        
        {content?.action && (
          <button onClick={onDashboard} className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
            Go to Dashboard
          </button>
        )}
        {!content?.action && (
           <button onClick={() => {
             // Mock resetting for demo purposes
             localStorage.removeItem('mock_provider_verification');
             window.location.reload();
           }} className="text-slate-400 text-sm hover:text-slate-600 underline">
             Reset Demo State
           </button>
        )}
      </div>
    </div>
  );
};
