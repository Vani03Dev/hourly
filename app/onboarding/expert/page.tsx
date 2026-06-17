"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Upload, Check, ShieldCheck, HelpCircle } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { CustomSelect } from "../../../components/ui/CustomSelect";
import toast from "react-hot-toast";

const DOMAINS = [
  "CA & Tax",
  "Startup Legal",
  "Tech & CTO",
  "Finance & CFO",
  "HR & People",
  "Sales & GTM",
  "Marketing",
  "Operations",
  "Leadership"
];

export default function ExpertOnboarding() {
  const router = useRouter();

  // Wizard Steps: 1, 2, 3, 4, 5 (5 is final review screen)
  const [step, setStep] = useState(1);

  // Step 1 States
  const [fullName, setFullName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 2 States
  const [domain, setDomain] = useState("CA & Tax");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [credDetails, setCredDetails] = useState("");
  const [documentAttached, setDocumentAttached] = useState<string | null>(null);

  // Step 3 States
  const [price15, setPrice15] = useState(499);
  const [price30, setPrice30] = useState(999);
  const [price60, setPrice60] = useState(1999);

  // Step 4 States
  const [bankLinked, setBankLinked] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNextStep1 = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = "Full name is required";
    if (!title.trim()) errs.title = "Professional title is required";
    if (bio.trim().length < 50) errs.bio = "Bio must be at least 50 characters long";

    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setStep(2);
    }
  };

  const handleNextStep2 = () => {
    const errs: Record<string, string> = {};
    if (!linkedinUrl.trim() || !linkedinUrl.includes("linkedin.com")) {
      errs.linkedinUrl = "Please enter a valid LinkedIn URL";
    }
    if (!credDetails.trim()) {
      errs.credDetails = "Please describe your credentials or registration numbers";
    }

    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setStep(3);
    }
  };

  const handleAttachDocument = () => {
    setDocumentAttached("credential_certificate_icai.pdf");
  };

  const handleLinkBankMock = () => {
    setIsLinking(true);
    setTimeout(() => {
      setIsLinking(false);
      setBankLinked(true);
      toast.success("Razorpay bank account linked successfully!");
    }, 1500);
  };

  const handleFinishOnboarding = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(5);
    }, 1200);
  };

  return (
    <div className="bg-bg min-h-[calc(100vh-64px)] flex items-center justify-center px-[20px] py-[40px] font-sans">
      
      {/* WIZARD CONTAINER */}
      <div className="bg-white border border-border rounded-xl p-[32px] w-full max-w-[500px] shadow-sm flex flex-col gap-[24px]">
        
        {/* PROGRESS DOTS */}
        {step < 5 && (
          <div className="flex gap-[8px] justify-center">
            {[1, 2, 3, 4].map(s => (
              <div 
                key={s} 
                className={`h-[4px] rounded-full transition-all duration-300 ${
                  step >= s ? "w-[24px] bg-accent" : "w-[12px] bg-border"
                }`}
              />
            ))}
          </div>
        )}

        {/* STEP 1: BIO AND TITLE */}
        {step === 1 && (
          <div className="flex flex-col gap-[20px] animate-page-enter">
            <div className="text-center">
              <h2 className="text-[20px] font-bold text-primary">Basic Profile Info</h2>
              <p className="text-[12px] text-muted mt-[4px]">Set up the primary details visible to businesses.</p>
            </div>

            <Input 
              label="Full Name"
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              error={errors.fullName}
              className="h-[40px]"
            />

            <Input 
              label="Professional Title"
              type="text"
              placeholder="e.g. SEBI Registered CA / ex-Razorpay Tech Lead"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
              className="h-[40px]"
            />

            <div className="flex flex-col gap-[6px]">
              <label className="text-[11px] font-bold text-muted uppercase tracking-wider">Professional Bio</label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Detail your background, companies you've unblocked, and what questions you solve in under 60 minutes."
                className={`w-full p-[12px] border text-[13.5px] rounded-lg focus:outline-none focus:border-accent ${
                  errors.bio ? "border-danger" : "border-border"
                }`}
              />
              {errors.bio && <p className="text-[11px] text-danger font-semibold mt-[2px]">{errors.bio}</p>}
            </div>

            <Button 
              variant="primary" 
              className="bg-accent hover:bg-accent-hover text-white rounded-lg h-[44px] font-bold w-full mt-[8px] flex items-center justify-center gap-[8px]"
              onClick={handleNextStep1}
            >
              Continue <ArrowRight className="w-[16px] h-[16px]" />
            </Button>
          </div>
        )}

        {/* STEP 2: DOMAIN & CREDENTIALS */}
        {step === 2 && (
          <div className="flex flex-col gap-[20px] animate-page-enter">
            <div className="text-center">
              <h2 className="text-[20px] font-bold text-primary">Credentials Verification</h2>
              <p className="text-[12px] text-muted mt-[4px]">We verify all experts to maintain India's top B2B consulting network.</p>
            </div>

            <div className="flex flex-col gap-[6px]">
              <label className="text-[11px] font-bold text-muted uppercase tracking-wider">Primary Domain</label>
              <CustomSelect
                value={domain}
                onChange={setDomain}
                options={DOMAINS}
              />
            </div>

            <Input 
              label="LinkedIn Profile URL"
              type="text"
              placeholder="e.g. https://linkedin.com/in/rahulsharma"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              error={errors.linkedinUrl}
              className="h-[40px]"
            />

            <Input 
              label="Credentials details (ICAI No / Bar Council ID / etc.)"
              type="text"
              placeholder="e.g. ICAI Membership No. 123456"
              value={credDetails}
              onChange={(e) => setCredDetails(e.target.value)}
              error={errors.credDetails}
              className="h-[40px]"
            />

            {/* Document Upload */}
            <div className="flex flex-col gap-[8px]">
              <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Upload Registration Certificate (Optional)</span>
              {documentAttached ? (
                <div className="bg-bg border border-border p-[12px] rounded-lg text-[12.5px] font-bold text-primary flex justify-between items-center">
                  <span className="truncate">{documentAttached}</span>
                  <button onClick={() => setDocumentAttached(null)} className="text-danger">Remove</button>
                </div>
              ) : (
                <button 
                  onClick={handleAttachDocument}
                  className="border border-border hover:border-accent rounded-lg p-[16px] text-center flex items-center justify-center gap-[8px] bg-bg font-semibold text-[13px] text-primary transition-colors"
                >
                  <Upload className="w-[16px] h-[16px]" /> Attach certificate (PDF / PNG)
                </button>
              )}
            </div>

            <div className="flex gap-[12px] mt-[8px]">
              <Button 
                variant="outline" 
                className="border-border text-primary rounded-lg h-[44px] font-bold flex-1"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button 
                variant="primary" 
                className="bg-accent hover:bg-accent-hover text-white rounded-lg h-[44px] font-bold flex-1"
                onClick={handleNextStep2}
              >
                Continue &rarr;
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: SESSION RATES */}
        {step === 3 && (
          <div className="flex flex-col gap-[20px] animate-page-enter">
            <div className="text-center">
              <h2 className="text-[20px] font-bold text-primary">Set Session Pricing</h2>
              <p className="text-[12px] text-muted mt-[4px]">Define your pricing in INR (₹) for standard session lengths.</p>
            </div>

            <div className="flex flex-col gap-[16px]">
              <div className="flex justify-between items-center border border-border p-[12px] rounded-lg bg-bg">
                <span className="text-[13.5px] font-bold text-primary">15 Min Session Rate</span>
                <input 
                  type="number"
                  value={price15}
                  onChange={(e) => setPrice15(Number(e.target.value))}
                  className="h-[36px] w-[100px] border border-border rounded-md px-[8px] text-[13.5px] font-bold font-mono text-right"
                />
              </div>

              <div className="flex justify-between items-center border border-border p-[12px] rounded-lg bg-bg">
                <span className="text-[13.5px] font-bold text-primary">30 Min Session Rate</span>
                <input 
                  type="number"
                  value={price30}
                  onChange={(e) => setPrice30(Number(e.target.value))}
                  className="h-[36px] w-[100px] border border-border rounded-md px-[8px] text-[13.5px] font-bold font-mono text-right"
                />
              </div>

              <div className="flex justify-between items-center border border-border p-[12px] rounded-lg bg-bg">
                <span className="text-[13.5px] font-bold text-primary">60 Min Session Rate</span>
                <input 
                  type="number"
                  value={price60}
                  onChange={(e) => setPrice60(Number(e.target.value))}
                  className="h-[36px] w-[100px] border border-border rounded-md px-[8px] text-[13.5px] font-bold font-mono text-right"
                />
              </div>
            </div>

            <div className="flex gap-[12px] mt-[8px]">
              <Button 
                variant="outline" 
                className="border-border text-primary rounded-lg h-[44px] font-bold flex-1"
                onClick={() => setStep(2)}
              >
                Back
              </Button>
              <Button 
                variant="primary" 
                className="bg-accent hover:bg-accent-hover text-white rounded-lg h-[44px] font-bold flex-1"
                onClick={() => setStep(4)}
              >
                Continue &rarr;
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: BANK LINK DETAILS */}
        {step === 4 && (
          <div className="flex flex-col gap-[20px] animate-page-enter">
            <div className="text-center">
              <h2 className="text-[20px] font-bold text-primary">Payout Account</h2>
              <p className="text-[12px] text-muted mt-[4px]">Link your bank account to receive direct payouts via Razorpay.</p>
            </div>

            {bankLinked ? (
              <div className="bg-green-50 border border-green-200 text-success p-[16px] rounded-xl flex flex-col items-center gap-[8px] text-center shadow-sm">
                <ShieldCheck className="w-[32px] h-[32px]" />
                <h4 className="font-bold text-[14px]">Razorpay Bank Account Connected</h4>
                <p className="text-[12px] text-muted">Payouts will be sent directly to your linked savings/current account.</p>
              </div>
            ) : (
              <div className="border border-border rounded-xl p-[24px] bg-bg flex flex-col gap-[12px] items-center text-center">
                <HelpCircle className="w-[32px] h-[32px] text-muted" />
                <span className="text-[13.5px] font-bold text-primary">Razorpay Route Integration</span>
                <p className="text-[12px] text-muted">Click the button below to simulate link credentials and register your bank account details securely.</p>
                
                <Button
                  variant="outline"
                  className="border-border text-primary h-[40px] px-6 rounded-lg font-bold bg-white mt-[8px]"
                  onClick={handleLinkBankMock}
                  disabled={isLinking}
                >
                  {isLinking ? "Connecting..." : "Link Bank Account"}
                </Button>
              </div>
            )}

            <div className="flex gap-[12px] mt-[8px]">
              <Button 
                variant="outline" 
                className="border-border text-primary rounded-lg h-[44px] font-bold flex-grow"
                onClick={() => setStep(3)}
              >
                Back
              </Button>
              <Button 
                variant="primary" 
                className="bg-accent hover:bg-accent-hover text-white rounded-lg h-[44px] font-bold flex-grow"
                onClick={handleFinishOnboarding}
                disabled={!bankLinked || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Finish Onboarding"}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW SCREEN */}
        {step === 5 && (
          <div className="flex flex-col items-center text-center py-[24px] gap-[20px] animate-success-bounce">
            <div className="w-[64px] h-[64px] bg-[#ECFDF5] border border-success text-success rounded-full flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-[32px] h-[32px]" />
            </div>

            <div>
              <h2 className="text-[20px] font-bold text-primary">Profile Under Review</h2>
              <p className="text-[13px] text-muted mt-[8px] leading-relaxed">
                Thank you for applying! Our team is verifying your credentials (ICAI / Bar Council / LinkedIn credentials).
              </p>
            </div>

            <div className="bg-bg border border-border p-[16px] rounded-xl text-[12px] font-bold text-muted w-full">
              Estimated approval time: <span className="text-primary font-mono">24 Hours</span>
            </div>

            <Button 
              variant="primary" 
              className="bg-accent hover:bg-accent-hover text-white rounded-lg h-[44px] px-8 font-bold w-full"
              asChild
            >
              <Link href="/expert/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        )}

      </div>

    </div>
  );
}
