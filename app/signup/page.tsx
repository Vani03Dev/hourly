"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";
import { WelcomePage } from "@/components/signup/WelcomePage";
import { SignupForm } from "@/components/signup/SignupForm";
import { AnimatePresence, motion } from "framer-motion";

export default function SignupPage() {
  const [step, setStep] = useState<"welcome" | "form">("welcome");

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6, px: { xs: 2, md: 3 }, overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        {step === "welcome" ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <WelcomePage onContinueWithEmail={() => setStep("form")} />
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <SignupForm />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
