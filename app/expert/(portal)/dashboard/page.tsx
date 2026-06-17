"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { 
  Home, Calendar, Wallet, FileText, Settings, ShieldCheck, 
  CheckCircle2, Circle, MoreVertical, MessageSquare, Video,
  TrendingUp, Users, Eye, ArrowRight, Share2, Copy
} from "lucide-react";
import toast from "react-hot-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function ExpertDashboardPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [expandedChecklist, setExpandedChecklist] = useState<string | null>('customize');
  const [profileStatus, setProfileStatus] = useState({
    hasAvailability: false,
    hasCustomizedPage: false,
    hasServices: false,
    username: '',
  });

  useEffect(() => {
    async function checkOnboarding() {
      if (!user) return;
      const supabase = createClient();
      const { data, error } = await supabase
        .from('expert_profiles')
        .select('is_onboarded')
        .eq('id', user.id)
        .single();
        
      if (error || !data || !data.is_onboarded) {
        window.location.href = '/expert/onboarding';
      }
    }
    checkOnboarding();
  }, [user]);

  useEffect(() => {
    async function fetchProfileStatus() {
      if (!user) return;
      const supabase = createClient();

      const { data: profile } = await supabase
        .from('expert_profiles')
        .select('username, avatar_url, bio, weekly_schedule')
        .eq('id', user.id)
        .single();

      const { count: serviceCount } = await supabase
        .from('services')
        .select('id', { count: 'exact', head: true })
        .eq('expert_id', user.id);

      const hasSchedule = profile?.weekly_schedule &&
        Object.values(profile.weekly_schedule as Record<string, { enabled?: boolean }>).some((d) => d?.enabled);

      setProfileStatus({
        hasAvailability: !!hasSchedule,
        hasCustomizedPage: !!(profile?.avatar_url && profile?.bio && profile.bio.length >= 20) ||
          !!user.user_metadata?.creator_page_customized,
        hasServices: (serviceCount || 0) > 0,
        username: profile?.username || '',
      });
    }
    fetchProfileStatus();
  }, [user]);

  useEffect(() => {
    async function fetchBookings() {
      if (!user) return;
      const supabase = createClient();
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('expert_id', user.id)
        .neq('status', 'canceled')
        .order('booking_date', { ascending: true })
        .order('start_time', { ascending: true });
        
      if (!error && data) {
        const formattedBookings = data.map((b: any) => {
          let formattedDate = b.booking_date;
          try {
            const [y, m, d] = b.booking_date.split('-');
            const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
            formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          } catch (e) {}

          return {
            id: b.id,
            name: `Mentee (${b.mentee_id.substring(0, 6)})`,
            type: '1-on-1 Consultation',
            duration: '30 min',
            time: `${formattedDate} at ${b.start_time}`,
            roomLink: b.meeting_link ? `/room/${b.id}` : null
          };
        });
        setUpcomingSessions(formattedBookings);
      }
    }
    fetchBookings();
  }, [user]);

  const copyProfileLink = () => {
    const slug = profileStatus.username || user?.user_metadata?.username || user?.id;
    const profileLink = `sessionly.in/${slug}`;
    navigator.clipboard.writeText(profileLink);
    toast.success('Link copied!');
  };

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || "Expert";
  const profileUrl = `sessionly.in/${profileStatus.username || user?.user_metadata?.username || user?.id}`;

  const completedSteps = [
    profileStatus.hasAvailability,
    profileStatus.hasCustomizedPage,
    profileStatus.hasServices,
  ].filter(Boolean).length;

  return (
        <div className="max-w-[1100px] mx-auto p-6 md:p-10 lg:p-12">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            
            {/* Header Area */}
            <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <h1 className="text-[32px] md:text-[40px] font-bold text-primary tracking-tight leading-tight">
                Hi, {firstName}
              </h1>
              
              <div className="flex items-center bg-white border border-border rounded-full p-1 pl-4 shadow-sm max-w-sm">
                <span className="text-[14px] font-semibold text-primary truncate mr-3">
                  {profileUrl}
                </span>
                <button 
                  onClick={copyProfileLink}
                  className="w-8 h-8 flex items-center justify-center bg-bg hover:bg-border rounded-full transition-colors text-primary shrink-0"
                >
                  <Copy size={14} />
                </button>
              </div>
            </motion.div>

            {/* Verify Banner */}
            <motion.div variants={fadeUp} className="mb-10 bg-blue-50/50 border border-blue-200 rounded-[16px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-blue-900 mb-1">Verify your identity to enable payouts</h3>
                  <p className="text-[14px] text-blue-700/80">Complete identity verification to start receiving payouts directly to your bank account for your paid bookings.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <button className="text-[14px] font-semibold text-blue-600 hover:text-blue-800 transition-colors">Contact Support</button>
                <Button className="bg-primary hover:bg-primary/95 text-white border-none shadow-md">Verify Identity</Button>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column - 2/3 width */}
              <div className="lg:col-span-2 flex flex-col gap-8">
                
                {/* Onboarding Checklist */}
                {completedSteps < 3 && (
                  <motion.div variants={fadeUp} className="bg-white border border-border rounded-[16px] p-6 md:p-8 shadow-sm">
                    <h2 className="text-[20px] font-bold text-primary mb-2">Make the page yours!</h2>
                    <p className="text-[15px] text-muted mb-8">Unlock the potential of your Sessionly page</p>
                    
                    {/* Progress Bar */}
                    <div className="flex gap-2 mb-8">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className={`h-2 flex-1 rounded-full ${i < completedSteps ? 'bg-accent' : 'bg-bg'}`}
                        />
                      ))}
                    </div>

                    <div className="flex flex-col">
                      {/* Item 1 */}
                      <div className="border-b border-border py-4">
                        <button 
                          onClick={() => setExpandedChecklist(expandedChecklist === 'availability' ? null : 'availability')}
                          className="w-full flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-4">
                            {profileStatus.hasAvailability ? (
                              <CheckCircle2 className="text-accent" size={24} />
                            ) : (
                              <Circle className="text-muted" size={24} />
                            )}
                            <span className="text-[16px] font-bold text-primary">Set availability</span>
                          </div>
                        </button>
                        {expandedChecklist === 'availability' && (
                          <div className="pl-10 mt-4">
                            <p className="text-[14px] text-muted mb-4">
                              {profileStatus.hasAvailability
                                ? 'Your weekly schedule is configured.'
                                : 'Set your weekly hours so clients know when to book.'}
                            </p>
                            <Button variant={profileStatus.hasAvailability ? 'outline' : 'primary'} asChild>
                              <Link href="/expert/availability">
                                {profileStatus.hasAvailability ? 'Edit availability' : 'Set availability'}
                              </Link>
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Item 2 */}
                      <div className="border-b border-border py-4">
                        <button 
                          onClick={() => setExpandedChecklist(expandedChecklist === 'customize' ? null : 'customize')}
                          className="w-full flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-4">
                            {profileStatus.hasCustomizedPage ? (
                              <CheckCircle2 className="text-accent" size={24} />
                            ) : (
                              <Circle className="text-muted" size={24} />
                            )}
                            <span className="text-[16px] font-bold text-primary">Customize your creator page</span>
                          </div>
                        </button>
                        {expandedChecklist === 'customize' && (
                          <div className="pl-10 mt-4">
                            <p className="text-[14px] text-muted mb-4">Add your photo, bio, theme, and expertise tags to stand out.</p>
                            <Button asChild>
                              <Link href="/expert/customize">Customize page</Link>
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Item 3 */}
                      <div className="py-4">
                        <button 
                          onClick={() => setExpandedChecklist(expandedChecklist === 'services' ? null : 'services')}
                          className="w-full flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-4">
                            {profileStatus.hasServices ? (
                              <CheckCircle2 className="text-accent" size={24} />
                            ) : (
                              <Circle className="text-muted" size={24} />
                            )}
                            <span className="text-[16px] font-bold text-primary">Create your services</span>
                          </div>
                        </button>
                        {expandedChecklist === 'services' && (
                          <div className="pl-10 mt-4">
                            <p className="text-[14px] text-muted mb-4">
                              {profileStatus.hasServices
                                ? 'Your services are active and ready to be booked.'
                                : 'Create consultation offerings with pricing and duration.'}
                            </p>
                            <Button variant={profileStatus.hasServices ? 'outline' : 'primary'} asChild>
                              <Link href="/expert/services">
                                {profileStatus.hasServices ? 'Manage services' : 'Create a service'}
                              </Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Upcoming Sessions */}
                <motion.div variants={fadeUp} className="bg-white border border-border rounded-[16px] p-6 md:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-[20px] font-bold text-primary">Upcoming Bookings</h2>
                    <div className="bg-bg text-primary font-bold px-3 py-1 rounded-full text-[13px]">
                      {upcomingSessions.length}
                    </div>
                  </div>

                  {upcomingSessions.length === 0 ? (
                    <div className="text-center py-12 px-4">
                      <div className="w-16 h-16 bg-bg rounded-full flex items-center justify-center mx-auto mb-4 text-muted">
                        <Calendar size={24} />
                      </div>
                      <h3 className="text-[16px] font-bold text-primary mb-2">No upcoming sessions</h3>
                      <p className="text-[14px] text-muted max-w-sm mx-auto">Share your profile link on LinkedIn or Twitter to get your first booking!</p>
                      <Button className="mt-6 gap-2" variant="outline" onClick={copyProfileLink}>
                        <Share2 size={16} /> Share Profile
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6">
                      {upcomingSessions.map((session, i) => (
                        <div key={session.id} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${i !== upcomingSessions.length - 1 ? 'pb-6 border-b border-border' : ''}`}>
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-[18px] shrink-0">
                              {session.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-[16px] font-bold text-primary mb-1">{session.name}</div>
                              <div className="text-[14px] text-muted mb-2">{session.type} • {session.duration}</div>
                              <div className="inline-block bg-bg text-primary text-[12px] font-bold px-2 py-1 rounded">
                                {session.time}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 sm:ml-auto">
                            <button className="w-10 h-10 flex items-center justify-center bg-white border border-border rounded-[8px] text-muted hover:text-primary hover:border-primary transition-colors">
                              <MessageSquare size={18} />
                            </button>
                            {session.roomLink && (
                              <Button className="h-10 bg-accent hover:bg-accent-hover border-none shadow-sm gap-2">
                                <Video size={16} /> Join
                              </Button>
                            )}
                            <button className="w-10 h-10 flex items-center justify-center bg-white border border-border rounded-[8px] text-muted hover:text-primary hover:border-primary transition-colors">
                              <MoreVertical size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Right Column - 1/3 width */}
              <div className="flex flex-col gap-8">
                
                {/* Quick Stats Placeholder */}
                <motion.div variants={fadeUp} className="bg-white border border-border rounded-[16px] p-6 shadow-sm">
                  <h3 className="text-[12px] font-bold text-muted uppercase tracking-widest mb-6">Quick Stats</h3>
                  <div className="flex flex-col items-center justify-center min-h-[150px] text-center">
                    <TrendingUp size={24} className="text-muted mb-3" />
                    <h4 className="text-[14px] font-bold text-primary mb-1">No data yet</h4>
                    <p className="text-[13px] text-muted">Your analytics will appear here once you start getting bookings.</p>
                  </div>
                </motion.div>

              </div>
            </div>

          </motion.div>
        </div>
  );
}
