"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { CheckCircle, FormatListBulleted } from "@mui/icons-material";

interface AnimatedLogoProps {
  className?: string;
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  className = ""
}) => {
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowList(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      className={className}
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 80,
        height: 80
      }}
      role="img"
      aria-label="TaskMaster Pro animated logo"
      data-oid="4fw.nnn">

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
          type: "spring",
          stiffness: 100
        }}
        style={{ position: "relative" }}
        data-oid="3qi3d9a">

        {/* Checkmark Icon */}
        <motion.div
          animate={{
            scale: showList ? 0 : 1,
            opacity: showList ? 0 : 1
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          data-oid="3trhtc4">

          <CheckCircle
            sx={{
              fontSize: 64,
              color: "secondary.main"
            }}
            aria-hidden="true"
            data-oid="69.66h6" />

        </motion.div>

        {/* List Icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: showList ? 1 : 0,
            opacity: showList ? 1 : 0
          }}
          transition={{ duration: 0.5, ease: "easeInOut", delay: 0.3 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          data-oid="xjpy199">

          <FormatListBulleted
            sx={{
              fontSize: 64,
              color: "primary.main"
            }}
            aria-hidden="true"
            data-oid="fwk3g28" />

        </motion.div>
      </motion.div>
    </Box>);

};