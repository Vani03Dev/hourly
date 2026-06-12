"use client";

import React, { useEffect, useState } from 'react';
import { ClientSidebar } from '../../../components/layout/ClientSidebar';
import { motion } from 'framer-motion';
import { Save, Building2, User } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { createClient } from '@/utils/supabase/client';

export default function SettingsPage() {
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

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#FCFCFD] overflow-hidden">
      <ClientSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[800px] mx-auto p-6 md:p-10 lg:p-12">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="text-[32px] font-bold text-navy-DEFAULT tracking-tight mb-2">Settings</h1>
                <p className="text-[15px] text-text-sub">Manage your personal profile and workspace details.</p>
              </div>
              <Button className="shrink-0 gap-2"><Save size={16} /> Save Changes</Button>
            </div>

            <div className="flex flex-col gap-8">
              {/* Personal Section */}
              <div className="bg-white border border-border rounded-[16px] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border bg-surface-1 flex items-center gap-3">
                  <User className="text-teal-DEFAULT" size={20} />
                  <h2 className="text-[16px] font-bold text-navy-DEFAULT">Personal Details</h2>
                </div>
                <div className="p-6 md:p-8 flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-bold text-navy-DEFAULT">Full Name</label>
                    <input type="text" defaultValue={user?.user_metadata?.full_name || ""} className="w-full h-[44px] px-4 rounded-[8px] border border-border bg-white text-[14px] focus:outline-none focus:border-teal-DEFAULT focus:ring-2 focus:ring-teal-DEFAULT/15 transition-all" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-bold text-navy-DEFAULT">Email Address</label>
                    <input type="email" defaultValue={user?.email || ""} disabled className="w-full h-[44px] px-4 rounded-[8px] border border-border bg-surface-2 text-text-muted text-[14px] cursor-not-allowed" />
                  </div>
                </div>
              </div>

              {/* Workspace Section */}
              <div className="bg-white border border-border rounded-[16px] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border bg-surface-1 flex items-center gap-3">
                  <Building2 className="text-teal-DEFAULT" size={20} />
                  <h2 className="text-[16px] font-bold text-navy-DEFAULT">Workspace Details</h2>
                </div>
                <div className="p-6 md:p-8 flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-bold text-navy-DEFAULT">Company Name</label>
                    <input type="text" defaultValue={clientData?.company_name || ""} placeholder="Your Company Ltd" className="w-full h-[44px] px-4 rounded-[8px] border border-border bg-white text-[14px] focus:outline-none focus:border-teal-DEFAULT focus:ring-2 focus:ring-teal-DEFAULT/15 transition-all" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-bold text-navy-DEFAULT">GSTIN (Optional)</label>
                    <input type="text" defaultValue={clientData?.gstin || ""} placeholder="For tax invoices" className="w-full h-[44px] px-4 rounded-[8px] border border-border bg-white text-[14px] focus:outline-none focus:border-teal-DEFAULT focus:ring-2 focus:ring-teal-DEFAULT/15 transition-all" />
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
