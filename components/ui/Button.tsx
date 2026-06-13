import React, { ButtonHTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Slot } from '@radix-ui/react-slot';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'teal-outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth = false, asChild = false, ...props }, ref) => {
    
    const variants = {
      primary: 'bg-teal text-white hover:bg-teal-600 active:scale-[0.98]',
      secondary: 'bg-[#0F2137] text-white hover:bg-[#1E3A5F] active:scale-[0.98]',
      outline: 'bg-transparent border-[1.5px] border-gray-200 text-gray-700 hover:border-gray-700 hover:text-gray-900 active:scale-[0.98]',
      'teal-outline': 'bg-transparent border-[1.5px] border-teal text-teal hover:bg-teal hover:text-white active:scale-[0.98]',
      ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 active:scale-[0.98]',
      danger: 'bg-red text-white hover:bg-red-900 active:scale-[0.98]',
    };

    const sizes = {
      xs: 'h-[28px] px-[10px] text-[12px] font-semibold rounded-[6px]',
      sm: 'h-[36px] px-[14px] text-[13px] font-semibold rounded-[6px]',
      md: 'h-[44px] px-[20px] text-[15px] font-semibold rounded-[8px]',
      lg: 'h-[52px] px-[24px] text-[16px] font-bold rounded-[8px]',
      xl: 'h-[60px] px-[28px] text-[18px] font-bold rounded-[10px]',
    };

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-[150ms] ease-in-out font-sans select-none',
          'focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:bg-gray-100 disabled:text-gray-400',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
