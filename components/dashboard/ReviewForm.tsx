"use client";

import React, { useState } from "react";
import StarIcon from '@mui/icons-material/Star';
import { Box, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Chip, IconButton } from "@mui/material";

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewForm({ isOpen, onClose }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const tags = ["Actionable Advice", "Clear Explanations", "Friendly", "Extremely Knowledgeable"];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main', pb: 1 }}>
          Leave a Review
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
              How was your session?
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <IconButton
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  sx={{ p: 0.5, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.1)' } }}
                >
                  <StarIcon sx={{ fontSize: 48, color: (hoveredRating || rating) >= star ? '#F59E0B' : 'grey.300' }} />
                </IconButton>
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
              What went well?
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              {tags.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <Chip
                    key={tag}
                    label={tag}
                    onClick={() => toggleTag(tag)}
                    color={isSelected ? "secondary" : "default"}
                    variant={isSelected ? "filled" : "outlined"}
                    sx={{ fontWeight: 'bold', px: 1, py: 2.5, borderRadius: 10, fontSize: '0.875rem' }}
                  />
                );
              })}
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
              Share your experience
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Tell others what it was like working with this professional..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              variant="outlined"
            />
          </Box>

        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button variant="outlined" onClick={onClose} sx={{ fontWeight: 'bold', width: 120 }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="secondary"
            type="submit" 
            disabled={rating === 0 || reviewText.length < 10}
            sx={{ fontWeight: 'bold', width: 160 }}
          >
            Submit Review
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
