import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

// Header padrão
const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: 110,
        background: "#111",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        pb: 1.2,
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
          opacity: 0.7,
          zIndex: 1,
        }}
      />
      <Typography
        sx={{
          position: "relative",
          zIndex: 2,
          color: "#d5bb51",
          fontFamily: "'Orelega One', cursive",
          fontSize: "1.6rem",
          fontWeight: 700,
          letterSpacing: "2px",
          ml: 2,
        }}
      >
        SHIHTIZUz
      </Typography>
      <IconButton
        sx={{
          position: "absolute",
          top: 16,
          right: 18,
          color: "#fff",
          zIndex: 3,
        }}
        aria-label="menu"
        onClick={() => setOpen(true)}
      >
        <MenuIcon sx={{ fontSize: 32 }} />
      </IconButton>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: { width: 220, bgcolor: "#181818", color: "#fff" },
        }}
      >
        <Box sx={{ mt: 4 }}>
          <List>
            {[
              { label: "Home", route: "/" },
              { label: "Login", route: "/login" },
              { label: "Shop", route: "/shop" },
            ].map((item) => (
              <ListItem disablePadding key={item.label}>
                <ListItemButton
                  onClick={() => {
                    setOpen(false);
                    navigate(item.route);
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontFamily: "'Orelega One', cursive",
                          fontSize: "1.1rem",
                          color: "#FFD700",
                        }}
                      >
                        {item.label}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

// --- Página de Cadastro ---
const CadastroPage: React.FC = () => {
  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh", pb: 2 }}>
      <Header />

      {/* Título */}
      <Typography
        sx={{
          fontFamily: "'Bungee', 'Orelega One', cursive",
          fontWeight: 700,
          textAlign: "center",
          color: "#222",
          fontSize: "2rem",
          letterSpacing: 2,
          mt: 2.2,
          mb: 2,
          textShadow: "2px 2px 4px #8887",
        }}
      >
        CADASTRO
      </Typography>

      {/* Formulário ou Placeholder */}
      <Box
        sx={{
          width: "92vw",
          maxWidth: 370,
          height: 240,
          bgcolor: "#ddd",
          borderRadius: 2,
          mx: "auto",
          mb: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Substitua por seu formulário futuramente */}
        {/* <TextField ... /> */}
      </Box>

      {/* Botão Login */}
      <Typography
        component="a"
        href="/login"
        sx={{
          display: "block",
          fontFamily: "'Bungee', 'Orelega One', cursive",
          fontWeight: 700,
          textAlign: "center",
          color: "#222",
          fontSize: "1.5rem",
          letterSpacing: 1,
          mt: 1.5,
          textDecoration: "none",
          textShadow: "2px 2px 4px #8887",
          cursor: "pointer",
          transition: "color 0.14s",
          "&:hover": { color: "#b9a342" },
        }}
      >
        LOGIN
      </Typography>
    </Box>
  );
};

export default CadastroPage;
