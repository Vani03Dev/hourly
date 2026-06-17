import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExpertProfileInteractive } from "../../../components/experts/ExpertProfileInteractive";
import { createClient } from "../../../utils/supabase/server";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getExpertData(username: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("expert_profiles")
      .select("*")
      .eq("username", username)
      .single();
      
    if (!data) return null;

    return {
      id: data.id,
      name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || data.username,
      title: data.title,
      categories: data.tags || ["General Consultant"],
      availability: "any" as const,
      durations: [15, 30, 60] as (15 | 30 | 60)[],
      price: data.hourly_rate || 1000,
      rating: 5.0,
      reviewsCount: 0,
      initials: (data.first_name?.charAt(0) || data.username?.charAt(0) || "E").toUpperCase(),
      isVerified: true,
      company: "",
      memberSince: data.created_at ? new Date(data.created_at).getFullYear().toString() : "2026",
      bio: data.bio || "Verified Sessionly Expert available for B2B strategic consultation.",
      credentials: ["LinkedIn Verified", "Verified Account"],
      languages: ["English"],
      skills: data.tags || [],
      experience: [],
      certifications: [],
      avatarUrl: data.avatar_url || "",
    };
  } catch (e) {
    return null;
  }
}

// Generate Dynamic SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const expert = await getExpertData(resolvedParams.id);
  
  if (!expert) {
    return {
      title: "Expert Profile | Sessionly",
      description: "Book a paid session with a verified startup and corporate expert.",
    };
  }
  
  return {
    title: `${expert.name} | Sessionly Expert`,
    description: `Book a paid session with ${expert.name}, ${expert.title}. Verified credentials, instant scheduling.`,
  };
}

export default async function ExpertProfilePage({ params }: PageProps) {
  const resolvedParams = await params;
  const expert = await getExpertData(resolvedParams.id);

  if (!expert) {
    notFound();
  }

  return (
    <div className="bg-bg min-h-screen py-[40px]">
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[48px] lg:px-[96px] w-full">
        {/* Breadcrumbs */}
        <div className="text-[13px] text-muted font-semibold mb-[24px] flex gap-[8px] items-center">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/experts" className="hover:text-primary transition-colors">Browse Experts</Link>
          <span>/</span>
          <span className="text-primary truncate">{expert.name}</span>
        </div>

        {/* Interactive profile elements */}
        <ExpertProfileInteractive expert={expert} />
      </div>
    </div>
  );
}
