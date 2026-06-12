import React from 'react';
import { cn } from './Button';
import { Receipt, ShieldCheck, Briefcase } from 'lucide-react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'itc' | 'verified' | 'available' | '1slot' | 'workspace' | 'completed' | 'upcoming' | 'cancelled' | 'admin' | 'member';
  shape?: 'pill' | 'rect';
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
    pill: 'rounded-[20px] px-[12px] py-[6px]',
    rect: 'rounded-[4px] px-[10px] py-[4px]',
  };

  const variants = {
    default: 'bg-gray-100 text-gray-700',
    itc: 'bg-itc-bg text-itc-text',
    verified: 'bg-verified-bg text-verified-text',
    available: 'bg-green-light text-[#065F46]',
    '1slot': 'bg-amber-light text-[#92400E]',
    workspace: 'bg-workspace-bg text-workspace-text',
    completed: 'bg-green-light text-[#065F46]',
    upcoming: 'bg-amber-light text-[#92400E]',
    cancelled: 'bg-red-light text-[#991B1B]',
    admin: 'bg-navy text-white',
    member: 'bg-gray-100 text-gray-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center text-[12px] font-semibold gap-[6px] w-fit whitespace-nowrap',
        shapes[shape],
        variants[variant],
        className
      )}
      {...props}
    >
      {icon && variant === 'itc' && <Receipt size={14} />}
      {icon && variant === 'verified' && <ShieldCheck size={14} />}
      {icon && variant === 'available' && <div className="w-[6px] h-[6px] rounded-full bg-[#065F46]" />}
      {icon && variant === '1slot' && <div className="w-[6px] h-[6px] rounded-full bg-[#92400E]" />}
      {icon && variant === 'workspace' && <Briefcase size={14} />}
      {children}
    </span>
  );
};
