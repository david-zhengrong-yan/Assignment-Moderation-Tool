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
} from "@mui/material";
import Navbar from "../components/Navbar";

const LEFT_NAV_WIDTH = 200; // match your permanent left navbar width

// -------- Mock data (replace with API later) --------
const RUBRICS = Array.from({ length: 10 }, (_, i) => ({
  id: `r${i + 1}`,
  name: `Rubric ${i + 1}`,
  fullMark: 10,
}));

// Administrator’s marks (per rubric)
const ADMIN_MARKS = [6, 7, 8, 9, 7, 6, 8, 7, 9, 8];

// Marker marks: markers[m][r] = score for marker m on rubric r
const MARKER_MARKS = [
  [6, 7, 8, 10, 7, 6, 9, 7, 11, 8],
  [6, 6, 8, 9, 7, 6, 7, 7, 8, 8],
  [5, 7, 7, 8, 6, 7, 8, 6, 7, 8],
  [7, 8, 9, 11, 6, 6, 9, 8, 11, 9],
  [6, 7, 8, 8, 7, 6, 7, 7, 9, 8],
  [4, 6, 6, 7, 5, 5, 6, 5, 6, 7],
  [6, 8, 9, 9, 8, 7, 8, 7, 10, 8],
  [5, 7, 8, 8, 7, 5, 8, 7, 8, 7],
  [6, 7, 9, 9, 7, 6, 9, 8, 10, 9],
  [6, 7, 8, 9, 7, 6, 8, 7, 9, 8],
];

const MARKERS = MARKER_MARKS.map((row, i) => ({
  id: `m${i + 1}`,
  name: `Marker ${i + 1}`,
  marks: row,
}));

// Highlight thresholds
const ABS_THRESHOLD = 2; // mark mode: +/- 2
const PCT_THRESHOLD = 0.15; // percentage mode: +/- 15%

export default function ViewSubmissionPage() {
  const [mode, setMode] = React.useState("mark"); // 'mark' | 'percentage'
  const fullMarks = RUBRICS.map((r) => r.fullMark);

  // KPI 1: how many markers finished (simple rule: provided all rubric scores)
  const markersFinished = React.useMemo(
    () =>
      MARKERS.filter(
        (m) =>
          m.marks.length === RUBRICS.length && m.marks.every((v) => v != null)
      ).length,
    []
  );

  // KPI 2: admin average as a percentage of full marks
  const currentAveragePct = React.useMemo(() => {
    const ratios = ADMIN_MARKS.map((v, i) => v / (fullMarks[i] || 1));
    return Math.round(
      (ratios.reduce((a, b) => a + b, 0) / ratios.length) * 100
    );
  }, [fullMarks]);

  const handleMode = (_e, next) => next && setMode(next);

  // Convert a raw value to display text depending on the mode
  const toDisplay = (value, rIdx) => {
    if (value == null) return "—";
    if (mode === "percentage") {
      const pct = (value / (fullMarks[rIdx] || 1)) * 100;
      return `${Math.round(pct)}%`;
    }
    return value;
  };

  // Compute cell highlight vs. Administrator’s mark
  const cellStyle = (value, rIdx) => {
    const admin = ADMIN_MARKS[rIdx];
    if (value == null || admin == null) return {};
    if (mode === "percentage") {
      const fm = fullMarks[rIdx] || 1;
      const diff = value / fm - admin / fm;
      if (diff >= PCT_THRESHOLD) return { backgroundColor: "#FDE2E1" }; // higher -> red
      if (diff <= -PCT_THRESHOLD) return { backgroundColor: "#FFF7D6" }; // lower -> yellow
      return {};
    } else {
      const diff = value - admin;
      if (diff >= ABS_THRESHOLD) return { backgroundColor: "#FDE2E1" };
      if (diff <= -ABS_THRESHOLD) return { backgroundColor: "#FFF7D6" };
      return {};
    }
  };

  return (
    <>
      <CssBaseline />
      <Navbar />
      <Box
        component="main"
        sx={{
          ml: `${LEFT_NAV_WIDTH}px`,
          minHeight: "100vh",
          bgcolor: "#F5F6F8",
          py: 5,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 3 }}>
            View Submission
          </Typography>

          {/* KPI cards */}
          <Grid container spacing={3} sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={(markersFinished / MARKERS.length) * 100}
                  sx={{ mb: 1 }}
                />
                <Typography variant="subtitle2" color="text.secondary">
                  # markers finished marking
                </Typography>
                <Typography variant="h5">
                  {markersFinished} / {MARKERS.length}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={currentAveragePct}
                  sx={{ mb: 1 }}
                />
                <Typography variant="subtitle2" color="text.secondary">
                  # Current Average(%)
                </Typography>
                <Typography variant="h5">{currentAveragePct}%</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* View mode toggle */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Typography variant="body1">View:</Typography>
            <ToggleButtonGroup
              value={mode}
              exclusive
              onChange={handleMode}
              size="small"
              color="primary"
            >
              <ToggleButton value="mark">Mark</ToggleButton>
              <ToggleButton value="percentage">Percentage</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Table */}
          <Paper sx={{ p: 0, overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 520 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, width: 160 }}>
                      Rubric
                    </TableCell>
                    {MARKERS.map((m) => (
                      <TableCell
                        key={m.id}
                        align="center"
                        sx={{ fontWeight: 600 }}
                      >
                        {m.name}
                      </TableCell>
                    ))}
                    <TableCell align="center" sx={{ fontWeight: 600 }}>
                      Administrator
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {RUBRICS.map((r, rIdx) => (
                    <TableRow key={r.id}>
                      <TableCell sx={{ fontWeight: 500 }}>{r.name}</TableCell>
                      {MARKERS.map((m) => {
                        const val = m.marks[rIdx];
                        return (
                          <TableCell
                            key={`${m.id}-${rIdx}`}
                            align="center"
                            sx={cellStyle(val, rIdx)}
                          >
                            {toDisplay(val, rIdx)}
                          </TableCell>
                        );
                      })}
                      <TableCell
                        align="center"
                        sx={{ backgroundColor: "#EEF2FF", fontWeight: 600 }}
                      >
                        {toDisplay(ADMIN_MARKS[rIdx], rIdx)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Legend */}
            <Box sx={{ p: 2 }}>
              <Chip size="small" label="Mark" sx={{ mr: 1 }} />
              <Chip size="small" label="Percentage" variant="outlined" />
              <Box sx={{ mt: 2, fontSize: 12, color: "text.secondary" }}>
                <div>
                  Note:{" "}
                  <span style={{ background: "#FDE2E1", padding: "0 6px" }}>
                    Red highlight
                  </span>{" "}
                  = higher than Administrator’s mark.
                </div>
                <div>
                  <span style={{ background: "#FFF7D6", padding: "0 6px" }}>
                    Yellow highlight
                  </span>{" "}
                  = lower than Administrator’s mark.
                </div>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
}
