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
} from "@mui/material";
import Navbar from "../components/Navbar";

export default function HomePage({ role = "admin" }) {
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("a-z");
  const [search, setSearch] = useState("");
  const [appBarHeight, setAppBarHeight] = useState(0);

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

  const subjects = [
    { name: "Mathematics", code: "MATH101", assignments: 5 },
    { name: "Computer Science", code: "CS102", assignments: 8 },
    { name: "Physics", code: "PHY201", assignments: 6 },
    { name: "Chemistry", code: "CHEM110", assignments: 4 },
    { name: "Biology", code: "BIO120", assignments: 7 },
    { name: "History", code: "HIS210", assignments: 3 },
    { name: "English Literature", code: "ENG150", assignments: 9 },
    { name: "Economics", code: "ECO200", assignments: 6 },
  ];

  const filteredSubjects = subjects
    .filter(
      (s) =>
        s.name.toLowerCase().includes(search) ||
        s.code.toLowerCase().includes(search)
    )
    .filter((s) => {
      if (filter === "completed") return s.assignments > 5;
      if (filter === "incomplete") return s.assignments <= 5;
      return true;
    })
    .sort((a, b) => {
      if (sort === "a-z") return a.name.localeCompare(b.name);
      if (sort === "z-a") return b.name.localeCompare(a.name);
      if (sort === "newest") return b.assignments - a.assignments;
      if (sort === "oldest") return a.assignments - b.assignments;
      return 0;
    });

  const cardWidth = 240;
  const cardHeight = 140;
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
          {/* Sticky AppBar like PageTitle */}
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

          {/* Spacer to avoid overlap */}
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
            {filteredSubjects.map((s, index) => (
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
                  justifyContent: "center",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <Typography variant="h6" sx={{ mb: 0.5 }}>
                  {s.name}
                </Typography>
                <Typography
                  sx={{ fontSize: "0.9rem", color: "text.secondary" }}
                >
                  {s.code}
                </Typography>
                <Typography sx={{ fontSize: "0.85rem", mt: 0.5 }}>
                  {s.assignments} Assignments
                </Typography>
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
