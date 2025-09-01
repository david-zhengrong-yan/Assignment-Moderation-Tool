
import {
    AppBar,
    Box,
    Toolbar,
    Link,
} from "@mui/material";
import { Link as RouterLink } from 'react-router';
import deakinLogo from '../assets/logo_deakin-rebrand-stacked.png'

function Topbar() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed"
                sx={{
                    bgcolor : "black",
                    height : "10%",
                    padding : 1.5,
                }}
            >
                <Toolbar sx={{ justifyContent: "left"}}>
                    <Link component={RouterLink} to="/">
                        <Box 
                            component="img"
                            sx={{
                                height : 64,
                            }}
                            alt="Deakin Logo"
                            src={deakinLogo}
                        />
                    </Link>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Topbar;