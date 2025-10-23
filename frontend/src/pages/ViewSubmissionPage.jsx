// src/pages/ViewSubmissionPage.jsx
import * as React from "react";
import {
  Box,
  Container,
  CssBaseline,
  Typography,
  Paper,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  LinearProgress,
  Chip,
  CircularProgress,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { useParams } from "react-router";
import { getApiBaseUrl } from "../constants"

const LEFT_NAV_WIDTH = 200;
const ABS_THRESHOLD = 2;
const PCT_THRESHOLD = 0.15;

export default function ViewSubmissionPage() {
  const { assignmentId, submissionId } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [rubrics, setRubrics] = React.useState([]);
  const [levels, setLevels] = React.useState([]);
  const [adminMarks, setAdminMarks] = React.useState({});
  const [markers, setMarkers] = React.useState([]);
  const [mode, setMode] = React.useState("mark"); // mark or percentage

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${getApiBaseUrl()}/api/assignment/${assignmentId}/submission/${submissionId}/marks`,
          { headers: { "X-Session-ID": localStorage.getItem("sessionid") } }
        );
        const data = await res.json();
        if (!data.successful) throw new Error(data.message || "Failed to fetch data");

        const rubricCriteria = data.rubric.criteria || [];
        const rubricLevels = data.rubric.levels || [];
        setRubrics(rubricCriteria);
        setLevels(rubricLevels);

        // Convert admin marks to numeric max scores
        const numericAdminMarks = {};
        rubricCriteria.forEach((r) => {
          const levelId = data.admin_marks[r.id];
          const levelIndex = r.cells.findIndex((c, i) => rubricLevels[i]?.id === levelId);
          numericAdminMarks[r.id] = levelIndex >= 0 ? r.cells[levelIndex].max : null;
        });
        setAdminMarks(numericAdminMarks);

        // Markers
        const normalizedMarkers = (data.markers || []).map((m) => ({
          id: m.id,
          name: m.marker.username || m.marker.email,
          marks: rubricCriteria.map((r) => (m.marks[r.id]?.score ?? null)),
          isFinalized: m.isFinalized,
        }));
        setMarkers(normalizedMarkers);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [assignmentId, submissionId]);

  const fullMarks = rubrics.map((r) => r.maxScore || 0);
  const handleMode = (_e, next) => next && setMode(next);

  // KPI: markers finalized
  const markersFinished = React.useMemo(() => markers.filter((m) => m.isFinalized).length, [markers]);

  // KPI: current average across finalized markers only
  const currentAveragePct = React.useMemo(() => {
    const finalizedMarkers = markers.filter((m) => m.isFinalized);
    if (!rubrics.length || finalizedMarkers.length === 0) return 0;

    const totalSum = finalizedMarkers.reduce((sumMarkers, m) => {
      const sum = rubrics.reduce((sumR, r, i) => sumR + (m.marks[i] ?? 0), 0);
      return sumMarkers + sum;
    }, 0);

    const totalFullMarks = rubrics.reduce((sum, r) => sum + (r.maxScore || 0), 0) * finalizedMarkers.length;
    return Math.round((totalSum / totalFullMarks) * 100);
  }, [markers, rubrics]);

  const toDisplay = (value, rIdx) => {
    if (value == null) return "—";
    if (mode === "percentage") {
      const totalFull = fullMarks[rIdx] || 1;
      return `${Math.round((value / totalFull) * 100)}%`;
    }
    return value;
  };

  const cellStyle = (value, rIdx) => {
    const adminScore = adminMarks[rubrics[rIdx].id];
    if (value == null || adminScore == null) return {};
    const diff = value - adminScore;
    if (mode === "percentage") {
      const diffPct = value / (fullMarks[rIdx] || 1) - adminScore / (fullMarks[rIdx] || 1);
      if (diffPct >= PCT_THRESHOLD) return { backgroundColor: "#FDE2E1" };
      if (diffPct <= -PCT_THRESHOLD) return { backgroundColor: "#FFF7D6" };
    } else {
      if (diff >= ABS_THRESHOLD) return { backgroundColor: "#FDE2E1" };
      if (diff <= -ABS_THRESHOLD) return { backgroundColor: "#FFF7D6" };
    }
    return {};
  };

  const totalMarker = (marks) => {
    const sum = marks.reduce((a, b) => a + (b ?? 0), 0);
    if (mode === "percentage") {
      const totalFull = fullMarks.reduce((a, b) => a + b, 0);
      return totalFull ? Math.round((sum / totalFull) * 100) + "%" : "—";
    }
    return sum;
  };

  const totalAdmin = () => {
    const sum = rubrics.reduce((acc, r) => acc + (adminMarks[r.id] ?? 0), 0);
    if (mode === "percentage") {
      const totalFull = fullMarks.reduce((a, b) => a + b, 0);
      return totalFull ? Math.round((sum / totalFull) * 100) + "%" : "—";
    }
    return sum;
  };

  if (loading) return <CircularProgress sx={{ mt: 10, ml: 10 }} />;

  return (
    <>
      <CssBaseline />
      <Navbar />
      <Box component="main" sx={{ ml: `${LEFT_NAV_WIDTH}px`, minHeight: "100vh", bgcolor: "#F5F6F8", py: 5 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 3 }}>View Submission</Typography>

          {/* KPI cards */}
          <Grid container spacing={3} sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={(markersFinished / (markers.length || 1)) * 100}
                  sx={{ mb: 1 }}
                />
                <Typography variant="subtitle2" color="text.secondary"># markers finished marking</Typography>
                <Typography variant="h5">{markersFinished} / {markers.length}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <LinearProgress variant="determinate" value={currentAveragePct} sx={{ mb: 1 }} />
                <Typography variant="subtitle2" color="text.secondary"># Current Average(%)</Typography>
                <Typography variant="h5">{currentAveragePct}%</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* View mode toggle */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Typography variant="body1">View:</Typography>
            <ToggleButtonGroup value={mode} exclusive onChange={handleMode} size="small" color="primary">
              <ToggleButton value="mark">Mark</ToggleButton>
              <ToggleButton value="percentage">Percentage</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Paper sx={{ p: 0, overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 520 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, width: 200 }}>Rubric / Criteria</TableCell>
                    {markers.map((m) => (
                      <TableCell key={m.id} align="center" sx={{ fontWeight: 600 }}>
                        {m.name}{!m.isFinalized && " (Not Finalized)"}
                      </TableCell>
                    ))}
                    <TableCell align="center" sx={{ fontWeight: 600 }}>Administrator</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rubrics.map((r, rIdx) => (
                    <TableRow key={r.id}>
                      <TableCell sx={{ fontWeight: 500 }}>{r.title}</TableCell>
                      {markers.map((m) => (
                        <TableCell key={m.id + "-" + rIdx} align="center" sx={cellStyle(m.marks[rIdx], rIdx)}>
                          {toDisplay(m.marks[rIdx], rIdx)}
                        </TableCell>
                      ))}
                      <TableCell align="center" sx={{ backgroundColor: "#EEF2FF", fontWeight: 600 }}>
                        {toDisplay(adminMarks[r.id], rIdx)}
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Total row */}
                  <TableRow sx={{ fontWeight: 600, backgroundColor: "#EEF2FF" }}>
                    <TableCell>Total</TableCell>
                    {markers.map((m) => (
                      <TableCell key={"total-" + m.id} align="center">{totalMarker(m.marks)}</TableCell>
                    ))}
                    <TableCell align="center">{totalAdmin()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ p: 2 }}>
              <Chip size="small" label="Mark" sx={{ mr: 1 }} />
              <Chip size="small" label="Percentage" variant="outlined" />
              <Box sx={{ mt: 2, fontSize: 12, color: "text.secondary" }}>
                <div>Note: <span style={{ background: "#FDE2E1", padding: "0 6px" }}>Red highlight</span> = higher than Administrator’s mark.</div>
                <div><span style={{ background: "#FFF7D6", padding: "0 6px" }}>Yellow highlight</span> = lower than Administrator’s mark.</div>
                <div>Non-finalized markers are shown with &quot;(Not Finalized)&quot; in the column header.</div>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
}
