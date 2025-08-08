import React from "react";
import { Box, IconButton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import PeopleIcon from "@mui/icons-material/People";
import StorefrontIcon from "@mui/icons-material/Storefront";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const BottomNavBar: React.FC = () => (
  <Box sx={{
    position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 110,
    background: "#fff", boxShadow: "0 -2px 8px #0002", py: 0.5,
    display: "flex", justifyContent: "space-around", alignItems: "center",
    maxWidth: 500, mx: "auto", width: "100vw"
  }}>
    <IconButton><HomeIcon sx={{ color: "#23272e" }} /></IconButton>
    <IconButton><OndemandVideoIcon sx={{ color: "#333" }} /></IconButton>
    <IconButton><PeopleIcon sx={{ color: "#333" }} /></IconButton>
    <IconButton><StorefrontIcon sx={{ color: "#333" }} /></IconButton>
    <IconButton><NotificationsIcon sx={{ color: "#333" }} /></IconButton>
    <IconButton><AccountCircleIcon sx={{ color: "#333" }} /></IconButton>
  </Box>
);

export default BottomNavBar;
