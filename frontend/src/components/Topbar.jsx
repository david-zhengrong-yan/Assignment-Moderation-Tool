import React from "react";
import { AppBar, Toolbar, Box, Link } from "@mui/material";
import { Link as RouterLink } from "react-router";
import deakinLogo from "../assets/logo_deakin-rebrand-stacked.png";

// Export height constant
export const TOPBAR_HEIGHT = 100;

export default function Topbar() {
  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: "black",
        boxShadow: 1,
        height: TOPBAR_HEIGHT,
        display: "flex",           // make AppBar a flex container
        justifyContent: "center",  // horizontal centering if needed
      }}
    >
      <Toolbar
        sx={{
          minHeight: TOPBAR_HEIGHT,
          display: "flex",
          alignItems: "center",    // vertical centering
          justifyContent: "flex-start", // logo on left
          px: 3,                   // horizontal padding
          width: "100%",
        }}
      >
        <Link component={RouterLink} to="/" underline="none">
          <Box
            component="img"
            src={deakinLogo}
            alt="Deakin Logo"
            sx={{ height: 64, display: "block" }} // block ensures vertical centering
          />
        </Link>
      </Toolbar>
    </AppBar>
  );
}
