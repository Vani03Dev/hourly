"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ShieldCheck, Zap, Clock, CheckCircle2 } from 'lucide-react';
import { SHOW_RATINGS_AND_REVIEWS } from '@/lib/feature-flags';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { createClient } from '../../utils/supabase/client';

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
  const user = useSelector((state: RootState) => state.auth.user);
  const [role, setRole] = useState<'company' | 'expert' | null>(user?.user_metadata?.role || null);

  useEffect(() => {
    async function checkRole() {
      if (!user) {
        setRole(null);
        return;
      }
      const supabase = createClient();
      const { data: eData } = await supabase.from('expert_profiles').select('id').eq('id', user.id).single();
      if (eData || user.user_metadata?.role === 'expert') {
        setRole('expert');
      } else {
        setRole('company');
      }
    }
    checkRole();
  }, [user]);

  const displayName = expert.name;

  return (
    <div className="bg-white border border-gray-200 rounded-[12px] p-[24px] shadow-level-1 relative flex flex-col h-full hover:-translate-y-[3px] hover:shadow-level-2 transition-all duration-200 ease-out group">
      
      {/* ONLINE STATUS & ITC BADGE */}
      <div className="absolute top-[20px] right-[20px] flex flex-col items-end gap-[6px]">
        {expert.isVerified && (
          <Badge variant="verified" shape="tag">Verified</Badge>
        )}
        {expert.availability === 'now' ? (
          <Badge variant="success" shape="pill" icon>Available</Badge>
        ) : (
          <Badge variant="warning" shape="pill" icon>Today</Badge>
        )}
      </div>

      {/* HEADER: AVATAR & INFO */}
      <div className="flex gap-[16px]">
        <div className="relative shrink-0">
          {(expert.avatarUrl || expert.photo) ? (
            <Image 
              src={expert.avatarUrl || expert.photo || ''} 
              alt={displayName} 
              width={52} 
              height={52} 
              className="w-[52px] h-[52px] rounded-full object-cover border-[3px] border-white ring-[3px] ring-teal"
            />
          ) : (
            <div className="w-[52px] h-[52px] rounded-full bg-[#0F2137] text-white flex items-center justify-center font-bold text-[18px]">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 min-w-0 pt-[2px]">
          <div className="flex items-center gap-[4px]">
            <h3 className="text-[16px] font-bold text-[#0F2137] truncate">{displayName}</h3>
          </div>
          
          <p className="text-[13px] text-gray-500 mt-[2px] line-clamp-1 font-medium">{expert.title}</p>
        </div>
      </div>

      {/* CREDENTIAL PILLS */}
      <div className="flex flex-wrap gap-[6px] mt-[16px]">
        {(expert.specializations || expert.credentials || []).slice(0, 2).map((spec, i) => (
          <Badge key={i} variant="workspace" shape="pill">{spec}</Badge>
        ))}
        {(expert.specializations || expert.credentials || []).length > 2 && (
          <Badge variant="default" shape="pill">+{ (expert.specializations || expert.credentials || []).length - 2 } more</Badge>
        )}
      </div>

      {/* STATS ROW */}
      <div className="flex items-center gap-[16px] border-t border-gray-100 mt-[16px] pt-[16px]">
        {SHOW_RATINGS_AND_REVIEWS && (
        <div className="flex items-center gap-[4px] text-[13px] font-semibold text-gray-700">
          <span>{expert.rating || '4.9'}★</span>
        </div>
        )}
        <div className="text-[13px] text-gray-500">
          {expert.sessionCount || expert.sessions || 12} sessions
        </div>
        <div className="text-[13px] text-gray-500">
          {expert.responseTime || '<1hr'}
        </div>
      </div>

      <div className="flex-grow"></div>

      {/* PRICE & ACTION */}
      <div className="mt-[20px] pt-[12px] flex items-center justify-between border-t border-gray-100">
        <div className="flex flex-col">
          <span className="text-price-s">
            ₹{(expert.price || 600).toLocaleString('en-IN')}
          </span>
          <span className="text-[12px] text-gray-400 font-medium">30 or 60 min</span>
        </div>
        
        <Button variant="primary" size="sm" asChild>
          <Link href={role === 'expert' ? `/experts/${expert.id}` : `/booking/${expert.id}`}>
            {role === 'expert' ? 'View Profile' : 'Book Now'}
          </Link>
        </Button>
      </div>
    </div>
  );
};
