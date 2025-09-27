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
  const [name, setName] = React.useState("");
  const [dueDate, setDueDate] = React.useState(dayjs());

  const [assignmentFiles, setAssignmentFiles] = React.useState([]);
  const [rubric, setRubric] = React.useState({ levels: [], criteria: [] });

  const [sub1Files, setSub1Files] = React.useState([]);
  const [sub2Files, setSub2Files] = React.useState([]);
  const [sub1Feedback, setSub1Feedback] = React.useState("");
  const [sub2Feedback, setSub2Feedback] = React.useState("");

  const [submissionMarks, setSubmissionMarks] = React.useState({
    sub1: {},
    sub2: {},
  });

  // ===== Handlers =====
  const onUpload = (setter) => (e) => {
    const files = Array.from(e.target.files || []);
    setter((prev) => [...prev, ...files]);
    e.target.value = "";
  };
  const deleteFileAt = (setter) => (idx) =>
    setter((prev) => prev.filter((_, i) => i !== idx));

  const handleImportRubric = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const parsed = await parseDocxToRubric(f);
      setRubric(parsed);
      setSubmissionMarks({ sub1: {}, sub2: {} }); // reset marks
    } catch (err) {
      console.error(err);
      alert("Failed to import rubric. Please check the document format.");
    } finally {
      e.target.value = "";
    }
  };

  const handleMarkChange = (sub, criterionId, value) => {
    setSubmissionMarks((prev) => ({
      ...prev,
      [sub]: { ...prev[sub], [criterionId]: Number(value) },
    }));
  };

  const handleCancel = () => window.history.back();
  const handleCreate = () => {
    const payload = {
      name,
      dueDate: dueDate?.toISOString(),
      assignmentFiles,
      rubric,
      submissions: [
        { files: sub1Files, feedback: sub1Feedback, marks: submissionMarks.sub1 },
        { files: sub2Files, feedback: sub2Feedback, marks: submissionMarks.sub2 },
      ],
    };
    console.log("Create Assignment payload:", payload);
    // TODO: POST to API
  };

  const textFieldSx = {
    "& .MuiInputBase-root": { borderRadius: 2, bgcolor: "#F0F1F3" },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ccc" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#999" },
  };

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
                    slotProps={{
                      textField: { size: "small", sx: textFieldSx, fullWidth: true },
                    }}
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
                    {assignmentFiles.map((f, i) => (
                      <Chip
                        key={i}
                        label={f.name}
                        onDelete={() => deleteFileAt(setAssignmentFiles)(i)}
                      />
                    ))}
                    <Button component="label" startIcon={<UploadFile />} variant="outlined" size="small">
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
                <Grid item xs={12} sm={3}>
                  <Typography>Rubric:</Typography>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <Button component="label" startIcon={<UploadFile />} variant="outlined" size="small">
                    Import rubric (.docx)
                    <input hidden type="file" accept=".docx" onChange={handleImportRubric} />
                  </Button>
                </Grid>
              </Grid>

              {rubric?.levels?.length > 0 && (
                <Box sx={{ mt: 2, width: "100%" }}>
                  <RubricEditor rubric={rubric} setRubric={setRubric} />
                </Box>
              )}

              {/* Submissions */}
              {["1", "2"].map((sub) => (
                <React.Fragment key={sub}>
                  {/* Submission Files */}
                  <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={3}>
                      <Typography>Submission {sub}:</Typography>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {(sub === "1" ? sub1Files : sub2Files).map((f, i) => (
                          <Chip
                            key={i}
                            label={f.name}
                            onDelete={() =>
                              deleteFileAt(sub === "1" ? setSub1Files : setSub2Files)(i)
                            }
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
                          Upload (.pdf{sub === "1" ? ", .doc" : ", .md"})
                          <input
                            hidden
                            multiple
                            type="file"
                            accept={sub === "1" ? ".pdf,.doc,.docx" : ".pdf,.md"}
                            onChange={onUpload(sub === "1" ? setSub1Files : setSub2Files)}
                          />
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Dynamic Marking Table */}
                  {rubric?.criteria?.length > 0 && (
                    <Box sx={{ my: 2, overflowX: "auto" }}>
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Enter Marks for Submission {sub}
                      </Typography>
                      <Table sx={{ minWidth: 600 }}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Criterion</TableCell>
                            {rubric.levels.map((level) => (
                              <TableCell key={level.id} align="center">{level.name}</TableCell>
                            ))}
                            <TableCell align="center">Mark</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rubric.criteria.map((c) => (
                            <TableRow key={c.id}>
                              <TableCell>{c.title}</TableCell>
                              {rubric.levels.map((level) => (
                                <TableCell key={level.id}></TableCell>
                              ))}
                              <TableCell>
                                <TextField
                                  size="small"
                                  type="number"
                                  value={submissionMarks[sub]?.[c.id] || ""}
                                  onChange={(e) =>
                                    handleMarkChange(sub, c.id, e.target.value)
                                  }
                                  inputProps={{ min: 0, max: c.maxScore }}
                                  sx={{ width: 80 }}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  )}

                  {/* Submission Feedback */}
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    label={`Submission ${sub} Feedback`}
                    value={sub === "1" ? sub1Feedback : sub2Feedback}
                    onChange={(e) =>
                      sub === "1"
                        ? setSub1Feedback(e.target.value)
                        : setSub2Feedback(e.target.value)
                    }
                    sx={{ ...textFieldSx, mb: 3 }}
                  />
                </React.Fragment>
              ))}

              {/* Footer */}
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
      </Box>
    </LocalizationProvider>
  );
}
