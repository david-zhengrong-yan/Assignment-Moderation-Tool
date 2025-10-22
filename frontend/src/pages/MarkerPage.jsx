import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CssBaseline,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router";
import { parseDocxToRubric } from "../utils/rubricDocx"; // adjust import path
import { getApiBaseUrl } from "../constants"

export default function MarkerPage() {
  const navigate = useNavigate();
  const { userId, assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [rubric, setRubric] = useState(null); // parsed rubric JSON

  const navbarWidth = 200;

  // Fetch assignment metadata
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await fetch(
          `${getApiBaseUrl()}/api/${userId}/marker/assignment/${assignmentId}`
        );
        const data = await res.json();
        setAssignment(data);
      } catch (err) {
        console.error("Error fetching assignment:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [assignmentId]);

  // Fetch rubric DOCX and parse with mammoth
  useEffect(() => {
    if (!assignmentId) return;
    const fetchRubric = async () => {
      try {
        const res = await fetch(
          `${getApiBaseUrl()}/api/assignment/${assignmentId}/rubric/download`
        );
        const blob = await res.blob();
        const file = new File([blob], "rubric.docx", { type: blob.type });
        const parsed = await parseDocxToRubric(file);
        setRubric(parsed);
      } catch (err) {
        console.error("Error parsing rubric docx:", err);
      }
    };
    fetchRubric();
  }, [assignmentId]);

  if (loading) return <div>Loading...</div>;
  if (!assignment) return <div>No assignment found</div>;

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleFeedbackOpen = () => setFeedbackOpen(true);
  const handleFeedbackClose = () => setFeedbackOpen(false);

  // Helper to download any file
  const downloadFile = async (url, filename) => {
    const res = await fetch(url);
    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  console.log(assignment);

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
          }}
        >
          <Typography variant="h4">{assignment.name}</Typography>
          <Typography sx={{ mb: 2 }}>
            Due date: {new Date(assignment.due_date).toLocaleDateString()}
          </Typography>

          {/* Assignment file */}
          <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
            Assignment File:
          </Typography>
          <Button
            variant="outlined"
            onClick={() =>
              downloadFile(
                `${getApiBaseUrl()}/api/assignment/${assignmentId}/download/`,
                "assignment.pdf"
              )
            }
          >
            Download Assignment
          </Button>

          {/* Rubric */}
          <Typography variant="h5" sx={{ mt: 3, mb: 1 }}>
            Rubric:
          </Typography>
          <Button
            variant="outlined"
            onClick={() =>
              downloadFile(
                `${getApiBaseUrl()}/api/assignment/${assignmentId}/rubric/download/`,
                "rubric.docx"
              )
            }
          >
            Download Rubric
          </Button>

          {/* Rubric table generated from DOCX */}
          {rubric && (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Criterion</strong></TableCell>
                    {rubric.levels.map((level) => (
                      <TableCell key={level.id} align="center">
                        <strong>{level.name}</strong>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rubric.criteria.map((crit) => (
                    <TableRow key={crit.id}>
                      <TableCell>{crit.title}</TableCell>
                      {crit.cells.map((cell, i) => (
                        <TableCell key={i}>{cell.description}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Submissions */}
          <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
            Submissions
          </Typography>
          {assignment.submissions.map((submission) => (
            <Box
              key={submission.id}
              sx={{
                display: "flex",
                background: "#D9D9D9",
                p: 1,
                borderRadius: 1,
                alignItems: "center",
                mb: 1,
              }}
            >
              <Box sx={{ width: "33%" }}>{submission.name}</Box>
              <Box sx={{ width: "33%" }}>
                {submission.marks.some((m) => m.is_finalized)
                  ? "Completed"
                  : "Incomplete"}
              </Box>
              <Box sx={{ width: "33%" }}>
                {submission.marks.some((m) => m.is_finalized) ? (
                  <Button onClick={handleFeedbackOpen}>Send Feedback</Button>
                ) : (
                  <Button
                    variant="outlined"
                    sx={{ ml: 1 }}
                    onClick={() => navigate(`/${userId}/assignment/${assignmentId}/submission/${submission.id}/mark`)}
                  >
                    Mark
                  </Button>
                )}
                <Button
                  variant="outlined"
                  sx={{ ml: 1 }}
                  onClick={() =>
                    downloadFile(
                      `${getApiBaseUrl()}/api/submission/${submission.id}/download/`,
                      `${submission.name}.pdf`
                    )
                  }
                >
                  Download Submission
                </Button>
              </Box>
            </Box>
          ))}

          {/* Delete Dialog */}
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Delete Assignment?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this assignment?
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
                Feedback Already Sent to Student's Email.
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
