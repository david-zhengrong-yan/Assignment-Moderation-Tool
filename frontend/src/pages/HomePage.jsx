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
    Paper
} from "@mui/material";
import Navbar from "../components/Navbar"
import * as React from 'react';
import PageTitle from '../components/PageTitle'

export default function HomePage() {
    const paperStyle = {
        bgcolor : "#E5E5E5",
        width : 250,
        height : 140,
        borderRadius : 2,
        textAlign : "left",
        padding : 3,
    }
    const [filter, setFilter] = React.useState('incomplete');
    const [sort, setSort] = React.useState('newest');


    const handleFilter = (event) => { 
        setFilter(event.target.value);
    };

    const handleSort = (event) => {
        setSort(event.target.value);
    };

    const handleSearch = (event) => {
        console.log(event.target.value);
    }


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
                        pl : "240px",
                        bgcolor : "white"
                    }} 
                >
                    <Toolbar>
                        <TextField id="outlined-search" label="Search" type="search" sx={{mr : "25%", width : "50%"}} onChange={handleSearch}/>
                        <FormControl sx={{mr : 5, width : "10%"}}>
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
                        <FormControl sx={{width : "10%"}}>
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

                <Box
                    sx={{
                        display : "flex",
                        flexDirection : "row",
                        flexWrap : "wrap",
                        mt: 20,
                        ml: "20%",
                        bgcolor : 'gray',
                        borderRadius : 1,
                        alignContent : 'flex-start',
                        maxWidth : 2000,
                    }}
                >
                    <Paper
                        sx={paperStyle}
                    >
                        <Typography variant="h5" sx={{mb : 3}}>Subject1</Typography>
                        <Typography>Subject Code</Typography>
                        <Typography>Number of Assignments</Typography>
                    </Paper>
                    <Paper
                        sx={paperStyle}
                    >
                        <Typography variant="h5" sx={{mb : 3}}>Subject1</Typography>
                        <Typography>Subject Code</Typography>
                        <Typography>Number of Assignments</Typography>
                    </Paper>
                    <Paper
                        sx={paperStyle}
                    >
                        <Typography variant="h5" sx={{mb : 3}}>Subject1</Typography>
                        <Typography>Subject Code</Typography>
                        <Typography>Number of Assignments</Typography>
                    </Paper>
                    <Paper
                        sx={paperStyle}
                    >
                        <Typography variant="h5" sx={{mb : 3}}>Subject1</Typography>
                        <Typography>Subject Code</Typography>
                        <Typography>Number of Assignments</Typography>
                    </Paper>
                </Box>
            </Container>
        </React.Fragment>
    );
}
