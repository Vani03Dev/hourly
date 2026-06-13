"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Check, Users, ShieldCheck, Plus, X } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import toast from "react-hot-toast";

const CATEGORIES = [
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

export default function BusinessOnboarding() {
  const router = useRouter();

  // Wizard Step: 1, 2, 3
  const [step, setStep] = useState(1);

  // Step 1 States
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [teamSize, setTeamSize] = useState("1-10");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 2 States
  const [neededExpertise, setNeededExpertise] = useState<string[]>([]);

  // Step 3 States
  const [emails, setEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNextStep1 = () => {
    const errs: Record<string, string> = {};
    if (!companyName.trim()) errs.companyName = "Company name is required";
    if (!industry.trim()) errs.industry = "Industry is required";

    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setStep(2);
    }
  };

  const handleCategoryToggle = (cat: string) => {
    setNeededExpertise(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleAddEmail = () => {
    if (currentEmail.trim() !== "" && currentEmail.includes("@")) {
      setEmails([...emails, currentEmail.trim()]);
      setCurrentEmail("");
    }
  };

  const handleRemoveEmail = (email: string) => {
    setEmails(emails.filter(e => e !== email));
  };

  const handleFinishOnboarding = async () => {
    setIsSubmitting(true);
    // Simulate updating Supabase profile
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Workspace setup completed!");
      router.push("/dashboard/business");
    }, 1200);
  };

  return (
    <div className="bg-bg min-h-[calc(100vh-64px)] flex items-center justify-center px-[20px] py-[40px] font-sans">
      
      {/* WIZARD CONTAINER */}
      <div className="bg-white border border-border rounded-xl p-[32px] w-full max-w-[500px] shadow-sm flex flex-col gap-[24px]">
        
        {/* PROGRESS DOTS */}
        <div className="flex gap-[8px] justify-center">
          {[1, 2, 3].map(s => (
            <div 
              key={s} 
              className={`h-[4px] rounded-full transition-all duration-300 ${
                step >= s ? "w-[24px] bg-accent" : "w-[12px] bg-border"
              }`}
            />
          ))}
        </div>

        {/* STEP 1: COMPANY INFO */}
        {step === 1 && (
          <div className="flex flex-col gap-[20px] animate-page-enter">
            <div className="text-center">
              <h2 className="text-[20px] font-bold text-primary">Tell us about your company</h2>
              <p className="text-[12px] text-muted mt-[4px]">Help us customize your workspace experience.</p>
            </div>

            <Input 
              label="Company Name"
              type="text"
              placeholder="e.g. Acme Corp"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              error={errors.companyName}
              className="h-[40px]"
            />

            <Input 
              label="Industry"
              type="text"
              placeholder="e.g. SaaS, Fintech, Web3"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              error={errors.industry}
              className="h-[40px]"
            />

            <div className="flex flex-col gap-[6px]">
              <label className="text-[11px] font-bold text-muted uppercase tracking-wider">Team Size</label>
              <select
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                className="h-[40px] px-[12px] border border-border rounded-lg text-[13.5px] text-primary font-semibold bg-white outline-none focus:border-accent"
              >
                <option value="1-10">1 - 10 members</option>
                <option value="11-50">11 - 50 members</option>
                <option value="51-200">51 - 200 members</option>
                <option value="200+">200+ members</option>
              </select>
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

        {/* STEP 2: WHAT EXPERTISE NEEDED */}
        {step === 2 && (
          <div className="flex flex-col gap-[20px] animate-page-enter">
            <div className="text-center">
              <h2 className="text-[20px] font-bold text-primary">What expertise do you need most?</h2>
              <p className="text-[12px] text-muted mt-[4px]">Select one or more categories below (you can change this anytime).</p>
            </div>

            {/* 3x3 category grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-[8px]">
              {CATEGORIES.map(cat => {
                const isSelected = neededExpertise.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryToggle(cat)}
                    className={`h-[48px] px-[8px] rounded-lg border text-[12px] font-bold transition-all text-center flex items-center justify-center leading-tight ${
                      isSelected 
                        ? "border-accent bg-blue-50/50 text-accent" 
                        : "border-border text-primary hover:bg-bg bg-white"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
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
                onClick={() => setStep(3)}
                disabled={neededExpertise.length === 0}
              >
                Continue &rarr;
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: INVITE TEAMMATES */}
        {step === 3 && (
          <div className="flex flex-col gap-[20px] animate-page-enter">
            <div className="text-center">
              <h2 className="text-[20px] font-bold text-primary">Invite your team (optional)</h2>
              <p className="text-[12px] text-muted mt-[4px]">Collaborate on shared corporate credits under a unified GSTIN.</p>
            </div>

            <div className="flex gap-[8px]">
              <input
                type="email"
                placeholder="colleague@company.com"
                value={currentEmail}
                onChange={(e) => setCurrentEmail(e.target.value)}
                className="flex-grow px-[12px] h-[40px] border border-border text-[13px] rounded-lg focus:outline-none focus:border-accent"
              />
              <Button 
                variant="outline" 
                className="border-border text-primary h-[40px] px-[16px] rounded-lg font-bold shrink-0 flex items-center gap-[4px]"
                onClick={handleAddEmail}
              >
                <Plus className="w-[16px] h-[16px]" /> Add
              </Button>
            </div>

            {/* List of emails */}
            {emails.length > 0 && (
              <div className="flex flex-col gap-[8px] bg-bg p-[12px] border border-border rounded-lg max-h-[120px] overflow-y-auto pr-[4px]">
                {emails.map(email => (
                  <div key={email} className="flex justify-between items-center text-[12px] font-semibold text-primary">
                    <span className="truncate">{email}</span>
                    <button onClick={() => handleRemoveEmail(email)} className="text-muted hover:text-primary">
                      <X className="w-[14px] h-[14px]" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-[12px] mt-[8px]">
              <Button 
                variant="primary" 
                className="bg-accent hover:bg-accent-hover text-white rounded-lg h-[44px] font-bold w-full flex items-center justify-center gap-[8px]"
                onClick={handleFinishOnboarding}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Finish Setup"}
              </Button>
              
              <button 
                type="button" 
                onClick={handleFinishOnboarding}
                className="text-[13px] font-semibold text-muted hover:text-primary transition-colors text-center w-full block"
              >
                Skip for now
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
