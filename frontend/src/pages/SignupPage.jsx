import { 
    Box,
    Button, 
    Container, 
    FormControl,
    Grid, 
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
    Alert} from "@mui/material";
import { Link as RouterLink} from "react-router";
import * as React from "react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Topbar from "../components/Topbar";

export default function SignupPage() {
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
    const [signupData, setSignupData] = React.useState({});

    
    const handleName = (event) => { setName(event.target.value); };
    const handleStaffId = (event) => { setStaffId(event.target.value); };
    const handleEmail = (event) => { setEmail(event.target.value); };
    const handlePassword = (event) => { setPassword(event.target.value); };
    const handleConfirmedPassword = (event) => { setConfirmPassword(event.target.value); };
    const handleSelect = (event) => { setRole(event.target.value); };
    const handleClose = () => { setError(false); };

    const validateEmail = (inputEmail) => {
        // Simple regex for email validation (can be more complex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(inputEmail)) {
            return false;
        } else {
            return true;
        }
    };

    const passwordMatch = (password, confirmed) => {
        if (password !== confirmed) {
            return false;
        }
        else {
            return true;
        }
    };


    const handleSubmit = () => { 
        if (name.length === 0) {
            setError(true);
            setErrorMessage("Please enter your name!");
        } else if (staffId.length === 0) {
            setError(true);
            setErrorMessage("Please enter the staff ID!");
        } else if (email.length === 0) {
            setError(true);
            setErrorMessage("Please enter the email!");
        } else if (password.length < 6) {
            setError(true);
            setErrorMessage("Password should be more than 6 characters!");
        } else if (role === "") {
            setError(true);
            setErrorMessage("You must select a role!");
        } else if(!validateEmail(email)) {
            setError(true);
            setErrorMessage("Please provide a valid email!");
        }else if (!passwordMatch(password, confirmPassword)) {
            setError(true);
            setErrorMessage("Passwords are not match!");
        } else {
            setError(false);
            setErrorMessage("");
            setSignupData({
                name : name,
                staffId : staffId,
                email : email,
                password : password,
                role : role,
            });

            fetch( "http://localhost:8000/signup", {
                mode: 'cors',
                method: 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify(signupData),
            }
            )
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error("Error:", error))
        }

        console.log("login");
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <Container>
                <Topbar />
                <Container sx={{ width: "40%"}}>
                    <Paper 
                        elevation={10} 
                        sx={{
                            marginTop : 8, 
                            padding : 5,
                            bgcolor : "#E5E5E5",
                            borderRadius: "20px",
                        }}
                    >
                        <Typography component="h1" variant="h5" sx={{ textAlign : "center", mb : 5}}>
                            Sign up
                        </Typography>
                        <Box 
                        component="form" 
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ mt: 1}}
                        >
                            <TextField 
                                placeholder="Name" 
                                fullWidth
                                required
                                autoFocus
                                onChange={handleName}
                                value={name}
                                slotProps={{
                                    input : {
                                        sx : {
                                            mb : 2,
                                            bgcolor : "white",
                                            borderRadius : 10
                                        }
                                    }
                                }}
                            />
                            <TextField 
                                placeholder="Staff ID" 
                                fullWidth
                                required
                                autoFocus
                                onChange={handleStaffId}
                                value={staffId}
                                slotProps={{
                                    input : {
                                        sx : {
                                            mb : 2,
                                            bgcolor : "white",
                                            borderRadius : 10
                                        }
                                    }
                                }}
                            />
                            <TextField 
                                placeholder="Enter email" 
                                type="email"
                                fullWidth
                                required
                                autoFocus
                                onChange={handleEmail}
                                value={email}
                                slotProps={{
                                    input : {
                                        sx : {
                                            mb : 2,
                                            bgcolor : "white",
                                            borderRadius : 10
                                        }
                                    }
                                }}
                            />
                            <TextField 
                                placeholder="Enter password" 
                                fullWidth
                                required
                                type={showPassword ? "text" : "password"}
                                onChange={handlePassword}
                                value={password}
                                slotProps={{
                                    input : {
                                        endAdornment : (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                        sx : {
                                            mb : 2,
                                            bgcolor : "white",
                                            borderRadius : 10
                                        },
                                    },
                                }}
                                sx={{mb : 2}}
                            />
                            <TextField 
                                placeholder="Confirm password" 
                                fullWidth
                                required
                                type={showConfirmPassword ? "text" : "password"}
                                onChange={handleConfirmedPassword}
                                value={confirmPassword}
                                slotProps={{
                                    input : {
                                        endAdornment : (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    edge="end"
                                                >
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                        sx : {
                                            mb : 2,
                                            bgcolor : "white",
                                            borderRadius : 10
                                        }
                                    },
                                }}
                                sx={{ mb : 2 }}
                            />
                            <FormControl fullWidth required>
                                <InputLabel id="role-label">Register as</InputLabel>
                                <Select
                                    labelId="role-label"
                                    id="select-role"
                                    value={role}
                                    label="Register As"
                                    onChange={handleSelect}
                                    slotProps={{
                                        input : {
                                            sx : {
                                                bgcolor : "white",
                                                color : "black",
                                                textAlign : "left",
                                            }
                                        }
                                    }}
                                >
                                    <MenuItem value="administrator">Administrator</MenuItem>
                                    <MenuItem value="marker">Marker</MenuItem>
                                </Select>
                            </FormControl>
                            <Button 
                                // type="submit" 
                                onClick={ handleSubmit }
                                variant="contained"  
                                sx={{ 
                                    mt : 2,
                                    bgcolor : "#F6C6C6",
                                    color : "black",
                                    borderRadius: 10,
                                    width : 100,
                                }}
                            >
                                Sign up
                            </Button>
                        </Box>
                        <Grid container justifyContent="space-between" sx={{mt : 1}}>
                            <Grid item>
                                <Link component={RouterLink} to="/">
                                    Already a user? Login here.
                                </Link>
                            </Grid>
                        </Grid>
                    </Paper>
                    {/* Notification Bar */}
                    <Snackbar
                        open={error}
                        onClose={handleClose}
                        anchorOrigin={{ vertical: "top", horizontal: "center" }}
                        message={errorMessage}
                    />
                </Container>
            </Container>
        </React.Fragment>  
    );
}