import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { StayDetails } from '../../StayDetails'; // Reuse the consumer view for the actual preview

export const ListingPreview = () => {
  const { id } = useParams();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Top Warning/Action Bar for Provider */}
      <div className="bg-slate-900 text-white px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-4">
          <Link to={`/provider/listings/${id}/edit`} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Preview Mode</div>
            <div className="text-sm font-semibold">This is exactly how customers see your listing.</div>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2">
            <CheckCircle2 size={16} /> Publish Listing
          </button>
        </div>
      </div>

      {/* Actual Mocked Consumer View */}
      {/* We wrap it in a pointer-events-none or just let them click around. Better to isolate it slightly. */}
      <div className="flex-1 relative border-t-4 border-slate-900">
        <StayDetails /> 
        {/* We reuse the existing StayDetails component which already looks beautiful, 
            perfect for a high-fidelity mock of a published listing! */}
      </div>
    </div>
  );
};
