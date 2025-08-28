"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Box, Typography, CircularProgress } from "@mui/material";
import { AnimatedLogo } from "./AnimatedLogo";
import { useAuth } from "@/contexts/AuthContext";

interface SplashScreenProps {
  className?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  className = ""
}) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoading) {
        if (isAuthenticated) {
          router.push("/dashboard"); // Main screen
        } else {
          router.push("/login"); // Login screen
        }
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated, router]);

  return (
    <Box
      className={className}
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: (theme) =>
        theme.palette.mode === "dark" ?
        "linear-gradient(135deg, #111827 0%, #1f2937 100%)" :
        "linear-gradient(135deg, #eff6ff 0%, #ecfdf5 100%)",
        px: 2
      }}
      role="main"
      aria-label="TaskMaster Pro splash screen"
      data-oid="-o1bdz_">

      {/* Centered content container */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: 400,
          width: "100%",
          textAlign: "center"
        }}
        data-oid="6nfgvqm">

        {/* Animated Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ marginBottom: 32 }}
          data-oid="5sh4cbp">

          <AnimatedLogo
            className="w-20 h-20 md:w-24 md:h-24"
            aria-label="TaskMaster Pro animated logo"
            data-oid="e33ad61" />

        </motion.div>

        {/* App Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          data-oid="yskwrxo">

          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              background: (theme) =>
              theme.palette.mode === "dark" ?
              "linear-gradient(45deg, #3b82f6 30%, #10b981 90%)" :
              "linear-gradient(45deg, #2563eb 30%, #059669 90%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2
            }}
            aria-label="TaskMaster Pro application name"
            data-oid="nf919id">

            TaskMaster Pro
          </Typography>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          data-oid="d0t0d-r">

          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              fontWeight: 400,
              mb: 4
            }}
            data-oid="o76eaw-">

            Master Your Tasks, Master Your Day
          </Typography>
        </motion.div>

        {/* Loading Indicator */}
        {isLoading &&
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          data-oid="3wa97sy">

            <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2
            }}
            data-oid="id4fyuv">

              <CircularProgress
              size={40}
              thickness={4}
              aria-label="Loading application"
              aria-describedby="loading-text"
              data-oid="88xvwn4" />


              <Typography
              id="loading-text"
              variant="body2"
              sx={{
                color: "text.secondary",
                animation: "pulse 2s infinite"
              }}
              data-oid="kd5wzl_">

                Preparing your workspace...
              </Typography>
            </Box>
          </motion.div>
        }
      </Box>

      {/* Version info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.2 }}
        style={{
          position: "absolute",
          bottom: 32
        }}
        data-oid="0c89o:4">

        <Typography
          variant="caption"
          sx={{
            color: "text.disabled",
            fontSize: "0.75rem"
          }}
          data-oid="s9r0kw_">

          v1.0.0
        </Typography>
      </motion.div>

      {/* Background decoration */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: -1
        }}
        data-oid="zhfg8-d">

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          style={{
            position: "absolute",
            top: -160,
            right: -160,
            width: 320,
            height: 320,
            background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            borderRadius: "50%",
            filter: "blur(60px)"
          }}
          data-oid="ke7nbhl" />


        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
          style={{
            position: "absolute",
            bottom: -160,
            left: -160,
            width: 320,
            height: 320,
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            borderRadius: "50%",
            filter: "blur(60px)"
          }}
          data-oid="-hhfzwe" />

      </Box>
    </Box>);

};