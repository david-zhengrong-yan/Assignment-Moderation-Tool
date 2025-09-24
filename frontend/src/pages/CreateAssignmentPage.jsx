// src/pages/CreateAssignmentPage.jsx
// Adds: DOCX rubric import + editable rubric table + submit structured rubric.

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
  IconButton,
  Chip,
  Tooltip,
  Stack,
} from "@mui/material";
import {
  InfoOutlined,
  DeleteOutline,
  AddCircleOutline,
  UploadFile,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Navbar from "../components/Navbar";

// NEW: rubric parser + editor
import { parseDocxToRubric } from "../utils/rubricDocx";
import RubricEditor from "../components/RubricEditor";

const LEFT_NAV_WIDTH = 200;

export default function CreateAssignmentPage() {
  // ===== Form state =====
  const [name, setName] = React.useState("");
  const [dueDate, setDueDate] = React.useState(dayjs());

  const [assignmentFiles, setAssignmentFiles] = React.useState([]);
  const [rubric, setRubric] = React.useState({ levels: [], criteria: [] });

  const [sub1Files, setSub1Files] = React.useState([]);
  const [sub2Files, setSub2Files] = React.useState([]);
  const [sub1Feedback, setSub1Feedback] = React.useState("");
  const [sub2Feedback, setSub2Feedback] = React.useState("");

  const [questions, setQuestions] = React.useState([
    { id: 1, title: "Question 1", full: "", m1: "", m2: "", rule: "" },
  ]);
  const nextId = React.useRef(2);

  // ===== Helpers =====
  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: nextId.current++,
        title: `Question ${prev.length + 1}`,
        full: "",
        m1: "",
        m2: "",
        rule: "",
      },
    ]);
  };
  const updateQuestion = (id, key, value) =>
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [key]: value } : q))
    );
  const removeQuestion = (id) =>
    setQuestions((prev) => prev.filter((q) => q.id !== id));

  const onUpload = (setter) => (e) => {
    const files = Array.from(e.target.files || []);
    setter((prev) => [...prev, ...files]);
    e.target.value = "";
  };
  const deleteFileAt = (setter) => (idx) =>
    setter((prev) => prev.filter((_, i) => i !== idx));

  // ===== Rubric import (.docx) =====
  const handleImportRubric = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const parsed = await parseDocxToRubric(f);
      setRubric(parsed);
    } catch (err) {
      console.error(err);
      alert("Failed to import rubric. Please check the document format.");
    } finally {
      e.target.value = "";
    }
  };

  // ===== Validation =====
  const hasInvalid = questions.some(
    (q) => Number(q.m1 || 0) + Number(q.m2 || 0) > Number(q.full || 0)
  );

  // ===== Actions =====
  const handleCancel = () => window.history.back();
  const handleCreate = () => {
    if (hasInvalid) {
      alert("❌ Error: Some questions have m1 + m2 exceeding Full Mark.");
      return;
    }
    const payload = {
      name,
      dueDate: dueDate?.toISOString(),
      assignmentFiles,
      rubric, // send structured rubric (levels + criteria[maxScore/requireComment/cells])
      questions,
      submissions: [
        { files: sub1Files, feedback: sub1Feedback },
        { files: sub2Files, feedback: sub2Feedback },
      ],
    };
    console.log("Create Assignment payload:", payload);
    // TODO: POST to your API
  };

  // ===== Styling =====
  const textFieldSx = {
    bgcolor: "#F0F1F3",
    "& .MuiInputBase-root": { borderRadius: 2 },
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CssBaseline />
      <Navbar />

      <Box
        component="main"
        sx={{ ml: `${LEFT_NAV_WIDTH}px`, bgcolor: "#FFFFFF", width: "auto" }}
      >
        <Container maxWidth={false} sx={{ py: 5 }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Create Assignment
          </Typography>

          <Paper
            elevation={0}
            sx={{ p: 3, borderRadius: 2, bgcolor: "white", minHeight: "100vh" }}
          >
            <Box container="true" spacing={6}>
              {/* Assignment Name */}
              <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Grid item xs={3}>
                  <Typography>Assignment Name:</Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    label="Enter assignment name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={textFieldSx}
                  />
                </Grid>
              </Grid>

              {/* Due Date */}
              <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Grid item xs={3}>
                  <Typography>Due Date:</Typography>
                </Grid>
                <Grid item xs={9}>
                  <DatePicker
                    value={dueDate}
                    onChange={setDueDate}
                    slotProps={{
                      textField: {
                        size: "small",
                        sx: textFieldSx,
                        fullWidth: true,
                      },
                    }}
                  />
                </Grid>
              </Grid>

              {/* Assignment File */}
              <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Grid item xs={3}>
                  <Typography>Assignment File:</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {assignmentFiles.map((f, i) => (
                      <Chip
                        key={i}
                        label={f.name}
                        onDelete={() => deleteFileAt(setAssignmentFiles)(i)}
                      />
                    ))}
                    <Button
                      component="label"
                      startIcon={<UploadFile />}
                      variant="outlined"
                      size="small"
                    >
                      Upload (.pdf, .doc, .xls, .md)
                      <input
                        hidden
                        multiple
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.md"
                        onChange={onUpload(setAssignmentFiles)}
                      />
                    </Button>
                  </Box>
                </Grid>
              </Grid>

              {/* Rubric Import + Editor */}
              <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
                <Grid item xs={3}>
                  <Typography>Rubric:</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Button
                    component="label"
                    startIcon={<UploadFile />}
                    variant="outlined"
                    size="small"
                  >
                    Import rubric (.docx)
                    <input
                      hidden
                      type="file"
                      accept=".docx"
                      onChange={handleImportRubric}
                    />
                  </Button>
                </Grid>
              </Grid>

              {rubric?.levels?.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <RubricEditor rubric={rubric} setRubric={setRubric} />
                </Box>
              )}

              {/* Questions (keep your existing section)
              <Stack container="true" spacing={2} sx={{ mb: 2, mt: 4 }}>
                <Box item="true" xs={12}>
                  <Typography
                    sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                  >
                    Question:
                    <Tooltip title="Set title, full mark, band marks, and accept rate for each question.">
                      <InfoOutlined fontSize="small" />
                    </Tooltip>
                  </Typography>
                </Box>

                {questions.map((q) => {
                  const isInvalid =
                    Number(q.m1 || 0) + Number(q.m2 || 0) > Number(q.full || 0);
                  return (
                    <Box
                      key={q.id}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        flexWrap: "nowrap",
                        gap: 1,
                      }}
                    >
                      <TextField
                        size="small"
                        placeholder="Question"
                        value={q.title}
                        onChange={(e) =>
                          updateQuestion(q.id, "title", e.target.value)
                        }
                        sx={{ ...textFieldSx, flex: 2 }}
                      />
                      <TextField
                        size="small"
                        label="Full Mark"
                        type="number"
                        value={q.full}
                        onChange={(e) =>
                          updateQuestion(q.id, "full", e.target.value)
                        }
                        sx={{ ...textFieldSx, flex: 1 }}
                        inputProps={{ min: 0 }}
                      />
                      <TextField
                        size="small"
                        label="Submission 1"
                        type="number"
                        value={q.m1}
                        onChange={(e) =>
                          updateQuestion(q.id, "m1", e.target.value)
                        }
                        sx={{ ...textFieldSx, flex: 1 }}
                        inputProps={{ min: 0 }}
                        error={isInvalid}
                        helperText={isInvalid ? "m1 + m2 > Full" : ""}
                      />
                      <TextField
                        size="small"
                        label="Submission 2"
                        type="number"
                        value={q.m2}
                        onChange={(e) =>
                          updateQuestion(q.id, "m2", e.target.value)
                        }
                        sx={{ ...textFieldSx, flex: 1 }}
                        inputProps={{ min: 0 }}
                        error={isInvalid}
                        helperText={isInvalid ? "m1 + m2 > Full" : ""}
                      />
                      <TextField
                        size="small"
                        label="Accept Rate"
                        value={q.rule}
                        onChange={(e) =>
                          updateQuestion(q.id, "rule", e.target.value)
                        }
                        sx={{ ...textFieldSx, flex: 2 }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeQuestion(q.id)}
                      >
                        <DeleteOutline />
                      </IconButton>
                    </Box>
                  );
                })}

                {/* Totals Row */}
              {/* <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    mt: 1,
                    bgcolor: hasInvalid ? "#ffe6e6" : "#f9f9f9",
                    p: 1,
                    borderRadius: 1,
                    fontWeight: "bold",
                    color: hasInvalid ? "error.main" : "inherit",
                  }}
                >
                  <Box sx={{ flex: 2 }}>Total:</Box>
                  <Box sx={{ flex: 1, textAlign: "center" }}>
                    {questions.reduce((s, q) => s + Number(q.full || 0), 0)}
                  </Box>
                  <Box sx={{ flex: 1, textAlign: "center" }}>
                    {questions.reduce((s, q) => s + Number(q.m1 || 0), 0)}
                  </Box>
                  <Box sx={{ flex: 1, textAlign: "center" }}>
                    {questions.reduce((s, q) => s + Number(q.m2 || 0), 0)}
                  </Box>
                  <Box sx={{ flex: 2 }}>
                    {hasInvalid && (
                      <Typography variant="caption" color="error">
                        Some rows invalid
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ width: 40 }} />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Button
                    onClick={addQuestion}
                    startIcon={<AddCircleOutline />}
                    size="small"
                  >
                    Add Question
                  </Button>
                </Box>
              </Stack>} */}

              {/* Submission 1 */}
              <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Grid item xs={3}>
                  <Typography>Submission 1:</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {sub1Files.map((f, i) => (
                      <Chip
                        key={i}
                        label={f.name}
                        onDelete={() => deleteFileAt(setSub1Files)(i)}
                        size="small"
                      />
                    ))}
                    <Button
                      component="label"
                      variant="outlined"
                      size="small"
                      startIcon={<UploadFile />}
                      sx={{ textTransform: "none" }}
                    >
                      Upload (.pdf, .doc)
                      <input
                        hidden
                        multiple
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={onUpload(setSub1Files)}
                      />
                    </Button>
                  </Box>
                </Grid>
              </Grid>

              {/* Submission 1 Feedback */}
              <Stack direction="column" sx={{ mb: 3 }}>
                <Typography>Submission 1 Feedback:</Typography>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="Add Comments"
                  value={sub1Feedback}
                  onChange={(e) => setSub1Feedback(e.target.value)}
                  sx={textFieldSx}
                />
              </Stack>

              {/* Submission 2 */}
              <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Grid item xs={3}>
                  <Typography>Submission 2:</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {sub2Files.map((f, i) => (
                      <Chip
                        key={i}
                        label={f.name}
                        onDelete={() => deleteFileAt(setSub2Files)(i)}
                        size="small"
                      />
                    ))}
                    <Button
                      component="label"
                      variant="outlined"
                      size="small"
                      startIcon={<UploadFile />}
                      sx={{ textTransform: "none" }}
                    >
                      Upload (.pdf, .md)
                      <input
                        hidden
                        multiple
                        type="file"
                        accept=".pdf,.md"
                        onChange={onUpload(setSub2Files)}
                      />
                    </Button>
                  </Box>
                </Grid>
              </Grid>

              {/* Submission 2 Feedback */}
              <Stack direction="column" sx={{ mb: 3 }}>
                <Typography>Submission 2 Feedback:</Typography>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="Add Comments"
                  value={sub2Feedback}
                  onChange={(e) => setSub2Feedback(e.target.value)}
                  sx={textFieldSx}
                />
              </Stack>

              {/* Footer */}
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                <Button variant="outlined" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCreate}
                  disabled={hasInvalid}
                >
                  Create
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </LocalizationProvider>
  );
}
