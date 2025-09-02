import { 
    Container,
    CssBaseline,
    Typography,
    TextField,
    Box,
} from "@mui/material";
import Navbar from "../components/Navbar"
import * as React from 'react';
import PageTitle from "../components/PageTitle";

export default function SubjectPage() {
    // const [filter, setFilter] = React.useState();
    // const [sort, setSort] = React.useState();

    return (
        <React.Fragment>
            <CssBaseline />
            <Container sx={{ bgcolor : "white" }}>
                <Navbar />
                <PageTitle value="Subjects" />
                {/* <Box>
                    <TextField id="outlined-search" label="Search" type="search" />
                    <FormControl required>
                        <InputLabel id="filter-label">Register as</InputLabel>
                        <Select
                            labelId="filter-label"
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
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="completed">Complete</MenuItem>
                            <MenuItem value="incomplete">Incomplete</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl required>
                        <InputLabel id="sort-label">Register as</InputLabel>
                        <Select
                            labelId="sort-label"
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
                </Box> */}
                
            </Container>
        </React.Fragment>
    );
}
