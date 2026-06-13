"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Video, Clock, Share2, CalendarClock, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/utils/supabase/client';
import toast from 'react-hot-toast';

export default function ExpertSessionsPage() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [profileUrl, setProfileUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    async function fetchBookings() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('expert_profiles')
        .select('id, username')
        .eq('id', user.id)
        .single();
        
      if (!profile) {
        setLoading(false);
        return;
      }

      setProfileUrl(`sessionly.in/${profile.username || user.id}`);

      const { data: bks } = await supabase
        .from('bookings')
        .select(`
          *,
          client_profiles(id, first_name, last_name)
        `)
        .eq('expert_id', profile.id)
        .eq('payment_status', 'paid')
        .order('booking_date', { ascending: true });

      if (bks) {
        setBookings(bks);
      }
      setLoading(false);
    }
    fetchBookings();
  }, []);

  const copyProfileLink = () => {
    if (!profileUrl) return;
    navigator.clipboard.writeText(profileUrl);
    toast.success('Profile link copied!');
  };

  const now = new Date();
  
  const getBookingEndDate = (booking: any) => {
    const [hours, minutes] = booking.end_time.match(/(\d+):(\d+)\s*(AM|PM)/) ? 
      convert12to24(booking.end_time).split(':') : 
      booking.end_time.split(':');
      
    const date = new Date(booking.booking_date);
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return date;
  };

  const convert12to24 = (timeStr: string) => {
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return timeStr;
    let [_, hours, mins, modifier] = match;
    let h = parseInt(hours);
    if (h === 12) h = modifier.toUpperCase() === 'PM' ? 12 : 0;
    else if (modifier.toUpperCase() === 'PM') h += 12;
    return `${h.toString().padStart(2, '0')}:${mins}`;
  };

  const upcomingBookings = bookings.filter(b => getBookingEndDate(b) >= now);
  const pastBookings = bookings.filter(b => getBookingEndDate(b) < now).sort((a, b) => getBookingEndDate(b).getTime() - getBookingEndDate(a).getTime());

  const displayBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  const tabClass = (tab: 'upcoming' | 'past') =>
    `pb-4 text-[15px] font-semibold transition-colors relative ${
      activeTab === tab ? 'text-teal' : 'text-muted hover:text-primary'
    }`;

  return (
    <div className="max-w-[1100px] mx-auto p-6 md:p-10 lg:p-12">
      <div className="mb-8">
        <h1 className="text-[32px] font-bold text-primary tracking-tight mb-2">My Sessions</h1>
        <p className="text-[15px] text-muted">Manage your upcoming and past client consultations.</p>
      </div>

      <div className="flex items-center gap-6 border-b border-border mb-8">
        <button type="button" onClick={() => setActiveTab('upcoming')} className={tabClass('upcoming')}>
          Upcoming ({upcomingBookings.length})
          {activeTab === 'upcoming' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-teal rounded-t-full" />}
        </button>
        <button type="button" onClick={() => setActiveTab('past')} className={tabClass('past')}>
          Past Sessions ({pastBookings.length})
          {activeTab === 'past' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-teal rounded-t-full" />}
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-border rounded-[20px] p-6 animate-pulse">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div className="w-12 h-12 rounded-full bg-gray-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-10 bg-gray-100 rounded" />
                <div className="h-10 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : displayBookings.length === 0 ? (
        activeTab === 'upcoming' ? (
          <div className="bg-white border border-border rounded-[16px] shadow-sm overflow-hidden">
            <div className="p-8 md:p-12 text-center border-b border-border bg-teal-50/40">
              <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-teal mx-auto mb-5">
                <Calendar size={28} />
              </div>
              <h3 className="text-[22px] font-bold text-primary mb-2">No bookings yet</h3>
              <p className="text-[15px] text-muted max-w-md mx-auto">
                You&apos;re all set up — now get your first client. Complete these steps to start receiving bookings.
              </p>
            </div>

            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/expert/availability"
                className="group flex flex-col gap-3 p-5 rounded-[12px] border border-border hover:border-teal/40 hover:bg-teal-50/30 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-teal-50 text-teal flex items-center justify-center">
                  <CalendarClock size={20} />
                </div>
                <div>
                  <div className="text-[15px] font-bold text-primary mb-1 flex items-center gap-1">
                    Set availability
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-[13px] text-muted">Define when clients can book time with you.</p>
                </div>
              </Link>

              <Link
                href="/expert/services"
                className="group flex flex-col gap-3 p-5 rounded-[12px] border border-border hover:border-teal/40 hover:bg-teal-50/30 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-teal-50 text-teal flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <div className="text-[15px] font-bold text-primary mb-1 flex items-center gap-1">
                    Add a service
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-[13px] text-muted">Create consultation offerings with pricing.</p>
                </div>
              </Link>

              <button
                onClick={copyProfileLink}
                className="group flex flex-col gap-3 p-5 rounded-[12px] border border-border hover:border-teal/40 hover:bg-teal-50/30 transition-all text-left"
              >
                <div className="w-10 h-10 rounded-full bg-teal-50 text-teal flex items-center justify-center">
                  <Share2 size={20} />
                </div>
                <div>
                  <div className="text-[15px] font-bold text-primary mb-1 flex items-center gap-1">
                    Share your profile
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-[13px] text-muted truncate">
                    {profileUrl || 'Copy your booking link'}
                  </p>
                </div>
              </button>
            </div>

            <div className="px-6 md:px-8 pb-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button onClick={copyProfileLink} className="gap-2">
                <Share2 size={16} /> Copy profile link
              </Button>
              <Button variant="outline" asChild>
                <Link href="/expert/dashboard">Back to dashboard</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-border rounded-[16px] shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[320px]">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-muted mb-4">
              <Clock size={28} />
            </div>
            <h3 className="text-[20px] font-bold text-primary mb-2">No past sessions yet</h3>
            <p className="text-[15px] text-muted max-w-md mx-auto">
              Once you complete your first consultation, it will appear here with the session details and history.
            </p>
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayBookings.map((booking) => {
            const client = booking.client_profiles;
            const clientName = `${client?.first_name || ''} ${client?.last_name || ''}`.trim() || 'Client';
            const isUpcoming = activeTab === 'upcoming';
            const sessionDate = new Date(booking.booking_date);
            const isToday = sessionDate.toDateString() === now.toDateString();

            return (
              <div key={booking.id} className="bg-white border border-border rounded-[20px] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="flex items-start gap-4 mb-6 pb-6 border-b border-border">
                  <div className="w-12 h-12 rounded-full bg-teal-50 text-teal flex items-center justify-center font-bold text-[18px] shrink-0">
                    {clientName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-primary leading-tight mb-1">
                      {clientName}
                    </h3>
                    <p className="text-[13px] text-muted">1:1 Consultation</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8 flex-1">
                  <div className="flex items-center gap-3 text-primary">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-teal shrink-0">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <div className="text-[12px] text-muted font-medium mb-0.5">Date</div>
                      <div className="text-[14px] font-semibold">{sessionDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-primary">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-teal shrink-0">
                      <Clock size={16} />
                    </div>
                    <div>
                      <div className="text-[12px] text-muted font-medium mb-0.5">Time</div>
                      <div className="text-[14px] font-semibold">{booking.start_time} - {booking.end_time}</div>
                    </div>
                  </div>
                </div>

                {isUpcoming && (
                  <Button 
                    asChild={isToday}
                    disabled={!isToday}
                    variant={isToday ? "primary" : "outline"} 
                    className={`w-full ${!isToday && 'opacity-60 cursor-not-allowed'}`}
                  >
                    {isToday ? (
                      <a href={booking.meeting_link} target="_blank" rel="noopener noreferrer">
                        <Video size={16} className="mr-2" /> Join Call
                      </a>
                    ) : (
                      <span><Video size={16} className="mr-2" /> Call inactive until {sessionDate.toLocaleDateString()}</span>
                    )}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
