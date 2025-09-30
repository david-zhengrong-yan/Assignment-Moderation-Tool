import React, { useState, useEffect } from "react";
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
import { useParams, useNavigate } from "react-router-dom";

// PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// ---------------------
// Animated Circular Progress
// ---------------------
function CustomCircularProgress({ percent }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
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
        <Typography variant="caption" component="div" sx={{ fontWeight: "bold" }}>
          {`${Math.round(progress)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

// ---------------------
// Submission Card
// ---------------------
function SubmissionCard({ submission, downloadFile }) {
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
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
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
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <CustomCircularProgress percent={averagePercentage} />
          <Typography sx={{ mt: 1, fontSize: "0.85rem", textAlign: "center" }}>
            Current Average
          </Typography>
        </Card>
        <Card sx={{ p: 0, width: 180, height: 180 }}>
          <CardActionArea
            onClick={() => downloadFile(submission.downloadUrl)}
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

// ---------------------
// PDF Viewer
// ---------------------
function PDFViewer({ file }) {
  const [numPages, setNumPages] = useState(null);
  const [containerWidth, setContainerWidth] = useState(600);

  const onDocumentLoadSuccess = ({ numPages }) => setNumPages(numPages);

  useEffect(() => {
    const updateWidth = () => {
      const width = Math.min(window.innerWidth - 250, 800);
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

// ---------------------
// Main Page
// ---------------------
export default function AssignmentPage() {
  const { userId, assignmentId } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const navbarWidth = 200;
  const API_BASE = "http://localhost:8000/api";

  // Fetch assignment info
  useEffect(() => {
    async function fetchAssignment() {
      try {
        const res = await fetch(`${API_BASE}/assignment/${assignmentId}`);
        if (!res.ok) throw new Error("Failed to fetch assignment");
        const data = await res.json();

        // Add direct download URLs for frontend
        const assignmentData = {
          ...data.assignment,
          downloadUrl: `${API_BASE}/assignment/${assignmentId}/download/`,
          rubricDownloadUrl: `${API_BASE}/assignment/${assignmentId}/rubric/download/`,
        };
        const submissionsData = (data.submissions || []).map((sub) => ({
          ...sub,
          downloadUrl: `${API_BASE}/submission/${sub.id}/download/`,
        }));

        setAssignment(assignmentData);
        setSubmissions(submissionsData);
      } catch (err) {
        console.error("Error:", err);
        alert("Failed to load assignment.");
      } finally {
        setLoading(false);
      }
    }
    fetchAssignment();
  }, [assignmentId]);

  // ---------------------
  // File download as blob
  // ---------------------
  const downloadFile = async (fileUrl) => {
    try {
      const res = await fetch(fileUrl);
      if (!res.ok) throw new Error("Failed to download file");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileUrl.split("/").pop();
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Download failed: " + err.message);
    }
  };

  const renderFileViewer = (file) => {
    if (!file) return <Typography>No file uploaded</Typography>;
    if (file.endsWith(".pdf")) return <PDFViewer file={file} />;
    if (file.match(/\.(jpg|jpeg|png|gif)$/))
      return (
        <img
          src={file}
          alt="file preview"
          style={{ maxWidth: "100%", maxHeight: 400, borderRadius: 4 }}
        />
      );
    return <Typography>Preview not available</Typography>;
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_BASE}/assignment/${assignmentId}/delete/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete assignment");
      navigate(`/${userId}/home`, { replace: true });
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Error deleting assignment: " + err.message);
    }
  };

  if (loading) return <Typography sx={{ m: 4 }}>Loading...</Typography>;
  if (!assignment) return <Typography sx={{ m: 4 }}>Assignment not found</Typography>;

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
            {assignment.name}
          </Typography>
          <Typography sx={{ mb: 2 }}>Due date: {assignment.due_date || "N/A"}</Typography>

          {/* Assignment File */}
          <Typography variant="h5" sx={{ mb: 1 }}>
            Assignment File:
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
            {renderFileViewer(assignment.assignment_file)}
            <Button variant="outlined" onClick={() => downloadFile(assignment.downloadUrl)}>
              Download Assignment
            </Button>
          </Box>

          {/* Rubric File */}
          <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
            Rubric:
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
            {renderFileViewer(assignment.rubric)}
            <Button variant="outlined" onClick={() => downloadFile(assignment.rubricDownloadUrl)}>
              Download Rubric
            </Button>
          </Box>

          {/* Submissions */}
          <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
            Submissions
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {submissions.length > 0 ? (
              submissions.map((submission, idx) => (
                <SubmissionCard
                  submission={{ index: idx + 1, ...submission }}
                  key={submission.id}
                  downloadFile={downloadFile}
                />
              ))
            ) : (
              <Typography>No submissions yet</Typography>
            )}
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button variant="contained" color="error" onClick={() => setOpen(true)}>
              Delete Assignment
            </Button>
            <Button variant="contained" sx={{ background: "#D9D9D9", color: "black" }}>
              Edit
            </Button>
          </Box>

          {/* Delete Confirm Dialog */}
          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Delete Assignment?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this assignment? All submissions and marks will
                be deleted. This cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button color="error" onClick={handleDelete}>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </>
  );
}
