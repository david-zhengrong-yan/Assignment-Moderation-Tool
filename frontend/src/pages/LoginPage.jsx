// LoginPage.jsx
import React, { useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  InputAdornment,
  IconButton,
  Snackbar,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials : "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (!data.successful) {
      setError(true);
      setErrorMessage(data.message);
    } else {
      console.log("Login successful:", data);
      setMessage(data.message);
      setOpen(true);
      navigate(`/${data.id}/home`);
    }
  };

  useEffect(() => {
    if (location.state?.successMessage) {
      setMessage(location.state.successMessage);
      setOpen(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  return (
    <AuthLayout>
      <Paper elevation={10} sx={{ p: 5, borderRadius: 3, bgcolor: "#E5E5E5" }}>
        <Typography variant="h5" component="h1" textAlign="center" mb={4}>
          Login
        </Typography>

        <Box component="form" noValidate onSubmit={handleSubmit}>
          <TextField
            label="Email"
            placeholder="Enter email"
            fullWidth
            required
            autoFocus
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ bgcolor: "white", borderRadius: 1 }}
          />
          <TextField
            label="Password"
            placeholder="Enter password"
            fullWidth
            required
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: { bgcolor: "white", borderRadius: 1 },
            }}
          />
          <Box textAlign="right" mt={1}>
            <Link component={RouterLink} to="/signup">
              Forgot password?
            </Link>
          </Box>

          <Button
            type="submit"
            variant="contained"
            sx={{
              mt: 4,
              bgcolor: "#F6C6C6",
              color: "black",
              borderRadius: 2,
              width: "100%",
              py: 1.5,
            }}
          >
            Login
          </Button>
        </Box>

        {/* Removed "Want to login as marker/admin?" */}

        <Box mt={2}>
          <Link component={RouterLink} to="/signup">
            Not a user? You can sign up here.
          </Link>
        </Box>
      </Paper>

      <Snackbar
        open={open || error}
        onClose={() => {
          setOpen(false);
          setError(false);
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        message={error ? errorMessage : message}
      />
    </AuthLayout>
  );
}
