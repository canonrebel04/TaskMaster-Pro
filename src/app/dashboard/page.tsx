"use client";

import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    // Mock logout - clear authentication status
    localStorage.removeItem("isAuthenticated");
    router.push("/");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 3
      }}
      data-oid="mgpiruz">

      <Typography variant="h4" component="h1" gutterBottom data-oid="n7ty32y">
        TaskMaster Pro Dashboard
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4 }}
        data-oid="e8hv52v">

        Welcome to your task management dashboard!
      </Typography>
      <Button
        variant="outlined"
        onClick={handleLogout}
        sx={{ px: 4, py: 1.5 }}
        data-oid="icqbxk1">

        Sign Out
      </Button>
    </Box>);

}