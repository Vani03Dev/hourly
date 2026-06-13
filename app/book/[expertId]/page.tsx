"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { 
  ArrowLeft, 
  ArrowRight, 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  Phone, 
  Upload, 
  Plus, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Lock 
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { createClient } from "../../../utils/supabase/client";
import toast from "react-hot-toast";

// Predefined experts mapping for summary card fallback
const EXPERTS_LOOKUP: Record<string, any> = {
  "rahul-sharma": { name: "Rahul Sharma", title: "SEBI Registered CA", price: 999, initials: "RS" },
  "neha-gupta": { name: "Neha Gupta", title: "ex-Razorpay Tech Lead", price: 1499, initials: "NG" },
  "arjun-reddy": { name: "Arjun Reddy", title: "Corporate Lawyer", price: 1299, initials: "AR" },
  "priya-patel": { name: "Priya Patel", title: "Fractional CFO", price: 1999, initials: "PP" }
};

export default function BookingFlowWizard() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Get expert details
  const expertId = (params?.expertId as string) || "rahul-sharma";
  
  const [expert, setExpert] = useState<any>({ name: "Loading...", title: "Please wait...", price: 1000, initials: "E" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExpert() {
      const supabase = createClient();
      let query = supabase.from('expert_profiles').select('*');
      if (expertId.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)) {
        query = query.eq('id', expertId);
      } else {
        query = query.eq('username', expertId);
      }
      const { data, error } = await query.single();
      if (!error && data) {
        setExpert({
          id: data.id,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || data.username,
          title: data.title || "Verified Expert",
          price: data.hourly_rate || 1000,
          initials: (data.first_name?.charAt(0) || data.username?.charAt(0) || "E").toUpperCase()
        });
      } else {
        setExpert(EXPERTS_LOOKUP[expertId] || EXPERTS_LOOKUP["rahul-sharma"]);
      }
      setLoading(false);
    }
    fetchExpert();
  }, [expertId]);

  // Query parameters parsed
  const queryDate = searchParams?.get("date") ? Number(searchParams.get("date")) : 15;
  const queryTime = searchParams?.get("time") || "10:00 AM";
  const queryDuration = searchParams?.get("duration") ? Number(searchParams.get("duration")) : 30;

  // Wizard state: 1, 2, 3, 4 (4 is confirmation)
  const [step, setStep] = useState(1);

  // Step 1 States: Slot selection
  const [selectedDate, setSelectedDate] = useState<number>(queryDate);
  const [selectedTime, setSelectedTime] = useState<string>(queryTime);
  const [selectedDuration, setSelectedDuration] = useState<number>(queryDuration);

  // Step 2 States: Details
  const [helpDescription, setHelpDescription] = useState("");
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const [callFormat, setCallFormat] = useState<"video" | "phone">("video");
  const [teammateEmail, setTeammateEmail] = useState("");
  const [teammates, setTeammates] = useState<string[]>([]);
  const [helpError, setHelpError] = useState("");

  // Step 3 States: Payment
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Calculate pricing based on duration
  const priceMultiplier = selectedDuration === 15 ? 0.5 : selectedDuration === 60 ? 2.0 : 1.0;
  const sessionPrice = Math.round(expert.price * priceMultiplier);
  const platformFee = 0;
  const totalPrice = sessionPrice + platformFee;

  // Interactive functions
  const handleAddTeammate = () => {
    if (teammateEmail.trim() !== "" && teammateEmail.includes("@")) {
      setTeammates([...teammates, teammateEmail.trim()]);
      setTeammateEmail("");
    }
  };

  const handleRemoveTeammate = (emailToRemove: string) => {
    setTeammates(teammates.filter(email => email !== emailToRemove));
  };

  const handleFileUploadMock = () => {
    setAttachedFile("architecture_diagram_v2.png");
  };

  const handleNextStep2 = () => {
    if (helpDescription.trim().length < 20) {
      setHelpError("Please describe your blocker in at least 20 characters.");
      return;
    }
    setHelpError("");
    setStep(3);
  };

  const handleConfirmPayment = async () => {
    setPaymentLoading(true);
    const supabase = createClient();
    
    // Get current logged-in user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Authentication required to make a booking.");
      setPaymentLoading(false);
      return;
    }

    const menteeId = user.id;
    const expertUuid = expert?.id;

    if (!expertUuid) {
      toast.error("Expert ID is invalid.");
      setPaymentLoading(false);
      return;
    }

    // Calculate end time (e.g. +selectedDuration min)
    let endTime = selectedTime;
    try {
      const [timeStr, modifier] = selectedTime.split(' ');
      let [hours, minutes] = timeStr.split(':').map(Number);
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      
      let totalMinutes = hours * 60 + minutes + selectedDuration;
      let endHours = Math.floor(totalMinutes / 60) % 24;
      let endMinutes = totalMinutes % 60;
      
      let endModifier = endHours >= 12 ? 'PM' : 'AM';
      let displayHours = endHours % 12;
      if (displayHours === 0) displayHours = 12;
      
      endTime = `${displayHours}:${endMinutes.toString().padStart(2, '0')} ${endModifier}`;
    } catch (e) {}

    // Insert booking record into Supabase
    const { error } = await supabase
      .from('bookings')
      .insert({
        expert_id: expertUuid,
        mentee_id: menteeId,
        booking_date: `2026-06-${selectedDate.toString().padStart(2, '0')}`,
        start_time: selectedTime,
        end_time: endTime,
        status: 'confirmed',
        payment_status: 'paid',
        amount_paid: totalPrice,
        platform_fee: 0
      });

    if (error) {
      console.error("Booking Error:", error);
      toast.error(`Failed to confirm booking: ${error.message}`);
      setPaymentLoading(false);
      return;
    }

    setPaymentLoading(false);
    setStep(4);
  };

  // Inline calendar grid
  const daysInMonth = [14, 15, 16, 17, 18, 20, 21, 22];
  const slots = ["10:00 AM", "11:30 AM", "2:00 PM", "4:30 PM", "6:00 PM"];

  return (
    <div className="bg-bg min-h-screen py-[40px] px-[20px] md:px-[48px] lg:px-[96px] flex justify-center items-start">
      <div className="max-w-[1000px] w-full flex flex-col gap-[24px]">
        
        {/* PROGRESS BAR & STEP INDICATORS */}
        {step < 4 && (
          <div className="bg-white border border-border p-[20px] rounded-xl shadow-sm flex flex-col gap-[12px]">
            <div className="flex justify-between text-[13px] font-bold text-muted uppercase tracking-wider">
              <span className={step >= 1 ? "text-accent" : ""}>Step 1: Select Slot</span>
              <span className={step >= 2 ? "text-accent" : ""}>Step 2: Details</span>
              <span className={step >= 3 ? "text-accent" : ""}>Step 3: Payment</span>
            </div>
            <div className="w-full h-[6px] bg-bg rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-[300ms]"
                style={{ width: step === 1 ? "33%" : step === 2 ? "66%" : "100%" }}
              />
            </div>
          </div>
        )}

        {/* WIZARD CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[32px] items-start">
          
          {/* LEFT INTERACTIVE COLUMN (8 cols for Step 1/2/3, 12 cols for Step 4) */}
          <div className={`${step === 4 ? "lg:col-span-12" : "lg:col-span-8"} bg-white border border-border p-[32px] rounded-xl shadow-sm flex flex-col gap-[24px]`}>
            
            {/* STEP 1: SELECT SLOT */}
            {step === 1 && (
              <div className="flex flex-col gap-[24px] animate-page-enter">
                <div>
                  <h2 className="text-[22px] font-bold text-primary">Select Session Slot</h2>
                  <p className="text-[14px] text-muted mt-[4px]">Choose your duration and find a slot that fits your schedule.</p>
                </div>

                {/* Duration select */}
                <div className="flex flex-col gap-[8px]">
                  <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Session Duration</span>
                  <div className="grid grid-cols-3 gap-[8px]">
                    {[15, 30, 60].map(dur => (
                      <button
                        key={dur}
                        onClick={() => setSelectedDuration(dur)}
                        className={`h-[44px] rounded-lg border text-[13.5px] font-bold transition-all ${
                          selectedDuration === dur 
                            ? "border-accent bg-blue-50/50 text-accent" 
                            : "border-border text-primary hover:bg-bg bg-white"
                        }`}
                      >
                        {dur} Min
                      </button>
                    ))}
                  </div>
                </div>

                {/* Inline calendar grid */}
                <div className="flex flex-col gap-[8px]">
                  <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Select Date (June 2026)</span>
                  <div className="grid grid-cols-4 gap-[8px]">
                    {daysInMonth.map(day => (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(day)}
                        className={`h-[44px] text-[13.5px] font-bold rounded-lg border font-mono transition-all ${
                          selectedDate === day 
                            ? "border-accent bg-accent text-white" 
                            : "border-border text-primary hover:bg-bg bg-white"
                        }`}
                      >
                        {day} Jun
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time slot grid */}
                <div className="flex flex-col gap-[8px]">
                  <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Select Time (IST)</span>
                  <div className="grid grid-cols-3 gap-[8px]">
                    {slots.map(slot => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className={`h-[40px] text-[13px] font-semibold rounded-lg border transition-all ${
                          selectedTime === slot 
                            ? "border-accent bg-accent text-white" 
                            : "border-border text-primary hover:bg-bg"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Continue button */}
                <div className="border-t border-border pt-[20px] flex justify-end">
                  <Button 
                    variant="primary" 
                    className="bg-accent hover:bg-accent-hover text-white rounded-lg h-[44px] px-6 font-semibold flex items-center gap-[8px]"
                    onClick={() => setStep(2)}
                  >
                    Continue <ArrowRight className="w-[16px] h-[16px]" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: SESSION DETAILS */}
            {step === 2 && (
              <div className="flex flex-col gap-[24px] animate-page-enter">
                <div>
                  <h2 className="text-[22px] font-bold text-primary">Session Details</h2>
                  <p className="text-[14px] text-muted mt-[4px]">Help the expert prepare for your consultation by describing your bottleneck.</p>
                </div>

                {/* Textarea Description */}
                <div className="flex flex-col gap-[8px]">
                  <label className="text-[11px] font-bold text-muted uppercase tracking-wider">
                    What do you need help with? <span className="text-danger">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={helpDescription}
                    onChange={(e) => setHelpDescription(e.target.value)}
                    placeholder="Provide details about the issue. E.g. audit errors in GST, database locking problems under peak load, etc."
                    className={`w-full p-[12px] border text-[13.5px] rounded-lg focus:outline-none focus:border-accent ${
                      helpError ? "border-danger" : "border-border"
                    }`}
                  />
                  {helpError && <p className="text-[11px] text-danger font-semibold mt-[2px]">{helpError}</p>}
                </div>

                {/* Optional document upload */}
                <div className="flex flex-col gap-[8px]">
                  <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Attach any documents? (optional)</span>
                  {attachedFile ? (
                    <div className="flex justify-between items-center bg-bg p-[12px] border border-border rounded-lg text-[13px] font-semibold">
                      <span className="text-primary truncate">{attachedFile}</span>
                      <button onClick={() => setAttachedFile(null)} className="text-danger hover:text-red-700">
                        <X className="w-[16px] h-[16px]" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={handleFileUploadMock}
                      className="border-2 border-dashed border-border hover:border-accent rounded-lg p-[24px] text-center flex flex-col items-center justify-center gap-[8px] transition-colors"
                    >
                      <Upload className="w-[24px] h-[24px] text-muted" />
                      <span className="text-[13px] text-primary font-semibold">Upload document or architecture diagram</span>
                      <span className="text-[11px] text-muted">PDF, PNG, JPG up to 10MB</span>
                    </button>
                  )}
                </div>

                {/* Format selection: Video/Phone */}
                <div className="flex flex-col gap-[8px]">
                  <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Session Format</span>
                  <div className="grid grid-cols-2 gap-[8px]">
                    <button
                      onClick={() => setCallFormat("video")}
                      className={`h-[48px] rounded-lg border text-[13.5px] font-semibold flex items-center justify-center gap-[8px] transition-all ${
                        callFormat === "video" 
                          ? "border-accent bg-blue-50/50 text-accent" 
                          : "border-border text-primary hover:bg-bg bg-white"
                      }`}
                    >
                      <Video className="w-[18px] h-[18px]" /> Video Call
                    </button>
                    <button
                      onClick={() => setCallFormat("phone")}
                      className={`h-[48px] rounded-lg border text-[13.5px] font-semibold flex items-center justify-center gap-[8px] transition-all ${
                        callFormat === "phone" 
                          ? "border-accent bg-blue-50/50 text-accent" 
                          : "border-border text-primary hover:bg-bg bg-white"
                      }`}
                    >
                      <Phone className="w-[18px] h-[18px]" /> Phone Call
                    </button>
                  </div>
                </div>

                {/* Add teammates */}
                <div className="flex flex-col gap-[8px]">
                  <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Invite Teammates (optional)</span>
                  <div className="flex gap-[8px]">
                    <input
                      type="email"
                      value={teammateEmail}
                      onChange={(e) => setTeammateEmail(e.target.value)}
                      placeholder="teammate@company.com"
                      className="flex-grow px-[12px] h-[40px] border border-border text-[13px] rounded-lg focus:outline-none focus:border-accent"
                    />
                    <Button 
                      variant="outline" 
                      className="border-border text-primary h-[40px] px-3 rounded-lg flex items-center gap-[4px] font-semibold shrink-0"
                      onClick={handleAddTeammate}
                    >
                      <Plus className="w-[16px] h-[16px]" /> Add
                    </Button>
                  </div>

                  {teammates.length > 0 && (
                    <div className="flex flex-wrap gap-[6px] mt-[8px]">
                      {teammates.map(email => (
                        <div key={email} className="bg-bg text-primary border border-border px-[10px] py-[4px] rounded-full text-[12px] font-semibold flex items-center gap-[6px]">
                          <span>{email}</span>
                          <button onClick={() => handleRemoveTeammate(email)} className="text-muted hover:text-primary">
                            <X className="w-[12px] h-[12px]" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Navigation actions */}
                <div className="border-t border-border pt-[20px] flex justify-between">
                  <Button variant="outline" className="border-border text-primary rounded-lg h-[44px] px-6 font-semibold" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button variant="primary" className="bg-accent hover:bg-accent-hover text-white rounded-lg h-[44px] px-6 font-semibold flex items-center gap-[8px]" onClick={handleNextStep2}>
                    Continue <ArrowRight className="w-[16px] h-[16px]" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT & CONFIRM */}
            {step === 3 && (
              <div className="flex flex-col gap-[24px] animate-page-enter">
                <div>
                  <h2 className="text-[22px] font-bold text-primary">Payment & Confirm</h2>
                  <p className="text-[14px] text-muted mt-[4px]">Complete payment securely via Razorpay sandbox. Zero upfront retainer required.</p>
                </div>

                {/* Selected payment options */}
                <div className="flex flex-col gap-[12px]">
                  <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Select Payment Method</span>
                  {[
                    { id: "upi" as const, label: "UPI (GPay / PhonePe / PayTM)", sub: "Instant verification" },
                    { id: "card" as const, label: "Credit or Debit Card", sub: "Visa, Mastercard, RuPay" },
                    { id: "netbanking" as const, label: "Net Banking / Corporate Wallet", sub: "All major Indian banks" }
                  ].map(method => {
                    const isSelected = paymentMethod === method.id;
                    return (
                      <label 
                        key={method.id}
                        className={`flex items-center justify-between p-[16px] rounded-xl border cursor-pointer select-none transition-all ${
                          isSelected ? "border-accent bg-blue-50/20" : "border-border hover:bg-bg bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-[12px]">
                          <input
                            type="radio"
                            name="payment"
                            checked={isSelected}
                            onChange={() => setPaymentMethod(method.id)}
                            className="border-border text-accent focus:ring-accent w-[16px] h-[16px]"
                          />
                          <div className="flex flex-col">
                            <span className="text-[13.5px] font-bold text-primary">{method.label}</span>
                            <span className="text-[11px] text-muted">{method.sub}</span>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {/* Confirm & Pay action */}
                <div className="border-t border-border pt-[20px] flex flex-col gap-[12px]">
                  <Button 
                    variant="primary" 
                    className="bg-accent hover:bg-accent-hover text-white rounded-lg h-[48px] font-bold w-full flex items-center justify-center gap-[8px]"
                    onClick={handleConfirmPayment}
                    disabled={paymentLoading}
                  >
                    {paymentLoading ? (
                      <span className="flex items-center gap-[8px]">
                        <span className="w-[16px] h-[16px] border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Triggering Razorpay Checkout...
                      </span>
                    ) : (
                      <>Confirm & Pay ₹{totalPrice}</>
                    )}
                  </Button>
                  
                  <div className="flex items-center justify-center gap-[6px] text-[12px] text-muted font-semibold">
                    <Lock className="w-[14px] h-[14px]" /> Secure encrypted checkout · Cancel free up to 2 hours before session
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: CONFIRMATION SCREEN */}
            {step === 4 && (
              <div className="flex flex-col items-center text-center py-[40px] px-[20px] gap-[24px] animate-success-bounce max-w-[600px] mx-auto">
                <div className="w-[64px] h-[64px] bg-[#ECFDF5] rounded-full border-2 border-success flex items-center justify-center text-success">
                  <CheckCircle2 className="w-[36px] h-[36px]" />
                </div>
                
                <div>
                  <h1 className="text-[28px] font-bold text-primary">Session Confirmed!</h1>
                  <p className="text-[14px] text-muted mt-[8px]">
                    Your session with {expert.name} has been booked. A calendar invite and Google Meet link have been sent to your email.
                  </p>
                </div>

                {/* Booking summary card */}
                <div className="w-full bg-bg border border-border p-[24px] rounded-xl flex flex-col gap-[16px] text-left">
                  <div className="flex gap-[16px] items-center border-b border-border pb-[16px]">
                    <div className="w-[40px] h-[40px] rounded-full bg-primary text-white flex items-center justify-center font-bold text-[14px]">
                      {expert.initials}
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-primary">{expert.name}</h4>
                      <span className="text-[12px] text-muted">{expert.title}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-[12px] text-[13px]">
                    <div className="flex flex-col">
                      <span className="font-semibold text-muted">Date & Time</span>
                      <span className="font-bold text-primary mt-[2px] font-mono">{selectedDate} June 2026, {selectedTime} IST</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-muted">Format</span>
                      <span className="font-bold text-primary mt-[2px]">{callFormat === "video" ? "Video Call (Google Meet)" : "Phone Call"}</span>
                    </div>
                    <div className="flex flex-col col-span-2">
                      <span className="font-semibold text-muted">GST Tax Invoice</span>
                      <span className="font-bold text-success mt-[2px] flex items-center gap-[4px]">
                        <ShieldCheck className="w-[14px] h-[14px]" /> Auto-sent to billing email (18% ITC Recoverable)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Final actions */}
                <div className="flex flex-col sm:flex-row gap-[12px] w-full">
                  <Button variant="outline" className="border-border text-primary font-semibold h-[44px] rounded-lg flex-1">
                    Download Calendar Invite
                  </Button>
                  <Button 
                    variant="primary" 
                    className="bg-accent hover:bg-accent-hover text-white rounded-lg h-[44px] px-8 font-semibold flex-1"
                    asChild
                  >
                    <Link href="/dashboard/business">View My Sessions</Link>
                  </Button>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT SIDEBAR SUMMARY CARD (4 cols, hidden in step 4 confirmation) */}
          {step < 4 && (
            <div className="lg:col-span-4 bg-white border border-border rounded-xl p-[24px] shadow-sm flex flex-col gap-[20px]">
              <h3 className="text-[16px] font-bold text-primary border-b border-border pb-[12px]">Session Summary</h3>
              
              {/* Mini Expert Card */}
              <div className="flex gap-[12px] items-center">
                <div className="w-[40px] h-[40px] rounded-full bg-primary text-white flex items-center justify-center font-bold text-[14px]">
                  {expert.initials}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] font-bold text-primary truncate">{expert.name}</span>
                  <span className="text-[12px] text-muted truncate">{expert.title}</span>
                </div>
              </div>

              {/* Slot details */}
              <div className="flex flex-col gap-[12px] border-t border-border pt-[16px] text-[13px]">
                <div className="flex items-center gap-[8px] text-primary">
                  <CalendarIcon className="w-[16px] h-[16px] text-accent shrink-0" />
                  <span className="font-semibold font-mono">{selectedDate} June 2026</span>
                </div>
                <div className="flex items-center gap-[8px] text-primary">
                  <Clock className="w-[16px] h-[16px] text-accent shrink-0" />
                  <span className="font-semibold font-mono">{selectedTime} IST ({selectedDuration} min)</span>
                </div>
              </div>

              {/* Price summary table */}
              <div className="border-t border-border pt-[16px] flex flex-col gap-[8px] text-[13.5px]">
                <div className="flex justify-between items-center text-muted">
                  <span>Session charge</span>
                  <span className="font-mono text-primary font-semibold">₹{sessionPrice}</span>
                </div>
                <div className="flex justify-between items-center text-muted">
                  <span>Platform Fee</span>
                  <span className="font-mono text-primary font-semibold">₹{platformFee}</span>
                </div>
                <div className="h-[1px] border-t border-dashed border-border my-[4px]" />
                <div className="flex justify-between items-baseline font-bold text-[15px]">
                  <span className="text-primary">Total Price</span>
                  <span className="text-accent font-mono text-[18px]">₹{totalPrice}</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
