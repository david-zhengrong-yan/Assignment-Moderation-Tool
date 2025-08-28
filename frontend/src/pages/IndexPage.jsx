import { 
    Box, 
    Container, 
    Grid, 
    Paper, 
    Typography,
    Link, 
    Button} from "@mui/material"
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Link as RouterLink, useNavigate } from "react-router";

function IndexPage() {
    const navigate = useNavigate();
    const adminLoginRedirect = () => {
        navigate("/admin-login");
    };
    const markerLoginRedirect = () => {
        navigate("/marker-login");
    }
    return (
        <React.Fragment>
            <CssBaseline />
            <Container sx={{ bgcolor: "white",}}>
                <Box
                    sx={{
                        mb: "40px",
                    }}
                >
                    <Typography component="h1" variant="h5" sx={{ textAlign : "center" }}>
                        Login to the Assignment Moderation Tool
                    </Typography>
                </Box>
                <Box
                    sx={{
                        mb: "50px",
                    }}
                >
                    <Grid 
                        container 
                        spacing={20}
                        sx={{
                            justifyContent : "center",
                        }}
                    >
                        <Grid>
                            <Box
                                sx={{
                                    bgcolor: "#E5E5E5",
                                    width: "50vh",
                                    height: "40vh",
                                    padding: "50px",
                                    borderRadius: "10px",
                                }}
                            >
                                <Typography 
                                    component="h3" 
                                    variant="h5" 
                                    sx={{ 
                                        textAlign : "center", 
                                        mb : "20px",
                                    }}
                                >
                                    Staff and Tutor
                                </Typography>
                                <Typography sx={{ textAlign : "left" }}>
                                    Use your university email address to login as a marker.
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={markerLoginRedirect}
                                    sx={{
                                        bgcolor: "pink",
                                        color: "black",
                                    }}
                                >
                                    Staff Login
                                </Button>
                            </Box>
                        </Grid>
                        <Grid>
                            <Box
                                sx={{
                                    bgcolor: "#E5E5E5",
                                    width: "50vh",
                                    height: "40vh",
                                    padding: "50px",
                                    borderRadius: "10px",
                                }}
                            >
                                <Typography 
                                    component="h3" 
                                    variant="h5" 
                                    sx={{ 
                                        textAlign : "center", 
                                        mb : "20px",
                                    }}
                                >
                                    Administrator
                                </Typography>
                                <Typography sx={{ textAlign : "left" }}>
                                    Use your university email address to login as an administrator.
                                </Typography>
                                <Button 
                                    variant="contained"
                                    onClick={adminLoginRedirect}
                                    sx={{
                                        bgcolor: "pink",
                                        color: "black",
                                    }}
                                >
                                    Admin Login
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <Box>
                    <Link component={RouterLink} to="/signup" underline="hover">
                        Not a user? You can sign up here.
                    </Link>
                </Box>
            </Container>
        </React.Fragment>
    );
}

export default IndexPage