// NotFoundPage.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getApiBaseUrl } from "../constants"

export default function NotFoundPage() {
  const sessionid = localStorage.getItem("sessionid")
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/api/login_status`, {
          method: "GET",
          headers: {"X-Session-ID": sessionid},
          credentials: "include", // Important: send sessionid cookie
        });

        if (response.ok) {
          const data = await response.json();
          if (data.successful) {
            setIsLoggedIn(true); // user is logged in
            navigate(`/${data.id}/home`);
          } else {
            navigate("/login", { replace: true }); // not logged in
          }
        } else if (response.status === 401) {
          navigate("/login", { replace: true }); // unauthorized
        }
      } catch (err) {
        console.error("Login check failed:", err);
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, [navigate]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isLoggedIn) return null; // will redirect anyway

  // user is logged in → show Navbar + Not Found
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <Navbar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: "200px", // navbar width
          p: 4,
          bgcolor: "#ffffff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h3" color="text.secondary">
          404 - Page Not Found
        </Typography>
      </Box>
    </Box>
  );
}
