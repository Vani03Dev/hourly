import React, { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from './Button'; // reuse cn utility

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'default' | 'large';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, size = 'default', leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="flex flex-col w-full font-sans">
        {label && (
          <label className="text-[13px] font-medium text-gray-700 mb-[6px] select-none">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <div className="absolute left-[12px] flex items-center justify-center pointer-events-none text-muted">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full rounded-[8px] bg-white border border-border text-[14px] text-primary outline-none transition-all duration-150',
              'hover:border-gray-400 focus:border-accent focus:ring-2 focus:ring-accent/15 focus:ring-offset-0',
              size === 'large' ? 'h-[52px]' : 'h-[44px]',
              leftIcon ? 'pl-[40px]' : 'pl-[16px]',
              rightIcon ? 'pr-[40px]' : 'pr-[16px]',
              error && 'border-danger focus:border-danger focus:ring-danger/15',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-[12px] flex items-center justify-center pointer-events-none text-muted">
              {rightIcon}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p className={cn("text-[11px] font-semibold mt-[4px]", error ? "text-danger" : "text-muted")}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
