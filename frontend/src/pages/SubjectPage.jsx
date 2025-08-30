import { 
    Container,
    CssBaseline,

} from "@mui/material";
import Navbar from "../components/Navbar"
import * as React from 'react';

function SubjectPage() {
    return (
        <React.Fragment>
            <CssBaseline />
            <Container sx={{ bgcolor : "white" }}>
                <Navbar />
            </Container>
        </React.Fragment>
    );
}

export default SubjectPage;