// Editable rubric table with per-criterion settings (max score, require comment)
// and a Preview mode that shows how it will look to markers.

import * as React from "react";
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  IconButton,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";
import { Add, Delete, Preview } from "@mui/icons-material";

export default function RubricEditor({
  rubric,
  setRubric,
  showPreviewComments = true,
}) {
  const [mode, setMode] = React.useState("edit"); // 'edit' | 'preview'

  const patchCriterion = (idx, patch) => {
    const criteria = rubric.criteria.slice();
    criteria[idx] = { ...criteria[idx], ...patch };
    setRubric({ ...rubric, criteria });
  };

  const onLevelNameChange = (i, name) => {
    const levels = rubric.levels.slice();
    levels[i] = { ...levels[i], name };
    setRubric({ ...rubric, levels });
  };

  const onCellChange = (r, c, patch) => {
    const criteria = rubric.criteria.slice();
    const cells = criteria[r].cells.slice();
    cells[c] = { ...cells[c], ...patch };
    criteria[r] = { ...criteria[r], cells };
    setRubric({ ...rubric, criteria });
  };

  const addCriterion = () => {
    setRubric({
      ...rubric,
      criteria: [
        ...rubric.criteria,
        {
          id: `C${rubric.criteria.length + 1}`,
          title: `Criterion ${rubric.criteria.length + 1}`,
          cells: rubric.levels.map(() => ({ description: "" })),
          maxScore: undefined,
          requireComment: true,
        },
      ],
    });
  };

  const removeCriterion = (idx) => {
    const criteria = rubric.criteria.slice();
    criteria.splice(idx, 1);
    setRubric({ ...rubric, criteria });
  };

  const addLevel = () => {
    const levels = [
      ...rubric.levels,
      {
        id: `L${rubric.levels.length + 1}`,
        name: `Level ${rubric.levels.length + 1}`,
      },
    ];
    const criteria = rubric.criteria.map((c) => ({
      ...c,
      cells: [...c.cells, { description: "" }],
    }));
    setRubric({ levels, criteria });
  };

  const removeLevel = (idx) => {
    const levels = rubric.levels.slice();
    levels.splice(idx, 1);
    const criteria = rubric.criteria.map((c) => {
      const cells = c.cells.slice();
      cells.splice(idx, 1);
      return { ...c, cells };
    });
    setRubric({ levels, criteria });
  };

  return (
    <Box>
      {/* Toolbar */}
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(_, v) => v && setMode(v)}
          size="small"
        >
          <ToggleButton value="edit">Edit</ToggleButton>
          <ToggleButton value="preview">
            <Preview fontSize="small" sx={{ mr: 1 }} />
            Preview
          </ToggleButton>
        </ToggleButtonGroup>
        <Button size="small" startIcon={<Add />} onClick={addCriterion}>
          Add Criterion
        </Button>
        <Button size="small" startIcon={<Add />} onClick={addLevel}>
          Add Level
        </Button>
      </Box>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 320, fontWeight: 600 }}>Criteria</TableCell>
            {rubric.levels.map((lv, i) => (
              <TableCell key={lv.id} sx={{ fontWeight: 600, minWidth: 220 }}>
                {mode === "edit" ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TextField
                      size="small"
                      value={lv.name}
                      onChange={(e) => onLevelNameChange(i, e.target.value)}
                    />
                    <Tooltip title="Remove level">
                      <IconButton size="small" onClick={() => removeLevel(i)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                ) : (
                  lv.name
                )}
              </TableCell>
            ))}
            <TableCell /> {/* actions */}
          </TableRow>
        </TableHead>

        <TableBody>
          {rubric.criteria.map((c, rIdx) => (
            <TableRow key={c.id}>
              {/* Left: criterion title + settings */}
              <TableCell sx={{ verticalAlign: "top" }}>
                {mode === "edit" ? (
                  <Box sx={{ display: "grid", gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={c.title}
                      onChange={(e) =>
                        patchCriterion(rIdx, { title: e.target.value })
                      }
                    />
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <TextField
                        label="Max score"
                        size="small"
                        type="number"
                        sx={{ width: 140 }}
                        value={c.maxScore ?? ""}
                        onChange={(e) =>
                          patchCriterion(rIdx, {
                            maxScore: numOrUndef(e.target.value),
                          })
                        }
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            checked={!!c.requireComment}
                            onChange={(e) =>
                              patchCriterion(rIdx, {
                                requireComment: e.target.checked,
                              })
                            }
                          />
                        }
                        label="Require comment"
                      />
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>{c.title}</Typography>
                    {typeof c.maxScore === "number" && (
                      <Typography variant="body2" color="text.secondary">
                        / {c.maxScore}
                      </Typography>
                    )}
                    {showPreviewComments && c.requireComment && (
                      <Box
                        sx={{
                          mt: 1,
                          p: 1,
                          border: "1px solid #e0e0e0",
                          borderRadius: 1,
                          bgcolor: "#fafafa",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Criterion Feedback (required)
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </TableCell>

              {/* Cells */}
              {rubric.levels.map((lv, cIdx) => {
                const cell = c.cells[cIdx] || { description: "" };
                return (
                  <TableCell
                    key={`${c.id}-${lv.id}`}
                    sx={{ verticalAlign: "top" }}
                  >
                    {mode === "edit" ? (
                      <Box sx={{ display: "grid", gap: 0.5 }}>
                        <TextField
                          multiline
                          minRows={3}
                          size="small"
                          value={cell.description}
                          onChange={(e) =>
                            onCellChange(rIdx, cIdx, {
                              description: e.target.value,
                            })
                          }
                          placeholder="Description…"
                        />
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <TextField
                            label="Min"
                            size="small"
                            type="number"
                            sx={{ width: 100 }}
                            value={cell.min ?? ""}
                            onChange={(e) =>
                              onCellChange(rIdx, cIdx, {
                                min: numOrUndef(e.target.value),
                              })
                            }
                          />
                          <TextField
                            label="Max"
                            size="small"
                            type="number"
                            sx={{ width: 100 }}
                            value={cell.max ?? ""}
                            onChange={(e) =>
                              onCellChange(rIdx, cIdx, {
                                max: numOrUndef(e.target.value),
                              })
                            }
                          />
                        </Box>
                      </Box>
                    ) : (
                      <Box>
                        <div style={{ whiteSpace: "pre-wrap" }}>
                          {cell.description}
                        </div>
                        {(cell.min != null || cell.max != null) && (
                          <div style={{ opacity: 0.7, marginTop: 4 }}>
                            {cell.min != null && cell.max != null
                              ? `(${cell.min} – ${cell.max} points)`
                              : cell.min != null
                                ? `(${cell.min} points)`
                                : `(${cell.max} points)`}
                          </div>
                        )}
                      </Box>
                    )}
                  </TableCell>
                );
              })}

              <TableCell align="right" sx={{ verticalAlign: "top" }}>
                <IconButton size="small" onClick={() => removeCriterion(rIdx)}>
                  <Delete fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

function numOrUndef(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}
