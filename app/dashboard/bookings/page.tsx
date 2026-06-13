"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search, Video, Clock, ArrowRight, Download, Filter, Inbox, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import toast from 'react-hot-toast';

export default function BookingsPage() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [dateFilter, setDateFilter] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const demoBookings = [
    {
      id: "bk-1",
      expertName: "Aditi Sharma",
      title: "Ex-Stripe Staff Engineer",
      date: "2026-02-10",
      time: "11:00 AM - 12:00 PM",
      duration: "60 mins",
      amount: "₹1,260",
      status: "upcoming",
      category: "System Design",
      invoice: "INV-2026-0312",
    },
    {
      id: "bk-2",
      expertName: "Rahul Sharma",
      title: "SEBI Registered CA",
      date: "2026-01-28",
      time: "03:30 PM - 04:00 PM",
      duration: "30 mins",
      amount: "₹525",
      status: "completed",
      category: "GST & Tax",
      invoice: "INV-2026-0284",
    },
    {
      id: "bk-3",
      expertName: "Priya Patel",
      title: "Fractional CFO",
      date: "2026-01-12",
      time: "02:00 PM - 02:30 PM",
      duration: "30 mins",
      amount: "₹2,100",
      status: "cancelled",
      category: "Financial Model",
      invoice: "INV-2026-0105",
    },
    {
      id: "bk-4",
      expertName: "Vikram Desai",
      title: "Tech Lead · ex-Stripe",
      date: "2026-02-18",
      time: "10:00 AM - 10:30 AM",
      duration: "30 mins",
      amount: "₹630",
      status: "upcoming",
      category: "System Design",
      invoice: "INV-2026-0330",
    }
  ];

  useEffect(() => {
    async function fetchBookings() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      let dbBookings: any[] = [];
      if (user) {
        const { data } = await supabase
          .from('bookings')
          .select(`
            *,
            expert_profiles(first_name, last_name, username, avatar_url, title)
          `)
          .eq('mentee_id', user.id);
          
        if (data) {
          dbBookings = data.map(b => ({
            id: b.id,
            expertName: `${b.expert_profiles?.first_name || ''} ${b.expert_profiles?.last_name || ''}`.trim() || 'Expert',
            title: b.expert_profiles?.title || 'Advisor',
            date: b.booking_date,
            time: `${b.start_time} - ${b.end_time}`,
            duration: '30 mins',
            amount: `₹${b.amount_paid}`,
            status: b.status === 'pending' ? 'upcoming' : b.status || 'upcoming',
            category: 'General',
            invoice: b.razorpay_order_id ? `INV-${b.razorpay_order_id.slice(-6)}` : 'INV-MOCK'
          }));
        }
      }

      setBookings([...demoBookings, ...dbBookings]);
      setLoading(false);
    }
    fetchBookings();
  }, []);

  // Filter Logic
  const filteredBookings = bookings.filter(b => {
    // Tab match
    if (activeTab !== 'all' && b.status !== activeTab) return false;
    
    // Category match
    if (selectedCategory !== 'All Categories' && b.category !== selectedCategory) return false;
    
    // Date match
    if (dateFilter && b.date !== dateFilter) return false;

    return true;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getStatusBorder = (status: string) => {
    if (status === 'upcoming') return 'border-l-[3px] border-l-amber';
    if (status === 'completed') return 'border-l-[3px] border-l-green';
    if (status === 'cancelled') return 'border-l-[3px] border-l-red';
    return '';
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-400 text-[15px] font-bold animate-skeleton-pulse font-sans">
        Loading bookings catalog...
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto p-[20px] md:p-[40px] font-sans selection:bg-teal selection:text-white">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-[20px] mb-[32px]">
          <div>
            <h1 className="text-h1">All Bookings</h1>
            <p className="text-[15px] text-gray-500 mt-[4px]">Monitor and manage all expert consultations across your workspace.</p>
          </div>
          <Button variant="primary" size="lg" asChild>
            <Link href="/search"><Search size={16} className="mr-[8px]" /> Find Experts</Link>
          </Button>
        </div>

        {/* Tab Row & Filter Group */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-gray-200 gap-[16px] mb-[24px]">
          {/* Left Tabs */}
          <div className="flex gap-[16px]">
            {['all', 'upcoming', 'completed', 'cancelled'].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab as any); setCurrentPage(1); }}
                  className={`pb-[16px] text-[15px] font-semibold uppercase tracking-wider transition-all relative ${
                    isActive ? 'text-[#0F2137]' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#0F2137]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Filters */}
          <div className="flex items-center gap-[10px] pb-[8px] lg:pb-0">
            <input 
              type="date"
              value={dateFilter}
              onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
              className="h-[44px] px-[12px] border border-gray-200 rounded-[8px] text-[14px] text-gray-600 font-semibold outline-none focus:border-teal bg-white"
            />

            <select 
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="h-[44px] px-[16px] border border-gray-200 rounded-[8px] text-[14px] text-gray-600 font-semibold outline-none bg-white focus:border-teal"
            >
              <option>All Categories</option>
              <option>GST & Tax</option>
              <option>System Design</option>
              <option>Financial Model</option>
            </select>
          </div>
        </div>

        {/* Bookings Table / Empty State */}
        {paginatedBookings.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-[12px] p-[64px] text-center flex flex-col items-center justify-center min-h-[360px] shadow-level-1">
            <Inbox className="w-[56px] h-[56px] text-gray-300 mb-[16px]" />
            <h3 className="text-[20px] font-bold text-[#0F2137]">No bookings found</h3>
            <p className="text-[15px] text-gray-500 max-w-[340px] mt-[6px] mb-[24px]">
              We couldn't find any bookings matching your current filter choices. Try widening your selections.
            </p>
            <Button variant="teal-outline" size="md" onClick={() => { setActiveTab('all'); setSelectedCategory('All Categories'); setDateFilter(''); }}>
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-[12px] shadow-level-1 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                    <th className="px-[24px] py-[14px]">Expert</th>
                    <th className="px-[24px] py-[14px]">Date</th>
                    <th className="px-[24px] py-[14px]">Duration</th>
                    <th className="px-[24px] py-[14px]">Amount</th>
                    <th className="px-[24px] py-[14px] text-center">Status</th>
                    <th className="px-[24px] py-[14px] text-center">Invoice</th>
                    <th className="px-[24px] py-[14px] text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedBookings.map((bk) => (
                    <tr key={bk.id} className={`hover:bg-gray-50/50 transition-colors ${getStatusBorder(bk.status)}`}>
                      <td className="px-[24px] py-[16px] flex items-center gap-[12px]">
                        <div className="w-[36px] h-[36px] rounded-full bg-[#0F2137] text-white flex items-center justify-center font-bold text-[14px]">
                          {bk.expertName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-[14px] font-bold text-[#0F2137]">{bk.expertName}</div>
                          <div className="text-[12px] text-gray-400 font-semibold">{bk.title}</div>
                        </div>
                      </td>
                      <td className="px-[24px] py-[16px] text-[14px] text-gray-600 font-bold">
                        {new Date(bk.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-[24px] py-[16px] text-[14px] text-gray-600 font-semibold">{bk.duration}</td>
                      <td className="px-[24px] py-[16px] text-[14px] text-[#0F2137] font-bold font-mono">{bk.amount}</td>
                      <td className="px-[24px] py-[16px] text-center">
                        {bk.status === 'upcoming' && (
                          <Badge variant="warning" shape="pill">upcoming</Badge>
                        )}
                        {bk.status === 'completed' && (
                          <Badge variant="success" shape="pill">completed</Badge>
                        )}
                        {bk.status === 'cancelled' && (
                          <Badge variant="error" shape="pill">cancelled</Badge>
                        )}
                      </td>
                      <td className="px-[24px] py-[16px] text-center">
                        <a href="#" className="text-[13px] font-bold text-teal hover:underline inline-flex items-center gap-[4px] justify-center">
                          <Download size={12} /> PDF
                        </a>
                      </td>
                      <td className="px-[24px] py-[16px] text-right">
                        {bk.status === 'upcoming' ? (
                          <Button variant="primary" size="xs" asChild>
                            <a href={`/room/${bk.id}`} target="_blank" rel="noopener noreferrer">
                              <Video size={14} className="mr-1" /> Join
                            </a>
                          </Button>
                        ) : bk.status === 'completed' ? (
                          <Button variant="outline" size="xs">Rate</Button>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="bg-gray-50 border-t border-gray-100 px-[24px] py-[16px] flex justify-between items-center text-[14px] text-gray-500 font-semibold">
              <div>
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredBookings.length)} of {filteredBookings.length} bookings
              </div>
              <div className="flex items-center gap-[8px]">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-[6px] border border-gray-200 rounded-[6px] bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                
                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-[32px] h-[32px] rounded-[6px] border text-[13px] font-bold transition-all ${
                        currentPage === p 
                          ? 'border-teal bg-teal text-white' 
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}

                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-[6px] border border-gray-200 rounded-[6px] bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
}
