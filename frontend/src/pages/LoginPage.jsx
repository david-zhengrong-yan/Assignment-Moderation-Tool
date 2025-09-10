import { 
    Box,
    Button, 
    Checkbox, 
    Container, 
    FormControlLabel, 
    Grid, 
    Paper, 
    TextField, 
    Typography, 
    Link,
    InputAdornment,
    IconButton,
    CssBaseline,
    Snackbar} from "@mui/material";
import { useLocation, Link as RouterLink} from "react-router";
import * as React from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Topbar from "../components/Topbar";

export default function LoginPage() {
    const location = useLocation();
    const [isRedirected, ] = React.useState(location.state == undefined);
    const [showPassword, setShowPassword] = React.useState(false);
    const [open, setOpen] = React.useState(isRedirected ? false : true);
    const [message, setMessage] = React.useState(isRedirected ? "" : "Sign up successfully!");
    const [error, setError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const currentPathname = location.pathname;
    const routeName = currentPathname.split('/').pop();

    const handleClose = () => { setOpen(false); };
    const handleEmail = (event) => { setEmail(event.target.value); };
    const handlePassword = (event) => { setPassword(event.target.value); };

    const handleSubmit = async () => { 
        const response = await fetch("http://localhost:8000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        const data = await response.json();

        if (!data.successful) {
            setError(true);
            setErrorMessage(data.message);
        } else {
            console.log("Login successful:", data);
            // Save token or user info to state/localStorage
        }
    };


    return (
        <React.Fragment>
            <CssBaseline />
            <Container
                sx={{
                    bgcolor : "white",
                }}
            >
                <Topbar />
                <Container 
                    sx={{
                        bgcolor : "",
                        padding : "50px",
                        width : "70%",
                    }}
                >
                    <Paper 
                        elevation={10} 
                        sx={{
                            marginTop : 8, 
                            padding : 5,
                            borderRadius: "20px",
                            bgcolor : "#E5E5E5",
                        }}
                    >
                        <Typography 
                            component="h1" 
                            variant="h5" 
                            sx={{ 
                                textAlign : "center",
                                mb : "50px",
                            }}
                        >
                            Login
                        </Typography>
                        <Box 
                        component="form" 
                        noValidate
                        sx={{ mt: 1}}
                        >
                            <TextField 
                                placeholder="Enter email" 
                                fullWidth
                                required
                                autoFocus
                                slotProps={{
                                    input : {
                                        sx : {
                                            mb : 2,
                                            bgcolor : "white",
                                            borderRadius : 10
                                        }
                                    }
                                }}
                                value={ email }
                                onChange={ handleEmail }
                            />
                            <TextField 
                                placeholder="Enter password" 
                                fullWidth
                                required
                                type={showPassword ? "text" : "password"}
                                value={ password }
                                onChange={ handlePassword }
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
                                            borderRadius: 10,
                                            bgcolor : "white"

                                        }
                                    },
                                }}
                            />
                            <Box
                                sx={{
                                    textAlign : "left",
                                    ml : "5px",
                                    mt : "10px"
                                }}
                            >
                                <Link component={RouterLink} to="/signup">
                                    Forgot password?
                                </Link>
                            </Box>
                            
                            <Button 
                                variant="contained" 
                                sx={{ 
                                    mt : 5,
                                    bgcolor : "#F6C6C6",
                                    color : "black",
                                    borderRadius: 10,
                                    width : 100,
                                }}
                                onClick={ handleSubmit }
                            
                            >
                                Login
                            </Button>
                        </Box>
                        <Box
                            sx={{
                                mt : 5,
                            }}
                        >
                            <Link component={RouterLink} to={routeName==="marker-login" ? "/admin-login" : "/marker-login"}>
                                Want to login as {routeName==="marker-login" ? "administrator" : "marker"}? Click here.
                            </Link>
                        </Box>
                        <Box
                            sx={{
                                mt : 2,
                            }}
                        >
                            <Link component={RouterLink} to="/signup">
                                Not a user? You can sign up here.
                            </Link>
                        </Box>
                    </Paper>
                </Container>
                {/* Notification Bar */}
                <Snackbar
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    message={message}
                />
            </Container>
        </React.Fragment>
        
        
    )
}
