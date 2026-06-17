"use client";

import React, { useState, useMemo, useEffect } from "react";
import { createClient } from "../../utils/supabase/client";
import Link from "next/link";
import {
  Search, ShieldCheck, HelpCircle, X, SlidersHorizontal,
  Star, Clock3, Calendar, Sparkles
} from "lucide-react";
import { Button } from "../ui/Button";
import { Slider, Avatar, Chip } from "@mui/material";
import { SHOW_RATINGS_AND_REVIEWS } from "@/lib/feature-flags";

const CATEGORIES = [
  "CA & Tax",
  "Startup Legal",
  "Tech & CTO",
  "Finance & CFO",
  "HR & People",
  "Sales & GTM",
  "Marketing",
  "Operations",
  "Leadership",
];

const POPULAR_TAGS = ["CA", "Lawyer", "CTO", "CFO", "Marketing"];

const SORT_OPTIONS = [
  { label: "Recommended", value: "recommended" },
  { label: "Price ↑", value: "price_asc" },
  { label: "Price ↓", value: "price_desc" },
  ...(SHOW_RATINGS_AND_REVIEWS ? [{ label: "Top Rated", value: "rating" }] : []),
];

interface Expert {
  id: string;
  name: string;
  title: string;
  categories: string[];
  availability: "today" | "week" | "any";
  durations: (15 | 30 | 60)[];
  price: number;
  rating: number;
  reviewsCount: number;
  initials: string;
  isVerified: boolean;
}

function FilterSection({
  title,
  children,
  badge,
}: {
  title: string;
  children: React.ReactNode;
  badge?: number;
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-border pt-4 first:border-t-0 first:pt-0">
      <div className="flex items-center justify-between">
        <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider">{title}</h4>
        {badge !== undefined && badge > 0 && (
          <span className="text-[10px] font-bold bg-teal-50 text-teal px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function PillButton({
  active,
  onClick,
  children,
  className = "",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[10px] border text-[12.5px] font-semibold transition-all duration-200 outline-none focus:outline-none focus-visible:outline-none ${
        active
          ? "border-teal bg-teal-50 text-teal shadow-sm"
          : "border-border text-muted bg-white hover:border-teal/30 hover:text-primary hover:bg-gray-50"
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function BrowseExperts() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string>("any");
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [priceLimit, setPriceLimit] = useState<number>(10000);
  const [selectedRating, setSelectedRating] = useState<string>("any");
  const [sortBy, setSortBy] = useState<string>("recommended");

  useEffect(() => {
    async function fetchExperts() {
      const supabase = createClient();
      const { data } = await supabase
        .from("expert_profiles")
        .select("*")
        .eq("is_onboarded", true);

      if (data) {
        const formatted = data.map((exp: any) => ({
          id: exp.username || exp.id,
          name: `${exp.first_name || ""} ${exp.last_name || ""}`.trim() || exp.username,
          title: exp.title || "Expert Advisor",
          categories: exp.tags || [],
          availability: "any" as const,
          durations: [15, 30, 60] as (15 | 30 | 60)[],
          price: exp.hourly_rate || 1000,
          rating: 5.0,
          reviewsCount: 0,
          initials: (exp.first_name?.charAt(0) || exp.username?.charAt(0) || "E").toUpperCase(),
          isVerified: true,
        }));
        setExperts(formatted);
      }
      setLoading(false);
    }
    fetchExperts();
  }, []);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedAvailability("any");
    setSelectedDuration(null);
    setPriceLimit(10000);
    setSelectedRating("any");
    setSortBy("recommended");
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (selectedCategories.length) count += selectedCategories.length;
    if (selectedAvailability !== "any") count++;
    if (selectedDuration !== null) count++;
    if (priceLimit < 10000) count++;
    if (selectedRating !== "any") count++;
    return count;
  }, [searchQuery, selectedCategories, selectedAvailability, selectedDuration, priceLimit, selectedRating]);

  const activeFilterChips = useMemo(() => {
    const chips: { label: string; onRemove: () => void }[] = [];
    if (searchQuery.trim()) {
      chips.push({ label: `"${searchQuery}"`, onRemove: () => setSearchQuery("") });
    }
    selectedCategories.forEach((cat) => {
      chips.push({ label: cat, onRemove: () => handleCategoryToggle(cat) });
    });
    if (selectedAvailability !== "any") {
      const label = selectedAvailability === "today" ? "Today" : "This Week";
      chips.push({ label, onRemove: () => setSelectedAvailability("any") });
    }
    if (selectedDuration !== null) {
      chips.push({ label: `${selectedDuration} min`, onRemove: () => setSelectedDuration(null) });
    }
    if (priceLimit < 10000) {
      chips.push({ label: `≤ ₹${priceLimit.toLocaleString("en-IN")}`, onRemove: () => setPriceLimit(10000) });
    }
    if (selectedRating !== "any") {
      chips.push({ label: `${selectedRating}★+`, onRemove: () => setSelectedRating("any") });
    }
    return chips;
  }, [searchQuery, selectedCategories, selectedAvailability, selectedDuration, priceLimit, selectedRating]);

  const filteredExperts = useMemo(() => {
    return experts.filter((expert) => {
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesName = expert.name.toLowerCase().includes(query);
        const matchesTitle = expert.title.toLowerCase().includes(query);
        const matchesCat = expert.categories.some((c) => c.toLowerCase().includes(query));
        if (!matchesName && !matchesTitle && !matchesCat) return false;
      }

      if (selectedCategories.length > 0) {
        const hasMatch = expert.categories.some((c) => selectedCategories.includes(c));
        if (!hasMatch) return false;
      }

      if (selectedAvailability !== "any") {
        if (selectedAvailability === "today" && expert.availability !== "today") return false;
        if (selectedAvailability === "week" && expert.availability === "any") return false;
      }

      if (selectedDuration !== null) {
        if (!expert.durations.includes(selectedDuration as 15 | 30 | 60)) return false;
      }

      if (expert.price > priceLimit) return false;

      if (selectedRating !== "any") {
        const minRating = parseFloat(selectedRating);
        if (expert.rating < minRating) return false;
      }

      return true;
    });
  }, [experts, searchQuery, selectedCategories, selectedAvailability, selectedDuration, priceLimit, selectedRating]);

  const sortedExperts = useMemo(() => {
    const list = [...filteredExperts];
    if (sortBy === "price_asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price_desc") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [filteredExperts, sortBy]);

  const filterPanel = (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between lg:hidden">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-teal" />
          <span className="text-[16px] font-bold text-primary">Filters</span>
          {activeFilterCount > 0 && (
            <span className="text-[11px] font-bold bg-teal text-white px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(false)}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          <X size={18} />
        </button>
      </div>

      <FilterSection title="Search">
        <div className="flex items-center h-[48px] border border-border rounded-[10px] bg-gray-50 focus-within:bg-white focus-within:border-teal transition-all">
          <Search size={16} className="ml-3.5 shrink-0 text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Name, skill, or domain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-plain flex-1 min-w-0 h-full pl-2 pr-2 border-0 bg-transparent text-[14px] text-primary placeholder:text-muted outline-none ring-0 shadow-none focus:outline-none focus:ring-0"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mr-3 shrink-0 text-muted hover:text-primary"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {POPULAR_TAGS.map((tag) => (
            <PillButton
              key={tag}
              active={searchQuery.toLowerCase() === tag.toLowerCase()}
              onClick={() => setSearchQuery(searchQuery.toLowerCase() === tag.toLowerCase() ? "" : tag)}
              className="px-3 py-1.5 text-[11px]"
            >
              {tag}
            </PillButton>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Category" badge={selectedCategories.length}>
        <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto pr-1">
          {CATEGORIES.map((cat) => (
            <PillButton
              key={cat}
              active={selectedCategories.includes(cat)}
              onClick={() => handleCategoryToggle(cat)}
              className="px-3 py-2 text-[12px]"
            >
              {cat}
            </PillButton>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Availability">
        <div className="grid grid-cols-3 gap-2 p-1 bg-gray-50 rounded-[12px] border border-border">
          {[
            { label: "Today", value: "today", icon: Sparkles },
            { label: "This Week", value: "week", icon: Calendar },
            { label: "Any", value: "any", icon: Clock3 },
          ].map((option) => {
            const isSelected = selectedAvailability === option.value;
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelectedAvailability(option.value)}
                className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-[10px] text-[11px] font-bold transition-all outline-none focus:outline-none focus-visible:outline-none ${
                  isSelected
                    ? "bg-white text-teal shadow-sm"
                    : "text-muted hover:text-primary"
                }`}
              >
                <Icon size={14} />
                {option.label}
              </button>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection title="Session Length">
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "15m", value: 15 },
            { label: "30m", value: 30 },
            { label: "60m", value: 60 },
            { label: "Any", value: null },
          ].map((option) => (
            <PillButton
              key={String(option.value)}
              active={selectedDuration === option.value}
              onClick={() => setSelectedDuration(option.value)}
              className="h-10"
            >
              {option.label}
            </PillButton>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Max Price">
        <div className="p-4 rounded-[12px] bg-teal-50/40 border border-teal/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-semibold text-muted">Up to</span>
            <span className="text-[18px] font-bold text-teal font-mono">
              ₹{priceLimit.toLocaleString("en-IN")}
            </span>
          </div>
          <Slider
            value={priceLimit}
            min={500}
            max={10000}
            step={500}
            onChange={(_, val) => setPriceLimit(val as number)}
            sx={{
              color: "#2563EB",
              height: 6,
              padding: "12px 0",
              "& .MuiSlider-thumb": {
                width: 18,
                height: 18,
                backgroundColor: "#fff",
                border: "2px solid #2563EB",
                boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
                "&:hover, &.Mui-focusVisible": {
                  boxShadow: "0 0 0 8px rgba(37, 99, 235, 0.12)",
                },
              },
              "& .MuiSlider-track": { height: 6, borderRadius: 3 },
              "& .MuiSlider-rail": { color: "#E5E7EB", opacity: 1, height: 6, borderRadius: 3 },
            }}
          />
          <div className="flex justify-between text-[10px] text-muted font-bold mt-1">
            <span>₹500</span>
            <span>₹10,000</span>
          </div>
        </div>
      </FilterSection>

      {SHOW_RATINGS_AND_REVIEWS && (
      <FilterSection title="Rating">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "4.0+", value: "4.0" },
            { label: "4.5+", value: "4.5" },
            { label: "Any", value: "any" },
          ].map((option) => (
            <PillButton
              key={option.value}
              active={selectedRating === option.value}
              onClick={() => setSelectedRating(option.value)}
              className="h-10 flex items-center justify-center gap-1"
            >
              {option.value !== "any" && <Star size={12} className={selectedRating === option.value ? "fill-teal text-teal" : ""} />}
              {option.label}
            </PillButton>
          ))}
        </div>
      </FilterSection>
      )}

      <Button
        variant="outline"
        className="w-full h-[48px] rounded-[10px] font-bold"
        onClick={handleClearFilters}
        disabled={activeFilterCount === 0}
      >
        Reset all filters
      </Button>
    </div>
  );


  return (
    <div className="max-w-[1440px] mx-auto w-full flex flex-col lg:flex-row px-5 md:px-12 lg:px-24 py-10 gap-8 items-start">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-[280px] bg-white border border-border rounded-[16px] p-6 sticky top-[88px] shrink-0 shadow-sm">
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-border">
          <SlidersHorizontal size={18} className="text-teal" />
          <span className="text-[15px] font-bold text-primary">Filters</span>
          {activeFilterCount > 0 && (
            <span className="ml-auto text-[11px] font-bold bg-teal-50 text-teal px-2.5 py-1 rounded-full">
              {activeFilterCount} active
            </span>
          )}
        </div>
        {filterPanel}
      </aside>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-[70] flex">
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
          <aside className="relative ml-auto w-full max-w-[340px] h-full bg-white shadow-xl overflow-y-auto p-6 animate-page-enter">
            {filterPanel}
          </aside>
        </div>
      )}

      <main className="flex-1 w-full flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="border border-border bg-white p-4 rounded-[16px] mb-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 h-10 px-4 rounded-[10px] border border-border bg-gray-50 text-[13px] font-bold text-primary hover:border-teal/30 transition-colors"
              >
                <SlidersHorizontal size={16} className="text-teal" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-teal text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <span className="text-[15px] font-bold text-primary">
                {sortedExperts.length} expert{sortedExperts.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
              <span className="text-[11px] font-bold text-muted uppercase tracking-wider shrink-0">Sort</span>
              <div className="flex flex-wrap gap-1.5 p-1 bg-gray-50 rounded-[12px] border border-border">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSortBy(opt.value)}
                    className={`px-3 py-1.5 rounded-[8px] text-[12px] font-bold transition-all outline-none focus:outline-none focus-visible:outline-none ${
                      sortBy === opt.value
                        ? "bg-white text-teal shadow-sm"
                        : "text-muted hover:text-primary"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {activeFilterChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border">
              <span className="text-[11px] font-bold text-muted uppercase tracking-wider mr-1">Active</span>
              {activeFilterChips.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={chip.onRemove}
                  className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-teal-50 text-teal text-[12px] font-semibold border border-teal/20 hover:bg-teal/10 transition-colors"
                >
                  {chip.label}
                  <X size={12} />
                </button>
              ))}
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-[12px] font-bold text-muted hover:text-primary ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white border border-border rounded-[16px] p-6 h-[260px] flex flex-col justify-between animate-pulse">
                <div>
                  <div className="flex gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200" />
                    <div className="flex flex-col gap-2 pt-1 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-5 bg-gray-100 rounded w-16" />
                    <div className="h-5 bg-gray-100 rounded w-20" />
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex justify-between items-baseline mb-4">
                    <div className="h-3 bg-gray-100 rounded w-24" />
                    <div className="h-5 bg-gray-200 rounded w-16" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-10 bg-gray-100 rounded-[10px]" />
                    <div className="h-10 bg-gray-200 rounded-[10px]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedExperts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {sortedExperts.map((exp) => (
              <div
                key={exp.id}
                className="bg-white border border-border rounded-[16px] p-6 flex flex-col justify-between shadow-premium relative hover:border-teal/40 hover:-translate-y-[4px] hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute top-5 right-5 flex flex-col items-end gap-1.5 z-10">
                  <Chip
                    icon={<ShieldCheck size={12} className="text-teal" />}
                    label="Verified"
                    size="small"
                    sx={{
                      bgcolor: "#EFF6FF",
                      color: "#2563EB",
                      fontWeight: "bold",
                      fontSize: "10px",
                      height: "22px",
                      border: "none",
                      "& .MuiChip-icon": { marginLeft: "6px", marginRight: "-4px" },
                    }}
                  />
                  <Chip
                    label={exp.availability === "today" ? "Today" : "This Week"}
                    size="small"
                    sx={{
                      bgcolor: "#ECFDF5",
                      color: "#16A34A",
                      fontWeight: "bold",
                      fontSize: "10px",
                      height: "22px",
                    }}
                  />
                </div>

                <div>
                  <div className="flex gap-4 mb-4">
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: "#111827",
                        color: "#fff",
                        fontSize: "16px",
                        fontWeight: "bold",
                        border: "1px solid #E5E7EB",
                      }}
                    >
                      {exp.initials}
                    </Avatar>
                    <div className="flex flex-col pr-16">
                      <h3 className="text-[16px] font-bold text-primary line-clamp-1">{exp.name}</h3>
                      <p className="text-[12px] text-muted font-semibold mt-0.5 line-clamp-2 min-h-[32px]">{exp.title}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {exp.categories.slice(0, 2).map((cat, i) => (
                      <Chip
                        key={i}
                        label={cat}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: "#E5E7EB",
                          color: "#6B7280",
                          fontSize: "10px",
                          fontWeight: 600,
                          height: "22px",
                        }}
                      />
                    ))}
                  </div>

                  {SHOW_RATINGS_AND_REVIEWS && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-semibold text-primary">{exp.rating}</span>
                    <span className="text-muted text-[12px]">({exp.reviewsCount})</span>
                  </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex justify-between items-baseline mb-4">
                    <span className="text-[12px] text-muted font-semibold">Price per session</span>
                    <span className="text-[18px] font-bold text-primary font-mono">₹{exp.price}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="h-[48px] rounded-[10px] text-[13px] font-semibold" asChild>
                      <Link href={`/experts/${exp.id}`}>Profile</Link>
                    </Button>
                    <Button variant="primary" className="h-[48px] rounded-[10px] text-[13px] font-bold" asChild>
                      <Link href={`/book/${exp.id}`}>Book</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-border bg-white rounded-[16px] p-16 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-gray-50 border border-border flex items-center justify-center mb-4">
              <HelpCircle className="w-8 h-8 text-muted" />
            </div>
            <h3 className="text-[18px] font-bold text-primary mb-1">No experts matched your filters</h3>
            <p className="text-[14px] text-muted max-w-sm mb-6">
              Try removing a category, widening your budget, or clearing your search.
            </p>
            <Button variant="primary" onClick={handleClearFilters}>
              Reset All Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
