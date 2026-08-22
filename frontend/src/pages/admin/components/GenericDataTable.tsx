import React, { useState } from 'react';
import { Search, Filter, Edit2, Trash2, Eye } from 'lucide-react';

export interface ColumnDef {
  key: string;
  header: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface Props {
  title: string;
  data: any[];
  columns: ColumnDef[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
}

export const GenericDataTable: React.FC<Props> = ({ title, data, columns, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
        <h2 className="text-lg font-bold text-navy-900">{title}</h2>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-navy-900 focus:ring-1 focus:ring-navy-900"
            />
          </div>
          <button className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold border-b border-gray-200">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-4">{col.header}</th>
              ))}
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-gray-500">
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={row.id || i} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => onEdit?.(row)}
                        className="p-1.5 text-gray-400 hover:text-green-600 rounded-md hover:bg-green-50 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete?.(row)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Footer */}
      <div className="p-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500 bg-gray-50/50">
        <div>Showing {data.length > 0 ? 1 : 0} to {data.length} of {data.length} entries</div>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-50">Previous</button>
          <button className="px-3 py-1 border border-gray-200 rounded bg-navy-900 text-white hover:bg-navy-800">1</button>
          <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
};
