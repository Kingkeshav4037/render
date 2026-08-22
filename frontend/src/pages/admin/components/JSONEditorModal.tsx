import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  title: string;
  initialData: any;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export const JSONEditorModal: React.FC<Props> = ({ isOpen, title, initialData, onClose, onSave }) => {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setJsonText(JSON.stringify(initialData, null, 2));
      setError(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      setError(null);
      setSaving(true);
      const parsed = JSON.parse(jsonText);
      await onSave(parsed);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid JSON format');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-navy-900">{title}</h2>
            <p className="text-sm text-gray-500">Edit entity details in JSON format</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-2 border border-red-200">
              <AlertCircle size={16} className="mt-0.5" />
              <span className="font-medium">{error}</span>
            </div>
          )}
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="w-full h-[400px] font-mono text-sm p-4 bg-navy-900 text-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            spellCheck={false}
          />
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-lg font-bold text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 rounded-lg font-bold bg-navy-900 text-white flex items-center gap-2 hover:bg-navy-800 disabled:opacity-50 transition-colors"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};
