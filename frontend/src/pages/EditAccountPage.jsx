import React, { useState, useRef, useEffect } from "react";
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
    profilePicture: null,
  });

  const [initialForm] = useState({ ...form }); // for detecting changes
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [fileError, setFileError] = useState("");

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const MAX_DIMENSION = 400; // px

  // Resize and compress image
  const resizeImage = (file) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIMENSION) {
            height = (height * MAX_DIMENSION) / width;
            width = MAX_DIMENSION;
          }
        } else {
          if (height > MAX_DIMENSION) {
            width = (width * MAX_DIMENSION) / height;
            height = MAX_DIMENSION;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => resolve(new File([blob], file.name, { type: file.type })),
          file.type,
          0.8
        );
      };
      img.onerror = (err) => reject(err);
      img.src = URL.createObjectURL(file);
    });

  const handleFileChange = async (e) => {
    setFileError("");
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setFileError("Only JPEG, PNG, or WEBP images are allowed");
      return;
    }

    try {
      const resizedFile = await resizeImage(file);
      if (resizedFile.size > MAX_FILE_SIZE) {
        setFileError("File size must be less than 2MB after compression");
        return;
      }
      setForm((s) => ({ ...s, profilePicture: resizedFile }));
      setPreview(URL.createObjectURL(resizedFile));
    } catch {
      setFileError("Failed to process image");
    }
  };

  const isFormChanged = () => {
    const { password, confirmPassword, ...rest } = form;
    const { password: p2, confirmPassword: c2, ...restInit } = initialForm;
    return (
      JSON.stringify(rest) !== JSON.stringify(restInit) ||
      password !== "" ||
      confirmPassword !== ""
    );
  };

  const handleSave = () => {
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (fileError) return;

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("staffId", form.staffId);
    formData.append("role", form.role);
    formData.append("email", form.email);
    if (form.password) formData.append("password", form.password);
    if (form.profilePicture) formData.append("profilePicture", form.profilePicture);

    // TODO: send formData to backend API
    console.log("Form data ready for backend:", formData);

    navigate("/"); // Go back to account page
  };

  const handleCancel = () => {
    if (isFormChanged()) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!confirmLeave) return;
    }
    navigate("/");
  };

  // Warn on browser refresh/close
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isFormChanged()) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [form]);

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
              accept="image/jpeg,image/png,image/webp"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </Box>
          <Typography variant="caption" sx={{ mt: 1, color: "text.secondary" }}>
            Click the camera to change profile picture (Max 2MB after compression, JPEG/PNG/WEBP)
          </Typography>
          {fileError && (
            <Typography variant="caption" sx={{ color: "red", mt: 0.5 }}>
              {fileError}
            </Typography>
          )}
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
              onClick={handleCancel}
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
