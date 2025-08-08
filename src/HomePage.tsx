import React from "react";
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

// Exemplo de dados de notícias
const news = [
  {
    id: 1,
    title: "Dica para escovação diária",
    type: "image",
    media: "/img/news1.jpg",
    description: "Como escovar seu Shih Tzu corretamente.",
  },
  {
    id: 2,
    title: "Brincadeira saudável",
    type: "video",
    media: "/videos/brincadeira.mp4",
    description: "Veja como estimular seu pet com brincadeiras seguras.",
  },
  // Adicione outras notícias...
];

// =================== Header ===================
export const Header: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

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

// =================== NewsCard ===================
const NewsCard: React.FC<{
  item: typeof news[0];
  onClick: () => void;
}> = ({ item, onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      width: "100%",
      maxWidth: 350,
      bgcolor: "#fff",
      borderRadius: 3,
      boxShadow: 2,
      cursor: "pointer",
      mb: 3,
      mx: "auto",
      p: 2,
      transition: "box-shadow 0.2s, transform 0.15s",
      "&:hover": { boxShadow: 5, transform: "scale(1.01)" },
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    {item.type === "image" ? (
      <img
        src={item.media}
        alt={item.title}
        style={{
          width: "100%",
          maxHeight: 210,
          borderRadius: 12,
          objectFit: "cover",
        }}
      />
    ) : (
      <video
        controls
        style={{
          width: "100%",
          maxHeight: 210,
          borderRadius: 12,
          background: "#222",
        }}
        poster="/img/news-thumb.jpg"
      >
        <source src={item.media} type="video/mp4" />
        Seu navegador não suporta vídeo.
      </video>
    )}
    <Typography
      sx={{
        mt: 1.4,
        fontWeight: 700,
        fontFamily: "'Orelega One', cursive",
        color: "#d5bb51",
        fontSize: "1.11rem",
        textAlign: "center",
      }}
    >
      {item.title}
    </Typography>
    <Typography
      sx={{
        color: "#444",
        fontSize: "0.96rem",
        mt: 0.5,
        mb: 1,
        textAlign: "center",
      }}
    >
      {item.description}
    </Typography>
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
      {/* Bloco Novidades */}
      <Box sx={{ maxWidth: 980, mx: "auto", mt: 5 }}>
        <Typography
          variant="h5"
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
            mb: 2.5,
          }}
        >
          Últimas atualizações para você!
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 32,
            justifyContent: "center",
            mb: 3,
          }}
        >
          {news.map((item) => (
            <NewsCard
              key={item.id}
              item={item}
              onClick={() => navigate(`/noticia/${item.id}`)}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default HomePage;
