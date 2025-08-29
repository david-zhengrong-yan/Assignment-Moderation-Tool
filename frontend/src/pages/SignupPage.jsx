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
    MenuItem} from "@mui/material";
import { Link as RouterLink} from "react-router";
import * as React from "react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function SignupPage() {
    const [showPassword, setShowPassword] = React.useState(false);
    const [role, setRole] = React.useState("marker");
    const handleSubmit = () => { console.log("login");};
    const handleSelect = (event) => { setRole(event.target.value);};
    return (
        <Container maxwidth="xs">
            <Paper elevation={10} sx={{marginTop : 8, padding : 2}}>
                <Typography component="h1" variant="h5" sx={{ textAlign : "center" }}>
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
                        sx={{ mb : 2 }}
                    />
                    <TextField 
                        placeholder="Staff ID" 
                        fullWidth
                        required
                        autoFocus
                        sx={{ mb : 2 }}
                    />
                    <TextField 
                        placeholder="Enter email" 
                        fullWidth
                        required
                        autoFocus
                        sx={{ mb : 2 }}
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
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
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
                            sx={{ textAlign : "left" }}
                        >
                            <MenuItem value="administrator">Administrator</MenuItem>
                            <MenuItem value="marker">Marker</MenuItem>
                        </Select>
                    </FormControl>
                    <Button type="submit" variant="contained" fullWidth sx={{ mt : 1}}>
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
    )
}

export default SignupPage