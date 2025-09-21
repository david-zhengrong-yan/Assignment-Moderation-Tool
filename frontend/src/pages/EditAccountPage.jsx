import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Navbar from "../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";

export default function EditAccountPage() {
  const sessionid = localStorage.getItem("sessionid");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { userId } = useParams();

  const [form, setForm] = useState({
    username: "",
    role: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
  });
  const [initialForm, setInitialForm] = useState({});
  const [preview, setPreview] = useState(null);
  const [passwordError, setPasswordError] = useState(""); 
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const MAX_DIMENSION = 400; // px

  const showSnackbar = (message, severity = "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchWithAuth = async (url, options = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        "X-Session-ID": sessionid,
      },
      credentials: "include",
    });

    if (res.status === 401) {
      navigate("/login");
      return null;
    }

    return res;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetchWithAuth(`http://localhost:8000/api/${userId}/account`);
        if (!res) return;
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();

        setForm({
          username: data.username,
          role: data.role,
          email: data.email,
          password: "",
          confirmPassword: "",
          profilePicture: null,
        });

        setInitialForm({
          username: data.username,
          role: data.role,
          email: data.email,
        });

        if (data.profilePicture) {
          setPreview(
            data.profilePicture.startsWith("http")
              ? data.profilePicture
              : `http://localhost:8000${data.profilePicture}`
          );
        }
      } catch (err) {
        console.error(err);
        showSnackbar(err.message);
      }
    };
    fetchUser();
  }, [sessionid, userId, navigate]);

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
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      showSnackbar("Only JPEG, PNG, or WEBP images are allowed");
      return;
    }

    try {
      const resizedFile = await resizeImage(file);
      if (resizedFile.size > MAX_FILE_SIZE) {
        showSnackbar("File size must be less than 2MB after compression");
        return;
      }
      setForm((s) => ({ ...s, profilePicture: resizedFile }));
      setPreview(URL.createObjectURL(resizedFile));
    } catch {
      showSnackbar("Failed to process image");
    }
  };

  const isFormChanged = () => {
    const { password, confirmPassword, profilePicture, ...rest } = form;
    return (
      JSON.stringify(rest) !== JSON.stringify(initialForm) ||
      password !== "" ||
      confirmPassword !== "" ||
      profilePicture !== null
    );
  };

  const handleSave = async () => {
    setPasswordError("");

    if (form.password !== form.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", form.username);
      formData.append("role", form.role);
      formData.append("email", form.email);
      if (form.password) formData.append("password", form.password);
      if (form.profilePicture instanceof File) {
        formData.append("profilePicture", form.profilePicture);
      }

      const res = await fetchWithAuth(
        `http://localhost:8000/api/${userId}/account/edit`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!res) return;
      if (!res.ok) {
        const errData = await res.json();
        showSnackbar(errData.message || "Failed to update account");
        return;
      }

      showSnackbar("Account updated successfully", "success");
      navigate(`/${userId}/account`);
    } catch (err) {
      console.error(err);
      showSnackbar(err.message);
    }
  };

  const handleCancel = () => {
    if (isFormChanged() && !window.confirm("You have unsaved changes. Leave anyway?")) return;
    navigate(`/${userId}/account`);
  };

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

        {/* Avatar */}
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
            Click the camera to change profile picture (Max 2MB, JPEG/PNG/WEBP)
          </Typography>
        </Box>

        {/* Edit Form */}
        <Box sx={{ maxWidth: 600, mx: "auto", display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            label="Username"
            value={form.username}
            onChange={(e) => setForm((s) => ({ ...s, username: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Email"
            value={form.email}
            onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
            fullWidth
          />
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
            error={!!passwordError}
            helperText={passwordError}
          />

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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
