import React from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Link,
  InputLabel,
  Select,
  MenuItem,
  CssBaseline,
  Snackbar,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Topbar, { TOPBAR_HEIGHT } from "../components/Topbar";

export default function SignupPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const [name, setName] = React.useState("");
  const [staffId, setStaffId] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [role, setRole] = React.useState("");

  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleClose = () => setError(false);

  const validateEmail = (inputEmail) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputEmail);

  const passwordMatch = (password, confirmed) => password === confirmed;

  const handleSubmit = async () => {
    if (!name) return setError(true), setErrorMessage("Please enter your name!");
    if (!staffId) return setError(true), setErrorMessage("Please enter the staff ID!");
    if (!email) return setError(true), setErrorMessage("Please enter the email!");
    if (password.length < 6)
      return setError(true), setErrorMessage("Password should be more than 6 characters!");
    if (!role) return setError(true), setErrorMessage("You must select a role!");
    if (!validateEmail(email)) return setError(true), setErrorMessage("Please provide a valid email!");
    if (!passwordMatch(password, confirmPassword))
      return setError(true), setErrorMessage("Passwords do not match!");

    // Send data to backend
    const signupData = { name, staffId, email, password, role };

    try {
      const response = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });
      const data = await response.json();

      if (!data.successful) {
        setError(true);
        setErrorMessage(data.message || "Registration failed!");
      } else {
        navigate("/login", { state: { from: "signup" } });
      }
    } catch (err) {
      console.error(err);
      setError(true);
      setErrorMessage("Server error!");
    }
  };

  return (
    <>
      <CssBaseline />
      <Topbar />
      {/* Spacer to prevent overlap */}
      <Box sx={{ height: TOPBAR_HEIGHT }} />

      <Container
        maxWidth="sm"
        sx={{ minHeight: `calc(100vh - ${TOPBAR_HEIGHT}px)`, py: 4 }}
      >
        <Paper sx={{ p: 5, borderRadius: 3, bgcolor: "#E5E5E5" }} elevation={10}>
          <Typography variant="h5" component="h1" textAlign="center" mb={4}>
            Sign Up
          </Typography>

          <Box component="form" noValidate>
            <TextField
              label="Name"
              placeholder="Name"
              fullWidth
              required
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ bgcolor: "white", borderRadius: 1 }}
            />
            <TextField
              label="Staff ID"
              placeholder="Staff ID"
              fullWidth
              required
              margin="normal"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              sx={{ bgcolor: "white", borderRadius: 1 }}
            />
            <TextField
              label="Email"
              placeholder="Enter email"
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
              placeholder="Enter password"
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
              placeholder="Confirm password"
              fullWidth
              required
              type={showConfirmPassword ? "text" : "password"}
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { bgcolor: "white", borderRadius: 1 },
              }}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="role-label">Register as</InputLabel>
              <Select
                labelId="role-label"
                id="select-role"
                value={role}
                label="Register As"
                onChange={(e) => setRole(e.target.value)}
                sx={{ bgcolor: "white", borderRadius: 1 }}
              >
                <MenuItem value="administrator">Administrator</MenuItem>
                <MenuItem value="marker">Marker</MenuItem>
              </Select>
            </FormControl>

            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{ mt: 3, bgcolor: "#F6C6C6", color: "black", borderRadius: 2, width: "100%", py: 1.5 }}
            >
              Sign Up
            </Button>
          </Box>

          <Box mt={2} textAlign="center">
            <Link component={RouterLink} to="/">
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
      </Container>
    </>
  );
}
