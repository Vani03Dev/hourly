import React, { ButtonHTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Slot } from '@radix-ui/react-slot';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'icon-only';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth = false, asChild = false, ...props }, ref) => {
    
    const variants = {
      primary: 'bg-teal-DEFAULT text-white hover:bg-teal-dark hover:shadow-teal',
      secondary: 'bg-navy-DEFAULT text-white hover:bg-navy-dark',
      outline: 'bg-transparent border border-navy-DEFAULT text-navy-DEFAULT hover:bg-navy-DEFAULT hover:text-white',
      danger: 'bg-red-DEFAULT text-white',
      ghost: 'bg-transparent text-text-body hover:bg-surface-DEFAULT',
      'icon-only': 'bg-transparent text-text-body hover:bg-surface-2',
    };

    const sizes = {
      sm: 'h-[36px] px-4 text-[14px] font-medium rounded-[6px]',
      md: 'h-[48px] px-6 text-[16px] font-semibold rounded-[6px]',
      lg: 'h-[56px] px-8 text-[18px] font-semibold rounded-[6px]',
      icon: 'w-[40px] h-[40px] p-0 rounded-[4px]',
    };

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-200 ease-in-out font-sans',
          'active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none disabled:bg-surface-2 disabled:text-text-disabled',
          variants[variant],
          sizes[variant === 'icon-only' ? 'icon' : size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
