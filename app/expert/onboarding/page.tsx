"use client";

import React, { useState } from "react";
import { Box, Container, Typography, TextField, Button, Paper, Chip } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Toast } from "../../../utils/toast";

const onboardingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters (e.g., Senior Software Engineer)"),
  bio: z.string().min(20, "Bio must be at least 20 characters to help clients understand your expertise"),
  hourlyRate: z.number().min(100, "Hourly rate must be at least ₹100"),
  tags: z.string().min(2, "Please enter at least one tag"),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export default function ExpertOnboardingPage() {
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
  });

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/,/g, '');
      if (newTag && !tags.includes(newTag)) {
        const updatedTags = [...tags, newTag];
        setTags(updatedTags);
        setValue("tags", updatedTags.join(', '), { shouldValidate: true });
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    setValue("tags", updatedTags.join(', '), { shouldValidate: true });
  };

  const onSubmit = async (data: OnboardingFormValues) => {
    try {
      const { submitExpertOnboarding } = await import('@/app/actions/expert');
      
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('bio', data.bio);
      formData.append('hourlyRate', data.hourlyRate.toString());
      
      // Use the tags state directly or data.tags
      formData.append('tags', JSON.stringify(tags));
      
      const response = await submitExpertOnboarding(formData);
      
      if (response && response.error) {
        Toast.error(response.error);
      } else {
        Toast.success('Profile created successfully! Welcome to Hourly.');
        window.location.href = '/expert/dashboard';
      }
    } catch (error) {
      Toast.error('An unexpected error occurred.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={4} sx={{ p: { xs: 4, md: 6 }, borderRadius: 4 }}>
        <Box sx={{ mb: 5, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
            Complete Your Profile
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.125rem' }}>
            Set up your expert details so clients can find and book you.
          </Typography>
        </Box>

        <form onSubmit={(e) => {
          // Prevent form submission on enter key from the tag input
          if ((e.nativeEvent as any).submitter === null) {
             const activeElement = document.activeElement as HTMLElement;
             if (activeElement && activeElement.getAttribute('name') === 'tagInputHelper') {
               e.preventDefault();
               return;
             }
          }
          handleSubmit(onSubmit)(e);
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            
            <TextField
              fullWidth
              label="Professional Title"
              placeholder="e.g. Senior Product Designer at Google"
              variant="outlined"
              {...register("title")}
              error={!!errors.title}
              helperText={errors.title?.message || "This is the first thing clients see."}
            />

            <TextField
              fullWidth
              label="About You (Bio)"
              placeholder="Describe your experience, what you specialize in, and how you can help clients..."
              multiline
              rows={5}
              variant="outlined"
              {...register("bio")}
              error={!!errors.bio}
              helperText={errors.bio?.message || "Make it compelling and highlight your achievements."}
            />

            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                fullWidth
                label="Hourly Rate (₹)"
                type="number"
                placeholder="1500"
                variant="outlined"
                {...register("hourlyRate", { valueAsNumber: true })}
                error={!!errors.hourlyRate}
                helperText={errors.hourlyRate?.message || "You can change this later."}
                slotProps={{ htmlInput: { min: 100 } }}
              />

              <Box sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  name="tagInputHelper"
                  label="Expertise Tags"
                  placeholder="Type a tag and press Enter"
                  variant="outlined"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  error={!!errors.tags && tags.length === 0}
                  helperText={(errors.tags?.message && tags.length === 0) ? errors.tags.message : "Press Enter or comma to add a tag."}
                />
                
                {/* Hidden input to register with react-hook-form */}
                <input type="hidden" {...register("tags")} value={tags.join(', ')} />

                {tags.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                    {tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onDelete={() => handleRemoveTag(tag)}
                        color="secondary"
                        variant="outlined"
                        sx={{ borderRadius: 2, fontWeight: 'bold' }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              disabled={isSubmitting}
              sx={{ py: 1.5, mt: 2, fontSize: '1.125rem', fontWeight: 'bold', borderRadius: 2 }}
            >
              {isSubmitting ? 'Saving Profile...' : 'Complete Setup & Go to Dashboard'}
            </Button>

          </Box>
        </form>
      </Paper>
    </Container>
  );
}
