"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import { Toast } from "../../../utils/toast";
import { Button } from "../../../components/ui/Button";
import { ArrowRight, Info, User } from "lucide-react";

const onboardingSchema = z.object({
  linkedinUrl: z.string().url("Please enter a valid LinkedIn URL").includes("linkedin.com", { message: "Must be a LinkedIn URL" }),
  username: z.string()
    .min(3, "Must be at least 3 characters")
    .max(30, "Must be less than 30 characters")
    .regex(/^[a-zA-Z0-9-]+$/, "Only letters, numbers, and hyphens"),
  title: z.string().min(5, "e.g., Senior Software Engineer"),
  bio: z.string().min(20, "Please write at least 20 characters"),
  hourlyRate: z.number({ 
    message: "Please enter a valid rate (min ₹100)"
  }).min(100, "Must be at least ₹100"),
  isAnonymous: z.boolean(),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export default function ExpertOnboardingPage() {
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isFetchingLinkedIn, setIsFetchingLinkedIn] = useState(false);
  const [linkedinData, setLinkedinData] = useState<any>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
  });

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/,/g, '');
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = async (data: OnboardingFormValues) => {
    if (tags.length === 0) {
      Toast.error("Please add at least one expertise tag.");
      return;
    }
    
    try {
      const { submitExpertOnboarding } = await import('@/app/actions/expert');
      
      const formData = new FormData();
      formData.append('linkedinUrl', data.linkedinUrl);
      formData.append('username', data.username.toLowerCase());
      formData.append('title', data.title);
      formData.append('bio', data.bio);
      formData.append('hourlyRate', data.hourlyRate.toString());
      formData.append('tags', JSON.stringify(tags));
      formData.append('isAnonymous', data.isAnonymous ? 'true' : 'false');
      if (linkedinData) {
        formData.append('linkedinData', JSON.stringify(linkedinData));
      }
      
      const response = await submitExpertOnboarding(formData);
      
      if (response && response.error) {
        Toast.error(response.error);
      } else {
        Toast.success('Profile submitted for verification!');
        window.location.href = '/expert/dashboard';
      }
    } catch (error) {
      Toast.error('An unexpected error occurred.');
    }
  };

  const handleFetchLinkedIn = async () => {
    const url = control._formValues.linkedinUrl;
    if (!url || !url.includes('linkedin.com')) {
      Toast.error("Please enter a valid LinkedIn URL first.");
      return;
    }
    
    setIsFetchingLinkedIn(true);
    try {
      const res = await fetch('/api/linkedin/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch');
      
      setLinkedinData(data);
      Toast.success("Profile data fetched successfully!");
    } catch (error: any) {
      Toast.error(error.message || "Failed to fetch LinkedIn data");
    } finally {
      setIsFetchingLinkedIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans selection:bg-teal selection:text-white">


      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 py-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal/5 rounded-full blur-[120px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[680px] bg-white rounded-3xl border border-border p-8 md:p-12 shadow-sm relative z-10"
        >
          <div className="mb-10 text-center">
            <h1 className="text-[32px] font-bold text-navy mb-3 tracking-tight">Build your profile</h1>
            <p className="text-[16px] text-muted">Set up your expert details so clients can find and book you.</p>
          </div>

          <form onSubmit={(e) => {
            // Prevent enter key from submitting form when typing tags
            const activeElement = document.activeElement as HTMLElement;
            if (activeElement && activeElement.getAttribute('name') === 'tagInputHelper') {
              e.preventDefault();
              return;
            }
            handleSubmit(onSubmit)(e);
          }} className="space-y-6">
            
            {/* LINKEDIN */}
            <div>
              <label className="block text-[14px] font-semibold text-navy mb-2">LinkedIn Profile URL <span className="text-red-500">*</span></label>
              <div className="flex gap-3">
                <input 
                  type="url" 
                  {...register("linkedinUrl")}
                  className={`flex-1 h-[52px] px-4 rounded-[8px] border ${errors.linkedinUrl ? 'border-red-500 focus:ring-red-500/20' : 'border-border focus:border-teal focus:ring-teal/20'} outline-none transition-all text-[15px]`}
                  placeholder="https://linkedin.com/in/username"
                />
                <Button 
                  type="button" 
                  onClick={handleFetchLinkedIn} 
                  disabled={isFetchingLinkedIn}
                  className="h-[52px] px-6 whitespace-nowrap bg-navy hover:bg-navy/90"
                >
                  {isFetchingLinkedIn ? 'Fetching...' : 'Fetch Data'}
                </Button>
              </div>
              
              {errors.linkedinUrl ? (
                <p className="text-red-500 text-[13px] mt-1.5">{errors.linkedinUrl.message}</p>
              ) : (
                <p className="text-muted text-[13px] mt-1.5">Required to fetch your education and experience.</p>
              )}

              {/* MOCK DATA PREVIEW */}
              {linkedinData && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  className="mt-4 bg-teal/5 border border-teal/20 rounded-xl p-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-teal/20 rounded-full flex items-center justify-center font-bold text-teal">
                      {linkedinData.full_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-navy text-[14px]">{linkedinData.full_name}</p>
                      <p className="text-[12px] text-muted">{linkedinData.headline}</p>
                    </div>
                  </div>
                  <div className="text-[13px] text-navy">
                    <p className="font-semibold mb-1">Extracted Experience:</p>
                    <ul className="list-disc pl-5 space-y-1 text-muted">
                      {linkedinData.experiences?.map((exp: any, i: number) => (
                        <li key={i}>{exp.title} at {exp.company}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* USERNAME */}
              <div>
                <label className="block text-[14px] font-semibold text-navy mb-2">Public Username <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  {...register("username")}
                  className={`w-full h-[52px] px-4 rounded-[8px] border ${errors.username ? 'border-red-500 focus:ring-red-500/20' : 'border-border focus:border-teal focus:ring-teal/20'} outline-none transition-all text-[15px]`}
                  placeholder="e.g. prashant"
                />
                {errors.username && <p className="text-red-500 text-[13px] mt-1.5">{errors.username.message}</p>}
              </div>

              {/* RATE */}
              <div>
                <label className="block text-[14px] font-semibold text-navy mb-2">Hourly Rate (₹) <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  {...register("hourlyRate", { valueAsNumber: true })}
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                      e.preventDefault();
                    }
                  }}
                  className={`w-full h-[52px] px-4 rounded-[8px] border ${errors.hourlyRate ? 'border-red-500 focus:ring-red-500/20' : 'border-border focus:border-teal focus:ring-teal/20'} outline-none transition-all text-[15px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                  placeholder="15000"
                  min="100"
                />
                {errors.hourlyRate && <p className="text-red-500 text-[13px] mt-1.5">{errors.hourlyRate.message}</p>}
              </div>
            </div>

            {/* TITLE */}
            <div>
              <label className="block text-[14px] font-semibold text-navy mb-2">Professional Title <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                {...register("title")}
                className={`w-full h-[52px] px-4 rounded-[8px] border ${errors.title ? 'border-red-500 focus:ring-red-500/20' : 'border-border focus:border-teal focus:ring-teal/20'} outline-none transition-all text-[15px]`}
                placeholder="e.g. Staff Engineer at Stripe"
              />
              {errors.title && <p className="text-red-500 text-[13px] mt-1.5">{errors.title.message}</p>}
            </div>

            {/* BIO */}
            <div>
              <label className="block text-[14px] font-semibold text-navy mb-2">About You (Bio) <span className="text-red-500">*</span></label>
              <div className={`bg-white rounded-[8px] overflow-hidden border ${errors.bio ? 'border-red-500' : 'border-border focus-within:border-teal focus-within:ring-1 focus-within:ring-teal/20'} transition-all`}>
                <Controller
                  name="bio"
                  control={control}
                  render={({ field }) => (
                    <ReactQuill
                      theme="snow"
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder="Describe your experience, what you specialize in, and how you can help clients..."
                      className="h-[150px] pb-[42px]"
                    />
                  )}
                />
              </div>
              {errors.bio && <p className="text-red-500 text-[13px] mt-1.5">{errors.bio.message}</p>}
            </div>

            {/* TAGS */}
            <div>
              <label className="block text-[14px] font-semibold text-navy mb-2">Expertise Tags <span className="text-red-500">*</span></label>
              <input 
                name="tagInputHelper"
                type="text" 
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className={`w-full h-[52px] px-4 rounded-[8px] border border-border focus:border-teal focus:ring-4 focus:ring-teal/20 outline-none transition-all text-[15px] mb-3`}
                placeholder="Type a tag and press Enter"
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center gap-1.5 bg-gray-50 text-navy px-3 py-1.5 rounded-md text-[13px] font-semibold border border-border"
                    >
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="text-muted hover:text-red-500">&times;</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gray-50 border border-border rounded-xl p-4 flex items-start gap-3 mt-4">
              <Info className="w-5 h-5 text-muted shrink-0 mt-0.5" />
              <p className="text-[13px] text-muted font-medium leading-relaxed">
                Your profile will be reviewed by our team before going live.
              </p>
            </div>

            {/* ANONYMOUS MODE TOGGLE */}
            <div className="border border-border rounded-xl p-5 flex items-center justify-between mt-4">
              <div>
                <p className="font-bold text-navy text-[15px]">Anonymous Mode</p>
                <p className="text-[13px] text-muted mt-0.5 max-w-[400px]">
                  Hide your real name and profile picture from the public marketplace. Clients will only see your verified experience and credentials.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input type="checkbox" className="sr-only peer" {...register("isAnonymous")} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal"></div>
              </label>
            </div>

            <Button type="submit" size="lg" className="w-full h-[56px] mt-8 text-[16px] group" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Profile'} 
              {!isSubmitting && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
