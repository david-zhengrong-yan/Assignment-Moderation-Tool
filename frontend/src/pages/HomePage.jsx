import {
  CssBaseline,
  Typography,
  Box,
  Paper
} from "@mui/material";
import Navbar from "../components/Navbar";
import * as React from "react";
import PageTitle from "../components/PageTitle";

export default function HomePage({ role = "marker" }) { //  默认 marker，可以传 "admin"
  const [filter, setFilter] = React.useState("all");
  const [sort, setSort] = React.useState("a-z");
  const [search, setSearch] = React.useState("");
  const [appBarHeight, setAppBarHeight] = React.useState(0);

  const handleSearch = (event) => setSearch(event.target.value.toLowerCase());

  const subjects = [
    { name: "Mathematics", code: "MATH101", assignments: 5 },
    { name: "Computer Science", code: "CS102", assignments: 8 },
    { name: "Physics", code: "PHY201", assignments: 6 },
    { name: "Chemistry", code: "CHEM110", assignments: 4 },
    { name: "Biology", code: "BIO120", assignments: 7 },
    { name: "History", code: "HIS210", assignments: 3 },
    { name: "English Literature", code: "ENG150", assignments: 9 },
    { name: "Economics", code: "ECO200", assignments: 6 }
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

  // 卡片参数（保持不变）
  const cardWidth = 250;
  const cardHeight = 140;

  return (
    <React.Fragment>
      <CssBaseline />
      <Box sx={{ bgcolor: "white", display: "flex" }}>
        <Navbar />
        <Box sx={{ flex: 1, pl: 0, pr: 0, pt: `${appBarHeight}px` }}>
          <PageTitle
            value="Assignments"
            filter={filter}
            setFilter={setFilter}
            sort={sort}
            setSort={setSort}
            handleSearch={handleSearch}
            setAppBarHeight={setAppBarHeight}
          />

          {/* 卡片区域：Grid 布局 */}
          <Box
            sx={{
              mt: "-400px", // 让卡片在 AppBar 下方
              display: "grid",
              gridTemplateColumns: "repeat(5, 150px)", // 每行 5 张卡片
              gap: 15,
              justifyContent: "flex-start", // 靠左
              alignItems: "start",
            }}
          >
            {filteredSubjects.map((s, index) => (
              <Paper
                key={index}
                sx={{
                  width: cardWidth,
                  height: cardHeight,
                  bgcolor: "#E5E5E5",
                  borderRadius: 2,
                  textAlign: "left",
                  padding: 3,
                }}
              >
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {s.name}
                </Typography>
                <Typography>{s.code}</Typography>
                <Typography>{s.assignments} Assignments</Typography>
              </Paper>
            ))}

            {/*  只有 Admin 才能看到加号卡片 */}
            {role === "admin" && (
              <Paper
                sx={{
                  width: cardWidth,
                  height: cardHeight,
                  bgcolor: "#E5E5E5",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "3rem",
                  cursor: "pointer",
                }}
                onClick={() => alert("Add new assignment")}
              >
                +
              </Paper>
            )}
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
}
