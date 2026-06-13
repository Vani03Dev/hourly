"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export default function InvoicesPage() {
  return (
    <div className="max-w-[1100px] mx-auto p-6 md:p-10 lg:p-12">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-[32px] font-bold text-navy-DEFAULT tracking-tight mb-2">GST Invoices</h1>
            <p className="text-[15px] text-text-sub">Download your tax-compliant invoices for business accounting.</p>
          </div>
        </div>

        <div className="bg-white border border-border rounded-[16px] shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center text-text-muted mb-4">
            <FileText size={28} />
          </div>
          <h3 className="text-[20px] font-bold text-navy-DEFAULT mb-2">No invoices yet</h3>
          <p className="text-[15px] text-text-sub max-w-md mx-auto">Once you complete a paid expert session, your GST-compliant invoices will be available for download here.</p>
        </div>
      </motion.div>
    </div>
  );
}
