import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import * as React from "react";

export default function PageTitle({
  value,
  filter,
  setFilter,
  sort,
  setSort,
  handleSearch,
  setAppBarHeight
}) {
  const navbarWidth = 200;
  const ref = React.useRef(null);

  React.useEffect(() => {
    // 初始化时就获取一次高度，避免动态计算延迟
    if (ref.current && setAppBarHeight) {
      setAppBarHeight(ref.current.offsetHeight);
      const resizeObserver = new ResizeObserver(() => {
        setAppBarHeight(ref.current.offsetHeight);
      });
      resizeObserver.observe(ref.current);
      return () => resizeObserver.disconnect();
    }
  }, [setAppBarHeight]);

  return (
    <AppBar
      ref={ref}
      position="fixed" // 核心：固定定位，不随滚动移动
      elevation={0}
      sx={{
        bgcolor: "white", // 白底，避免与页面背景融合
        color: "black",
        borderBottom: "1px solid #ddd", // 底部边框，区分搜索栏和卡片
        zIndex: (theme) => theme.zIndex.drawer + 1, // 层级高于左侧导航栏，避免被遮挡
        ml: `${navbarWidth}px`, // 与左侧导航栏对齐
        width: `calc(100% - ${navbarWidth}px)`, // 宽度 = 页面总宽 - 导航栏宽度
        px: 3, // 内部左右padding，与卡片容器呼应
        py: 2,
        top: 0 // 强制固定在页面顶部，无偏移（关键补充）
      }}
    >
      {/* 标题 */}
      <Typography variant="h4" align="left" sx={{ mb: 2 }}>
        {value}
      </Typography>
      {/* 工具栏 */}
      <Toolbar disableGutters sx={{ display: "flex", gap: 3 }}>
        <TextField
          label="Search"
          type="search"
          size="small"
          sx={{ flex: 1, maxWidth: "60%" }}
          onChange={handleSearch}
        />
        {/* Filter */}
        <FormControl sx={{ width: 150 }} size="small">
          <InputLabel id="filter-label">Filter</InputLabel>
          <Select
            labelId="filter-label"
            value={filter}
            label="Filter"
            onChange={(e) => setFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="incomplete">Incomplete</MenuItem>
          </Select>
        </FormControl>
        {/* Sort */}
        <FormControl sx={{ width: 150 }} size="small">
          <InputLabel id="sort-label">Sort by</InputLabel>
          <Select
            labelId="sort-label"
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
  );
}