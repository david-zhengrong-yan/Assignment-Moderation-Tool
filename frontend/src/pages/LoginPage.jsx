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
    IconButton} from "@mui/material";
import { Link as RouterLink} from "react-router";
import { useState } from "react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const handleSubmit = () => { console.log("login");}
    return (
        <Container maxwidth="xs">
            <Paper elevation={10} sx={{marginTop : 8, padding : 2}}>
                <Typography component="h1" variant="h5" sx={{ textAlign : "center" }}>
                    Login
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
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                        sx={{ alignItems : "left"}}
                    />
                    <Button type="submit" variant="contained" fullWidth sx={{ mt : 1}}>
                        Login
                    </Button>
                </Box>
                <Grid container justifyContent="space-between" sx={{mt : 1}}>
                    <Grid item>
                        <Link component={RouterLink} to="/signup">
                            Forgot password?
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link component={RouterLink} to="/signup">
                            Not a user? Sign up here.
                        </Link>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    )
}

export default LoginPage;