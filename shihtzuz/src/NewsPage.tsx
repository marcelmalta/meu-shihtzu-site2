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
  TextField,
} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import MenuIcon from "@mui/icons-material/Menu";
import ShareIcon from "@mui/icons-material/Share";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import { useNavigate } from "react-router-dom";

// Header igual ao HomePage
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

// NewsContent ajustado (sem o bloco cinza vazio)
const NewsContent: React.FC = () => (
  <Box sx={{ width: "90vw", maxWidth: 420, mx: "auto", mt: 2, mb: 2 }}>
    <Typography
      sx={{
        fontFamily: "'Orelega One', cursive",
        fontWeight: 700,
        textAlign: "center",
        color: "#222",
        letterSpacing: 2,
        fontSize: "1.24rem",
        mb: 1.8,
        textShadow: "1px 1px 2px #fff9",
      }}
    >
      TÍTULO DA POSTAGEM
    </Typography>
    <Box
      sx={{
        width: "100%",
        minHeight: 220,
        bgcolor: "#e6e6e6",
        borderRadius: 3,
        boxShadow: 2,
        p: 3,
        mb: 2,
      }}
    >
      <Typography
        sx={{
          fontFamily: "'Roboto', Arial, sans-serif",
          color: "#111",
          fontSize: "1.11rem",
          lineHeight: 1.7,
        }}
      >
        Aqui vai o conteúdo da notícia. O administrador pode inserir vídeo, imagem e texto livre.<br />
        <br />
        <strong>Exemplo:</strong> O Shih Tzu é uma das raças mais amadas do mundo. Veja fotos, curiosidades e dicas de cuidados.
      </Typography>
    </Box>
  </Box>
);

// CommentBox e Footer permanecem iguais
const CommentBox: React.FC = () => (
  <Box
    sx={{
      width: "90vw",
      maxWidth: 340,
      mx: "auto",
      bgcolor: "#f5f5f5",
      border: "1px solid #ddd",
      borderRadius: 2,
      p: 2,
      mb: 2,
      boxShadow: 1,
    }}
  >
    <Typography
      sx={{
        fontFamily: "'Orelega One', cursive",
        color: "#444",
        mb: 1,
        fontSize: "1.03rem",
        fontWeight: 700,
        letterSpacing: 1,
      }}
    >
      Comentários
    </Typography>
    {/* Campo de adicionar comentário */}
    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
      <TextField
        variant="outlined"
        size="small"
        placeholder="Escreva um comentário..."
        fullWidth
        sx={{
          bgcolor: "#fff",
          borderRadius: 1,
          fontFamily: "'Roboto', Arial, sans-serif",
        }}
      />
      <Button
        variant="contained"
        sx={{
          bgcolor: "#d5bb51",
          color: "#111",
          fontFamily: "'Orelega One', cursive",
          fontWeight: 700,
          minWidth: 0,
        }}
      >
        Publicar
      </Button>
    </Box>
    {/* Lista de comentários (mock) */}
    <Box
      sx={{
        bgcolor: "#fff",
        borderRadius: 1,
        p: 1.2,
        mb: 1.3,
        boxShadow: 0,
        border: "1px solid #eee",
      }}
    >
      <Typography
        sx={{
          fontFamily: "'Roboto', Arial, sans-serif",
          color: "#111",
          fontSize: "0.97rem",
        }}
      >
        <strong>Usuário123:</strong> Muito legal essa matéria! 🐶
      </Typography>
      {/* Ações: curtir, responder, compartilhar */}
      <Box sx={{ display: "flex", gap: 2, mt: 0.5, ml: -1 }}>
        <Button
          startIcon={<ThumbUpAltOutlinedIcon />}
          sx={{
            fontFamily: "'Roboto', Arial, sans-serif",
            color: "#d5bb51",
            minWidth: 0,
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          Curtir
        </Button>
        <Button
          startIcon={<ReplyOutlinedIcon />}
          sx={{
            fontFamily: "'Roboto', Arial, sans-serif",
            color: "#d5bb51",
            minWidth: 0,
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          Responder
        </Button>
        <Button
          startIcon={<ShareIcon />}
          sx={{
            fontFamily: "'Roboto', Arial, sans-serif",
            color: "#d5bb51",
            minWidth: 0,
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          Compartilhar
        </Button>
      </Box>
    </Box>
    {/* ...Outros comentários dinâmicos no futuro */}
  </Box>
);

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

function NewsPage() {
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        minHeight: "100vh",
        pb: 3,
      }}
    >
      <Header />
      <NewsContent />
      <CommentBox />
      <Footer />
    </Box>
  );
}

export default NewsPage;
