import React from 'react';
import { cn } from './Button';
import { Receipt, ShieldCheck, Briefcase } from 'lucide-react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'itc' | 'verified' | 'workspace' | 'success' | 'warning' | 'error' | 'admin';
  shape?: 'pill' | 'tag';
  icon?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  shape = 'pill', 
  icon = false,
  className, 
  ...props 
}) => {
  const shapes = {
    pill: 'rounded-full text-[12px] font-medium px-[12px] py-[4px]',
    tag: 'rounded-[6px] text-[11px] font-semibold uppercase tracking-[0.08em] px-[8px] py-[3px]',
  };

  const variants = {
    default: 'bg-gray-100 text-gray-600',
    itc: 'bg-[#ECFDF5] text-[#065F46]',
    verified: 'bg-[#EFF6FF] text-[#1D4ED8]',
    workspace: 'bg-[#F5F3FF] text-[#5B21B6]',
    success: 'bg-[#ECFDF5] text-[#064E3B]',
    warning: 'bg-[#FFFBEB] text-[#F59E0B]',
    error: 'bg-[#FEF2F2] text-[#EF4444]',
    admin: 'bg-teal text-white',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center gap-[6px] w-fit whitespace-nowrap font-sans transition-colors',
        shapes[shape],
        variants[variant],
        className
      )}
      {...props}
    >
      {icon && variant === 'itc' && <Receipt size={12} />}
      {icon && variant === 'verified' && <ShieldCheck size={12} />}
      {icon && variant === 'workspace' && <Briefcase size={12} />}
      {icon && variant === 'success' && <div className="w-[6px] h-[6px] rounded-full bg-[#10B981]" />}
      {icon && variant === 'warning' && <div className="w-[6px] h-[6px] rounded-full bg-[#F59E0B]" />}
      {children}
    </span>
  );
};
