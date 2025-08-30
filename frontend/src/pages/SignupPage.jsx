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
    CssBaseline} from "@mui/material";
import { Link as RouterLink} from "react-router";
import * as React from "react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Topbar from "../components/Topbar";

function SignupPage() {
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [role, setRole] = React.useState("marker");
    const handleSubmit = () => { console.log("login");};
    const handleSelect = (event) => { setRole(event.target.value);};
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
                                type={showPassword ? "text" : "password"}
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
                                type="submit" 
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
                </Container>
            </Container>
        </React.Fragment>
        
    )
}

export default SignupPage