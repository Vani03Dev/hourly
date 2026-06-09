"use client";

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { motion } from "framer-motion";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({ 
  title = "No experts found", 
  description = "We couldn't find anyone matching your specific criteria. Try adjusting your filters or searching with different keywords.",
  actionText = "Clear Filters",
  onAction
}: EmptyStateProps) {
  return (
    <Box 
      component={motion.div}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      sx={{ 
        width: '100%', 
        py: 12, 
        px: 4, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center',
        bgcolor: 'background.paper',
        borderRadius: 6,
        border: '1px dashed',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ 
        width: 80, 
        height: 80, 
        borderRadius: '50%', 
        bgcolor: 'action.hover', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        mb: 3
      }}>
        <SearchOffIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
      </Box>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 800, color: 'text.primary' }}>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 400, mb: 4, lineHeight: 1.6 }}>
        {description}
      </Typography>
      {onAction && (
        <Button 
          variant="contained" 
          color="primary" 
          onClick={onAction}
          sx={{ borderRadius: 10, px: 4, py: 1.5, fontWeight: 'bold' }}
        >
          {actionText}
        </Button>
      )}
    </Box>
  );
}
