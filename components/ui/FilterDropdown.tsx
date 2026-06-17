"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface FilterDropdownProps {
  icon?: React.ReactNode;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  className?: string;
}

export function FilterDropdown({ icon, value, options, onChange, className = '' }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-[40px] pl-[36px] pr-[16px] border border-gray-200 rounded-[8px] text-[13px] text-gray-600 font-semibold outline-none bg-white hover:border-teal transition-colors shadow-sm flex items-center justify-between"
      >
        <div className="absolute left-[12px] top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {icon}
        </div>
        <span className="truncate">{value}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full lg:w-[220px] bg-white border border-gray-100 rounded-[12px] shadow-level-2 py-1 right-0 max-h-[250px] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-[13px] font-medium flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className={value === option ? 'text-teal font-bold' : 'text-gray-600'}>
                {option}
              </span>
              {value === option && <Check size={14} className="text-teal" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
