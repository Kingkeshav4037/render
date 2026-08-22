import React from 'react';

interface Props {
  status: string;
}

export const EVStatusBadge: React.FC<Props> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-100 text-green-700 border-green-200';
      case 'OCCUPIED': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'CHARGING': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'OFFLINE': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'MAINTENANCE': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`px-2 py-1 text-xs font-bold uppercase rounded-md border ${getStatusColor()}`}>
      {status}
    </span>
  );
};
