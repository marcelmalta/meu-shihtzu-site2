import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
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
              { label: "Cadastro", route: "/cadastro" },
              { label: "Login", route: "/login" },
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

// --- Shop Page ---
const ShopPage: React.FC = () => {
  // Simulando produtos
  const produtos = Array.from({ length: 21 }); // Troque pelo seu array real depois

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
          fontSize: "2.1rem",
          letterSpacing: 2,
          mt: 1.5,
          mb: 2,
          textShadow: "2px 2px 4px #8885",
        }}
      >
        PRODUTOS
      </Typography>

      {/* Filtros */}
      <Box
        sx={{
          width: "90vw",
          maxWidth: 370,
          height: 56,
          bgcolor: "#e6e6e6",
          borderRadius: 2,
          mx: "auto",
          mb: 2,
          boxShadow: 1,
        }}
      >
        {/* Aqui virão os filtros futuramente */}
      </Box>

      {/* Grid de Produtos */}
      <Box
        sx={{
          width: "92vw",
          maxWidth: 370,
          mx: "auto",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 2,
        }}
      >
        {produtos.map((_, idx) => (
          <Box
            key={idx}
            sx={{
              width: "100%",
              aspectRatio: "1 / 1",
              bgcolor: "#ddd",
              borderRadius: 1.4,
              cursor: "pointer",
              transition: "transform 0.14s",
              boxShadow: 1,
              "&:hover": { transform: "scale(1.045)", boxShadow: 3 },
            }}
            // onClick={() => openProduto(idx)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ShopPage;
