"use client";

import React, { useEffect, useState } from 'react';
import { Wallet, Save, TrendingUp, IndianRupee, ArrowDownRight } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function PayoutsPage() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [paymentDetails, setPaymentDetails] = useState({
    upi_id: '',
    bank_account: '',
    ifsc: '',
    account_name: ''
  });
  const [saving, setSaving] = useState(false);
  const [expertId, setExpertId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('expert_profiles')
        .select('id, payment_details')
        .eq('id', user.id)
        .single();

      if (profile) {
        setExpertId(profile.id);
        if (profile.payment_details) {
          setPaymentDetails({
            upi_id: profile.payment_details.upi_id || '',
            bank_account: profile.payment_details.bank_account || '',
            ifsc: profile.payment_details.ifsc || '',
            account_name: profile.payment_details.account_name || ''
          });
        }

        const { data: bks } = await supabase
          .from('bookings')
          .select('id, booking_date, start_time, amount_paid, payment_status, status, mentee_id')
          .eq('expert_id', profile.id)
          .eq('payment_status', 'paid')
          .order('booking_date', { ascending: false });

        if (bks) {
          // Fetch mentee names
          const menteeIds = [...new Set(bks.map(b => b.mentee_id))];
          if (menteeIds.length > 0) {
            const { data: mentees } = await supabase
              .from('client_profiles')
              .select('id, first_name, last_name')
              .in('id', menteeIds);
              
            const menteeMap = mentees?.reduce((acc, m) => {
              acc[m.id] = `${m.first_name || ''} ${m.last_name || ''}`.trim() || 'Client';
              return acc;
            }, {} as any) || {};

            const bksWithMentees = bks.map(b => ({
              ...b,
              mentee_name: menteeMap[b.mentee_id] || 'Client'
            }));
            setBookings(bksWithMentees);
          } else {
            setBookings(bks);
          }
        }
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleSaveDetails = async () => {
    if (!expertId) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('expert_profiles')
      .update({ payment_details: paymentDetails })
      .eq('id', expertId);

    if (error) {
      toast.error("Failed to save payment details");
    } else {
      toast.success("Payment details saved successfully");
    }
    setSaving(false);
  };

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.amount_paid || 0), 0);
  const platformFee = totalRevenue * 0.1; // 10% platform fee
  const expertEarnings = totalRevenue - platformFee;

  return (
        <div className="max-w-[1100px] mx-auto p-6 md:p-10 lg:p-12">
          {loading ? (
            <div className="text-center py-20 text-muted">Loading payouts...</div>
          ) : (
          <div>
            <div className="mb-8">
              <h1 className="text-[32px] font-bold text-primary tracking-tight mb-2">Payouts</h1>
              <p className="text-[15px] text-muted">Manage your earnings, platform fees, and withdrawal details.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white border border-border rounded-[16px] shadow-premium p-6">
                <div className="flex items-center gap-3 mb-2 text-muted">
                  <TrendingUp size={18} />
                  <span className="text-[14px] font-medium">Total Revenue</span>
                </div>
                <div className="text-[28px] font-bold text-primary flex items-center">
                  <IndianRupee size={22} className="mr-1 text-muted" />
                  {totalRevenue.toFixed(2)}
                </div>
              </div>

              <div className="bg-white border border-border rounded-[16px] shadow-premium p-6">
                <div className="flex items-center gap-3 mb-2 text-muted">
                  <ArrowDownRight size={18} />
                  <span className="text-[14px] font-medium">Platform Fees (10%)</span>
                </div>
                <div className="text-[28px] font-bold text-red-500 flex items-center">
                  - <IndianRupee size={22} className="mr-1" />
                  {platformFee.toFixed(2)}
                </div>
              </div>

              <div className="bg-accent/10 border border-accent/20 rounded-[16px] p-6 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-2 text-accent">
                    <Wallet size={18} />
                    <span className="text-[14px] font-medium">Your Earnings</span>
                  </div>
                  <div className="text-[32px] font-bold text-accent flex items-center">
                    <IndianRupee size={24} className="mr-1" />
                    {expertEarnings.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white border border-border rounded-[16px] shadow-premium overflow-hidden">
                  <div className="p-6 border-b border-border">
                    <h2 className="text-[16px] font-bold text-primary">Earning History</h2>
                  </div>
                  {bookings.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-bg text-muted text-[13px] uppercase tracking-wider">
                            <th className="p-4 font-medium">Date</th>
                            <th className="p-4 font-medium">Client</th>
                            <th className="p-4 font-medium">Amount Paid</th>
                            <th className="p-4 font-medium">Fee</th>
                            <th className="p-4 font-medium">You Earned</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {bookings.map((booking) => {
                            const fee = (booking.amount_paid || 0) * 0.1;
                            const earned = (booking.amount_paid || 0) - fee;
                            return (
                              <tr key={booking.id} className="text-[14px] text-primary hover:bg-bg transition-colors">
                                <td className="p-4 whitespace-nowrap">
                                  {new Date(booking.booking_date).toLocaleDateString()} <span className="text-muted ml-2">{booking.start_time}</span>
                                </td>
                                <td className="p-4 font-medium">{booking.mentee_name}</td>
                                <td className="p-4">₹{booking.amount_paid}</td>
                                <td className="p-4 text-red-500">-₹{fee.toFixed(2)}</td>
                                <td className="p-4 font-bold text-accent">₹{earned.toFixed(2)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-12 text-center text-muted">
                      No paid bookings yet. Complete a session to see your earnings here.
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="bg-white border border-border rounded-[16px] shadow-premium p-6 sticky top-6">
                  <h2 className="text-[16px] font-bold text-primary mb-4">Payout Settings</h2>
                  <p className="text-[13px] text-muted mb-6">
                    Enter your Bank or UPI details where you want your earnings to be transferred manually by the platform administrator.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[13px] font-bold text-primary mb-1">UPI ID</label>
                      <input 
                        type="text" 
                        value={paymentDetails.upi_id}
                        onChange={e => setPaymentDetails(p => ({...p, upi_id: e.target.value}))}
                        placeholder="e.g. yourname@okicici"
                        className="w-full h-[40px] px-3 bg-bg border border-border rounded-[8px] text-[14px] focus:border-accent focus:bg-white outline-none transition-colors"
                      />
                    </div>
                    
                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
                      <div className="relative flex justify-center"><span className="bg-white px-2 text-[12px] text-muted uppercase">OR BANK ACCOUNT</span></div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-primary mb-1">Account Holder Name</label>
                      <input 
                        type="text" 
                        value={paymentDetails.account_name}
                        onChange={e => setPaymentDetails(p => ({...p, account_name: e.target.value}))}
                        className="w-full h-[40px] px-3 bg-bg border border-border rounded-[8px] text-[14px] focus:border-accent focus:bg-white outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-primary mb-1">Account Number</label>
                      <input 
                        type="text" 
                        value={paymentDetails.bank_account}
                        onChange={e => setPaymentDetails(p => ({...p, bank_account: e.target.value}))}
                        className="w-full h-[40px] px-3 bg-bg border border-border rounded-[8px] text-[14px] focus:border-accent focus:bg-white outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-primary mb-1">IFSC Code</label>
                      <input 
                        type="text" 
                        value={paymentDetails.ifsc}
                        onChange={e => setPaymentDetails(p => ({...p, ifsc: e.target.value}))}
                        className="w-full h-[40px] px-3 bg-bg border border-border rounded-[8px] text-[14px] uppercase focus:border-accent focus:bg-white outline-none transition-colors"
                      />
                    </div>

                    <Button onClick={handleSaveDetails} disabled={saving} className="w-full mt-4 gap-2">
                      <Save size={16} /> {saving ? 'Saving...' : 'Save Details'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
  );
}
