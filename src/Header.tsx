import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: 90,
        background: "#111",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        pb: 1.5,
        boxShadow: "0 2px 10px #0003",
        zIndex: 10,
      }}
    >
      <img
        src="/img/shih-background.png"
        alt="Shih Tzu background"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.58,
          zIndex: 1,
        }}
      />
      <Button
        onClick={() => navigate("/")}
        sx={{
          position: "relative",
          zIndex: 2,
          color: "#d5bb51",
          fontFamily: "'Orelega One', cursive",
          fontSize: "2rem",
          fontWeight: 700,
          letterSpacing: "2px",
          ml: 2,
          background: "none",
          boxShadow: "none",
          "&:hover": { background: "none", color: "#FFD700" },
        }}
        disableRipple
      >
        SHIHTIZUz
      </Button>
      <IconButton
        sx={{
          position: "absolute",
          top: 18,
          right: 16,
          color: "#fff",
          zIndex: 3,
        }}
        aria-label="menu"
        onClick={() => setOpen(true)}
      >
        <MenuIcon sx={{ fontSize: 38 }} />
      </IconButton>
      {/* Drawer do menu lateral pode ser adicionado aqui */}
    </Box>
  );
};

export default Header;
