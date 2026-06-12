"use client";

import React, { useState, useEffect } from "react";
import { Search, Sparkles, ChevronDown, SearchX } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { ExpertCard } from "../../components/shared/ExpertCard";
import { createClient } from "../../utils/supabase/client";

export default function SearchPage() {
  const [aiMatch, setAiMatch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  const [experts, setExperts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExperts() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('expert_profiles')
        .select('*')
        .eq('is_onboarded', true);
        
      if (data) {
        // Map DB data to match ExpertCard props
        const formatted = data.map(e => ({
          id: e.username || e.id,
          name: `${e.first_name || ''} ${e.last_name || ''}`.trim() || e.username || 'Expert',
          title: e.title,
          location: 'Global',
          isVerified: true,
          specializations: e.tags || [],
          price: e.hourly_rate || 5000,
          usdPrice: Math.round((e.hourly_rate || 5000) / 83),
          avatarUrl: e.avatar_url,
          rating: 5.0,
          sessionCount: 0
        }));
        setExperts(formatted);
      }
      setLoading(false);
    }
    fetchExperts();
  }, []);

  const handleSearch = () => {
    if (aiMatch && searchValue) {
      setIsSearching(true);
      setTimeout(() => {
        setIsSearching(false);
      }, 1500);
    }
  };

  const filteredExperts = experts.filter((expert) => {
    if (!searchValue) return true;
    const term = searchValue.toLowerCase();
    return (
      expert.name.toLowerCase().includes(term) ||
      (expert.title && expert.title.toLowerCase().includes(term)) ||
      (expert.specializations && expert.specializations.some((tag: string) => tag.toLowerCase().includes(term)))
    );
  });

  return (
    <div className="min-h-screen bg-surface-DEFAULT flex flex-col">
      {/* SEARCH BAR STRIP */}
      <div className="bg-white p-6 border-b border-border shadow-xs sticky top-[64px] z-40">
        <div className="max-w-[1280px] mx-auto flex flex-col">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-text-muted" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Describe your problem — e.g. 'Scale PostgreSQL for 10M users' or 'AWS cost optimisation for Series B startup'"
                className="w-full h-[56px] pl-[44px] pr-[120px] rounded-[6px] border border-border text-[16px] focus:outline-none focus:border-teal-DEFAULT focus:ring-2 focus:ring-teal-DEFAULT/15"
              />
              <button 
                onClick={() => setAiMatch(!aiMatch)}
                className={`absolute right-2 top-1/2 -translate-y-1/2 h-[40px] px-3 rounded-[6px] text-[14px] font-semibold flex items-center gap-1 transition-colors ${aiMatch ? 'bg-teal-DEFAULT text-white' : 'bg-surface-2 text-text-sub'}`}
              >
                {aiMatch ? <><Sparkles className="w-4 h-4" /> AI On</> : "AI Off"}
              </button>
            </div>
            <Button size="lg" variant="primary" onClick={handleSearch} className="w-[120px]">
              Search
            </Button>
          </div>

          {isSearching && (
            <div className="mt-4 bg-teal-bg text-teal-DEFAULT p-3 rounded-[6px] flex items-center gap-2 animate-pulse">
              <Sparkles className="w-4 h-4" /> Analyzing requirement...
            </div>
          )}

          {!isSearching && aiMatch && searchValue && (
            <div className="mt-4 bg-teal-bg text-teal-DEFAULT p-3 rounded-[6px] flex items-center gap-2 animate-fade-in-up">
              <Sparkles className="w-4 h-4" /> {filteredExperts.length} experts matched to your exact problem
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-4">
            {["All", "Engineering", "Finance", "Legal", "Cloud", "Product", "Growth", "Data"].map(cat => (
              <button 
                key={cat} 
                className={`px-4 py-2 rounded-[6px] text-[14px] font-medium transition-colors ${cat === 'All' ? 'bg-teal-DEFAULT text-white' : 'border border-border text-text-body hover:border-text-muted'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT SPLIT */}
      <div className="max-w-[1280px] mx-auto w-full flex flex-1">
        {/* LEFT SIDEBAR */}
        <div className="w-[280px] shrink-0 bg-white shadow-sm border-r border-border p-6 hidden md:block h-[calc(100vh-180px)] overflow-y-auto sticky top-[180px]">
          <div className="flex justify-between items-center mb-6">
            <h5 className="text-[18px] font-semibold text-navy-DEFAULT">Filters</h5>
            <button className="text-[13px] text-teal-DEFAULT font-medium">Clear all</button>
          </div>

          <div className="space-y-8">
            <div>
              <label className="text-[12px] text-text-muted uppercase tracking-wide font-semibold block mb-3">Rate Range</label>
              <input type="range" className="w-full accent-teal-DEFAULT" />
              <div className="text-[13px] font-mono text-teal-DEFAULT mt-2">₹2,000 – ₹50,000</div>
            </div>

            <div>
              <label className="text-[12px] text-text-muted uppercase tracking-wide font-semibold block mb-3">Availability</label>
              <div className="space-y-2">
                {["Available now", "Today", "This week", "Any"].map(opt => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="availability" className="accent-teal-DEFAULT w-4 h-4" />
                    <span className="text-[14px] text-text-body">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[12px] text-text-muted uppercase tracking-wide font-semibold block mb-3">Credentials</label>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-[14px] text-text-body">Verified only</span>
                  <div className="w-10 h-5 bg-teal-DEFAULT rounded-full relative">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5" />
                  </div>
                </label>
              </div>
            </div>

            <Button fullWidth size="md">Apply Filters</Button>
          </div>
        </div>

        {/* RIGHT CONTENT AREA */}
        <div className="flex-1 p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[16px] text-text-sub">{filteredExperts.length} experts found</span>
            <select className="h-[40px] px-3 bg-white border border-border rounded-[6px] text-[14px] text-text-body focus:outline-none focus:border-teal-DEFAULT">
              <option>Best Match</option>
              <option>Top Rated</option>
              <option>Price: Low–High</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-20 text-text-muted">Finding top experts...</div>
          ) : filteredExperts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExperts.map(expert => (
                <div key={expert.id} className="relative">
                  {aiMatch && searchValue && !isSearching && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-gold-DEFAULT text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                      AI Recommended
                    </div>
                  )}
                  {/* Make entire card clickable by wrapping in anchor link to public profile */}
                  <a href={`/${expert.id}`} className="block h-full">
                    <ExpertCard expert={expert} />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mt-16 text-center">
              <SearchX className="w-[64px] h-[64px] text-text-muted mb-4" />
              <h4 className="text-[22px] font-semibold text-text-primary mb-2">No experts found</h4>
              <p className="text-[16px] text-text-body max-w-md mb-6">
                Try adjusting your filters or submit a custom request.
              </p>
              <Button size="md" variant="primary">Submit your requirement</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
