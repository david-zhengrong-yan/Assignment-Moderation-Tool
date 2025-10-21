import React from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Link,
  Snackbar,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { getApiBaseUrl } from "../constants"

export default function SignupPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const [username, setUserName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleClose = () => setError(false);

  const validateEmail = (inputEmail) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputEmail);

  const passwordMatch = (password, confirmed) => password === confirmed;

  const handleSubmit = async () => {
    if (!username) return setError(true), setErrorMessage("Please enter your username!");
    if (!email) return setError(true), setErrorMessage("Please enter the email!");
    if (!validateEmail(email))
      return setError(true), setErrorMessage("Please provide a valid email!");
    if (password.length < 6)
      return (
        setError(true),
        setErrorMessage("Password should be more than 6 characters!")
      );
    if (!passwordMatch(password, confirmPassword))
      return setError(true), setErrorMessage("Passwords do not match!");

    const signupData = { username, email, password };

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(signupData),
      });
      const data = await response.json();

      if (!data.successful) {
        setError(true);
        setErrorMessage(data.message || "Registration failed!");
      } else {
        navigate("/login", {
          state: { successMessage: "Sign up successfully!" },
        });
      }
    } catch (err) {
      console.error(err);
      setError(true);
      setErrorMessage("Server error!");
    }
  };

  return (
    <AuthLayout>
      <Paper sx={{ p: 5, borderRadius: 3, bgcolor: "#E5E5E5" }} elevation={10}>
        <Typography variant="h5" component="h1" textAlign="center" mb={4}>
          Sign Up
        </Typography>

        <Box component="form" noValidate>
          <TextField
            label="Username"
            fullWidth
            required
            margin="normal"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            sx={{ bgcolor: "white", borderRadius: 1 }}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ bgcolor: "white", borderRadius: 1 }}
          />
          <TextField
            label="Password"
            fullWidth
            required
            type={showPassword ? "text" : "password"}
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: { bgcolor: "white", borderRadius: 1 },
            }}
          />
          <TextField
            label="Confirm Password"
            fullWidth
            required
            type={showConfirmPassword ? "text" : "password"}
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: { bgcolor: "white", borderRadius: 1 },
            }}
          />

          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              mt: 3,
              bgcolor: "#F6C6C6",
              color: "black",
              borderRadius: 2,
              width: "100%",
              py: 1.5,
            }}
          >
            Sign Up
          </Button>
        </Box>

        <Box mt={2} textAlign="center">
          <Link component={RouterLink} to="/login">
            Already a user? Login here.
          </Link>
        </Box>
      </Paper>

      <Snackbar
        open={error}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        message={errorMessage}
      />
    </AuthLayout>
  );
}
