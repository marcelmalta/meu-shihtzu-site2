// src/BottomNavBar.tsx
import React from "react";
import { Box, IconButton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import PeopleIcon from "@mui/icons-material/People";
import StorefrontIcon from "@mui/icons-material/Storefront";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

const BottomNavBar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 110,
        background: "#fff",
        boxShadow: "0 -2px 8px #0002",
        py: 0.5,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        maxWidth: 500,
        mx: "auto",
        width: "100vw",
      }}
    >
      <IconButton onClick={() => navigate("/")} aria-label="Início">
        <HomeIcon sx={{ color: "#ff7800" }} />
      </IconButton>
      <IconButton onClick={() => navigate("/videos")} aria-label="Vídeos">
        <OndemandVideoIcon sx={{ color: "#333" }} />
      </IconButton>
      <IconButton onClick={() => navigate("/comunidade")} aria-label="Comunidade">
        <PeopleIcon sx={{ color: "#333" }} />
      </IconButton>
      <IconButton onClick={() => navigate("/shop")} aria-label="Loja">
        <StorefrontIcon sx={{ color: "#333" }} />
      </IconButton>
      <IconButton onClick={() => navigate("/notificacoes")} aria-label="Notificações">
        <NotificationsIcon sx={{ color: "#333" }} />
      </IconButton>
      <IconButton onClick={() => navigate("/login")} aria-label="Conta">
        <AccountCircleIcon sx={{ color: "#333" }} />
      </IconButton>
    </Box>
  );
};

export default BottomNavBar;
