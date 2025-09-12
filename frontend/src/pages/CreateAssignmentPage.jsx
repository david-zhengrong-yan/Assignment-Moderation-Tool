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
  IconButton,
  Chip,
  Tooltip,
  InputAdornment,
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

// Match your Navbar's permanent Drawer width
const LEFT_NAV_WIDTH = 200;

export default function CreateAssignmentPage() {
  // ===== Form state =====
  const [name, setName] = React.useState("");
  const [dueDate, setDueDate] = React.useState(dayjs());
  const [rubricFiles, setRubricFiles] = React.useState([]); // File[]
  const [sub1Files, setSub1Files] = React.useState([]);
  const [sub2Files, setSub2Files] = React.useState([]);
  const [sub1Feedback, setSub1Feedback] = React.useState("");
  const [sub2Feedback, setSub2Feedback] = React.useState("");

  const [questions, setQuestions] = React.useState([
    { id: 1, title: "Question 1", full: "", m1: "", m2: "", rule: "" },
  ]);
  const nextId = React.useRef(2);

  // ===== Question helpers (unchanged) =====
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
  const updateQuestion = (id, key, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [key]: value } : q))
    );
  };
  const removeQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // ===== File upload helpers (unchanged) =====
  const onUpload = (setter) => (e) => {
    const files = Array.from(e.target.files || []);
    setter((prev) => [...prev, ...files]);
    e.target.value = ""; // reset input
  };
  const deleteFileAt = (setter) => (idx) => {
    setter((prev) => prev.filter((_, i) => i !== idx));
  };

  // ===== Actions (unchanged) =====
  const handleCancel = () => window.history.back();
  const handleCreate = () => {
    const payload = {
      name,
      dueDate: dueDate?.toISOString(),
      rubricFiles,
      questions,
      submissions: [
        { files: sub1Files, feedback: sub1Feedback },
        { files: sub2Files, feedback: sub2Feedback },
      ],
    };
    console.log("Create Assignment payload:", payload);
    // call your API / navigate
  };

  // ===== Styling: keep your first design TextField look =====
  const textFieldSx = {
    bgcolor: "#F0F1F3",
    "& .MuiInputBase-root": { borderRadius: 2 },
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CssBaseline />
      <Navbar />

      {/* MAIN CONTENT — vertical sections per Figma */}
      <Box
        component="main"
        sx={{
          ml: `${LEFT_NAV_WIDTH}px`,
          bgcolor: "#FFFFFF",
          width: "auto",
        }}
      >
        <Container
          //   maxWidth="md"
          maxWidth={false}
          //   disableGutters
          sx={{ py: 5, alignItems: "flex-start", justifyContent: "flex-start" }}
        >
          <Typography variant="h4" sx={{ mb: 3 }}>
            Create Assignment
          </Typography>

          <Paper
            elevation={0}
            sx={{ p: 3, borderRadius: 2, bgcolor: "white", minHeight: "100vh" }}
          >
            <Box container spacing={6}>
              {/* Assignment Name */}
              <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Grid item xs={3}>
                  <Typography>Assignment Name:</Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    id="outlined-basic"
                    label="Enter assignment name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={textFieldSx}
                  />
                </Grid>
              </Grid>

              {/* Due Date */}
              <Grid container spacing={7} alignItems="center" sx={{ mb: 3 }}>
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

              {/* Rubric */}
              <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Grid item xs={3}>
                  <Typography>Rubric:</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {rubricFiles.map((f, i) => (
                      <Chip
                        key={i}
                        label={f.name}
                        onDelete={() => deleteFileAt(setRubricFiles)(i)}
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
                        onChange={onUpload(setRubricFiles)}
                      />
                    </Button>
                  </Box>
                </Grid>
              </Grid>

              {/* Questions */}
              <Stack container spacing={2} sx={{ mb: 2 }}>
                <Box item xs={12}>
                  <Typography
                    sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                  >
                    Question:
                    <Tooltip title="Set title, full mark, band marks, and accept rate for each question.">
                      <InfoOutlined fontSize="small" />
                    </Tooltip>
                  </Typography>
                </Box>

                {questions.map((q) => (
                  <Box
                    key={q.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "nowrap",
                    }}
                  >
                    {/* Question title */}
                    <TextField
                      size="small"
                      placeholder="Question"
                      value={q.title}
                      onChange={(e) =>
                        updateQuestion(q.id, "title", e.target.value)
                      }
                      sx={{ ...textFieldSx, flex: 2 }}
                    />

                    {/* Full Mark */}
                    <TextField
                      size="small"
                      id="outlined-basic"
                      label="Full Mark"
                      type="number"
                      value={q.full}
                      onChange={(e) =>
                        updateQuestion(q.id, "full", e.target.value)
                      }
                      sx={{ ...textFieldSx, flex: 1 }}
                      inputProps={{ min: 0 }}
                    />

                    {/* Mark 1 */}
                    <TextField
                      size="small"
                      id="outlined-basic"
                      label="Mark 1"
                      type="number"
                      value={q.m1}
                      onChange={(e) =>
                        updateQuestion(q.id, "m1", e.target.value)
                      }
                      sx={{ ...textFieldSx, flex: 1 }}
                      inputProps={{ min: 0 }}
                    />

                    {/* Mark 2 */}
                    <TextField
                      size="small"
                      id="outlined-basic"
                      label="Mark 2"
                      type="number"
                      value={q.m2}
                      onChange={(e) =>
                        updateQuestion(q.id, "m2", e.target.value)
                      }
                      sx={{ ...textFieldSx, flex: 1 }}
                      inputProps={{ min: 0 }}
                    />

                    {/* Accept Rate */}
                    <TextField
                      size="small"
                      id="outlined-basic"
                      label="Accept Rate"
                      value={q.rule}
                      onChange={(e) =>
                        updateQuestion(q.id, "rule", e.target.value)
                      }
                      sx={{ ...textFieldSx, flex: 2 }}
                    />

                    {/* Delete button */}
                    <IconButton
                      size="small"
                      onClick={() => removeQuestion(q.id)}
                    >
                      <DeleteOutline />
                    </IconButton>
                  </Box>
                ))}

                {/* Add Question button */}
                <Box sx={{ mb: 2 }}>
                  <Button
                    onClick={addQuestion}
                    startIcon={<AddCircleOutline />}
                    size="small"
                  >
                    Add Question
                  </Button>
                </Box>
              </Stack>

              {/* Submission 1 */}
              <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                {/* left Label */}
                <Grid item xs={3}>
                  <Typography>Submission 1:</Typography>
                </Grid>

                {/* right upload file area */}
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
              <Stack
                direction="column"
                sx={{
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  mb: 3,
                }}
              >
                <Typography>Submission 1 Feedback:</Typography>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  id="outlined-basic"
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
              <Stack
                direction="column"
                sx={{
                  mb: 3,
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
              >
                <Typography>Submission 2 Feedback:</Typography>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  id="outlined-basic"
                  label="Add Comments"
                  value={sub2Feedback}
                  onChange={(e) => setSub2Feedback(e.target.value)}
                  sx={textFieldSx}
                />
              </Stack>

              {/* Footer actions (centered like the Figma) */}
              <Box item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    mt: 1,
                  }}
                >
                  <Button variant="outlined" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button variant="contained" onClick={handleCreate}>
                    Create
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </LocalizationProvider>
  );
}
