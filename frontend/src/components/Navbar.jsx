import * as React from "react";
import { Box, Drawer, Avatar, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

export default function Navbar() {
  return (
    <Drawer
      variant="permanent"
      PaperProps={{
        sx: {
          width: 200,
          height: "100vh",
          bgcolor: "#484E58",
          boxSizing: "border-box",
          m: 0,
          p: 0,
        },
      }}
    >
      <Box sx={{ mt: 5, mb: 3, display: "flex", justifyContent: "center" }}>
        <Avatar variant="square" sx={{ width: 70, height: 70, bgcolor: "white" }}>
          <PersonIcon sx={{ width: "100%", height: "100%", color: "grey" }} />
        </Avatar>
      </Box>

      <List>
        {["Account", "Assignments", "People", "Subjects"].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemText primary={text} sx={{ textAlign: "center", color: "white" }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
