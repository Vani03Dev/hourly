import React, { InputHTMLAttributes } from 'react';
import { cn } from './Button'; // reuse cn utility

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label className="text-[14px] font-semibold text-gray-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'h-[48px] px-4 rounded-[8px] bg-white border outline-none transition-all duration-250',
            'placeholder:text-gray-500 text-gray-900',
            error 
              ? 'border-red focus:border-red focus:ring-1 focus:ring-red' 
              : 'border-gray-300 focus:border-teal focus:ring-1 focus:ring-teal',
            className
          )}
          {...props}
        />
        {(error || helperText) && (
          <p className={cn("text-[13px]", error ? "text-red" : "text-gray-500")}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
