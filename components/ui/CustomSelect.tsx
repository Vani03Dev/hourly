"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  icon?: React.ReactNode;
  value: string;
  options: SelectOption[] | string[];
  onChange: (val: string) => void;
  className?: string;
  placeholder?: string;
}

export function CustomSelect({ icon, value, options, onChange, className = '', placeholder = 'Select...' }: CustomSelectProps) {
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

  const normalizedOptions: SelectOption[] = options.map(opt => 
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );

  const selectedOption = normalizedOptions.find(opt => opt.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-full min-h-[44px] px-4 border border-gray-200 rounded-[8px] text-[13px] text-gray-600 font-semibold outline-none bg-white hover:border-teal transition-colors shadow-sm flex items-center justify-between focus:ring-2 focus:ring-teal/15 focus:border-teal"
      >
        <div className="flex items-center gap-2 truncate">
          {icon && <span className="text-gray-400 shrink-0">{icon}</span>}
          <span className="truncate">{displayValue}</span>
        </div>
        <ChevronDown size={14} className={`text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-[100] mt-1 w-full bg-white border border-gray-100 rounded-[12px] shadow-xl py-1 right-0 max-h-[250px] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
          {normalizedOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left text-[13px] font-medium flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className={value === option.value ? 'text-teal font-bold' : 'text-gray-600'}>
                {option.label}
              </span>
              {value === option.value && <Check size={14} className="text-teal shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
