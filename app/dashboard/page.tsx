"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui/Button';
import { ClientSidebar } from '../../components/layout/ClientSidebar';
import { Home, Calendar, Wallet, FileText, Users, Settings, Download, Plus, ArrowRight, Clock, MapPin, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { createClient } from '@/utils/supabase/client';

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

export default function DashboardPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [clientData, setClientData] = useState<any>(null);

  useEffect(() => {
    async function fetchClientProfile() {
      if (!user?.id) return;
      const supabase = createClient();
      const { data } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (data) setClientData(data);
    }
    fetchClientProfile();
  }, [user]);

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || "there";
  const companyName = clientData?.company_name || "Your Workspace";

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#FCFCFD] overflow-hidden">
      
      {/* SIDEBAR */}
      <ClientSidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1100px] mx-auto p-6 md:p-10 lg:p-12">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <div>
                <h1 className="text-[32px] md:text-[40px] font-bold text-navy-DEFAULT tracking-tight leading-tight">
                  Welcome back, {firstName}
                </h1>
                <p className="text-[16px] text-text-sub mt-1">
                  Manage your expert consultations and billing in one place.
                </p>
              </div>
              <Button asChild size="lg" className="shadow-sm">
                <Link href="/search"><Plus size={18} className="mr-2" /> Book an Expert</Link>
              </Button>
            </motion.div>

            {/* Upcoming Session */}
            <motion.div variants={fadeUp} className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[18px] font-bold text-navy-DEFAULT">Upcoming Session</h2>
              </div>
              
              <div className="bg-white border border-border rounded-[16px] p-8 shadow-sm text-center flex flex-col items-center justify-center min-h-[160px]">
                <div className="w-12 h-12 bg-surface-2 rounded-full flex items-center justify-center text-text-muted mb-3">
                  <Calendar size={20} />
                </div>
                <h3 className="text-[16px] font-bold text-navy-DEFAULT mb-1">No upcoming sessions</h3>
                <p className="text-[14px] text-text-sub mb-4">Book a session with a top 1% expert to get started.</p>
                <Button asChild variant="outline" size="sm">
                  <Link href="/search">Find an Expert</Link>
                </Button>
              </div>
            </motion.div>

            {/* Quick Stats & Past Sessions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <motion.div variants={fadeUp} className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[18px] font-bold text-navy-DEFAULT">Recent Activity</h2>
                </div>
                
                <div className="bg-white border border-border rounded-[16px] shadow-sm p-8 text-center flex flex-col items-center justify-center min-h-[200px]">
                  <div className="w-12 h-12 bg-surface-2 rounded-full flex items-center justify-center text-text-muted mb-3">
                    <FileText size={20} />
                  </div>
                  <h3 className="text-[16px] font-bold text-navy-DEFAULT mb-1">No recent activity</h3>
                  <p className="text-[14px] text-text-sub">When you book sessions, your invoices and history will appear here.</p>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-col gap-6">
                <div>
                  <h2 className="text-[18px] font-bold text-navy-DEFAULT mb-4">Workspace Details</h2>
                  <div className="bg-white border border-border rounded-[16px] p-6 shadow-sm">
                    <div className="flex flex-col gap-5">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-text-muted shrink-0">
                          <Building2 size={20} />
                        </div>
                        <div>
                          <div className="text-[13px] text-text-muted font-medium mb-0.5">Company Name</div>
                          <div className="text-[15px] font-bold text-navy-DEFAULT">{companyName}</div>
                        </div>
                      </div>
                      
                      {clientData?.gstin && (
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-text-muted shrink-0">
                            <FileText size={20} />
                          </div>
                          <div>
                            <div className="text-[13px] text-text-muted font-medium mb-0.5">GSTIN</div>
                            <div className="text-[15px] font-bold text-navy-DEFAULT">{clientData.gstin}</div>
                          </div>
                        </div>
                      )}
                      
                      <Button variant="outline" className="w-full mt-2">Edit Workspace</Button>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
