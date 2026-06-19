"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '../../utils/supabase/client';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  MapPin, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Star,
  Receipt, 
  Heart, 
  MessageSquare,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Video,
  FileText
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { SHOW_RATINGS_AND_REVIEWS } from '@/lib/feature-flags';
import toast from 'react-hot-toast';

export const dynamic = 'force-dynamic';

const getThemeClasses = (theme: string) => {
  switch(theme) {
    case 'blue': return { text: 'text-blue-600', bg: 'bg-blue-600', bgLight: 'bg-blue-50', ring: 'ring-blue-500', border: 'border-blue-500', borderLight: 'border-blue-200', hoverBg: 'hover:bg-blue-50', hoverText: 'hover:text-blue-600' };
    case 'navy': return { text: 'text-[#0F2137]', bg: 'bg-[#0F2137]', bgLight: 'bg-gray-100', ring: 'ring-[#0F2137]', border: 'border-[#0F2137]', borderLight: 'border-gray-300', hoverBg: 'hover:bg-gray-100', hoverText: 'hover:text-[#0F2137]' };
    default: return { text: 'text-teal', bg: 'bg-teal', bgLight: 'bg-teal-50', ring: 'ring-teal', border: 'border-teal', borderLight: 'border-teal/30', hoverBg: 'hover:bg-teal-50', hoverText: 'hover:text-teal' };
  }
};

export default function ExpertPublicProfile({ params }: { params: Promise<{ username: string }> }) {
  const { username } = React.use(params);
  const router = useRouter();
  const [expert, setExpert] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Profile Interactive States
  const [liked, setLiked] = useState(false);
  const [selectedSessionType, setSelectedSessionType] = useState<'video' | 'async'>('video');
  const [selectedDuration, setSelectedDuration] = useState<30 | 60>(30);
  const [selectedDate, setSelectedDate] = useState<number>(10);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('11:00 AM');

  // No fake data anymore

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      
      // Attempt to fetch from DB
      const { data: profile } = await supabase
        .from('expert_profiles')
        .select('*')
        .eq('username', username)
        .single();
        
      if (profile) {
          setExpert({
          id: profile.id,
          name: profile.is_anonymous ? 'Anonymous Expert' : (`${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.username),
          title: profile.title,
          avatar_url: profile.is_anonymous ? '' : (profile.avatar_url || ""),
          bio: profile.bio,
          hourly_rate: profile.hourly_rate,
          tags: profile.tags || [],
          page_theme: profile.page_theme || 'teal',
          linkedin_data: profile.linkedin_data || null,
          is_anonymous: profile.is_anonymous || false,
          is_online: profile.is_online || false,
          last_active_at: profile.last_active_at || null,
          rating: "0",
          sessions: "0",
          satisfaction: "0%",
          responseTime: "-",
          experience: profile.linkedin_data?.experiences || []
        });
      } else {
        router.push('/404');
      }
      setLoading(false);
    }
    fetchData();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-sans">
        <div className="animate-skeleton-pulse font-bold">Loading expert profile...</div>
      </div>
    );
  }

  // Calculate if expert is online based on boolean set by PresenceTracker
  const isOnlineNow = expert.is_online === true;

  const ratePerSession = selectedDuration === 30 ? expert.hourly_rate : expert.hourly_rate * 1.8;
  const platformFee = Math.round(ratePerSession * 0.05);
  const totalDue = ratePerSession + platformFee;

  const datesList = [
    { num: 8, day: "Mon", available: false },
    { num: 9, day: "Tue", available: false },
    { num: 10, day: "Wed", available: true, today: true },
    { num: 11, day: "Thu", available: true },
    { num: 12, day: "Fri", available: true },
    { num: 13, day: "Sat", available: false },
    { num: 14, day: "Sun", available: false },
    { num: 15, day: "Mon", available: true },
    { num: 16, day: "Tue", available: true },
    { num: 17, day: "Wed", available: true }
  ];

  const timeSlots = [
    { time: "09:00 AM", status: "available" },
    { time: "10:00 AM", status: "available" },
    { time: "11:00 AM", status: "available" },
    { time: "12:00 PM", status: "booked" },
    { time: "02:00 PM", status: "1-left" },
    { time: "03:30 PM", status: "available" },
    { time: "04:30 PM", status: "booked" }
  ];

  const handleBookSlotClick = () => {
    router.push(`/book/${expert.id}?date=${selectedDate}&time=${encodeURIComponent(selectedTimeSlot)}&duration=${selectedDuration}`);
  };

  const t = getThemeClasses(expert?.page_theme || 'teal');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans select-none overflow-x-hidden">
      
      {/* 1. PROFILE HEADER */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white px-[20px] md:px-[48px] lg:px-[96px] py-[40px] border-b border-gray-200 shadow-level-1 relative z-10"
      >
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-[32px] md:gap-[48px] items-center">
          
          {/* Avatar side */}
          <div className="md:col-span-3 flex flex-col items-center">
            <div className="relative">
              <div className={`relative w-[120px] h-[120px] rounded-full overflow-hidden border-[3px] border-white ring-[3px] ${t.ring} bg-gray-100 flex items-center justify-center`}>
                {expert.avatar_url ? (
                  <img 
                    src={expert.avatar_url} 
                    alt={expert.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[40px] font-bold text-gray-400">{expert.name?.charAt(0)}</span>
                )}
              </div>
              
              {isOnlineNow && (
                <span className="absolute bottom-[4px] right-[4px] flex h-[24px] w-[24px] z-10">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-[24px] w-[24px] bg-green-500 border-[4px] border-white shadow-sm"></span>
                </span>
              )}
            </div>
            
            <Badge variant="success" shape="tag" className="mt-[16px]">
              Verified Expert
            </Badge>
          </div>

          {/* Details side */}
          <div className="md:col-span-9 flex flex-col items-start">
            <h1 className="text-[32px] font-extrabold text-[#0F2137] tracking-tight leading-none flex items-center gap-[8px]">
              <span>{expert.name}</span>
              <ShieldCheck className={`w-[24px] h-[24px] ${t.text}`} />
            </h1>
            <p className="text-[18px] text-gray-500 mt-[6px] font-medium">
              {expert.title}
            </p>

            {/* Credentials Pills */}
            <div className="flex flex-wrap gap-[8px] mt-[12px]">
              {expert.tags.map((tag: string, i: number) => (
                <Badge key={i} variant="verified" shape="pill">{tag}</Badge>
              ))}
            </div>

            {/* GST ITC Banner */}
            <div className="bg-[#ECFDF5] border border-green/20 rounded-[10px] py-[12px] px-[16px] mt-[16px] flex items-center gap-[10px] w-full">
              <Receipt className="w-[16px] h-[16px] text-[#064E3B] shrink-0" />
              <span className="text-[14px] text-[#064E3B] font-semibold">
                GST ITC Eligible — every session auto-generates a claimable invoice
              </span>
            </div>

            {/* Stats Row */}
            <div className={`grid gap-[24px] mt-[20px] pt-[20px] border-t border-gray-200 w-full ${SHOW_RATINGS_AND_REVIEWS ? "grid-cols-4" : "grid-cols-3"}`}>
              {[
                ...(SHOW_RATINGS_AND_REVIEWS ? [{ val: `0★`, label: "Rating" }] : []),
                { val: `0`, label: "Sessions" },
                { val: "0%", label: "Satisfaction" },
              ].map((s, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-[22px] font-extrabold text-[#0F2137]">{s.val}</span>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-[2px]">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </motion.section>

      {/* 2. STICKY ACTION BAR */}
      <div className="sticky top-[64px] z-40 bg-white border-b border-gray-200 shadow-level-2 h-[64px] flex items-center justify-center px-[20px] md:px-[48px] lg:px-[96px] w-full">
        <div className="max-w-[1000px] w-full flex justify-between items-center">
          <div>
            <div className="flex items-baseline gap-[4px]">
              <span className="text-price-s">₹{expert.hourly_rate}</span>
              <span className="text-[13px] text-gray-500 font-semibold">/ session</span>
            </div>
            <span className="text-[12px] text-gray-400 font-medium hidden sm:inline">30 or 60 min · GST invoice included</span>
          </div>

          <div className="flex gap-[8px]">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`border border-gray-200 ${liked ? 'text-red bg-red-50' : 'text-gray-500'}`} 
              onClick={() => setLiked(!liked)}
            >
              <Heart className={`w-[16px] h-[16px] ${liked ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="outline" size="sm" className="hidden sm:inline-flex">
              Ask Question
            </Button>
            <Button variant="primary" size="lg" className="h-[44px]" onClick={handleBookSlotClick}>
              Book Session
            </Button>
          </div>
        </div>
      </div>

      {/* 3. PAGE CONTENT */}
      <motion.main 
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
          }
        }}
        className="max-w-[1000px] w-full mx-auto py-[32px] px-[20px] md:px-[40px] flex flex-col gap-[16px]"
      >
        
        {/* ABOUT CARD */}
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } }} className="bg-white border border-gray-200 rounded-[12px] p-[32px] shadow-level-1">
          <h4 className="text-[20px] font-bold text-[#0F2137] mb-[12px]">About</h4>
          <div 
            className="text-[18px] text-gray-600 leading-[1.7] font-normal [&>p]:mb-4 [&>p:last-child]:mb-0"
            dangerouslySetInnerHTML={{ __html: expert.bio }}
          />
        </motion.div>

        {/* SESSION TYPES CARD */}
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } }} className="bg-white border border-gray-200 rounded-[12px] p-[32px] shadow-level-1">
          <h4 className="text-[20px] font-bold text-[#0F2137] mb-[20px]">Session Types</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            {/* Video Consultation */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedSessionType('video')}
              className={`border rounded-[10px] p-[20px] cursor-pointer transition-colors duration-200 ${
                selectedSessionType === 'video' 
                  ? `${t.border} ${t.bgLight} ring-2 ring-opacity-10 ${t.ring}` 
                  : `border-gray-200 ${t.borderLight.replace('border-', 'hover:border-')} bg-white`
              }`}
            >
              <Video className={`w-[40px] h-[40px] ${t.text} mb-[12px]`} />
              <h5 className="text-[17px] font-bold text-[#0F2137]">1:1 Video Call</h5>
              <p className="text-[14px] text-gray-500 mt-[4px]">
                High-quality interactive screen share, audio, and chat rooms powered by Jitsi network.
              </p>
              
              <div className="flex gap-[8px] mt-[16px]">
                <button 
                  onClick={(e) => { e.stopPropagation(); setSelectedDuration(30); }}
                  className={`px-[12px] py-[6px] rounded-[6px] text-[13px] font-bold transition-all ${
                    selectedDuration === 30 && selectedSessionType === 'video'
                      ? `${t.bg} text-white` 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  30 min — ₹{expert.hourly_rate}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setSelectedDuration(60); }}
                  className={`px-[12px] py-[6px] rounded-[6px] text-[13px] font-bold transition-all ${
                    selectedDuration === 60 && selectedSessionType === 'video'
                      ? `${t.bg} text-white` 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  60 min — ₹{Math.round(expert.hourly_rate * 1.8)}
                </button>
              </div>
            </motion.div>

            {/* Async Q&A */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedSessionType('async')}
              className={`border rounded-[10px] p-[20px] cursor-pointer transition-colors duration-200 ${
                selectedSessionType === 'async' 
                  ? `${t.border} ${t.bgLight} ring-2 ring-opacity-10 ${t.ring}` 
                  : `border-gray-200 ${t.borderLight.replace('border-', 'hover:border-')} bg-white`
              }`}
            >
              <MessageSquare className={`w-[40px] h-[40px] ${t.text} mb-[12px]`} />
              <h5 className="text-[17px] font-bold text-[#0F2137]">Async Question</h5>
              <p className="text-[14px] text-gray-500 mt-[4px]">
                Submit your specific system blueprint or tax query. Expert replies via email/chat within 24 hours.
              </p>
              
              <div className="flex gap-[8px] mt-[16px]">
                <button 
                  className={`px-[12px] py-[6px] rounded-[6px] text-[13px] font-bold transition-all ${
                    selectedSessionType === 'async'
                      ? `${t.bg} text-white` 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Per Thread — ₹{Math.round(expert.hourly_rate * 0.8)}
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* BOOKING CALENDAR CARD */}
        <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } }} className="bg-white border border-gray-200 rounded-[12px] p-[32px] shadow-level-1">
          <h4 className="text-[20px] font-bold text-[#0F2137] mb-[20px]">Available Slots</h4>
          
          {/* Month Header */}
          <div className="flex justify-between items-center mb-[16px]">
            <h5 className="text-[16px] font-bold text-[#0F2137]">February 2026</h5>
            <div className="flex gap-[4px]">
              <button className="p-[6px] border border-gray-200 rounded-[6px] hover:bg-gray-50 transition-colors">
                <ChevronLeft size={16} className="text-gray-400" />
              </button>
              <button className="p-[6px] border border-gray-200 rounded-[6px] hover:bg-gray-50 transition-colors">
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* Date Grid */}
          <div className="grid grid-cols-7 gap-[8px] text-center border-b border-gray-100 pb-[12px]">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(d => (
              <span key={d} className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-[8px] mt-[12px]">
            {/* Blank placeholders for alignment */}
            <span className="h-[48px]" />
            <span className="h-[48px]" />
            
            {datesList.map((d, i) => {
              const isSelected = selectedDate === d.num;
              return (
                <button
                  key={i}
                  disabled={!d.available}
                  onClick={() => setSelectedDate(d.num)}
                  className={`h-[48px] rounded-[8px] flex flex-col items-center justify-center font-bold text-[14px] transition-all ${
                    isSelected 
                      ? `${t.bg} text-white shadow-level-1` 
                      : d.available 
                        ? `border border-gray-200 ${t.hoverBg} ${t.hoverText} bg-white text-[#0F2137]`
                        : 'text-gray-300 cursor-not-allowed bg-transparent'
                  }`}
                >
                  <span className={d.today ? `underline decoration-2 ${t.text.replace('text-', 'decoration-')}` : ''}>
                    {d.num}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Time Slots */}
          <div className="mt-[24px]">
            <h5 className="text-[14px] font-bold text-gray-600 mb-[12px]">Available times for Feb {selectedDate}</h5>
            <div className="flex flex-wrap gap-[8px]">
              {timeSlots.map((ts, i) => {
                const isSelected = selectedTimeSlot === ts.time;
                const isBooked = ts.status === 'booked';
                const isOneLeft = ts.status === '1-left';

                return (
                  <button
                    key={i}
                    disabled={isBooked}
                    onClick={() => setSelectedTimeSlot(ts.time)}
                    className={`h-[40px] px-[16px] rounded-[6px] text-[13px] font-semibold border transition-all ${
                      isSelected
                        ? `${t.bg} text-white ${t.border} shadow-level-1`
                        : isBooked
                          ? 'bg-gray-100 text-gray-300 line-through border-transparent cursor-not-allowed'
                          : isOneLeft
                            ? 'bg-[#FFFBEB] text-[#F59E0B] border-[#F59E0B]'
                            : `bg-white text-gray-700 border-gray-200 ${t.borderLight.replace('border-', 'hover:border-')}`
                    }`}
                  >
                    {ts.time} {isOneLeft && '(1 slot left)'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Summary & CTA */}
          <div className="mt-[32px] pt-[24px] border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[16px]">
            <div>
              <div className="text-[14px] text-gray-600 font-semibold">
                {selectedDuration} min · Feb {selectedDate} · {selectedTimeSlot}
              </div>
              <div className="text-[12px] text-gray-400 mt-[2px]">
                incl. platform fee (5%) · GST invoice auto-generated
              </div>
            </div>
            
            <div className="flex items-center gap-[24px] w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-right">
                <div className={`text-[24px] font-extrabold ${t.text}`}>₹{totalDue}</div>
                <div className="text-[11px] text-gray-400 font-bold">Total price</div>
              </div>
              <Button size="xl" className={`${t.bg} hover:opacity-90 border-0`} onClick={handleBookSlotClick}>
                Book This Slot
              </Button>
            </div>
          </div>

        </motion.div>

        {/* REVIEWS CARD */}
        {SHOW_RATINGS_AND_REVIEWS && (
        <div className="bg-gray-50 border border-gray-200 rounded-[12px] p-[32px] shadow-level-0">
          <div className="flex justify-between items-center mb-[20px]">
            <h4 className="text-[20px] font-bold text-[#0F2137]">127 Reviews</h4>
            <div className="flex items-center gap-[4px] text-gold font-bold">
              <span>★ 4.9 overall</span>
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="flex flex-col md:flex-row gap-[32px] items-center mb-[28px]">
            <div className="text-center shrink-0">
              <div className="text-[48px] font-extrabold text-[#0F2137] leading-none">4.9</div>
              <div className="flex text-gold gap-[2px] mt-[8px]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-[14px] h-[14px] fill-current" />
                ))}
              </div>
            </div>

            {/* Meters grid */}
            <div className="flex-grow flex flex-col gap-[6px] w-full">
              {[
                { label: "5 star", fill: "w-[92%]", count: 118 },
                { label: "4 star", fill: "w-[6%]", count: 7 },
                { label: "3 star", fill: "w-[1%]", count: 1 },
                { label: "2 star", fill: "w-[0%]", count: 0 },
                { label: "1 star", fill: "w-[1%]", count: 1 }
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-[12px] text-[13px] text-gray-500 font-semibold">
                  <span className="w-[44px] shrink-0 text-left">{row.label}</span>
                  <div className="flex-1 bg-gray-200 h-[6px] rounded-full overflow-hidden">
                    <div className={`${t.bg} h-full ${row.fill}`} />
                  </div>
                  <span className="w-[28px] text-right shrink-0">{row.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review Card List */}
          <div className="flex flex-col gap-[12px]">
            {[
              {
                name: "Amit K.",
                date: "Feb 05, 2026",
                text: "The advice was exceptionally clear. Solved our GST flip accounting structure issues instantly. Saved us lakhs in accounting retainer bills.",
                verified: true
              },
              {
                name: "Prashant G.",
                date: "Jan 28, 2026",
                text: "Amazing debugging expertise. Vik was able to trace our PostgreSQL lock contention issues within 20 minutes of review.",
                verified: true
              }
            ].map((rev, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-[10px] p-[20px] shadow-level-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-[10px]">
                    <div className="w-[36px] h-[36px] rounded-full bg-[#0F2137] text-white flex items-center justify-center font-bold text-[14px]">
                      {rev.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-[#0F2137]">{rev.name}</div>
                      <div className="text-[12px] text-gray-400 mt-[1px]">{rev.date}</div>
                    </div>
                  </div>
                  <div className="flex text-gold">★★★★★</div>
                </div>
                <p className="text-[14px] text-gray-600 mt-[12px] leading-relaxed">
                  {rev.text}
                </p>
                {rev.verified && (
                  <Badge variant="success" shape="tag" className="mt-[12px] !px-[6px] !py-[2px]">
                    Verified Booking
                  </Badge>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-[20px]">
            <Button variant="teal-outline" size="md">
              Load More Reviews
            </Button>
          </div>
        </div>
        )}

        {/* CREDENTIALS + EXPERIENCE (2-Column Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
          
          {/* Credentials Card */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } }} className="bg-white border border-gray-200 rounded-[12px] p-[32px] shadow-level-1">
            <h4 className="text-[20px] font-bold text-[#0F2137] mb-[20px]">Credentials & Licenses</h4>
            <div className="flex flex-wrap gap-[8px]">
              {expert.tags.map((tag: string, i: number) => (
                <Badge key={i} variant="verified" shape="pill" icon className="cursor-pointer hover:opacity-80">
                  {tag}
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Experience Card */}
          {expert.experience?.length > 0 && (
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } }} className="bg-white border border-gray-200 rounded-[12px] p-[32px] shadow-level-1">
              <h4 className="text-[20px] font-bold text-[#0F2137] mb-[20px]">Work Timeline</h4>
              <div className={`flex flex-col gap-[20px] border-l-2 ${t.border} pl-[20px] ml-[8px]`}>
                {expert.experience.map((exp: any, i: number) => (
                  <div key={i} className="relative">
                    {/* Dot marker */}
                    <div className={`absolute -left-[27px] top-[4px] w-[12px] h-[12px] rounded-full ${t.bg} border-2 border-white`} />
                    <div className="text-[15px] font-bold text-[#0F2137]">{exp.title}</div>
                    <div className="text-[13px] text-gray-500 font-semibold mt-[2px]">
                      {exp.company} · {exp.starts_at?.year ? `${exp.starts_at.year} - ${exp.ends_at?.year || 'Present'}` : ''}
                    </div>
                    {exp.description && (
                      <div className="text-[13px] text-gray-600 mt-[4px]">{exp.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </div>

      </motion.main>
    </div>
  );
}
