import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CssBaseline,
  Typography,
  Pagination,
  PaginationItem,
  CircularProgress,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { Document, Page, pdfjs } from "react-pdf";
import { useParams } from "react-router";

// ---------------------------
// PDF.js Worker setup for Vite
// ---------------------------
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

// ---------------------------
// PDF Viewer Component
// ---------------------------
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
        {Array.from(new Array(numPages), (_, index) => (
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

// ---------------------------
// Criteria Card Component
// ---------------------------
const CriteriaCard = ({ criteria, mark, setMark }) => {
  const [page, setPage] = useState(null); // null = no grade selected

  const selectedIndex = mark.marks?.[criteria.id]?.level_index ?? null;
  const selectedScore =
    selectedIndex !== null
      ? criteria.cells[selectedIndex]?.max || 0
      : 0;

  const handleLevelSelect = (levelIndex) => {
    setMark((prev) => ({
      ...prev,
      marks: {
        ...prev.marks,
        [criteria.id]: {
          ...prev.marks[criteria.id],
          level_index: levelIndex,
          score: criteria.cells[levelIndex]?.max || 0,
        },
      },
    }));
    setPage(levelIndex + 1);
  };

  return (
    <Box sx={{ mb: 4, mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {criteria.index}. {criteria.title}
      </Typography>

      <Pagination
        page={page || 0}
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
            {selectedScore} / {criteria.maxScore || criteria.totalMark || 0}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// ---------------------------
// Main Marking Page
// ---------------------------
export default function MarkingPage() {
  const { userId, assignmentId, submissionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [criteria, setCriteria] = useState([]);
  const [mark, setMark] = useState({ marks: {}, is_finalized: false, id: null });
  const navbarWidth = 200;

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/${userId}/assignment/${assignmentId}/submission/${submissionId}/mark`,
          {
            headers: { "X-Session-ID": localStorage.getItem("sessionid") },
          }
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

  // Save / Finalize handler
  const handleSave = async (finalize = false) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/${userId}/assignment/${assignmentId}/submission/${submissionId}/mark`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Session-ID": localStorage.getItem("sessionid"),
          },
          body: JSON.stringify({ marks: mark.marks, is_finalized: finalize }),
        }
      );
      const data = await res.json();
      if (!data.successful) throw new Error(data.message);
      alert(finalize ? "Mark finalized!" : "Draft saved!");
      setMark((prev) => ({ ...prev, is_finalized: finalize }));
    } catch (err) {
      console.error(err);
      alert("Failed to save mark.");
    }
  };

  if (loading) return <CircularProgress />;

  const totalScore = criteria.reduce(
    (sum, c) => sum + (mark.marks?.[c.id]?.score || 0),
    0
  );
  const maxScore = criteria.reduce(
    (sum, c) => sum + (c.maxScore || c.totalMark || 0),
    0
  );

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
          <Typography variant="h4" sx={{ mb: 2 }}>
            {submission.name}
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            {/* Left PDF */}
            <Box sx={{ width: "50%" }}>
              {submission.file_url ? (
                <PDFViewer
                  file={submission.file_url}
                />
              ) : (
                <Typography>No submission file uploaded</Typography>
              )}
            </Box>

            {/* Right Criteria */}
            <Box sx={{ width: "50%", overflowY: "auto", maxHeight: "80vh" }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Criteria
              </Typography>

              {criteria.map((c) => (
                <CriteriaCard key={c.id} criteria={c} mark={mark} setMark={setMark} />
              ))}

              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  borderTop: "1px solid #ccc",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Typography variant="h6" sx={{ color: "#66CCFF" }}>
                  Total Score: {totalScore} / {maxScore}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={() => handleSave(false)}
                  disabled={mark.is_finalized}
                >
                  Save Draft
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleSave(true)}
                  disabled={mark.is_finalized}
                >
                  Finalize
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
