import React from "react";
import { Box, Typography, IconButton, Avatar } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddBoxIcon from "@mui/icons-material/AddBox";
import MessageIcon from "@mui/icons-material/Message";

// Altere pelo avatar do usuário logado:
const userAvatar = "/uploads/avatar-mariana.jpg";

const TopBar: React.FC = () => (
  <Box sx={{
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "#fff",
    px: 1.5,
    py: 1,
    boxShadow: "0 2px 6px #0001",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  }}>
    <Typography
      variant="h5"
      sx={{
        fontWeight: 700,
        color: "#23272e",
        fontFamily: "'Segoe UI', Arial, sans-serif",
        letterSpacing: "-1px",
        mr: 0.5,
      }}>
      Shihtzuz
    </Typography>
    <Box sx={{ display: "flex", gap: 0.5 }}>
      <IconButton><SearchIcon sx={{ color: "#050505" }} /></IconButton>
      <IconButton><AddBoxIcon sx={{ color: "#23272e" }} /></IconButton>
      <IconButton><MessageIcon sx={{ color: "#23272e" }} /></IconButton>
      <Avatar sx={{ width: 36, height: 36 }} src={userAvatar} />
    </Box>
  </Box>
);

export default TopBar;
