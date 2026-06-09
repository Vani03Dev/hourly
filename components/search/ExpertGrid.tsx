"use client";

import React, { useState, useEffect } from "react";
import { Grid, Skeleton, Box, Card, CardContent } from "@mui/material";
import { ExpertCard } from "../shared/ExpertCard";
import { Expert } from "@/types";
import { FadeIn } from "../shared/MotionWrapper";
import { AnimatePresence, motion } from "framer-motion";

function ExpertCardSkeleton() {
  return (
    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ p: 3, flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Skeleton variant="circular" width={64} height={64} />
          <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
        </Box>
        <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="60%" height={20} sx={{ mb: 3 }} />
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Skeleton variant="rectangular" width={50} height={20} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={80} height={20} sx={{ borderRadius: 1 }} />
        </Box>
        
        <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Skeleton variant="rectangular" width="100%" height={36} sx={{ borderRadius: 2 }} />
        </Box>
      </CardContent>
    </Card>
  );
}

interface ExpertGridProps {
  experts: Expert[];
  loading: boolean;
}

import { EmptyState } from "../shared/EmptyState";

export function ExpertGrid({ experts, loading }: ExpertGridProps) {
  if (!loading && experts.length === 0) {
    return (
      <Box sx={{ mt: 2 }}>
        <EmptyState 
          title="No experts found" 
          description="We couldn't find any experts matching your filters. Try removing some filters or searching for a broader term."
        />
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {loading ? (
          // Render Skeletons
          Array.from(new Array(6)).map((_, index) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={`skeleton-${index}`}>
              <FadeIn delay={index * 0.05}>
                <ExpertCardSkeleton />
              </FadeIn>
            </Grid>
          ))
        ) : (
          // Render Actual Data
          <AnimatePresence mode="popLayout">
            {experts.map((expert) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={expert.id} component={motion.div} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }}>
                <ExpertCard expert={expert} />
              </Grid>
            ))}
          </AnimatePresence>
        )}
      </Grid>
    </Box>
  );
}
