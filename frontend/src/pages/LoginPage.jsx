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
    CssBaseline} from "@mui/material";
import { useLocation, Link as RouterLink} from "react-router";
import * as React from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Topbar from "../components/Topbar";

export default function LoginPage() {
    const [showPassword, setShowPassword] = React.useState(false);

    const location = useLocation();
    const currentPathname = location.pathname;
    const routeName = currentPathname.split('/').pop();
    const handleSubmit = () => { 
        if(routeName === "admin-login") {
            console.log(routeName);
        }

        if (routeName === "marker-login") {
            console.log(routeName);
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
                            {routeName==="marker-login" ? "Marker" : "Administrator"} Login
                        </Typography>
                        <Box 
                        component="form" 
                        onSubmit={handleSubmit}
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
                            />
                            <TextField 
                                placeholder="Enter password" 
                                fullWidth
                                required
                                type={showPassword ? "text" : "password"}
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
                                type="submit" 
                                variant="contained" 
                                sx={{ 
                                    mt : 5,
                                    bgcolor : "#F6C6C6",
                                    color : "black",
                                    borderRadius: 10,
                                    width : 100,
                                }}
                            
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

            </Container>
        </React.Fragment>
        
        
    )
}
