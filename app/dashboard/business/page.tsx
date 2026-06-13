"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Calendar, 
  DollarSign, 
  Clock, 
  Users2,
  Video
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { createClient } from "../../../utils/supabase/client";

export default function BusinessDashboard() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ sessionsCount: 0, totalSpent: 0, hoursSaved: 0 });

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: bks } = await supabase
        .from('bookings')
        .select(`
          *,
          expert_profiles(id, first_name, last_name, username, title)
        `)
        .eq('mentee_id', user.id)
        .order('booking_date', { ascending: true });

      if (bks) {
        const formatted = bks.map((b: any) => {
          const exp = b.expert_profiles;
          const expName = exp ? `${exp.first_name || ''} ${exp.last_name || ''}`.trim() || exp.username : 'Expert';
          return {
            id: b.id,
            expert: expName,
            title: `1:1 Consulting Session`,
            dateTime: `${new Date(b.booking_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${b.start_time}`,
            duration: '30 Min',
            status: b.status === 'confirmed' ? 'Confirmed' : b.status === 'pending' ? 'Pending' : 'Completed',
            roomUrl: `/room/${b.id}`
          };
        });
        setSessions(formatted);

        const paidSessions = bks.filter((b: any) => b.payment_status === 'paid');
        const spent = paidSessions.reduce((acc: number, curr: any) => acc + (Number(curr.amount_paid) || 0), 0);
        const hours = paidSessions.length * 0.5;
        setStats({
          sessionsCount: paidSessions.length,
          totalSpent: spent,
          hoursSaved: hours
        });
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleCancelSession = async (id: string) => {
    if (confirm("Are you sure you want to cancel this session?")) {
      const supabase = createClient();
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'canceled' })
        .eq('id', id);

      if (!error) {
        setSessions(prev => prev.filter(s => s.id !== id));
      }
    }
  };

  const recentExperts = useMemo(() => {
    const map = new Map();
    sessions.forEach(s => {
      map.set(s.expert, { name: s.expert, initials: s.expert.charAt(0) });
    });
    return Array.from(map.values()).slice(0, 3);
  }, [sessions]);

  if (loading) {
    return (
      <div className="bg-bg min-h-screen flex items-center justify-center w-full font-sans">
        <p className="text-[14px] text-muted font-medium">Loading workspace dashboard...</p>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-screen flex w-full font-sans">
      
      {/* RIGHT MAIN CONTENT AREA */}
      <main className="flex-grow p-[24px] md:p-[40px] flex flex-col gap-[32px] max-w-[1200px] overflow-hidden">
        
        {/* TOP HEADER */}
        <div className="flex justify-between items-center border-b border-border pb-[20px] flex-wrap gap-[16px]">
          <div>
            <h1 className="text-[24px] font-bold text-primary">Workspace Overview</h1>
            <p className="text-[13px] text-muted mt-[4px]">Manage your B2B session credits, upcoming meetings, and billing.</p>
          </div>
          <Button variant="primary" className="bg-accent hover:bg-accent-hover text-white rounded-lg h-[40px] font-bold" asChild>
            <Link href="/experts">Book New Session &rarr;</Link>
          </Button>
        </div>

        {/* TOP STATS ROW (4 cards) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[16px]">
          {[
            { label: "Sessions (This Month)", value: stats.sessionsCount.toString(), icon: Calendar, color: "text-accent" },
            { label: "Total Spent", value: `₹${stats.totalSpent.toLocaleString()}`, icon: DollarSign, color: "text-success", mono: true },
            { label: "Hours Saved", value: `${stats.hoursSaved} hrs`, icon: Clock, color: "text-warning", mono: true },
            { label: "Experts Booked", value: recentExperts.length.toString(), icon: Users2, color: "text-accent" }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white border border-border rounded-xl p-[20px] shadow-sm flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[12px] text-muted font-bold uppercase tracking-wider">{stat.label}</span>
                  <span className={`text-[20px] font-bold text-primary mt-[8px] ${stat.mono ? "font-mono" : ""}`}>{stat.value}</span>
                </div>
                <div className="w-[36px] h-[36px] bg-bg border border-border rounded-lg flex items-center justify-center shrink-0">
                  <Icon className={`w-[18px] h-[18px] ${stat.color}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* UPCOMING SESSIONS (table) */}
        <div className="bg-white border border-border rounded-xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-[20px] border-b border-border">
            <h3 className="text-[16px] font-bold text-primary">Your Scheduled Sessions</h3>
          </div>
          
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg text-[11px] font-bold text-muted uppercase tracking-wider border-b border-border">
                  <th className="p-[16px]">Expert</th>
                  <th className="p-[16px]">Topic</th>
                  <th className="p-[16px]">Date & Time</th>
                  <th className="p-[16px] text-center">Duration</th>
                  <th className="p-[16px] text-center">Status</th>
                  <th className="p-[16px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sessions.length > 0 ? (
                  sessions.map((row) => (
                    <tr key={row.id} className="hover:bg-bg/50 transition-colors text-[13.5px]">
                      <td className="p-[16px] font-bold text-primary">{row.expert}</td>
                      <td className="p-[16px] text-muted line-clamp-1 max-w-[200px]">{row.title}</td>
                      <td className="p-[16px] font-mono text-primary">{row.dateTime}</td>
                      <td className="p-[16px] text-center font-mono text-muted">{row.duration}</td>
                      <td className="p-[16px] text-center">
                        <span className={`inline-flex px-2 py-[2px] rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          row.status === "Confirmed" 
                            ? "bg-green-50 text-success" 
                            : row.status === "Pending" 
                            ? "bg-amber-50 text-warning" 
                            : "bg-gray-100 text-muted"
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="p-[16px] text-right">
                        <div className="flex justify-end gap-[12px] items-center">
                          {row.status === "Confirmed" && (
                            <Link href={row.roomUrl} className="text-success hover:underline font-bold flex items-center gap-[4px]">
                              <Video className="w-[14px] h-[14px]" /> Join
                            </Link>
                          )}
                          {row.status !== "Completed" && (
                            <>
                              <button className="text-accent hover:underline font-semibold">Reschedule</button>
                              <button onClick={() => handleCancelSession(row.id)} className="text-danger hover:underline font-semibold">Cancel</button>
                            </>
                          )}
                          {row.status === "Completed" && (
                            <span className="text-muted text-[12px] font-semibold">Session Ended</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-[32px] text-center text-muted text-[13.5px]">
                      No scheduled sessions found. Book a session with an expert to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* TWO COLUMN BOTTOM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px]">
          
          {/* RECENTLY BOOKED EXPERTS (Book Again) */}
          <div className="bg-white border border-border rounded-xl shadow-sm p-[24px] flex flex-col gap-[16px]">
            <h3 className="text-[16px] font-bold text-primary">Book Again</h3>
            {recentExperts.length > 0 ? (
              <div className="flex gap-[16px] overflow-x-auto pb-[12px] scrollbar-thin">
                {recentExperts.map((exp, idx) => (
                  <div key={idx} className="border border-border p-[16px] rounded-xl flex flex-col items-center text-center gap-[8px] min-w-[150px] shrink-0 bg-bg">
                    <div className="w-[36px] h-[36px] rounded-full bg-primary text-white flex items-center justify-center font-bold text-[13px]">
                      {exp.initials}
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-primary truncate w-[120px]">{exp.name}</h4>
                      <span className="text-[11px] text-muted block mt-0.5">Verified Expert</span>
                    </div>
                    <Button variant="outline" className="border-border text-accent hover:bg-white rounded-lg h-[28px] px-3 text-[11px] font-bold mt-[8px]" asChild>
                      <Link href="/experts">Book Again</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted text-[13px]">
                <p>You haven't booked any sessions yet.</p>
                <Button variant="outline" className="h-[32px] mt-3 border-border text-accent font-semibold px-4 text-[12px]" asChild>
                  <Link href="/experts">Browse Experts</Link>
                </Button>
              </div>
            )}
          </div>

          {/* HELP & RESOURCES BAND */}
          <div className="bg-white border border-border rounded-xl shadow-sm p-[24px] flex flex-col gap-[16px]">
            <h3 className="text-[16px] font-bold text-primary">Workspace Billing & Rules</h3>
            <div className="flex flex-col gap-[12px] text-[13px]">
              <div className="flex justify-between items-start border-b border-border pb-[8px]">
                <div className="flex flex-col">
                  <span className="font-bold text-primary">GST Invoicing</span>
                  <span className="text-muted mt-0.5">Input tax credit invoice generated instantly on checkout.</span>
                </div>
                <span className="text-[11px] font-mono bg-green-50 text-success px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Active</span>
              </div>
              <div className="flex justify-between items-start border-b border-border pb-[8px]">
                <div className="flex flex-col">
                  <span className="font-bold text-primary">Cancellation Policy</span>
                  <span className="text-muted mt-0.5">Free reschedule/cancellation up to 24 hours prior.</span>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="font-bold text-primary">Need help?</span>
                  <span className="text-muted mt-0.5">Reach out to corporate billing support at help@sessionly.in</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>

    </div>
  );
}
