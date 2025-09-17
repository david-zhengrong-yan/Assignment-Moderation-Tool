import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CircularProgress,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { DownloadIcon } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";

// Set worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


// Full PDF Viewer Component
function PDFViewer({ file }) {
  const [numPages, setNumPages] = useState(null);
  const [containerWidth, setContainerWidth] = useState(600);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Responsive width
  React.useEffect(() => {
    const updateWidth = () => {
      const width = Math.min(window.innerWidth - 250, 800); // navbar + padding accounted
      setContainerWidth(width);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <Box
      sx={{
        border: "1px solid #ccc",
        borderRadius: 2,
        overflowY: "auto",
        maxHeight: 600,
        p: 1,
        mb: 1,
      }}
    >
      <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={containerWidth}
          />
        ))}
      </Document>
    </Box>
  );
}

// Main Assignment Page
export default function MarkerPage() {
  const [submissions, setSubmissions] = useState([
    { index: 1, completed: false },
    { index: 2, completed: true },
  ]);
  const [open, setOpen] = useState(false);
  const navbarWidth = 200;

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const handleFeedbackOpen = () => setFeedbackOpen(true);
  const handleFeedbackClose = () => setFeedbackOpen(false);

  const rubricFile = "/files/rubric.pdf";

  const downloadFile = (file) => {
    const link = document.createElement("a");
    link.href = file;
    link.download = file.split("/").pop();
    link.click();
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
        <Navbar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            ml: `${navbarWidth}px`,
            p: 4,
            bgcolor: "#ffffff",
            boxSizing: "border-box",
          }}
        >
          <Typography variant="h4" sx={{ mb: 1 }}>
            Assignment Name
          </Typography>
          <Typography sx={{ mb: 2 }}>Due date: xx/xx/xxxx</Typography>

          <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
            Rubric:
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
            <Button variant="outlined" onClick={() => downloadFile(rubricFile)}>
              Download Rubric
            </Button>
          </Box>

          <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
            Submissions
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {
              submissions.map(submission => {
                return (
                  <div style={{ display: 'flex', background: '#D9D9D9', padding: '5px', borderRadius: '5px', alignItems: 'center', justifyContent: 'center' }} key={submission.index}>
                    <div style={{width: '33%'}}>
                      Submission{submission.index}
                    </div>
                    <div style={{width: '33%'}}>
                      {
                        submission.completed ? 'Completed' : 'Incomplete'
                      }
                    </div>
                    <div style={{width: '33%'}}>
                      {
                        submission.completed ? <Button onClick={handleFeedbackOpen}>Send Feedback</Button> : <Button>Mark</Button>
                      }
                    </div>
                  </div>
                )
              })
            }
          </Box>

          {/* Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button variant="contained" color="error" onClick={handleClickOpen}>
              Delete
            </Button>
            <Button variant="contained" sx={{ background: "#D9D9D9", color: "black" }}>
              Edit
            </Button>
          </Box>

          {/* Delete Dialog */}
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Delete Assignment?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this assignment? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button color="error" onClick={() => alert("Delete logic here")}>
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          {/* Feedback Dialog */}
          <Dialog open={feedbackOpen} onClose={handleFeedbackClose}>
            <DialogContent>
              <DialogContentText>
                Feedback Already Send to your Email.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleFeedbackClose}>Continue</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </>
  );
}
