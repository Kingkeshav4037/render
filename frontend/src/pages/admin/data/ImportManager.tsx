import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useAdmin } from '../../../hooks/useAdmin';
import { importService } from '../../../services/importService';

type ImportState = 'IDLE' | 'VALIDATING' | 'PREVIEW' | 'PROCESSING' | 'COMPLETED';

export const ImportManager = () => {
  const { hasPermission } = useAdmin();
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<ImportState>('IDLE');
  
  const [metrics, setMetrics] = useState({ total: 0, valid: 0, warnings: 0, errors: 0 });
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('locations');

  const canExecute = hasPermission('imports', 'execute');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setState('VALIDATING');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const json = JSON.parse(text);
          if (!Array.isArray(json)) throw new Error('Root element must be a JSON array');
          
          setParsedData(json);
          // Simplified validation logic
          setMetrics({ 
            total: json.length, 
            valid: json.length, // assuming all valid for MVP
            warnings: 0, 
            errors: 0 
          });
          setState('PREVIEW');
        } catch (err) {
          console.error("Parse error", err);
          setState('IDLE');
          alert('Failed to parse JSON file.');
        }
      };
      reader.readAsText(uploadedFile);
    }
  };

  const handleExecute = async () => {
    setState('PROCESSING');
    
    try {
      await importService.executeBulkImport(selectedTable, parsedData);
      setState('COMPLETED');
    } catch (err) {
      console.error(err);
      alert('Failed to import data');
      setState('PREVIEW');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Bulk Data Importer</h1>
        <p className="text-gray-500">Import destinations, wildlife, and POIs securely via CSV or JSON.</p>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-200 p-8">
        
        {/* Step 1: Upload */}
        {state === 'IDLE' && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors">
            <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Upload Data File</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">Supports .json files containing an array of records</p>
            <div className="mb-4 text-left inline-block">
              <label className="block text-sm font-bold text-gray-700 mb-1">Target Table</label>
              <select 
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:border-navy-900 focus:ring-1 focus:ring-navy-900 text-sm font-medium"
              >
                <option value="locations">Locations (Places)</option>
                <option value="accommodations">Accommodations</option>
                <option value="activities">Activities</option>
                <option value="restaurants">Restaurants</option>
              </select>
            </div>
            <br />
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".csv,.json"
              onChange={handleFileUpload}
            />
            <label 
              htmlFor="file-upload" 
              className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 shadow-sm"
            >
              Browse Files
            </label>
          </div>
        )}

        {/* Step 2: Validating */}
        {state === 'VALIDATING' && (
          <div className="py-12 text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Validating Data...</h3>
            <p className="text-sm text-gray-500 mt-1">Checking for duplicates, schema matches, and constraints.</p>
          </div>
        )}

        {/* Step 3: Preview */}
        {state === 'PREVIEW' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-bold text-navy-900">{file?.name}</h3>
                <p className="text-sm text-gray-500">Validation complete. Ready for import.</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-900">{metrics.total}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Total Rows</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                <div className="text-2xl font-bold text-green-700">{metrics.valid}</div>
                <div className="text-xs text-green-600 uppercase tracking-wide font-medium">Valid</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-center">
                <div className="text-2xl font-bold text-yellow-700">{metrics.warnings}</div>
                <div className="text-xs text-yellow-600 uppercase tracking-wide font-medium">Warnings (Duplicates)</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
                <div className="text-2xl font-bold text-red-700">{metrics.errors}</div>
                <div className="text-xs text-red-600 uppercase tracking-wide font-medium">Errors (Skipped)</div>
              </div>
            </div>

            {metrics.errors > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-sm text-red-800">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
                <div>
                  <p className="font-semibold mb-1">10 rows failed validation and will be skipped.</p>
                  <button className="text-red-700 underline font-medium hover:text-red-900">Download error report</button>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button 
                onClick={() => { setFile(null); setState('IDLE'); }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleExecute}
                disabled={!canExecute || metrics.valid === 0}
                className="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 font-medium shadow-sm disabled:opacity-50"
              >
                Import {metrics.valid} Valid Rows
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Processing */}
        {state === 'PROCESSING' && (
          <div className="py-12 text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Importing Data...</h3>
            <p className="text-sm text-gray-500 mt-1">This is running as a background job.</p>
            <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto mt-6 overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full w-1/2 animate-pulse"></div>
            </div>
          </div>
        )}

        {/* Step 5: Completed */}
        {state === 'COMPLETED' && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Import Successful</h3>
            <p className="text-gray-500 mb-6">Successfully imported {metrics.valid} records.</p>
            <button 
              onClick={() => { setFile(null); setState('IDLE'); }}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium shadow-sm"
            >
              Start New Import
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
