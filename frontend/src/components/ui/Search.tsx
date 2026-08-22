import React from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { Input, InputProps } from './Input';

interface SearchProps extends Omit<InputProps, 'leftIcon' | 'rightIcon'> {
  onClear?: () => void;
}

export const Search: React.FC<SearchProps> = ({ onClear, value, ...props }) => {
  return (
    <Input
      leftIcon={<SearchIcon className="h-4 w-4" />}
      rightIcon={
        value && onClear ? (
          <button 
            type="button" 
            onClick={onClear}
            className="hover:text-gray-700 transition-colors focus:outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        ) : undefined
      }
      value={value}
      {...props}
    />
  );
};
