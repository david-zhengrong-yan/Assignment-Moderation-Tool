import React from "react";
import { AppBar, Toolbar, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router";

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
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Toolbar
        sx={{
          minHeight: TOPBAR_HEIGHT,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          px: 3,
          width: "100%",
        }}
      >
        <Link component={RouterLink} to="/" underline="none">
          <Typography
            variant="h6"
            sx={{
              color: "white",
              fontWeight: "bold",
              letterSpacing: 0.5,
            }}
          >
            Assignment Moderation Tool
          </Typography>
        </Link>
      </Toolbar>
    </AppBar>
  );
}
