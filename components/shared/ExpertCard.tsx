import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ShieldCheck, Star, Zap, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCurrency } from '../../contexts/CurrencyContext';

export interface ExpertData {
  id: string;
  name: string;
  title: string;
  avatarUrl?: string;
  photo?: string;
  location: string;
  timezone?: string;
  isVerified?: boolean;
  isElite?: boolean;
  isOnline?: boolean;
  availability?: string;
  nextAvailability?: string;
  specializations?: string[];
  credentials?: string[];
  rating?: number;
  sessionCount?: number;
  sessions?: number;
  responseTime?: string;
  price: number;
  usdPrice?: number;
}

interface ExpertCardProps {
  expert: ExpertData;
}

export const ExpertCard: React.FC<ExpertCardProps> = ({ expert }) => {
  const { currency } = useCurrency();

  return (
    <div className="bg-white border border-border rounded-[16px] p-6 relative flex flex-col h-full hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-teal-DEFAULT/40 transition-all duration-300 group">
      
      {/* ONLINE STATUS DOT (Top Right Corner) */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5">
        {expert.isOnline && (
          <>
            <span className="w-2 h-2 rounded-full bg-green-DEFAULT animate-pulse" />
            <span className="text-[11px] font-semibold text-green-DEFAULT uppercase tracking-wider">Online</span>
          </>
        )}
      </div>

      {/* HEADER: AVATAR & INFO */}
      <div className="flex gap-4">
        <div className="relative shrink-0">
          {(expert.avatarUrl || expert.photo) ? (
            <Image 
              src={expert.avatarUrl || expert.photo || ''} 
              alt={expert.name} 
              width={64} 
              height={64} 
              className="w-16 h-16 rounded-full object-cover border border-border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-surface-2 border border-border flex items-center justify-center text-navy-DEFAULT font-bold text-[20px]">
              {expert.name.charAt(0)}
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 min-w-0 pt-1">
          <div className="flex items-center gap-2">
            <h3 className="text-[18px] font-bold text-navy-DEFAULT truncate">{expert.name}</h3>
            {expert.isVerified && (
              <ShieldCheck className="w-[18px] h-[18px] text-teal-DEFAULT shrink-0" />
            )}
          </div>
          
          <p className="text-[13px] text-text-sub mt-0.5 line-clamp-1 font-medium">{expert.title}</p>
          
          <div className="flex items-center gap-2 text-[12px] text-text-muted mt-1.5">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{expert.location}</span>
          </div>
        </div>
      </div>

      {/* SPECIALIZATIONS */}
      <div className="flex flex-wrap gap-2 mt-5">
        {(expert.specializations || expert.credentials || []).slice(0, 3).map((spec, i) => (
          <span key={i} className="bg-surface-2 text-navy-DEFAULT text-[11px] font-semibold px-2.5 py-1 rounded-md border border-border/50">
            {spec}
          </span>
        ))}
        {(expert.specializations || expert.credentials || []).length > 3 && (
          <span className="text-text-muted text-[11px] font-semibold px-1 py-1">
            +{(expert.specializations || expert.credentials || []).length - 3}
          </span>
        )}
      </div>

      {/* TRUST & AVAILABILITY GRID */}
      <div className="grid grid-cols-2 gap-y-2 mt-6 pt-5 border-t border-border/60">
        <div className="flex items-center gap-1.5 text-[12px] text-text-sub">
          <CheckCircle2 className="w-3.5 h-3.5 text-teal-DEFAULT" /> KYC Verified
        </div>
        <div className="flex items-center gap-1.5 text-[12px] text-text-sub">
          <CheckCircle2 className="w-3.5 h-3.5 text-teal-DEFAULT" /> NDA Ready
        </div>
        
        <div className="flex items-center gap-1.5 text-[12px] font-medium mt-1">
          {expert.availability === 'now' ? (
            <span className="text-green-DEFAULT flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 fill-current" /> Available Now</span>
          ) : expert.availability === 'today' ? (
            <span className="text-teal-DEFAULT flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Available Today</span>
          ) : (
             <span className="text-text-muted flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Book Next Week</span>
          )}
        </div>
      </div>

      <div className="flex-grow"></div>

      {/* PRICE & ACTION */}
      <div className="mt-6 pt-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[11px] text-text-muted font-medium uppercase tracking-wider mb-0.5">Session Rate</span>
          <div className="flex items-baseline gap-1">
            <span className="text-[20px] font-bold text-navy-DEFAULT font-mono">
              ₹{expert.price.toLocaleString('en-IN')}
            </span>
            <span className="text-[13px] text-text-sub font-medium">/hr</span>
          </div>
        </div>
        
        <Button variant="primary" className="bg-navy-DEFAULT hover:bg-navy-dark text-white rounded-xl shadow-md group-hover:bg-teal-DEFAULT transition-colors px-6" asChild>
          <Link href={`/book/${expert.id}`}>Book Now</Link>
        </Button>
      </div>
    </div>
  );
};
