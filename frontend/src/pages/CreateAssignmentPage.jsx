// src/pages/CreateAssignmentPage.jsx
import * as React from "react";
import {
  Box,
  Grid,
  Container,
  CssBaseline,
  Typography,
  TextField,
  Paper,
  Button,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Snackbar,
  Alert,
} from "@mui/material";
import { UploadFile } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Navbar from "../components/Navbar";
import { parseDocxToRubric } from "../utils/rubricDocx";
import RubricEditor from "../components/RubricEditor";

const LEFT_NAV_WIDTH = 200;

export default function CreateAssignmentPage() {
  // Assignment state
  const [name, setName] = React.useState("");
  const [dueDate, setDueDate] = React.useState(dayjs());
  const [assignmentFile, setAssignmentFile] = React.useState(null);

  // Rubric state
  const [rubricFile, setRubricFile] = React.useState(null);
  const [rubric, setRubric] = React.useState({ levels: [], criteria: [] });

  // Submissions state
  const [sub1File, setSub1File] = React.useState(null);
  const [sub2File, setSub2File] = React.useState(null);
  const [sub1Feedback, setSub1Feedback] = React.useState("");
  const [sub2Feedback, setSub2Feedback] = React.useState("");
  const [submissionMarks, setSubmissionMarks] = React.useState({ sub1: {}, sub2: {} });

  // Snackbar state
  const [snackbar, setSnackbar] = React.useState({ open: false, message: "", severity: "error" });
  const showSnackbar = (message, severity = "error") => setSnackbar({ open: true, message, severity });
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const textFieldSx = {
    "& .MuiInputBase-root": { borderRadius: 2, bgcolor: "#F0F1F3" },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ccc" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#999" },
  };

  // --- Handlers ---
  const handleSingleUpload = (setter) => (e) => {
    const file = e.target.files?.[0];
    if (file) setter(file);
    e.target.value = "";
  };

  const deleteSingleFile = (setter) => () => setter(null);

  const handleImportRubric = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRubricFile(file);
    try {
      const parsed = await parseDocxToRubric(file);
      setRubric(parsed);
      setSubmissionMarks({ sub1: {}, sub2: {} }); // Reset marks
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to import rubric. Please check the document format.");
      setRubricFile(null);
    } finally {
      e.target.value = "";
    }
  };

  const deleteRubricFile = () => {
    setRubricFile(null);
    setRubric({ levels: [], criteria: [] });
    setSubmissionMarks({ sub1: {}, sub2: {} });
  };

  const handleLevelSelect = (sub, criterionId, levelId) => {
    setSubmissionMarks((prev) => ({
      ...prev,
      [sub]: { ...prev[sub], [criterionId]: levelId },
    }));
  };

  const getSubmissionTotal = (sub) => {
    if (!rubric.criteria.length) return { achieved: 0, max: 0 };
    let achieved = 0;
    let max = 0;
    rubric.criteria.forEach((c) => {
      const selectedLevelId = submissionMarks[sub]?.[c.id];
      if (selectedLevelId) {
        const idx = rubric.levels.findIndex((lvl) => lvl.id === selectedLevelId);
        const cell = c.cells?.[idx];
        if (cell?.max) achieved += cell.max;
      }
      const criterionMax = c.cells?.reduce((acc, cell) => (cell.max > acc ? cell.max : acc), 0) || 0;
      max += criterionMax;
    });
    return { achieved, max };
  };

  const handleCancel = () => window.history.back();

  // --- Create Assignment with validation ---
  const handleCreate = () => {
    // Validate assignment
    if (!name.trim()) return showSnackbar("Please enter the assignment name.");
    if (!dueDate) return showSnackbar("Please select the due date.");
    if (!assignmentFile) return showSnackbar("Please upload the assignment file.");

    // Validate rubric
    if (!rubricFile) return showSnackbar("Please upload the rubric file.");
    if (!rubric.criteria.length) return showSnackbar("Rubric is empty or invalid.");

    // Validate submissions
    const submissionKeys = ["sub1", "sub2"];
    for (const sub of submissionKeys) {
      const file = sub === "sub1" ? sub1File : sub2File;
      if (!file) return showSnackbar(`Please upload the file for submission ${sub === "sub1" ? "1" : "2"}.`);

      const marks = submissionMarks[sub];
      for (const c of rubric.criteria) {
        if (!marks[c.id]) return showSnackbar(`Please select a mark for "${c.title}" in submission ${sub === "sub1" ? "1" : "2"}.`);
      }
    }

    // Construct payload
    const payload = {
      name,
      dueDate: dueDate?.toISOString(),
      assignmentFile,
      rubricFile,
      rubric,
      submissions: [
        { file: sub1File, feedback: sub1Feedback, marks: submissionMarks.sub1 },
        { file: sub2File, feedback: sub2Feedback, marks: submissionMarks.sub2 },
      ],
      totals: { sub1: getSubmissionTotal("sub1"), sub2: getSubmissionTotal("sub2") },
    };

    console.log("Create Assignment payload:", payload);
    showSnackbar("Assignment created successfully!", "success");

    // TODO: POST payload to backend
  };

  // --- Render ---
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CssBaseline />
      <Navbar />
      <Box
        component="main"
        sx={{
          ml: `${LEFT_NAV_WIDTH}px`,
          bgcolor: "#FFFFFF",
          minHeight: "100vh",
          width: "100%",
          overflowX: "hidden",
          pb: 5,
        }}
      >
        <Container maxWidth={false} sx={{ py: 5 }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Create Assignment
          </Typography>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: "#FFFFFF", width: "100%" }}>
            <Box container="true" spacing={6}>
              {/* Assignment Name */}
              <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Grid item xs={12} sm={3}>
                  <Typography>Assignment Name:</Typography>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <TextField
                    label="Enter assignment name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={textFieldSx}
                    fullWidth
                  />
                </Grid>
              </Grid>

              {/* Due Date */}
              <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Grid item xs={12} sm={3}>
                  <Typography>Due Date:</Typography>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <DatePicker
                    value={dueDate}
                    onChange={setDueDate}
                    slotProps={{ textField: { size: "small", sx: textFieldSx, fullWidth: true } }}
                  />
                </Grid>
              </Grid>

              {/* Assignment File */}
              <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Grid item xs={12} sm={3}>
                  <Typography>Assignment File:</Typography>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {assignmentFile && <Chip label={assignmentFile.name} onDelete={deleteSingleFile(setAssignmentFile)} />}
                    {!assignmentFile && (
                      <Button component="label" startIcon={<UploadFile />} variant="outlined" size="small">
                        Upload (.pdf, .doc, .xls, .md)
                        <input hidden type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.md" onChange={handleSingleUpload(setAssignmentFile)} />
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>

              {/* Rubric File */}
              <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
                <Grid item xs={12} sm={3}>
                  <Typography>Rubric:</Typography>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
                    {rubricFile && <Chip label={rubricFile.name} onDelete={deleteRubricFile} color="primary" />}
                    {!rubricFile && (
                      <Button component="label" startIcon={<UploadFile />} variant="outlined" size="small">
                        Import rubric (.docx)
                        <input hidden type="file" accept=".docx" onChange={handleImportRubric} />
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>

              {/* Rubric Editor (Preview) */}
              {rubric?.levels?.length > 0 && (
                <Box sx={{ mt: 2, width: "100%" }}>
                  <RubricEditor rubric={rubric} setRubric={setRubric} previewMode />
                </Box>
              )}

              {/* Submissions */}
              {["sub1", "sub2"].map((sub) => {
                const file = sub === "sub1" ? sub1File : sub2File;
                const setFile = sub === "sub1" ? setSub1File : setSub2File;
                const feedback = sub === "sub1" ? sub1Feedback : sub2Feedback;
                const setFeedback = sub === "sub1" ? setSub1Feedback : setSub2Feedback;
                const subNumber = sub === "sub1" ? "1" : "2";

                return (
                  <React.Fragment key={sub}>
                    {/* Submission File */}
                    <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                      <Grid item xs={12} sm={3}>
                        <Typography>Submission {subNumber}:</Typography>
                      </Grid>
                      <Grid item xs={12} sm={9}>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                          {file && <Chip label={file.name} onDelete={deleteSingleFile(setFile)} size="small" />}
                          {!file && (
                            <Button
                              component="label"
                              variant="outlined"
                              size="small"
                              startIcon={<UploadFile />}
                              sx={{ textTransform: "none" }}
                            >
                              Upload {subNumber === "1" ? "(.pdf, .doc)" : "(.pdf, .md)"}
                              <input hidden type="file" accept={subNumber === "1" ? ".pdf,.doc,.docx" : ".pdf,.md"} onChange={handleSingleUpload(setFile)} />
                            </Button>
                          )}
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Marking Table */}
                    {rubric?.criteria?.length > 0 && (
                      <Box sx={{ my: 2, overflowX: "auto" }}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                          Enter Marks for Submission {subNumber}
                        </Typography>
                        <Table sx={{ minWidth: 600 }}>
                          <TableHead>
                            <TableRow>
                              <TableCell>Criterion</TableCell>
                              {rubric.levels.map((level) => (
                                <TableCell key={level.id} align="center">
                                  {level.name}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {rubric.criteria.map((c) => (
                              <TableRow key={c.id}>
                                <TableCell>{c.title}</TableCell>
                                {rubric.levels.map((level) => {
                                  const selectedLevel = submissionMarks[sub]?.[c.id];
                                  const isSelected = selectedLevel === level.id;
                                  return (
                                    <TableCell key={level.id} align="center">
                                      <Chip
                                        label={level.name}
                                        color={isSelected ? "primary" : "default"}
                                        variant={isSelected ? "filled" : "outlined"}
                                        onClick={() => handleLevelSelect(sub, c.id, level.id)}
                                        clickable
                                      />
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell colSpan={rubric.levels.length + 1} align="right">
                                <Typography variant="subtitle1" fontWeight="bold">
                                  Total Score: {getSubmissionTotal(sub).achieved} / {getSubmissionTotal(sub).max}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>
                    )}

                    {/* Feedback */}
                    <TextField
                      fullWidth
                      multiline
                      minRows={3}
                      label={`Submission ${subNumber} Feedback (optional)`}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      sx={{ ...textFieldSx, mb: 3 }}
                    />
                  </React.Fragment>
                );
              })}

              {/* Footer Buttons */}
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                <Button variant="outlined" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleCreate}>
                  Create
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
}
