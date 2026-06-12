"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  hourlyRate: z.number().min(100, "Must be at least ₹100"),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export default function ExpertOnboardingPage() {
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
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

  return (
    <div className="min-h-screen bg-surface-DEFAULT flex flex-col font-sans selection:bg-teal-DEFAULT selection:text-white">
      {/* Header */}
      <header className="h-[80px] bg-white border-b border-border flex items-center px-6 md:px-12 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-[24px] font-bold text-navy-DEFAULT font-serif italic">Hourly.</span>
          <span className="bg-teal-DEFAULT/10 text-teal-DEFAULT px-2.5 py-1 rounded-[6px] text-[11px] font-bold uppercase tracking-wider">Expert Profile Setup</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 py-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-DEFAULT/5 rounded-full blur-[120px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[680px] bg-white rounded-3xl border border-border p-8 md:p-12 shadow-sm relative z-10"
        >
          <div className="mb-10 text-center">
            <h1 className="text-[32px] font-bold text-navy-DEFAULT mb-3 tracking-tight">Build your profile</h1>
            <p className="text-[16px] text-text-sub">Set up your expert details so clients can find and book you.</p>
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
              <label className="block text-[14px] font-semibold text-navy-DEFAULT mb-2">LinkedIn Profile URL <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                  <User className="w-5 h-5" />
                </div>
                <input 
                  type="url" 
                  {...register("linkedinUrl")}
                  className={`w-full h-[52px] pl-12 pr-4 rounded-[8px] border ${errors.linkedinUrl ? 'border-red-500 focus:ring-red-500/20' : 'border-border focus:border-teal-DEFAULT focus:ring-teal-DEFAULT/20'} outline-none transition-all text-[15px]`}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              {errors.linkedinUrl ? (
                <p className="text-red-500 text-[13px] mt-1.5">{errors.linkedinUrl.message}</p>
              ) : (
                <p className="text-text-muted text-[13px] mt-1.5">Required for background verification.</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* USERNAME */}
              <div>
                <label className="block text-[14px] font-semibold text-navy-DEFAULT mb-2">Public Username <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  {...register("username")}
                  className={`w-full h-[52px] px-4 rounded-[8px] border ${errors.username ? 'border-red-500 focus:ring-red-500/20' : 'border-border focus:border-teal-DEFAULT focus:ring-teal-DEFAULT/20'} outline-none transition-all text-[15px]`}
                  placeholder="e.g. prashant"
                />
                {errors.username && <p className="text-red-500 text-[13px] mt-1.5">{errors.username.message}</p>}
              </div>

              {/* RATE */}
              <div>
                <label className="block text-[14px] font-semibold text-navy-DEFAULT mb-2">Hourly Rate (₹) <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  {...register("hourlyRate", { valueAsNumber: true })}
                  className={`w-full h-[52px] px-4 rounded-[8px] border ${errors.hourlyRate ? 'border-red-500 focus:ring-red-500/20' : 'border-border focus:border-teal-DEFAULT focus:ring-teal-DEFAULT/20'} outline-none transition-all text-[15px]`}
                  placeholder="15000"
                  min="100"
                />
                {errors.hourlyRate && <p className="text-red-500 text-[13px] mt-1.5">{errors.hourlyRate.message}</p>}
              </div>
            </div>

            {/* TITLE */}
            <div>
              <label className="block text-[14px] font-semibold text-navy-DEFAULT mb-2">Professional Title <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                {...register("title")}
                className={`w-full h-[52px] px-4 rounded-[8px] border ${errors.title ? 'border-red-500 focus:ring-red-500/20' : 'border-border focus:border-teal-DEFAULT focus:ring-teal-DEFAULT/20'} outline-none transition-all text-[15px]`}
                placeholder="e.g. Staff Engineer at Stripe"
              />
              {errors.title && <p className="text-red-500 text-[13px] mt-1.5">{errors.title.message}</p>}
            </div>

            {/* BIO */}
            <div>
              <label className="block text-[14px] font-semibold text-navy-DEFAULT mb-2">About You (Bio) <span className="text-red-500">*</span></label>
              <textarea 
                {...register("bio")}
                className={`w-full p-4 rounded-[8px] border ${errors.bio ? 'border-red-500 focus:ring-red-500/20' : 'border-border focus:border-teal-DEFAULT focus:ring-teal-DEFAULT/20'} outline-none transition-all text-[15px] resize-none h-[120px]`}
                placeholder="Describe your experience, what you specialize in, and how you can help clients..."
              />
              {errors.bio && <p className="text-red-500 text-[13px] mt-1.5">{errors.bio.message}</p>}
            </div>

            {/* TAGS */}
            <div>
              <label className="block text-[14px] font-semibold text-navy-DEFAULT mb-2">Expertise Tags <span className="text-red-500">*</span></label>
              <input 
                name="tagInputHelper"
                type="text" 
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className={`w-full h-[52px] px-4 rounded-[8px] border border-border focus:border-teal-DEFAULT focus:ring-4 focus:ring-teal-DEFAULT/20 outline-none transition-all text-[15px] mb-3`}
                placeholder="Type a tag and press Enter"
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center gap-1.5 bg-surface-2 text-navy-DEFAULT px-3 py-1.5 rounded-md text-[13px] font-semibold border border-border"
                    >
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="text-text-muted hover:text-red-500">&times;</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-surface-2 border border-border rounded-xl p-4 flex items-start gap-3 mt-4">
              <Info className="w-5 h-5 text-text-muted shrink-0 mt-0.5" />
              <p className="text-[13px] text-text-sub font-medium leading-relaxed">
                Your profile will be reviewed by our team before going live. Make sure your LinkedIn is up to date.
              </p>
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
