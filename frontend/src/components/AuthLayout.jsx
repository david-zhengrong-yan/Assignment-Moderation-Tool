import React from "react";
import { Box, Container, CssBaseline } from "@mui/material";
import Topbar, { TOPBAR_HEIGHT } from "./Topbar"; // adjust path if needed

export default function AuthLayout({ children }) {
  return (
    <>
      <CssBaseline />
      <Topbar />
      {/* Spacer below Topbar */}
      <Box sx={{ height: TOPBAR_HEIGHT }} />

      {/* Full-page white background wrapper */}
      <Box
        sx={{
          minHeight: `calc(100vh - ${TOPBAR_HEIGHT}px)`,
          bgcolor: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Container maxWidth="sm">{children}</Container>
      </Box>
    </>
  );
}
