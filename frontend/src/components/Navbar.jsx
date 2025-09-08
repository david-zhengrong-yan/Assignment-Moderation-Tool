// import * as React from 'react';
// import PropTypes from 'prop-types';
// import AppBar from '@mui/material/AppBar';
// import Box from '@mui/material/Box';
// import CssBaseline from '@mui/material/CssBaseline';
// import Divider from '@mui/material/Divider';
// import Drawer from '@mui/material/Drawer';
// import IconButton from '@mui/material/IconButton';
// import InboxIcon from '@mui/icons-material/MoveToInbox';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import MailIcon from '@mui/icons-material/Mail';
// import MenuIcon from '@mui/icons-material/Menu';
// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import { Avatar } from '@mui/material';
// import PersonIcon from "@mui/icons-material/Person";

import * as React from 'react';
import { Box, Drawer, Avatar, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import PersonIcon from "@mui/icons-material/Person";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
    const location = useLocation();   // 获取当前路径
    const currentPath = location.pathname;

    // 定义菜单
    const menuItems = [
        { text: "Account", path: "/account" },
        { text: "Assignments", path: "/home" },   // ⚡ 注意这里和 App.jsx 里的 <Route path="/home" /> 保持一致
        { text: "People", path: "/peoples" }
    ];

    return (
        <Box component="nav">
            <Drawer
                variant="permanent"
                PaperProps={{
                    sx: { width: 200, bgcolor: "#484E58" }
                }}
            >
                {/* 头像 */}
                <Box>
                    <Avatar 
                        variant="square"
                        sx={{ 
                            m: "auto", 
                            mt: 5, 
                            bgcolor: "white",
                            width: 70, 
                            height: 70 
                        }}
                    >
                        <PersonIcon sx={{ width: "100%", height: "100%", color: "grey" }} />
                    </Avatar>
                </Box>

                {/* 菜单 */}
                <List sx={{ mt: 2 }}>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton component={Link} to={item.path}>
                                <ListItemText 
                                    primary={item.text} 
                                    sx={{
                                        textAlign: "center",
                                        color: currentPath.startsWith(item.path) ? "red" : "white",
                                        fontWeight: currentPath.startsWith(item.path) ? "bold" : "normal"
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </Box>
    );
}

