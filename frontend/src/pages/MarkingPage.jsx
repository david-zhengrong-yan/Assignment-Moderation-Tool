// src/pages/MarkingPage.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  CssBaseline,
  Typography,
  Pagination,
  PaginationItem,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";

import { useParams, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import { Document, Page, pdfjs } from "react-pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import FitScreenIcon from "@mui/icons-material/FitScreen";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

// PDF Viewer Component (Zoom + Reset)
function PDFViewer({ submissionId }) {
  const [numPages, setNumPages] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [scale, setScale] = useState(1);
  const [containerWidth, setContainerWidth] = useState(600);

  const viewerRef = useRef(null);

  const onDocumentLoadSuccess = ({ numPages }) => setNumPages(numPages);

  // Adjust container width dynamically
  useEffect(() => {
    const updateWidth = () => setContainerWidth(Math.min(window.innerWidth / 2 - 60, 900));
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Fetch PDF
  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/submissions/${submissionId}/pdf/`,
          { method: "GET", headers: { "X-Session-ID": localStorage.getItem("sessionid") } }
        );
        if (!res.ok) throw new Error("Failed to fetch PDF");
        const blob = await res.blob();
        setPdfUrl(URL.createObjectURL(blob));
      } catch (err) {
        console.error("Error loading PDF:", err);
      }
    };
    if (submissionId) fetchPdf();
  }, [submissionId]);

  // Keyboard zoom (Ctrl + / Ctrl -)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!e.ctrlKey) return;
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        setScale((prev) => Math.min(prev + 0.2, 3));
      }
      if (e.key === "-") {
        e.preventDefault();
        setScale((prev) => Math.max(prev - 0.2, 0.5));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Mouse wheel zoom (Ctrl + wheel)
  useEffect(() => {
    const handleWheel = (e) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      if (e.deltaY < 0) setScale((prev) => Math.min(prev + 0.1, 3));
      if (e.deltaY > 0) setScale((prev) => Math.max(prev - 0.1, 0.5));
    };
    const el = viewerRef.current;
    if (el) el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el && el.removeEventListener("wheel", handleWheel);
  }, []);

  // Reset / Fit to width
  const handleResetZoom = () => setScale(1);

  if (!pdfUrl)
    return (
      <Box
        sx={{
          flex: 1,
          border: "1px solid #ccc",
          borderRadius: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#fafafa",
          height: "100%",
        }}
      >
        <Typography>Loading PDF...</Typography>
      </Box>
    );

  return (
    <Box
      ref={viewerRef}
      sx={{
        flex: 1,
        border: "1px solid #ccc",
        borderRadius: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#fff",
        overflow: "hidden",
      }}
    >
      {/* Zoom Controls */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1, gap: 1 }}>
        <IconButton size="small" onClick={() => setScale((prev) => Math.min(prev + 0.2, 3))}>
          <ZoomInIcon />
        </IconButton>
        <IconButton size="small" onClick={() => setScale((prev) => Math.max(prev - 0.2, 0.5))}>
          <ZoomOutIcon />
        </IconButton>
        <IconButton size="small" onClick={handleResetZoom}>
          <FitScreenIcon />
        </IconButton>
        <Typography variant="body2" sx={{ alignSelf: "center" }}>
          {(scale * 100).toFixed(0)}%
        </Typography>
      </Box>

      {/* PDF Pages */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": { width: 8 },
          "&::-webkit-scrollbar-thumb": { backgroundColor: "#ccc", borderRadius: 4 },
        }}
      >
        <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(numPages), (_, index) => (
            <Box
              key={`page_${index + 1}`}
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                borderRadius: 1,
                backgroundColor: "#fff",
              }}
            >
              <Page
                pageNumber={index + 1}
                width={containerWidth * scale}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            </Box>
          ))}
        </Document>
      </Box>
    </Box>
  );
}


// ---------------------------
// Criteria Card Component (unchanged)
// ---------------------------
const CriteriaCard = ({ criteria, mark, setMark, autoSave, highlightError }) => {
  const selectedIndex = mark.marks?.[criteria.id]?.level_index ?? null;

  const handleLevelSelect = (levelIndex) => {
    setMark((prev) => {
      const updatedMarks = {
        ...prev.marks,
        [criteria.id]: {
          ...prev.marks[criteria.id],
          level_index: levelIndex,
          score: criteria.cells[levelIndex]?.max || 0,
        },
      };
      if (autoSave) autoSave(updatedMarks);
      return { ...prev, marks: updatedMarks };
    });
  };

  return (
    <Box
      sx={{
        mb: 4,
        mt: 4,
        border: highlightError && selectedIndex === null ? "1px solid red" : "none",
        borderRadius: 1,
        p: highlightError && selectedIndex === null ? 1 : 0,
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 2, color: highlightError && selectedIndex === null ? "red" : "inherit" }}
      >
        {criteria.index}. {criteria.title}
      </Typography>

      <Pagination
        page={selectedIndex !== null ? selectedIndex + 1 : 0}
        shape="rounded"
        variant="outlined"
        sx={{ width: "100%" }}
        count={criteria.cells.length}
        color="primary"
        renderItem={(item) => {
          const isSelected = selectedIndex === item.page - 1;
          const display = isSelected ? "✓" : "";
          return (
            <PaginationItem
              {...item}
              sx={{
                flex: 1,
                bgcolor: isSelected ? "#66CCFF" : undefined,
                color: isSelected ? "#fff" : undefined,
              }}
              page={display}
              onClick={() => handleLevelSelect(item.page - 1)}
            />
          );
        }}
      />

      {selectedIndex !== null && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Typography variant="body1" sx={{ flex: 1, color: "#66CCFF" }}>
            {criteria.cells[selectedIndex].description}
          </Typography>
          <Typography variant="body1" sx={{ color: "#66CCFF" }}>
            {criteria.cells[selectedIndex].max} / {criteria.maxScore || criteria.totalMark || 0}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// ---------------------------
// Main Marking Page (unchanged)
// ---------------------------
export default function MarkingPage() {
  const { userId, assignmentId, submissionId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [criteria, setCriteria] = useState([]);
  const [mark, setMark] = useState({ marks: {}, is_finalized: false, id: null });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [finalizeError, setFinalizeError] = useState(false);
  const autoSaveTimer = useRef(null);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/${userId}/assignment/${assignmentId}/submission/${submissionId}/mark`,
          { headers: { "X-Session-ID": localStorage.getItem("sessionid") } }
        );
        const data = await res.json();
        if (!data.successful) throw new Error(data.message);

        setAssignment(data.assignment);
        setSubmission(data.submission);

        setMark({
          marks: data.mark.marks || {},
          is_finalized: data.mark.is_finalized || false,
          id: data.mark.id || null,
        });

        const crits = (data.assignment.mark_criteria.criteria || []).map((c, idx) => ({
          ...c,
          index: idx + 1,
        }));
        setCriteria(crits);
      } catch (err) {
        console.error(err);
        alert("Failed to load marking data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, assignmentId, submissionId]);

  const autoSaveDraft = (updatedMarks) => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/${userId}/assignment/${assignmentId}/submission/${submissionId}/mark`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Session-ID": localStorage.getItem("sessionid") },
            body: JSON.stringify({ marks: updatedMarks, is_finalized: false }),
          }
        );
        const data = await res.json();
        if (!data.successful) throw new Error(data.message);
        setSnackbarOpen(true);
      } catch (err) {
        console.error("Auto-save failed:", err);
      }
    }, 500);
  };

  const handleFinalize = async () => {
    const unmarked = criteria.filter((c) => mark.marks?.[c.id]?.level_index === undefined);
    if (unmarked.length > 0) {
      setFinalizeError(true);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8000/api/${userId}/assignment/${assignmentId}/submission/${submissionId}/mark`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Session-ID": localStorage.getItem("sessionid") },
          body: JSON.stringify({ marks: mark.marks, is_finalized: true }),
        }
      );
      const data = await res.json();
      if (!data.successful) throw new Error(data.message);

      setMark((prev) => ({ ...prev, is_finalized: true }));
      setFinalizeError(false);
      setSnackbarOpen(true);
      navigate(`/${userId}/marker/assignment/${assignmentId}`);
    } catch (err) {
      console.error(err);
      setFinalizeError(true);
    }
  };

  if (loading) return <CircularProgress sx={{ mt: 10, ml: 10 }} />;

  const totalScore = criteria.reduce((sum, c) => sum + (mark.marks?.[c.id]?.score || 0), 0);
  const maxScore = criteria.reduce((sum, c) => sum + (c.maxScore || c.totalMark || 0), 0);

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
        {/* Navbar */}
        <Box sx={{ width: 200, flexShrink: 0 }}>
          <Navbar />
        </Box>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, p: 4, bgcolor: "#fff", minWidth: 0 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            {submission?.name}
          </Typography>

          {/* Left PDF + Right Criteria */}
          <Box sx={{ display: "flex", width: "100%", minHeight: "80vh", gap: 2 }}>
            {/* Left PDF */}
            <Box sx={{ width: "50%", minWidth: 0, height: "calc(100vh - 160px)" }}>
              <PDFViewer submissionId={submissionId} />
            </Box>

            {/* Right Criteria */}
            <Box sx={{ width: "50%", minWidth: 0, display: "flex", flexDirection: "column", maxHeight: "calc(100vh - 160px)" }}>
              <Typography variant="h5" sx={{ mb: 2 }}>Criteria</Typography>
              <Box sx={{ flexGrow: 1, overflowY: "auto", pr: 1, scrollBehavior: "smooth", "&::-webkit-scrollbar": { width: 8 }, "&::-webkit-scrollbar-thumb": { backgroundColor: "#ccc", borderRadius: 4 } }}>
                {criteria.map((c) => (
                  <CriteriaCard key={c.id} criteria={c} mark={mark} setMark={setMark} autoSave={autoSaveDraft} highlightError={finalizeError} />
                ))}
              </Box>

              <Box sx={{ mt: 3, p: 2, borderTop: "1px solid #ccc", display: "flex", justifyContent: "flex-end" }}>
                <Typography variant="h6" sx={{ color: "#66CCFF" }}>Total Score: {totalScore} / {maxScore}</Typography>
              </Box>

              {finalizeError && <Alert severity="error" sx={{ mt: 2 }}>Please mark all criteria before finalizing!</Alert>}

              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                <Button variant="contained" onClick={() => navigate(`/${userId}/marker/assignment/${assignmentId}`)}>Go Back</Button>
                <Button variant="contained" color="success" onClick={handleFinalize} disabled={mark.is_finalized}>Finalize</Button>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Snackbar */}
        <Snackbar open={snackbarOpen} autoHideDuration={1500} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }} elevation={6} variant="filled">
            Draft saved
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}
