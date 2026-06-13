"use client";

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  FileText, 
  ChevronRight, 
  Check, 
  ArrowLeft,
  Receipt,
  Lock,
  QrCode,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '../../../utils/supabase/client';
import toast from 'react-hot-toast';

export default function BookingFlowPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Selected date/time from query params
  const dateParam = searchParams.get('date') || 'Feb 10';
  const timeParam = searchParams.get('time') || '11:00 AM';
  const durationParam = searchParams.get('duration') || '30';

  const [expert, setExpert] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Payment states
  const [paymentSource, setPaymentSource] = useState<'wallet' | 'direct'>('wallet');
  const [directTab, setDirectTab] = useState<'upi' | 'card' | 'netbanking' | 'paylater'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Fallbacks
  const demoExperts: Record<string, any> = {
    "rahul": { name: "Rahul Sharma", title: "SEBI-Licensed CA", rate: 600 },
    "aditi": { name: "Aditi Sharma", title: "Ex-Stripe Staff Engineer", rate: 1200 }
  };

  useEffect(() => {
    async function fetchExpert() {
      const supabase = createClient();
      const { data } = await supabase
        .from('expert_profiles')
        .select('*')
        .eq('id', unwrappedParams.id)
        .single();

      if (data) {
        setExpert({
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || data.username,
          title: data.title,
          rate: data.hourly_rate
        });
      } else {
        const key = demoExperts[unwrappedParams.id.toLowerCase()] ? unwrappedParams.id.toLowerCase() : "aditi";
        setExpert(demoExperts[key]);
      }
      setLoading(false);
    }
    fetchExpert();
  }, [unwrappedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-skeleton-pulse font-bold text-gray-400">Loading booking checkout...</div>
      </div>
    );
  }

  const rate = Number(durationParam) === 60 ? expert.rate * 1.8 : expert.rate;
  const fee = Math.round(rate * 0.05);
  const total = rate + fee;
  
  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate Razorpay or Wallet Deduction
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Payment completed successfully!");
      router.push(`/booking/success?date=${encodeURIComponent(dateParam)}&time=${encodeURIComponent(timeParam)}&duration=${durationParam}&name=${encodeURIComponent(expert.name)}&title=${encodeURIComponent(expert.title)}&total=${total}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white pt-[48px] pb-[96px] font-sans selection:bg-teal selection:text-white">
      <div className="max-w-[1000px] mx-auto px-[20px] md:px-[40px]">
        
        {/* 1. PROGRESS BAR */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-[24px]">
            <div className="flex items-center gap-[8px]">
              <div className="w-[32px] h-[32px] rounded-full bg-teal text-white flex items-center justify-center font-bold text-[14px]">✓</div>
              <span className="text-[14px] font-semibold text-teal">1 Choose Slot</span>
            </div>
            <div className="w-[48px] h-[1px] bg-teal" />
            <div className="flex items-center gap-[8px]">
              <div className="w-[32px] h-[32px] rounded-full bg-teal text-white flex items-center justify-center font-bold text-[14px]">2</div>
              <span className="text-[14px] font-bold text-[#0F2137]">2 Review & Pay</span>
            </div>
            <div className="w-[48px] h-[1px] bg-gray-200" />
            <div className="flex items-center gap-[8px]">
              <div className="w-[32px] h-[32px] rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-bold text-[14px]">3</div>
              <span className="text-[14px] font-semibold text-gray-400">3 Confirmed</span>
            </div>
          </div>
        </div>

        {/* 2. SPLIT CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[32px] mt-[40px]">
          
          {/* LEFT COLUMN: Booking Summary (55% split) */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-gray-200 rounded-[12px] p-[32px] shadow-level-1">
              <h3 className="text-[20px] font-bold text-[#0F2137] mb-[20px]">Your Booking</h3>
              
              <div className="flex items-center gap-[12px] pb-[20px] border-b border-gray-100">
                <div className="w-[48px] h-[48px] rounded-full bg-[#0F2137] text-white flex items-center justify-center font-bold text-[18px]">
                  {expert.name.charAt(0)}
                </div>
                <div>
                  <div className="text-[16px] font-bold text-[#0F2137]">{expert.name}</div>
                  <div className="text-[13px] text-gray-500 font-semibold">{expert.title}</div>
                </div>
              </div>

              <div className="flex flex-col gap-[14px] mt-[20px]">
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-gray-500 font-semibold">Date</span>
                  <span className="font-bold text-gray-700">{dateParam}, 2026</span>
                </div>
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-gray-500 font-semibold">Time</span>
                  <span className="font-bold text-gray-700">{timeParam} (IST)</span>
                </div>
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-gray-500 font-semibold">Duration</span>
                  <span className="font-bold text-gray-700">{durationParam} minutes</span>
                </div>
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-gray-500 font-semibold">Session Type</span>
                  <span className="font-bold text-gray-700">1:1 Video Consultation</span>
                </div>
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-gray-500 font-semibold">Booked By</span>
                  <span className="font-bold text-gray-700">Prashant (Acme Inc)</span>
                </div>
              </div>

              <div className="w-full h-[1px] bg-gray-100 my-[20px]" />

              <div className="flex flex-col gap-[10px]">
                <div className="flex justify-between text-[14px] text-gray-500 font-semibold">
                  <span>Expert Rate</span>
                  <span>₹{rate}</span>
                </div>
                <div className="flex justify-between text-[14px] text-gray-500 font-semibold">
                  <span>Platform Fee (5%)</span>
                  <span>₹{fee}</span>
                </div>
                <div className="w-full h-[1px] bg-gray-100 my-[4px]" />
                <div className="flex justify-between items-center">
                  <span className="text-[16px] font-bold text-[#0F2137]">Total Amount</span>
                  <span className="text-[20px] font-extrabold text-teal">₹{total}</span>
                </div>
              </div>

              {/* ITC badge note */}
              <div className="bg-[#ECFDF5] border border-green/20 rounded-[8px] p-[12px] flex items-center gap-[8px] mt-[16px]">
                <Receipt className="w-[16px] h-[16px] text-[#064E3B] shrink-0" />
                <span className="text-[13px] text-[#064E3B] font-semibold">
                  GST tax invoice will email to billing@acme.com
                </span>
              </div>

              <div className="mt-[20px]">
                <Link href={`/${unwrappedParams.id}`} className="text-[13px] font-bold text-teal hover:underline flex items-center gap-[4px]">
                  ← Change Slot
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Payment Card (45% split) */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-gray-200 rounded-[12px] p-[32px] shadow-level-1 sticky top-[104px]">
              <h3 className="text-[20px] font-bold text-[#0F2137] mb-[20px]">Complete Payment</h3>

              {/* Source Toggle */}
              <div className="bg-gray-100 p-[3px] rounded-[10px] flex w-full mb-[20px]">
                <button 
                  onClick={() => setPaymentSource('wallet')}
                  className={`flex-1 h-[38px] rounded-[8px] text-[13px] font-bold transition-all ${
                    paymentSource === 'wallet' ? 'bg-white text-[#0F2137] shadow-xs' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Team Wallet
                </button>
                <button 
                  onClick={() => setPaymentSource('direct')}
                  className={`flex-1 h-[38px] rounded-[8px] text-[13px] font-bold transition-all ${
                    paymentSource === 'direct' ? 'bg-white text-[#0F2137] shadow-xs' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Pay Directly
                </button>
              </div>

              {/* Toggle panels */}
              {paymentSource === 'wallet' ? (
                /* WALLET PANEL */
                <div className="flex flex-col">
                  <div className="bg-teal text-white rounded-[10px] p-[20px] shadow-level-1 relative overflow-hidden">
                    <span className="text-[11px] text-white/70 uppercase tracking-widest font-bold">Acme Technologies Wallet</span>
                    <div className="text-[28px] font-extrabold mt-[4px] font-mono">₹18,500 available</div>
                    {/* progress bar */}
                    <div className="w-full bg-white/20 h-[8px] rounded-full overflow-hidden mt-[10px]">
                      <div className="bg-teal-300 h-full w-[65%]" />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-[10px] p-[14px] mt-[16px] flex justify-between items-center text-[14px] text-gray-600 font-semibold border border-gray-100">
                    <span>After booking:</span>
                    <span className="font-bold text-[#0F2137] font-mono">₹{(18500 - total).toLocaleString('en-IN')}</span>
                  </div>

                  <Button 
                    variant="primary" 
                    size="xl" 
                    fullWidth 
                    className="mt-[20px]"
                    disabled={isProcessing}
                    onClick={handlePayment}
                  >
                    {isProcessing ? "Processing deduction..." : "Pay from Wallet"}
                  </Button>
                </div>
              ) : (
                /* DIRECT PANEL */
                <div className="flex flex-col">
                  {/* Direct tabs */}
                  <div className="bg-gray-100 p-[3px] rounded-[8px] flex gap-[2px] mb-[16px]">
                    {[
                      { id: 'upi', label: 'UPI' },
                      { id: 'card', label: 'Card' },
                      { id: 'netbanking', label: 'Net' },
                      { id: 'paylater', label: 'Later' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setDirectTab(tab.id as any)}
                        className={`flex-1 h-[30px] rounded-[6px] text-[11px] font-bold uppercase transition-all ${
                          directTab === tab.id ? 'bg-teal text-white shadow-xs' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {directTab === 'upi' && (
                    <div className="flex flex-col items-center gap-[12px] animate-page-enter">
                      <div className="w-[140px] h-[140px] border-2 border-dashed border-gray-200 rounded-[10px] flex items-center justify-center text-gray-300 bg-gray-50 p-[8px]">
                        <QrCode size={110} className="text-gray-400" />
                      </div>
                      <span className="text-[12px] text-gray-400 font-bold uppercase tracking-wider">OR</span>
                      <div className="flex gap-[8px] w-full">
                        <div className="flex-grow">
                          <Input 
                            placeholder="username@upi"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="!h-[44px]"
                          />
                        </div>
                        <Button variant="outline" size="sm" className="h-[44px]">Verify</Button>
                      </div>
                    </div>
                  )}

                  {directTab === 'card' && (
                    <div className="flex flex-col gap-[12px] animate-page-enter">
                      <Input 
                        placeholder="Card Number" 
                        leftIcon={<CreditCard size={16} />}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g,''))}
                      />
                      <div className="grid grid-cols-2 gap-[12px]">
                        <Input 
                          placeholder="MM/YY" 
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                        />
                        <Input 
                          placeholder="CVV" 
                          type="password"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g,''))}
                        />
                      </div>
                    </div>
                  )}

                  {directTab === 'netbanking' && (
                    <div className="p-[12px] border border-gray-200 rounded-[8px] text-[13px] text-gray-600 font-semibold animate-page-enter">
                      Choose bank from list on next screen.
                    </div>
                  )}

                  {directTab === 'paylater' && (
                    <div className="p-[12px] border border-[#FFFBEB] bg-[#FFFBEB] text-[#F59E0B] rounded-[8px] text-[13px] font-semibold animate-page-enter">
                      Available for verified corporate clients only.
                    </div>
                  )}

                  <Button 
                    variant="primary" 
                    size="xl" 
                    fullWidth 
                    className="mt-[20px]"
                    disabled={isProcessing}
                    onClick={handlePayment}
                  >
                    {isProcessing ? "Processing direct payment..." : `Pay ₹${total} & Book`}
                  </Button>
                </div>
              )}

              {/* Security signature */}
              <div className="text-[12px] text-gray-400 text-center mt-[16px] font-medium flex items-center justify-center gap-[4px]">
                <Lock className="w-[12px] h-[12px]" />
                <span>Secured by Razorpay · 256-bit SSL</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
