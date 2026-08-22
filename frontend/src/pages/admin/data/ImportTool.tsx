import React, { useState } from 'react';
import { UploadCloud, AlertCircle, FileJson, CheckCircle } from 'lucide-react';

export const ImportTool = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [parsing, setParsing] = useState(false);
  
  const handleUpload = () => {
    setParsing(true);
    setTimeout(() => {
      setParsing(false);
      setStep(2);
    }, 1500);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900">Bulk Data Import Pipeline</h1>
        <p className="text-gray-500">Safely import and normalize bulk Norway data with duplicate detection.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center mb-12">
        <Step active={step >= 1} label="Upload & Parse" number={1} />
        <div className={`flex-1 h-1 mx-4 rounded ${step >= 2 ? 'bg-navy-900' : 'bg-gray-200'}`}></div>
        <Step active={step >= 2} label="Duplicate Detection" number={2} />
        <div className={`flex-1 h-1 mx-4 rounded ${step >= 3 ? 'bg-navy-900' : 'bg-gray-200'}`}></div>
        <Step active={step >= 3} label="Approve & Import" number={3} />
      </div>

      {/* Step 1: Upload */}
      {step === 1 && (
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-navy-900 transition-colors">
          <UploadCloud size={48} className="mx-auto text-navy-900 mb-4" />
          <h3 className="text-xl font-bold text-navy-900 mb-2">Upload CSV or JSON File</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Drag and drop your file here, or click to browse. Max size 50MB.
            Supports Locations, Wildlife, Food, and Activities schemas.
          </p>
          <button 
            onClick={handleUpload}
            disabled={parsing}
            className="bg-navy-900 text-white px-8 py-3 rounded-lg font-bold shadow-md hover:bg-navy-800 disabled:opacity-50"
          >
            {parsing ? 'Parsing File...' : 'Select File'}
          </button>
        </div>
      )}

      {/* Step 2: Duplicate Detection */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="text-orange-600 mt-1" size={24} />
              <div>
                <h3 className="text-lg font-bold text-orange-800">Duplicate Conflicts Detected</h3>
                <p className="text-orange-700 mt-1">We parsed 1,000 records. 982 are clean, but 18 potential duplicates were found based on name similarity and coordinates.</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h4 className="font-bold text-navy-900 mb-4 border-b pb-2">Conflict Resolution Queue (1/18)</h4>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-xs font-bold uppercase text-gray-500 mb-2">Existing Database Record</div>
                <div className="font-bold text-navy-900 text-lg">Tromsø Airport</div>
                <div className="text-sm text-gray-600 font-mono mt-1">Lat: 69.6833 | Lng: 18.9167</div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 relative">
                <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">NEW IMPORT</div>
                <div className="text-xs font-bold uppercase text-blue-600 mb-2">Imported Record</div>
                <div className="font-bold text-navy-900 text-lg">Tromso Airport (Langnes)</div>
                <div className="text-sm text-gray-600 font-mono mt-1">Lat: 69.6830 | Lng: 18.9160</div>
                <div className="mt-3 text-xs font-bold text-orange-600 bg-orange-100 inline-block px-2 py-1 rounded">98% Name Match | 30m proximity</div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button className="px-6 py-2 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50">Skip Record</button>
              <button className="px-6 py-2 bg-navy-900 text-white rounded-lg font-bold shadow-sm hover:bg-navy-800">Update Existing</button>
              <button className="px-6 py-2 bg-white border border-navy-900 text-navy-900 rounded-lg font-bold hover:bg-blue-50" onClick={() => setStep(3)}>Resolve All (Mock)</button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Complete */}
      {step === 3 && (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
          <CheckCircle size={64} className="mx-auto text-aurora-green mb-6" />
          <h3 className="text-2xl font-bold text-navy-900 mb-2">Import Complete</h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Successfully imported 994 locations into the canonical database.
          </p>
          
          <div className="flex justify-center gap-4">
            <button className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50">
              <FileJson size={18} /> Download Import Log
            </button>
            <button onClick={() => setStep(1)} className="px-6 py-2 bg-navy-900 text-white rounded-lg font-bold hover:bg-navy-800">
              New Import
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Step = ({ active, label, number }: any) => (
  <div className="flex flex-col items-center gap-2">
    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${
      active ? 'bg-navy-900 text-white shadow-md' : 'bg-gray-200 text-gray-500'
    }`}>
      {number}
    </div>
    <span className={`text-sm font-bold ${active ? 'text-navy-900' : 'text-gray-400'}`}>{label}</span>
  </div>
);
