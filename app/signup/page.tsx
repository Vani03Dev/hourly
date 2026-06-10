"use client";

import React, { useState } from "react";
import { Box, Paper } from "@mui/material";
import { WelcomePage } from "../../components/signup/WelcomePage";
import { SignupForm } from "../../components/signup/SignupForm";
import { AnimatePresence, motion } from "framer-motion";

export default function SignupPage() {
  const [step, setStep] = useState<"welcome" | "form">("welcome");

  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 64px)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      py: { xs: 4, md: 8 }, 
      px: { xs: 2, md: 4 },
      position: 'relative',
      overflow: 'hidden',
      bgcolor: 'background.default'
    }}>
      {/* Animated Background Elements */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '60vw',
          height: '60vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(45, 212, 191, 0.15) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(96, 165, 250, 0.15) 0%, transparent 70%)',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', maxWidth: 640, position: 'relative', zIndex: 1 }}
      >
        <Paper elevation={0} sx={{ 
          p: { xs: 4, sm: 6 }, 
          borderRadius: 4, 
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)',
          minHeight: 500,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
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
        </Paper>
      </motion.div>
    </Box>
  );
}
