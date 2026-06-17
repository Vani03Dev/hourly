import React from "react";
import { createClient } from "../utils/supabase/server";
import { HomeHero } from "../components/home/HomeHero";
import { HomeStatsBar } from "../components/home/HomeStatsBar";
import { HomeHowItWorks } from "../components/home/HomeHowItWorks";
import { HomeFeaturedExperts } from "../components/home/HomeFeaturedExperts";

import { CategoryExplorer } from "../components/home/CategoryExplorer";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let role = user?.user_metadata?.role;
  if (user && role !== "expert") {
    const { data: eProfile } = await supabase
      .from("expert_profiles")
      .select("id")
      .eq("id", user.id)
      .single();
    if (eProfile) {
      role = "expert";
    }
  }

  const { data: dbExperts } = await supabase
    .from("expert_profiles")
    .select("*")
    .eq("is_onboarded", true)
    .limit(4);

  const featuredExperts = dbExperts
    ? dbExperts.map((exp: any) => ({
        id: exp.username || exp.id,
        name: `${exp.first_name || ""} ${exp.last_name || ""}`.trim() || exp.username,
        title: exp.title || "Expert Advisor",
        domain: exp.tags?.[0] || "Consulting",
        rating: 5.0,
        sessions: 0,
        price: exp.hourly_rate || 1000,
        availableToday: true,
        initials: (exp.first_name?.charAt(0) || exp.username?.charAt(0) || "E").toUpperCase(),
      }))
    : [];

  return (
    <div className="w-full bg-bg min-h-screen flex flex-col font-sans overflow-x-hidden">
      <HomeHero isLoggedIn={!!user} role={role} />
      <HomeStatsBar />

      <CategoryExplorer />
      <HomeHowItWorks />
      <HomeFeaturedExperts experts={featuredExperts} />
    </div>
  );
}
