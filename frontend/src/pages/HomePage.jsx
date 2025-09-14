import React, { useState, useRef, useEffect } from "react";
import {
  CssBaseline,
  Typography,
  Box,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Toolbar,
  AppBar,
  Chip,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";

export default function HomePage({ role = "admin" }) {
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("a-z");
  const [search, setSearch] = useState("");
  const [appBarHeight, setAppBarHeight] = useState(0);
  const { userId } = useParams();

  const navbarWidth = 200;
  const appBarRef = useRef(null);

  useEffect(() => {
    if (appBarRef.current) {
      setAppBarHeight(appBarRef.current.offsetHeight);
      const resizeObserver = new ResizeObserver(() => {
        setAppBarHeight(appBarRef.current.offsetHeight);
      });
      resizeObserver.observe(appBarRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  const handleSearch = (event) => setSearch(event.target.value.toLowerCase());

  // Example assignments (later replace with fetch)
  const assignments = [
    { name: "Algebra Homework", dueDate: "2025-09-20", completed: false },
    { name: "Essay on Shakespeare", dueDate: "2025-09-18", completed: true },
    { name: "Physics Lab Report", dueDate: "2025-09-22", completed: false },
    { name: "Economics Case Study", dueDate: "2025-09-25", completed: true },
    { name: "Biology Quiz Prep", dueDate: "2025-09-16", completed: false },
  ];

  const filteredAssignments = assignments
    .filter(
      (a) =>
        a.name.toLowerCase().includes(search) ||
        a.dueDate.toLowerCase().includes(search)
    )
    .filter((a) => {
      if (filter === "completed") return a.completed;
      if (filter === "incomplete") return !a.completed;
      return true;
    })
    .sort((a, b) => {
      if (sort === "a-z") return a.name.localeCompare(b.name);
      if (sort === "z-a") return b.name.localeCompare(a.name);
      if (sort === "newest") return new Date(b.dueDate) - new Date(a.dueDate);
      if (sort === "oldest") return new Date(a.dueDate) - new Date(b.dueDate);
      return 0;
    });

  const cardWidth = 260;
  const cardHeight = 150;
  const cardGap = 12;

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
            boxSizing: "border-box",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            bgcolor: "#ffffff",
            overflowY: "auto",
          }}
        >
          {/* Sticky AppBar */}
          <AppBar
            ref={appBarRef}
            position="fixed"
            elevation={0}
            sx={{
              bgcolor: "white",
              color: "black",
              borderBottom: "1px solid #ddd",
              zIndex: (theme) => theme.zIndex.drawer + 1,
              ml: `${navbarWidth}px`,
              width: `calc(100% - ${navbarWidth}px)`,
              px: 3,
              py: 2,
              top: 0,
            }}
          >
            <Typography variant="h4" sx={{ mb: 2 }}>
              Assignments
            </Typography>

            <Toolbar disableGutters sx={{ display: "flex", gap: 3 }}>
              <TextField
                label="Search"
                type="search"
                size="small"
                sx={{ flex: 1, maxWidth: "60%" }}
                onChange={handleSearch}
              />

              <FormControl sx={{ width: 150 }} size="small">
                <InputLabel>Filter</InputLabel>
                <Select
                  value={filter}
                  label="Filter"
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="incomplete">Incomplete</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ width: 150 }} size="small">
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={sort}
                  label="Sort by"
                  onChange={(e) => setSort(e.target.value)}
                >
                  <MenuItem value="a-z">A-Z</MenuItem>
                  <MenuItem value="z-a">Z-A</MenuItem>
                  <MenuItem value="newest">Newest</MenuItem>
                  <MenuItem value="oldest">Oldest</MenuItem>
                </Select>
              </FormControl>
            </Toolbar>
          </AppBar>

          {/* Spacer */}
          <Box sx={{ height: `${appBarHeight}px` }} />

          {/* Assignment Grid */}
          <Box
            sx={{
              mt: 3,
              px: 4,
              pb: 4,
              display: "grid",
              gridTemplateColumns: `repeat(auto-fill, minmax(${cardWidth}px, 1fr))`,
              gap: cardGap,
            }}
          >
            {filteredAssignments.map((a, index) => (
              <Paper
                key={index}
                sx={{
                  width: cardWidth,
                  height: cardHeight,
                  bgcolor: "#E5E5E5",
                  borderRadius: 3,
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <Box>
                  <Typography variant="h6">{a.name}</Typography>
                  <Typography
                    sx={{ fontSize: "0.9rem", color: "text.secondary" }}
                  >
                    Due: {new Date(a.dueDate).toLocaleDateString()}
                  </Typography>
                </Box>

                <Chip
                  label={a.completed ? "Completed" : "Incomplete"}
                  color={a.completed ? "success" : "warning"}
                  variant="outlined"
                  sx={{ alignSelf: "flex-start", mt: 1 }}
                />
              </Paper>
            ))}

            {role === "admin" && (
              <Paper
                sx={{
                  width: cardWidth,
                  height: cardHeight,
                  bgcolor: "#E5E5E5",
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2.5rem",
                  cursor: "pointer",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                  },
                }}
                onClick={() => alert("Add new assignment")}
              >
                +
              </Paper>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}
