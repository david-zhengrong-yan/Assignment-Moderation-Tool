import {
    Box,
    AppBar,
    Toolbar,
    Typography
} from '@mui/material';

export default function PageTitle(props) {
    // const navbarWidth = 200;
    return (
        <Box sx={{ flexGrow: 1 }} >
        <AppBar position="fixed"
            sx={{
                bgcolor : "white",
                height : "10%",
                padding : 1.5,
            }}
            elevation={0}
        >
            <Typography
                sx={{
                    fontSize : "48pt",
                    color : "black",
                }}
                align='left'
                ml="250px"
            >
                {props.value}
            </Typography>
        </AppBar>
    </Box>
    );
}