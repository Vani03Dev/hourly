"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Box, Container, Typography, Grid, Select, MenuItem, Pagination, FormControl, } from "@mui/material";
import { SearchFilters } from "../../components/search/SearchFilters";
import { ExpertGrid } from "../../components/search/ExpertGrid";
import { mockExperts } from "@/lib/mock-data";
import { createClient } from '../../utils/supabase/client';

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [priceRange, setPriceRange] = useState<number[]>([200, 5000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState("recommended");
  const [loading, setLoading] = useState(true);
  const [allExperts, setAllExperts] = useState<any[]>([]);

  // Fetch real data from Supabase
  useEffect(() => {
    async function loadExperts() {
       
    setLoading(true);
      try {
        
        const supabase = createClient();
        
        const { data, error } = await supabase
          .from('expert_profiles')
          .select('*')
          .eq('is_onboarded', true);
          
        if (error) throw error;
        
        // Map Supabase rows to our existing Expert interface
        const mappedExperts = data.map((row: any) => ({
          id: row.username || row.id,
          name: `${row.first_name || ''} ${row.last_name || ''}`.trim() || 'Expert',
          title: row.title || 'Professional',
          bio: row.bio || '',
          price: row.hourly_rate || 0,
          rating: 5.0, // Mock until reviews are implemented
          sessions: 0, // Mock until bookings are implemented
          credentials: row.tags || [],
          isOnline: false,
          photo: row.avatar_url || null,
        }));
        
        setAllExperts(mappedExperts);
      } catch (error) {
        console.error("Error loading experts", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadExperts();
  }, []);

  const filteredExperts = useMemo(() => {
    let result = allExperts;

    // Filter by query
    if (query) {
      const lowerQ = query.toLowerCase();
      result = result.filter(e => 
        e.name.toLowerCase().includes(lowerQ) || 
        e.title.toLowerCase().includes(lowerQ) || 
        e.bio.toLowerCase().includes(lowerQ) ||
        e.credentials.some((c: string) => c.toLowerCase().includes(lowerQ))
      );
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      // Allow if expert has ANY of the selected categories, or if we want ALL, change to every
      result = result.filter(e => 
        e.credentials.some((c: string) => selectedCategories.includes(c))
      );
    }

    // Filter by price
    result = result.filter(e => e.price >= priceRange[0] && e.price <= priceRange[1]);

    // Sorting
    if (sortOrder === "price_low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOrder === "price_high") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortOrder === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [query, priceRange, selectedCategories, sortOrder, allExperts]);

  return (
    <Box sx={{ py: 6, bgcolor: 'background.default', minHeight: 'calc(100vh - 64px)' }}>
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 3 }}>
            <SearchFilters 
              query={query} setQuery={setQuery}
              priceRange={priceRange} setPriceRange={setPriceRange}
              selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories}
            />
          </Grid>
          
          <Grid size={{ xs: 12, md: 9 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 4, gap: 2 }}>
              <Typography sx={{ fontWeight: 'bold' }} variant="body1" color="text.primary">
                {loading ? "Searching experts..." : `${filteredExperts.length} experts available`}
              </Typography>
              
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <Select 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  displayEmpty
                  sx={{ 
                    borderRadius: 3, 
                    bgcolor: 'background.paper', 
                    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                    fontWeight: 'bold',
                    '& .MuiOutlinedInput-notchedOutline': { border: '1px solid', borderColor: 'divider' },
                    '&:hover': { bgcolor: 'action.hover', cursor: 'pointer', transform: 'translateY(-1px)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <MenuItem value="recommended" sx={{ fontWeight: 'medium' }}>Sort by: Recommended</MenuItem>
                  <MenuItem value="price_low" sx={{ fontWeight: 'medium' }}>Price: Low to High</MenuItem>
                  <MenuItem value="price_high" sx={{ fontWeight: 'medium' }}>Price: High to Low</MenuItem>
                  <MenuItem value="rating" sx={{ fontWeight: 'medium' }}>Highest Rated</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <ExpertGrid experts={filteredExperts} loading={loading} />

            {!loading && filteredExperts.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <Pagination count={Math.ceil(filteredExperts.length / 6) || 1} color="primary" size="large" />
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
