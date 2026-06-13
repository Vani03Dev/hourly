"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export default function TeamPage() {
  return (
    <div className="max-w-[1100px] mx-auto p-6 md:p-10 lg:p-12">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-[32px] font-bold text-navy-DEFAULT tracking-tight mb-2">Team Members</h1>
            <p className="text-[15px] text-text-sub">Invite colleagues to book sessions using your company wallet.</p>
          </div>
          <Button className="shrink-0">
            <Plus size={18} className="mr-2" /> Invite Member
          </Button>
        </div>

        <div className="bg-white border border-border rounded-[16px] shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-2 border-b border-border">
                <th className="px-6 py-4 text-[12px] font-semibold text-text-muted uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-text-muted uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-text-muted uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border last:border-0 hover:bg-surface-1 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-DEFAULT/10 text-teal-DEFAULT flex items-center justify-center font-bold">Y</div>
                    <div>
                      <div className="text-[14px] font-bold text-navy-DEFAULT">You</div>
                      <div className="text-[12px] text-text-muted">Admin</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-[14px] font-medium text-text-sub">Owner</td>
                <td className="px-6 py-4"><span className="bg-teal-DEFAULT/10 text-teal-DEFAULT text-[11px] font-bold uppercase px-2 py-1 rounded">Active</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 bg-surface-1 border border-border border-dashed rounded-[16px] p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-white border border-border rounded-full flex items-center justify-center text-text-muted mb-4 shadow-sm">
            <Users size={28} />
          </div>
          <h3 className="text-[18px] font-bold text-navy-DEFAULT mb-2">Grow your team</h3>
          <p className="text-[15px] text-text-sub mb-6 max-w-md mx-auto">Empower your engineers and designers to get unblocked by top experts.</p>
          <Button variant="outline" asChild>
            <Link href="/enterprise">Learn about Enterprise Plans</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
