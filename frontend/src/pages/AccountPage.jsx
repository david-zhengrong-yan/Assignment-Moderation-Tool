import React, { useState, useEffect } from "react";
import { Box, Avatar, Typography, Divider, LinearProgress, Button } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import DoneIcon from "@mui/icons-material/Done";
import { useNavigate, useParams } from "react-router-dom";
import { getApiBaseUrl } from "../constants"

import Navbar from "../components/Navbar";

export default function AccountPage() {
  const sessionid = localStorage.getItem("sessionid");
  const navigate = useNavigate();
  const { userId } = useParams();

  const [user, setUser] = useState({
    username: "User Name",
    role: "Marker",
    email: "user@example.com",
    profilePicture: null,
  });

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/api/${userId}/account`, {
          method: "GET",
          headers: { "X-Session-ID": sessionid },
          credentials: "include",
        });

        if (res.status === 401) {
          navigate("/login");
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch account:", err);
      }
    };

    fetchAccount();
  }, [navigate, sessionid, userId]);

  const handleEditAccount = () => {
    navigate(`/${userId}/account/edit`, { state: { user } });
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw" }}>
      <Navbar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#ffffff",
          color: "rgba(0,0,0,0.87)",
          p: 4,
          height: "100vh",
          overflowY: "auto",
          boxSizing: "border-box",
          ml: "200px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top content */}
        <Box sx={{ flex: 1 }}>
          {/* Page Title */}
          <Typography variant="h4" sx={{ mb: 2 }}>
            Account
          </Typography>

          {/* Avatar + User Info */}
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Avatar
                sx={{ width: 96, height: 96, bgcolor: "grey.100" }}
                src={user.profilePicture}
              >
                {!user.profilePicture && <PersonIcon sx={{ fontSize: 48, color: "grey.600" }} />}
              </Avatar>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                {user.username}
              </Typography>

              <Box sx={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography sx={{ width: 80 }}>Role:</Typography>
                  {user.role}
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography sx={{ width: 80 }}>Email:</Typography>
                  {user.email}
                </Box>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Teaching & Marking Overview */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Teaching & Marking Overview
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <EventIcon sx={{ color: "primary.main" }} />
              <Typography>
                Current assignments allocated: <strong>Assignment 1 – Sep 10</strong>
              </Typography>
            </Box>

            <Box
              sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <DoneIcon />
                <Typography>Submissions marked</Typography>
              </Box>
              <Box sx={{ width: "55%" }}>
                <LinearProgress
                  variant="determinate"
                  value={60}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Bottom Edit Button */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<PersonIcon />}
            onClick={handleEditAccount}
            sx={{
              borderRadius: 3,
              px: 5,
              py: 1.5,
              fontSize: "1rem",
              textTransform: "none",
              boxShadow: 3,
            }}
          >
            Edit Account
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
