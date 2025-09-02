import { 
    Container,
    CssBaseline,
    Typography,
    TextField,
    Box,
    AppBar,
    Toolbar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Paper,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Navbar from "../components/Navbar"
import * as React from 'react';
import PageTitle from "../components/PageTitle";

export default function SubjectPage() {
    const paperStyle = {
        bgcolor : "#E5E5E5",
        width : 250,
        height : 140,
        borderRadius : 2,
        textAlign : "left",
        padding : 3,
    }
    // const [filter, setFilter] = React.useState();
    const [sort, setSort] = React.useState("newest");

    const handleSort = (event) => { setSort(event.target.value); };

    const handleSearch = (event) => { console.log(event.target.value); };

    return (
        <React.Fragment>
            <CssBaseline />
            <Container sx={{ bgcolor : "white" }}>
                <Navbar />
                <PageTitle value="Subjects" />
                <AppBar 
                    elevation={0}
                    sx={{ 
                        mt : 20, 
                        pl : "240px",
                        bgcolor : "white"
                    }} 
                >
                    <Toolbar>
                        <TextField id="outlined-search" label="Search" type="search" sx={{mr : "15%", width : "70%"}} onChange={handleSearch}/>
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

                <Grid 
                    container 
                    rowSpacing={6}
                    columnSpacing={6}
                    sx={{
                        mt : "40%",
                        ml : "30%",
                        padding : 0,
                        maxWidth : "100%"
                    }}
                >
                    <Grid>
                        <Paper
                            sx={paperStyle}
                        >
                            <Typography variant="h5" sx={{mb : 3}}>Subject1</Typography>
                            <Typography>Subject Code</Typography>
                            <Typography>Number of Assignments</Typography>
                        </Paper>
                    </Grid>
                    <Grid>
                        <Paper
                            sx={paperStyle}
                        >
                            <p>hello</p>
                            <p>hello</p>
                            <p>hello</p>
                        </Paper>
                    </Grid>
                    <Grid>
                        <Paper
                            sx={paperStyle}
                        >
                            <p>hello</p>
                            <p>hello</p>
                            <p>hello</p>
                        </Paper>
                    </Grid>
                    <Grid>
                        <Paper
                            sx={paperStyle}
                        >
                            <p>hello</p>
                            <p>hello</p>
                            <p>hello</p>
                        </Paper>
                    </Grid>
                    <Grid>
                       <Paper
                            sx={paperStyle}
                        >
                            <p>hello</p>
                            <p>hello</p>
                            <p>hello</p>
                        </Paper>
                    </Grid>
                    <Grid>
                       <Paper
                            sx={paperStyle}
                        >
                            <AddIcon 
                                sx={{
                                    color : "black",
                                    width : 100,
                                    height : 100,
                                }}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </React.Fragment>
    );
}
