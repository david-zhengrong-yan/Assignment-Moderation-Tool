import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Avatar } from '@mui/material';
import PersonIcon from "@mui/icons-material/Person";

export default function Navbar() {
    return (
        <Box component="nav">
            <Drawer
                variant="permanent"
                slotProps={{
                    root: {
                    keepMounted: true, // Better open performance on mobile.
                    },
                    paper : {
                        sx : {
                            width: 200,
                            bgcolor : "#484E58",
                        }
                    }
                }}
            >
                <Box
                >
                    <Avatar 
                        variant="square"
                        sx={{ 
                            m : "auto",
                            mt : 5,
                            bgcolor : "white",
                        }} 
                        style={{
                            width : 70,
                            height : 70,
                            
                        }}
                    >
                        <PersonIcon 
                            sx={{
                                width : "100%",
                                height: "100%",
                                fontSize: "inherit",
                                bgcolor : "white",
                                color : "grey"
                            }}
                        />
                    </Avatar>
                </Box>
                
                <List sx={{ mt : 1 }}>
                    {['Account', 'Assignments', 'People', 'Subjects'].map((text) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                        <ListItemText 
                            primary={text} 
                            sx={{
                                textAlign :  "center",
                                color : "white"
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
