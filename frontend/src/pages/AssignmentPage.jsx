import {
    Box,
    Button,
    Card,
    CardActionArea,
    CircularProgress,
    circularProgressClasses,
    Container,
    CssBaseline,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,

} from "@mui/material";
import Navbar from "../components/Navbar"
import * as React from 'react';
import { DownloadIcon, Newspaper } from "lucide-react";

function CustomCircularProgress(props) {
    return (
        <Box sx={{ position: 'relative' }}>
            <CircularProgress
                variant="determinate"
                sx={{ color: '#E8DEF8' }}
                size={80}
                thickness={4}
                {...props}
                value={100}
            />
            <CircularProgress
                variant="determinate"
                disableShrink
                sx={{
                    color: '#6750A4',
                    animationDuration: '550ms',
                    position: 'absolute',
                    left: 0,
                    [`& .${circularProgressClasses.circle}`]: {
                        strokeLinecap: 'round',
                    },
                }}
                size={80}
                value={props.percent}
                thickness={4}
                {...props}
            />
        </Box>
    );
}

function SubmissionCard(props) {
    const finishedPercentage = props.submission.markers / props.submission.totalMarkers * 100;
    const averagePercentage = props.submission.averageMarkers / props.submission.totalMarkers * 100;
    return <Card sx={{
        background: '#D9D9D9',
        px: 2,
        py: 2
    }}>
        <Typography variant="body1" align="left" sx={{ mb: 2 }}>
            Submission {props.index}
        </Typography>
        <Box sx={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
            <Card sx={{ p: 2, width: '200px', height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <CustomCircularProgress percent={finishedPercentage} />
                <Typography variant="body1" align="left" sx={{ mt: 2 }}>
                    {props.submission.markers}/{props.submission.totalMarkers} markers finished
                </Typography>
            </Card>
            <Card sx={{ p: 2, width: '200px', height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <CustomCircularProgress percent={averagePercentage} />
                <Typography variant="body1" align="left" sx={{ mt: 2 }}>
                    Current Average
                </Typography>
            </Card>
            <Card>
                <CardActionArea onClick={() => alert("Download the file")} sx={{ p: 2, width: '200px', height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <DownloadIcon size={90} />
                    <Typography variant="body1" align="left" sx={{ mt: 2 }}>
                        Download Submission
                    </Typography>
                </CardActionArea>
            </Card>
        </Box>
    </Card>
}

export default function AssignmentPage() {
    const [submissions, setSubmissions] = React.useState([{
        index: 1,
        markers: 2,
        totalMarkers: 5,
        averageMarkers: 3,
    }, {
        index: 2,
        markers: 2,
        totalMarkers: 10,
        averageMarkers: 3,
    }])

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = () => {
        setOpen(false);
        const newSubmissions = [...submissions];
        newSubmissions.pop();
        setSubmissions(newSubmissions)
    };
    return (
        <React.Fragment>
            <CssBaseline />
            <Box sx={{ bgcolor: "white", display: 'flex' }} alignItems={'flex-start'} justifyContent={'flex-start'}>
                <Navbar />
                <Box sx={{
                    top: 0,
                    left: 0,
                    pl: '220px',
                    width: `calc(100% - 200px)`,
                    position: 'absolute',
                    py: 2,
                    textAlign: 'left'
                }}>
                    <Typography variant="h4" align="left" sx={{ mb: 2 }}>
                        Assignment Name
                    </Typography>
                    <Typography variant="body1" align="left" sx={{ mb: 2 }}>
                        Due date: xx/xx/xxxx
                    </Typography>
                    <Typography variant="h4" align="left" sx={{ mb: 2 }}>
                        Assignment File:
                    </Typography>
                    <a style={{ color: 'black', textDecoration: 'underline' }} href="#">assignment.pdf</a>
                    <Typography variant="h4" align="left" sx={{ mb: 2 }}>
                        Rubric
                    </Typography>
                    <a style={{ color: 'black', textDecoration: 'underline' }} href="#">rubric.pdf</a>
                    <Typography variant="h4" align="left" sx={{ mb: 2 }}>
                        Submission
                    </Typography>
                    <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                        {
                            submissions.map((submission) => {
                                return <SubmissionCard index={submission.index} submission={submission} key={submission.index} />
                            })
                        }
                    </div>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            Delete?
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure to delete?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button color="error" onClick={handleDelete} autoFocus>
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <div style={{ display: 'flex', marginTop: '10px', justifyContent: 'space-between' }}>
                        <Button variant="contained" color="error" onClick={handleClickOpen}>Delete</Button>
                        <Button variant="contained" sx={{ background: '#D9D9D9', color: 'black' }}>Edit</Button>
                    </div>
                </Box>

            </Box>
        </React.Fragment>
    );
}

