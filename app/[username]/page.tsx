"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '../../utils/supabase/client';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { MapPin, ShieldCheck, Clock, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';

export default function ExpertPublicProfile({ params }: { params: { username: string } }) {
  const [expert, setExpert] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      
      // Fetch expert profile by username
      const { data: profile, error } = await supabase
        .from('expert_profiles')
        .select('*')
        .eq('username', params.username)
        .single();
        
      if (error || !profile) {
        setLoading(false);
        return; // Will show not found
      }

      setExpert(profile);

      // Fetch expert services
      const { data: svcs } = await supabase
        .from('services')
        .select('*')
        .eq('expert_id', profile.id)
        .order('price', { ascending: true });

      if (svcs) setServices(svcs);
      setLoading(false);
    }
    fetchData();
  }, [params.username]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-text-muted">Loading profile...</div>;
  }

  if (!expert) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold text-navy-DEFAULT mb-2">Profile Not Found</h1>
        <p className="text-text-sub mb-6">The expert you are looking for does not exist.</p>
        <Button asChild><Link href="/search">Find an Expert</Link></Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFCFD]">
      {/* Header section */}
      <div className="bg-navy-DEFAULT pt-20 pb-32 px-6">
        <div className="max-w-[800px] mx-auto text-center relative z-10">
          <div className="w-32 h-32 mx-auto rounded-full bg-white border-4 border-white overflow-hidden shadow-lg mb-6">
            {expert.avatar_url ? (
              <Image src={expert.avatar_url} alt={expert.username} width={128} height={128} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-surface-2 flex items-center justify-center text-4xl font-bold text-navy-DEFAULT">
                {(expert.first_name?.[0] || expert.username?.[0] || 'E').toUpperCase()}
              </div>
            )}
          </div>
          <h1 className="text-[36px] md:text-[48px] font-bold text-white tracking-tight flex items-center justify-center gap-3">
            {expert.first_name ? `${expert.first_name} ${expert.last_name || ''}` : expert.username}
            <ShieldCheck className="text-teal-DEFAULT w-8 h-8" />
          </h1>
          <p className="text-[18px] text-white/80 mt-2 font-medium">{expert.title}</p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-[14px] text-white/60">
            <div className="flex items-center gap-1.5"><MapPin size={16} /> Global (Remote)</div>
            <div className="flex items-center gap-1.5"><Clock size={16} /> Usually responds in 2 hours</div>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="max-w-[800px] mx-auto px-6 -mt-20 relative z-20 pb-20">
        <div className="bg-white rounded-3xl shadow-xl border border-border p-8 md:p-12 mb-8">
          <h2 className="text-[20px] font-bold text-navy-DEFAULT mb-4">About</h2>
          <div className="prose prose-sm max-w-none text-text-body text-[16px] leading-relaxed">
            {expert.bio?.split('\n').map((para: string, i: number) => (
              <p key={i} className="mb-4">{para}</p>
            ))}
          </div>

          {expert.tags && expert.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="text-[14px] font-bold text-navy-DEFAULT mb-4 uppercase tracking-wider">Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {expert.tags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1.5 bg-surface-2 text-navy-DEFAULT rounded-full text-[13px] font-medium border border-border">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <h2 className="text-[24px] font-bold text-navy-DEFAULT mb-6">Available Services</h2>
        <div className="flex flex-col gap-4">
          {services.length > 0 ? (
            services.map(service => (
              <div key={service.id} className="bg-white rounded-[20px] border border-border p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center justify-between hover:shadow-md transition-shadow group">
                <div className="flex-1">
                  <h3 className="text-[18px] font-bold text-navy-DEFAULT mb-2 group-hover:text-teal-DEFAULT transition-colors">{service.title}</h3>
                  <p className="text-[15px] text-text-sub line-clamp-2">{service.description}</p>
                </div>
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between shrink-0 gap-4">
                  <div className="text-right">
                    <div className="text-[24px] font-bold text-navy-DEFAULT">₹{service.price}</div>
                    <div className="text-[13px] font-medium text-text-muted">{service.duration_minutes} mins</div>
                  </div>
                  <Button asChild size="md">
                    <Link href={`/${expert.username}/book/${service.id}`}>
                      Book Session <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-surface-1 rounded-[20px] border border-border border-dashed p-10 text-center">
              <p className="text-text-muted">This expert hasn't set up any services yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
