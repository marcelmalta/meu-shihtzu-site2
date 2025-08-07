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

// Adicione isso ao <head> do index.html para garantir a fonte Orelega One:
// <link href="https://fonts.googleapis.com/css2?family=Orelega+One&display=swap" rel="stylesheet" />

// =================== Header ===================
const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: 130,
        background: "#111",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        pb: 1.5,
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
      <Typography
        sx={{
          position: "relative",
          zIndex: 2,
          color: "#d5bb51",
          fontFamily: "'Orelega One', cursive",
          fontSize: "2rem",
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
              { label: "Cadastro", route: "/cadastro" },
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

// =================== NewsHighlight ===================
const NewsHighlight: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <Box sx={{ my: 3 }}>
    <Typography
      variant="h6"
      sx={{
        fontFamily: "'Orelega One', cursive",
        fontWeight: 700,
        textAlign: "center",
        color: "#111",
        letterSpacing: 2,
        fontSize: "1.35rem",
        mb: 1,
        textShadow: "1px 1px 2px #fff9",
      }}
    >
      NOVIDADES
    </Typography>
    <Typography
      sx={{
        fontFamily: "'Roboto', Arial, sans-serif",
        textAlign: "center",
        color: "#333",
        fontSize: "0.95rem",
        mb: 1.3,
      }}
    >
      Últimas atualizações para você!
    </Typography>
    <Box
      onClick={onClick}
      sx={{
        width: "90vw",
        maxWidth: 320,
        height: 170,
        bgcolor: "#d9d9d9",
        mx: "auto",
        borderRadius: 3,
        boxShadow: 2,
        cursor: "pointer",
        transition: "transform 0.15s",
        "&:hover": { transform: "scale(1.02)" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url('/img/news-highlight.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Conteúdo opcional dentro do destaque */}
    </Box>
  </Box>
);

// =================== NewsGrid ===================
const NewsGrid: React.FC<{ onClick: (id: number) => void }> = ({ onClick }) => (
  <Box sx={{ my: 1.5 }}>
    <Typography
      variant="h6"
      sx={{
        fontFamily: "'Orelega One', cursive",
        fontWeight: 700,
        textAlign: "center",
        color: "#111",
        letterSpacing: 2,
        fontSize: "1.15rem",
        mb: 0.6,
        textShadow: "1px 1px 2px #fff9",
      }}
    >
      MAIS NOTÍCIAS
    </Typography>
    <Typography
      sx={{
        fontFamily: "'Roboto', Arial, sans-serif",
        textAlign: "center",
        color: "#333",
        fontSize: "0.89rem",
        mb: 1,
      }}
    >
      Confira as notícias anteriores
    </Typography>
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 2,
        width: "90vw",
        maxWidth: 340,
        mx: "auto",
        mb: 2,
      }}
    >
      {[1, 2, 3, 4].map((n) => (
        <Box
          key={n}
          onClick={() => onClick(n)}
          sx={{
            width: "100%",
            aspectRatio: "1 / 1",
            bgcolor: "#d9d9d9",
            borderRadius: 2,
            boxShadow: 1,
            cursor: "pointer",
            transition: "transform 0.13s",
            "&:hover": { transform: "scale(1.03)" },
            backgroundImage: `url('/img/news${n}.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}
    </Box>
  </Box>
);

// =================== LoadMoreButton ===================
const LoadMoreButton: React.FC = () => (
  <Box sx={{ width: "90vw", maxWidth: 320, mx: "auto", mb: 2 }}>
    <Button
      fullWidth
      variant="contained"
      sx={{
        bgcolor: "#d5bb51",
        color: "#111",
        fontWeight: 700,
        fontFamily: "'Orelega One', cursive",
        letterSpacing: 2,
        py: 1.1,
        fontSize: "1rem",
        borderRadius: 3,
        boxShadow: 2,
        "&:hover": { bgcolor: "#b9a342" },
      }}
    >
      CARREGAR MAIS
    </Button>
  </Box>
);

// =================== Footer ===================
const Footer: React.FC = () => (
  <Box
    sx={{
      width: "100vw",
      height: 70,
      bgcolor: "#111",
      color: "#d5bb51",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Roboto', Arial, sans-serif",
      fontSize: "1.08rem",
      mt: 4,
    }}
  >
    © {new Date().getFullYear()} Shihtzuz — Todos os direitos reservados
  </Box>
);

// =================== HomePage ===================
function HomePage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        minHeight: "100vh",
        pb: 3,
      }}
    >
      <Header />
      <NewsHighlight onClick={() => navigate("/noticia/1")} />
      <NewsGrid onClick={(id) => navigate(`/noticia/${id}`)} />
      <LoadMoreButton />
      <Footer />
    </Box>
  );
}

export default HomePage;
