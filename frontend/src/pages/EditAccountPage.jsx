import React, { useState, useRef } from "react";
import {
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  MenuItem,
  IconButton,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function EditAccountPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "User Name",
    staffId: "S1234567",
    role: "Marker",
    email: "user@example.com",
    password: "",
    confirmPassword: "",
    profilePicture: null, // new field to store file
  });

  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const handleSave = () => {
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Form data to send to backend
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("staffId", form.staffId);
    formData.append("role", form.role);
    formData.append("email", form.email);
    if (form.password) formData.append("password", form.password);
    if (form.profilePicture) formData.append("profilePicture", form.profilePicture);

    // TODO: send formData to backend API
    console.log("Form data ready for backend:", formData);

    navigate("/account"); // go back to account page
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((s) => ({ ...s, profilePicture: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
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
        <Typography variant="h4" sx={{ mb: 3 }}>
          Edit Account
        </Typography>

        {/* Avatar with Upload */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={preview || ""}
              sx={{ width: 96, height: 96, bgcolor: "grey.100", fontSize: 48 }}
            >
              {!preview && <PersonIcon sx={{ fontSize: 48, color: "grey.600" }} />}
            </Avatar>

            {/* Upload Button */}
            <IconButton
              color="primary"
              sx={{
                position: "absolute",
                bottom: -5,
                right: -5,
                bgcolor: "white",
                boxShadow: 2,
                "&:hover": { bgcolor: "grey.100" },
              }}
              onClick={() => fileInputRef.current.click()}
            >
              <CameraAltIcon />
            </IconButton>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </Box>
          <Typography variant="caption" sx={{ mt: 1, color: "text.secondary" }}>
            Click the camera to change profile picture
          </Typography>
        </Box>

        {/* Edit Form */}
        <Box sx={{ maxWidth: 600, mx: "auto", display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            label="Full Name"
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            fullWidth
          />

          <TextField
            label="Staff ID"
            value={form.staffId}
            onChange={(e) => setForm((s) => ({ ...s, staffId: e.target.value }))}
            fullWidth
          />

          <TextField
            label="Email"
            value={form.email}
            onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
            fullWidth
          />

          <TextField
            select
            label="Role"
            value={form.role}
            onChange={(e) => setForm((s) => ({ ...s, role: e.target.value }))}
            fullWidth
          >
            <MenuItem value="Administrator">Administrator</MenuItem>
            <MenuItem value="Marker">Marker</MenuItem>
          </TextField>

          <TextField
            label="New Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
            fullWidth
          />

          <TextField
            label="Confirm Password"
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm((s) => ({ ...s, confirmPassword: e.target.value }))}
            fullWidth
            error={!!error}
            helperText={error}
          />

          {/* Save & Cancel Buttons */}
          <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/")}
              sx={{ px: 5, py: 1.5, borderRadius: 3, textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{ px: 5, py: 1.5, borderRadius: 3, textTransform: "none" }}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
