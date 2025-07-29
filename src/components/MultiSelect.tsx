import { Label } from 'flowbite-react';
import React, { useState, useEffect, useRef } from 'react';
import { HiX } from 'react-icons/hi';

interface CustomMultiSelectProps {
  id: string;
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
  required?: boolean;
  disabled?: boolean;
}

export const MultiSelect: React.FC<CustomMultiSelectProps> = ({
  id,
  label,
  options,
  selectedValues,
  onChange,
  required = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const multiSelectRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (value: string) => {
    if (!disabled) {
      const newSelected = selectedValues.includes(value)
        ? selectedValues.filter((item) => item !== value)
        : [...selectedValues, value];
      onChange(newSelected);
    }
  };

  const handleRemove = (value: string) => {
    if (!disabled) {
      const newSelected = selectedValues.filter((item) => item !== value);
      onChange(newSelected);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (multiSelectRef.current && !multiSelectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen && !disabled) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, disabled]);

  return (
    <div className="flex flex-col gap-2" ref={multiSelectRef}>
      <Label htmlFor={id} value={label} />
      <div className="relative">
        <div
          className={`w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            disabled ? 'cursor-not-allowed bg-gray-100 opacity-50' : 'cursor-pointer'
          }`}
          onClick={toggleDropdown}
        >
          {selectedValues?.length === 0 ? (
            <span className="text-gray-500">Select {label.toLowerCase()}...</span>
          ) : (
            <div className="flex flex-wrap gap-1">
              {selectedValues?.map((value ,index) => (
                <span
                  key={index}
                  className="inline-flex items-center bg-blue-50 text-blue-800 text-sm font-medium px-2 py-1 rounded-sm"
                >
                  {value}
                  <button
                    color="primary"
                    type="button"
                    className={`ml-1 focus:outline-none ${disabled ? 'cursor-not-allowed' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(value);
                    }}
                    disabled={disabled}
                  >
                    <HiX className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        {isOpen && !disabled && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-sm max-h-60 overflow-y-auto">
            {options && options.length > 0 ? (
              options.map((option ,index) => (
                <div
                  key={index}
                  className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                    selectedValues?.includes(option) ? 'bg-blue-100' : ''
                  } ${disabled ? 'cursor-not-allowed' : ''}`}
                  onClick={() => handleSelect(option)}
                >
                  <input
                    type="checkbox"
                    checked={selectedValues?.includes(option)}
                    onChange={() => {}}
                    className="mr-2"
                    disabled={disabled}
                  />
                  {option}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-400">No options available</div>
            )}
          </div>
        )}
      </div>
      {required && (
        <input
          type="hidden"
          id={id}
          required
          value={selectedValues?.length > 0 ? selectedValues?.join(',') : ''}
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default MultiSelect;
