// src/pages/HomePage.jsx
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
  CircularProgress,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { getApiBaseUrl } from "../constants"

export default function HomePage() {
  const sessionid = localStorage.getItem("sessionid");
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("a-z");
  const [search, setSearch] = useState("");

  // Layout
  const navbarWidth = 200;
  const [appBarHeight, setAppBarHeight] = useState(0);
  const appBarRef = useRef(null);

  // Track AppBar height dynamically
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

  // Handle search input
  const handleSearch = (event) => setSearch(event.target.value.toLowerCase());

  // Fetch user + assignments
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // User
        const userRes = await fetch(`${getApiBaseUrl()}/api/${userId}/account`, {
          headers: { "X-Session-ID": sessionid },
          credentials: "omit",
        });
        if (!userRes.ok) throw new Error("Failed to fetch user info");
        const userData = await userRes.json();
        setUser(userData);

        // Assignments
        const assignmentsRes = await fetch(
          `${getApiBaseUrl()}/api/${userId}/assignments`,
          {
            headers: { "X-Session-ID": sessionid },
            credentials: "omit",
          }
        );
        if (!assignmentsRes.ok) throw new Error("Failed to fetch assignments");
        const assignmentsData = await assignmentsRes.json();
        setAssignments(assignmentsData.assignments);

        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (userId) fetchData();
  }, [userId, sessionid]);

  // Apply filtering + sorting
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

  // Card layout
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
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            bgcolor: "#ffffff",
            overflowY: "auto",
          }}
        >
          {/* AppBar (sticky header) */}
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

          {/* Spacer for AppBar */}
          <Box sx={{ height: `${appBarHeight}px` }} />

          {/* Loading / Error / Content */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" sx={{ mt: 3, textAlign: "center" }}>
              {error}
            </Typography>
          ) : (
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
              {filteredAssignments.map((a) => (
                <Paper
                  key={a.id}
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
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                    },
                  }}
                  onClick={() => {
                    if (user.role === "admin") {
                      navigate(`/${userId}/assignment/${a.id}`);
                    } else {
                      // Marker goes to assignment marking page
                      navigate(`/${userId}/marker/assignment/${a.id}`);
                    }
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

              {/* Admin only: Add Assignment */}
              {user.role === "admin" && (
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
                  onClick={() => navigate(`/${userId}/assignment/create`)}
                >
                  +
                </Paper>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}
