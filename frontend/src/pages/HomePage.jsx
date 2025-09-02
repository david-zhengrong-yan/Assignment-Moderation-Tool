import { 
    Container,
    CssBaseline,
    Typography,
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Toolbar,
    AppBar,
} from "@mui/material";
import Navbar from "../components/Navbar"
import * as React from 'react';
import PageTitle from '../components/PageTitle'

export default function HomePage() {
    const [filter, setFilter] = React.useState('incomplete');
    const [sort, setSort] = React.useState('newest');


    const handleFilter = (event) => { 
        setFilter(event.target.value);
    };

    const handleSort = (event) => {
        setSort(event.target.value);
    };


    return (
        <React.Fragment>
            <CssBaseline />
            <Container sx={{ bgcolor : "white" }}>
                <Navbar />
                <PageTitle value="Assignments" />

                <AppBar 
                    elevation={0}
                    sx={{ 
                        mt : 20, 
                        pl : "250px",
                        bgcolor : "white"
                    }} 
                >
                    <Toolbar>
                        <Typography>
                            <TextField id="outlined-search" label="Search" type="search"/>
                        </Typography>
                        <FormControl>
                                <InputLabel id="filter-label">Filter</InputLabel>
                                <Select
                                    labelId="filter-label"
                                    id="select-role"
                                    value={filter}
                                    label="Filter"
                                    onChange={handleFilter}
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
                        <FormControl>
                            <InputLabel id="sort-label">Sort by</InputLabel>
                            <Select
                                labelId="sort-label"
                                id="select-role"
                                value={sort}
                                label="Sort by"
                                onChange={handleSort}
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
                                <MenuItem value="a-z">A-Z</MenuItem>
                                <MenuItem value="z-a">Z-A</MenuItem>
                                <MenuItem value="newest">Newest</MenuItem>
                                <MenuItem value="oldest">Oldest</MenuItem>
                            </Select>
                        </FormControl>
                    </Toolbar>

                </AppBar>

                
            </Container>
        </React.Fragment>
    );
}
