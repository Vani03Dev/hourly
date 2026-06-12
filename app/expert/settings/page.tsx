"use client";

import React from 'react';
import { ExpertSidebar } from '../../../components/layout/ExpertSidebar';
import { motion } from 'framer-motion';
import { Save, User, Link as LinkIcon, Bell, CreditCard } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export default function ExpertSettingsPage() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#FCFCFD] overflow-hidden">
      <ExpertSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[800px] mx-auto p-6 md:p-10 lg:p-12">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="text-[32px] font-bold text-navy-DEFAULT tracking-tight mb-2">Settings</h1>
                <p className="text-[15px] text-text-sub">Manage your profile, preferences, and account settings.</p>
              </div>
              <Button className="shrink-0 gap-2"><Save size={16} /> Save Changes</Button>
            </div>

            <div className="flex flex-col gap-8">
              
              {/* Profile Section */}
              <div className="bg-white border border-border rounded-[16px] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border bg-surface-1 flex items-center gap-3">
                  <User className="text-teal-DEFAULT" size={20} />
                  <h2 className="text-[16px] font-bold text-navy-DEFAULT">Public Profile</h2>
                </div>
                <div className="p-6 md:p-8 flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-bold text-navy-DEFAULT">Full Name</label>
                    <input type="text" defaultValue="Expert User" className="w-full h-[44px] px-4 rounded-[8px] border border-border bg-white text-[14px] focus:outline-none focus:border-teal-DEFAULT focus:ring-2 focus:ring-teal-DEFAULT/15 transition-all" />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-bold text-navy-DEFAULT">Professional Title</label>
                    <input type="text" placeholder="e.g. Senior Software Engineer at Google" className="w-full h-[44px] px-4 rounded-[8px] border border-border bg-white text-[14px] focus:outline-none focus:border-teal-DEFAULT focus:ring-2 focus:ring-teal-DEFAULT/15 transition-all" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-bold text-navy-DEFAULT">Bio</label>
                    <textarea rows={4} placeholder="Briefly describe your expertise and what you can help with..." className="w-full p-4 rounded-[8px] border border-border bg-white text-[14px] focus:outline-none focus:border-teal-DEFAULT focus:ring-2 focus:ring-teal-DEFAULT/15 transition-all resize-none"></textarea>
                  </div>
                </div>
              </div>

              {/* Links Section */}
              <div className="bg-white border border-border rounded-[16px] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border bg-surface-1 flex items-center gap-3">
                  <LinkIcon className="text-teal-DEFAULT" size={20} />
                  <h2 className="text-[16px] font-bold text-navy-DEFAULT">Social Links</h2>
                </div>
                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-bold text-navy-DEFAULT">LinkedIn</label>
                    <input type="text" placeholder="https://linkedin.com/in/..." className="w-full h-[44px] px-4 rounded-[8px] border border-border bg-white text-[14px] focus:outline-none focus:border-teal-DEFAULT focus:ring-2 focus:ring-teal-DEFAULT/15 transition-all" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-bold text-navy-DEFAULT">Twitter</label>
                    <input type="text" placeholder="https://twitter.com/..." className="w-full h-[44px] px-4 rounded-[8px] border border-border bg-white text-[14px] focus:outline-none focus:border-teal-DEFAULT focus:ring-2 focus:ring-teal-DEFAULT/15 transition-all" />
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
