import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CircularProgress,
  circularProgressClasses,
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

// Animated Circular Progress Component
function CustomCircularProgress({ percent }) {
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    let current = 0;
    const increment = percent / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= percent) {
        current = percent;
        clearInterval(timer);
      }
      setProgress(current);
    }, 10);
    return () => clearInterval(timer);
  }, [percent]);

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        sx={{ color: "#E8DEF8" }}
        size={80}
        thickness={4}
        value={100}
      />
      <CircularProgress
        variant="determinate"
        disableShrink
        sx={{
          color: "#6750A4",
          animationDuration: "550ms",
          position: "absolute",
          left: 0,
          [`& .${circularProgressClasses.circle}`]: { strokeLinecap: "round" },
        }}
        size={80}
        value={progress}
        thickness={4}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="black"
          sx={{ fontWeight: "bold" }}
        >
          {`${Math.round(progress)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

// Submission Card Component
function SubmissionCard({ submission }) {
  const finishedPercentage = (submission.markers / submission.totalMarkers) * 100;
  const averagePercentage = (submission.averageMarkers / submission.totalMarkers) * 100;

  return (
    <Card
      sx={{
        background: "#D9D9D9",
        p: 2,
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
        Submission {submission.index}
      </Typography>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Card
          sx={{
            p: 2,
            width: 180,
            height: 180,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CustomCircularProgress percent={finishedPercentage} />
          <Typography sx={{ mt: 1, fontSize: "0.85rem", textAlign: "center" }}>
            {submission.markers}/{submission.totalMarkers} markers finished
          </Typography>
        </Card>
        <Card
          sx={{
            p: 2,
            width: 180,
            height: 180,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CustomCircularProgress percent={averagePercentage} />
          <Typography sx={{ mt: 1, fontSize: "0.85rem", textAlign: "center" }}>
            Current Average
          </Typography>
        </Card>
        <Card sx={{ p: 0, width: 180, height: 180 }}>
          <CardActionArea
            onClick={() => window.open(submission.file, "_blank")}
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DownloadIcon size={60} />
            <Typography sx={{ mt: 1, fontSize: "0.85rem", textAlign: "center" }}>
              Download Submission
            </Typography>
          </CardActionArea>
        </Card>
      </Box>
    </Card>
  );
}

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
export default function AssignmentPage({ assignmentId }) {
  const [submissions] = useState([
    { index: 1, markers: 2, totalMarkers: 5, averageMarkers: 3, file: "/files/submission1.pdf" },
    { index: 2, markers: 2, totalMarkers: 10, averageMarkers: 3, file: "/files/submission2.pdf" },
  ]);
  const [open, setOpen] = useState(false);
  const navbarWidth = 200;

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const assignmentFile = "sample.pdf";
  const rubricFile = "/files/rubric.pdf";

  const renderFileViewer = (file) => {
    if (file.endsWith(".pdf")) {
      return <PDFViewer file={file} />;
    } else if (file.match(/\.(jpg|jpeg|png|gif)$/)) {
      return <img src={file} alt="file preview" style={{ maxWidth: "100%", maxHeight: 400, borderRadius: 4 }} />;
    } else {
      return <Typography>Preview not available</Typography>;
    }
  };

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

          <Typography variant="h5" sx={{ mb: 1 }}>
            Assignment File:
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
            {renderFileViewer(assignmentFile)}
            <Button variant="outlined" onClick={() => downloadFile(assignmentFile)}>
              Download Assignment
            </Button>
          </Box>

          <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
            Rubric:
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
            {renderFileViewer(rubricFile)}
            <Button variant="outlined" onClick={() => downloadFile(rubricFile)}>
              Download Rubric
            </Button>
          </Box>

          <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
            Submissions
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {submissions.map((submission) => (
              <SubmissionCard submission={submission} key={submission.index} />
            ))}
          </Box>

          {/* Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button variant="contained" color="error" onClick={handleClickOpen}>
              Delete Assignment
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
        </Box>
      </Box>
    </>
  );
}
