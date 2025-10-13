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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { DownloadIcon, EyeIcon } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { useParams, useNavigate } from "react-router-dom";
import { parseDocxToRubric } from "../utils/rubricDocx";

// PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// ---------------------
// Circular Progress with raw number
// ---------------------
function CustomCircularProgress({ percent, label }) {
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
      <CircularProgress variant="determinate" sx={{ color: "#E8DEF8" }} size={80} thickness={4} value={100} />
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
        <Typography variant="caption" component="div" sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
          {label}
        </Typography>
      </Box>
    </Box>
  );
}

// ---------------------
// Submission Card
// ---------------------
function SubmissionCard({ submission, downloadFile, onViewDetails }) {
  const finishedPercent = submission.totalMarkers
    ? (submission.markersFinished / submission.totalMarkers) * 100
    : 0;
  const averagePercent = submission.totalMarkers
    ? (submission.averageScore / submission.totalMarkers) * 100
    : 0;

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
        {/* Markers Finished */}
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
          <CustomCircularProgress percent={finishedPercent} label={submission.markersFinished} />
          <Typography sx={{ mt: 1, fontSize: "0.85rem", textAlign: "center" }}>
            {submission.totalMarkers} markers total
          </Typography>
        </Card>

        {/* Average Score */}
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
          <CustomCircularProgress percent={averagePercent} label={submission.averageScore.toFixed(1)} />
          <Typography sx={{ mt: 1, fontSize: "0.85rem", textAlign: "center" }}>Current Average</Typography>
        </Card>

        {/* Download Submission */}
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

        {/* View Details */}
        <Card sx={{ p: 0, width: 180, height: 180 }}>
          <CardActionArea
            onClick={() => onViewDetails(submission)}
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <EyeIcon size={60} />
            <Typography sx={{ mt: 1, fontSize: "0.85rem", textAlign: "center" }}>View Details</Typography>
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
    <Box sx={{ border: "1px solid #ccc", borderRadius: 2, overflowY: "auto", maxHeight: 600, p: 1, mb: 1 }}>
      <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (_, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} width={containerWidth} />
        ))}
      </Document>
    </Box>
  );
}

// ---------------------
// Main Assignment Page
// ---------------------
export default function AssignmentPage() {
  const { userId, assignmentId } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [rubric, setRubric] = useState(null);

  const navbarWidth = 200;
  const API_BASE = "http://localhost:8000/api";

  useEffect(() => {
    async function fetchAssignment() {
      try {
        const res = await fetch(`${API_BASE}/assignment/${assignmentId}`);
        if (!res.ok) throw new Error("Failed to fetch assignment");
        const data = await res.json();

        const assignmentData = {
          ...data.assignment,
          downloadUrl: `${API_BASE}/assignment/${assignmentId}/download/`,
          rubricDownloadUrl: `${API_BASE}/assignment/${assignmentId}/rubric/download/`,
        };

        let submissionsData = (data.submissions || []).map((sub, idx) => ({
          ...sub,
          index: idx + 1,
          downloadUrl: `${API_BASE}/submission/${sub.id}/download/`,
          markersFinished: 0,
          averageScore: 0,
          totalMarkers: sub.totalMarkers || 0,
        }));

        // Fetch marks for each submission
        for (let i = 0; i < submissionsData.length; i++) {
          const sub = submissionsData[i];
          try {
            const resMarks = await fetch(`${API_BASE}/submission/${sub.id}/marks`);
            if (!resMarks.ok) throw new Error("Failed to fetch marks");
            const marksData = (await resMarks.json()).marks || [];
            const finalizedMarks = marksData.filter((m) => m.isFinalized);
            const markersFinished = finalizedMarks.length;
            const averageScore =
              finalizedMarks.length > 0
                ? finalizedMarks.reduce((sum, m) => {
                    const total = Object.values(m.marks).reduce((a, b) => a + b, 0);
                    return sum + total;
                  }, 0) / finalizedMarks.length
                : 0;
            submissionsData[i] = { ...sub, markersFinished, averageScore };
          } catch (err) {
            console.error("Failed to fetch marks for submission:", sub.id, err);
          }
        }

        setAssignment(assignmentData);
        setSubmissions(submissionsData);

        // Fetch rubric
        if (assignmentData.rubricDownloadUrl) {
          const resRubric = await fetch(assignmentData.rubricDownloadUrl);
          if (!resRubric.ok) throw new Error("Failed to fetch rubric file");
          const file = await resRubric.blob();
          const parsedRubric = await parseDocxToRubric(file);
          setRubric(parsedRubric);
        }
      } catch (err) {
        console.error("Error:", err);
        alert("Failed to load assignment.");
      } finally {
        setLoading(false);
      }
    }

    fetchAssignment();
  }, [assignmentId]);

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

  const renderRubricTable = () => {
    if (!rubric) return <Typography>Loading rubric...</Typography>;

    return (
      <Table sx={{ border: "1px solid #ccc", mb: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Criteria</TableCell>
            {rubric.levels.map((level) => (
              <TableCell key={level.id} sx={{ fontWeight: "bold" }}>
                {level.name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rubric.criteria.map((c) => (
            <TableRow key={c.id}>
              <TableCell>{c.title}</TableCell>
              {c.cells.map((cell, idx) => (
                <TableCell key={idx}>{cell.description}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_BASE}/assignment/${assignmentId}/delete/`, { method: "DELETE" });
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
        <Box component="main" sx={{ flexGrow: 1, ml: `${navbarWidth}px`, p: 4, bgcolor: "#ffffff", boxSizing: "border-box" }}>
          <Typography variant="h4" sx={{ mb: 1 }}>
            {assignment.name}
          </Typography>
          <Typography sx={{ mb: 2 }}>Due date: {assignment.due_date || "N/A"}</Typography>

          {/* Assignment File */}
          <Typography variant="h5" sx={{ mb: 1 }}>
            Assignment File:
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
            <Button variant="outlined" onClick={() => downloadFile(assignment.downloadUrl)}>
              Download Assignment
            </Button>
          </Box>

          {/* Rubric Table */}
          <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
            Rubric:
          </Typography>
          {renderRubricTable()}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
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
              submissions.map((submission) => (
                <SubmissionCard
                  key={submission.id}
                  submission={submission}
                  downloadFile={downloadFile}
                  onViewDetails={(sub) => navigate(`/${userId}/assignment/${assignmentId}/submission/${sub.id}/marks`)}
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
            <Button
              variant="contained"
              sx={{ background: "#D9D9D9", color: "black" }}
              onClick={() => navigate(`/${userId}/assignment/${assignmentId}/edit`)}
            >
              Edit
            </Button>
          </Box>

          {/* Delete Confirm Dialog */}
          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Delete Assignment?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this assignment? All submissions and marks will be deleted. This cannot be undone.
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
