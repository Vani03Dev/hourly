"use client";

import React from "react";
import { Box, Typography, Paper, TextField, InputAdornment, Accordion, AccordionSummary, AccordionDetails, FormGroup, FormControlLabel, Checkbox, Slider, Button, Chip, Stack, IconButton } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';

interface SearchFiltersProps {
  query: string;
  setQuery: (q: string) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  selectedCategories: string[];
  setSelectedCategories: (cats: string[]) => void;
}

export function SearchFilters({ query, setQuery, priceRange, setPriceRange, selectedCategories, setSelectedCategories }: SearchFiltersProps) {
  const categories = ["Engineering", "Product Management", "Design", "Marketing", "Sales", "Legal"];
  const availability = ["Available Today", "This Week", "Weekends", "Async Chat Only"];

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleClearAll = () => {
    setQuery('');
    setPriceRange([0, 5000]);
    setSelectedCategories([]);
  };

  return (
    <Paper elevation={4} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 4, position: 'sticky', top: 88, boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary' }}>Filters</Typography>
        </Box>
        <Button onClick={handleClearAll} variant="text" size="small" sx={{ color: 'text.secondary', fontWeight: 'bold', '&:hover': { color: 'primary.main', bgcolor: 'transparent' } }}>
          Clear All
        </Button>
      </Box>
      
      <TextField
        fullWidth
        placeholder="Search names, skills..."
        variant="outlined"
        size="medium"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ 
          mb: 4, 
          '& .MuiOutlinedInput-root': { 
            bgcolor: 'background.default',
            transition: 'all 0.2s',
            '&:hover': {
              bgcolor: 'action.hover'
            },
            '&.Mui-focused': {
              boxShadow: '0 4px 20px rgba(13, 148, 136, 0.15)',
              bgcolor: 'background.paper',
              '& fieldset': {
                borderColor: 'secondary.main',
                borderWidth: '1px'
              }
            },
            '& input': {
              outline: 'none',
              boxShadow: 'none',
              '&:focus': {
                outline: 'none',
                boxShadow: 'none'
              }
            }
          } 
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color={query ? "secondary" : "action"} sx={{ transition: 'color 0.2s' }} />
              </InputAdornment>
            ),
            endAdornment: query ? (
              <InputAdornment position="end">
                <IconButton onClick={() => setQuery('')} size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'error.main', bgcolor: 'error.light', opacity: 0.8 } }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          }
        }}
      />

      <Accordion defaultExpanded disableGutters elevation={0} sx={{ '&:before': { display: 'none' }, bgcolor: 'transparent', mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0, minHeight: 48 }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '1.05rem' }}>Category</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0, pt: 0, pb: 2 }}>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {categories.map((cat) => (
              <Chip 
                key={cat} 
                label={cat} 
                onClick={() => toggleCategory(cat)}
                sx={{ 
                  fontWeight: 'medium',
                  borderRadius: 2,
                  transition: 'all 0.2s ease-in-out',
                  cursor: 'pointer',
                  bgcolor: selectedCategories.includes(cat) ? 'rgba(13,148,136,0.1)' : 'action.hover',
                  color: selectedCategories.includes(cat) ? 'secondary.main' : 'text.secondary',
                  border: 1,
                  borderColor: selectedCategories.includes(cat) ? 'secondary.main' : 'transparent',
                  '&:hover': { 
                    bgcolor: selectedCategories.includes(cat) ? 'rgba(13,148,136,0.2)' : 'action.selected',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }
                }} 
              />
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded disableGutters elevation={0} sx={{ '&:before': { display: 'none' }, bgcolor: 'transparent', mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0, minHeight: 48 }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '1.05rem' }}>Hourly Rate</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0, pt: 0, pb: 2 }}>
          <Box sx={{ px: 1, pt: 2, pb: 1 }}>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              min={200}
              max={5000}
              step={100}
              valueLabelDisplay="on"
              valueLabelFormat={(val) => `₹${val}`}
              color="secondary"
              sx={(theme) => ({
                '& .MuiSlider-valueLabel': {
                  bgcolor: 'primary.main',
                  color: theme.palette.mode === 'dark' ? '#0F172A' : '#FFFFFF',
                  borderRadius: 1,
                  px: 1,
                  py: 0.5,
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                },
                '& .MuiSlider-thumb': {
                  transition: 'box-shadow 0.2s ease',
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: `0px 0px 0px 8px ${theme.palette.mode === 'dark' ? 'rgba(45, 212, 191, 0.16)' : 'rgba(13, 148, 136, 0.16)'}`,
                  }
                }
              })}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>₹200</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>₹5,000+</Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      
      <Accordion defaultExpanded disableGutters elevation={0} sx={{ '&:before': { display: 'none' }, bgcolor: 'transparent' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0, minHeight: 48 }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '1.05rem' }}>Availability</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0, pt: 0 }}>
          <FormGroup>
            {availability.map((item) => (
              <FormControlLabel 
                key={item} 
                control={<Checkbox size="small" color="secondary" sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }} />} 
                label={<Typography variant="body2" sx={{ fontWeight: 'medium', color: 'text.secondary' }}>{item}</Typography>} 
                sx={{ 
                  mb: 0.5, 
                  py: 0.5, 
                  px: 1, 
                  ml: -1,
                  borderRadius: 2, 
                  transition: 'all 0.2s ease',
                  '&:hover': { bgcolor: 'action.hover' } 
                }}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
}
