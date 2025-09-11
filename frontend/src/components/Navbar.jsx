import * as React from "react";
import { Box, Drawer, Avatar, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { Link } from "react-router-dom"; // import Link from React Router

export default function Navbar() {
  const menuItems = [
    { text: "Account", path: "/account" },
    { text: "Home", path: "/home" },
    { text: "People", path: "/people" },
    { test: "Logout", path: "/"}
  ];

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
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link} // Use Link as the component
              to={item.path}    // Route path
            >
              <ListItemText
                primary={item.text}
                sx={{ textAlign: "center", color: "white" }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
