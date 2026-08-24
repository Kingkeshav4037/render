import React, { useState } from 'react';
import { Search, Filter, Edit2, Trash2, Eye } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

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
          <Input 
            type="text" 
            placeholder="Search..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={16} />}
            className="w-64"
          />
          <Button variant="outline" size="sm" className="h-11 px-3">
            <Filter size={18} className="text-gray-600" />
          </Button>
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
                      <Button variant="ghost" size="sm" className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                        <Eye size={16} />
                      </Button>
                      <Button 
                        variant="ghost" size="sm"
                        onClick={() => onEdit?.(row)}
                        className="p-1.5 text-gray-400 hover:text-green-600 rounded-md hover:bg-green-50 transition-colors"
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button 
                        variant="ghost" size="sm"
                        onClick={() => onDelete?.(row)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} />
                      </Button>
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
          <Button variant="outline" size="sm" className="px-3 py-1 bg-white hover:bg-gray-100 text-gray-700 font-normal">Previous</Button>
          <Button variant="primary" size="sm" className="px-3 py-1 bg-navy-900 text-white hover:bg-navy-800">1</Button>
          <Button variant="outline" size="sm" className="px-3 py-1 bg-white hover:bg-gray-100 text-gray-700 font-normal">Next</Button>
        </div>
      </div>
    </div>
  );
};
