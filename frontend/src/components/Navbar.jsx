import * as React from "react";
import { Box, Drawer, Avatar, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function Navbar() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        credentials: "include", // Include session cookies
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        localStorage.removeItem("sessionid");
        navigate("/login"); // redirect to login
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const menuItems = [
    { text: "Home", path: `/${userId}/home` },
    { text: "Account", path: `/${userId}/account` },
    { text: "Logout", path: "#", onClick: handleLogout } // Use onClick
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
            {item.onClick ? (
              <ListItemButton onClick={item.onClick}>
                <ListItemText
                  primary={item.text}
                  sx={{ textAlign: "center", color: "white" }}
                />
              </ListItemButton>
            ) : (
              <ListItemButton component={Link} to={item.path}>
                <ListItemText
                  primary={item.text}
                  sx={{ textAlign: "center", color: "white" }}
                />
              </ListItemButton>
            )}
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
