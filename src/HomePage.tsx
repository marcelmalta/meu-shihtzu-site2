import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

// ===== Tipos TypeScript =====
type PostType = "image" | "video";

interface Post {
  id: number;
  petName: string;
  owner: string;
  type: PostType;
  media: string;
  caption: string;
  likes: number;
  comments: number;
  createdAt: string;
}

interface FeedCardProps {
  post: Post;
  onClick: () => void;
}

// ===== Exemplo de posts simulados (mock) =====
const posts: Post[] = [
  {
    id: 1,
    petName: "Luna",
    owner: "Mariana",
    type: "image",
    media: "/uploads/luna-banho.jpg",
    caption: "Hoje foi dia de banho!",
    likes: 22,
    comments: 5,
    createdAt: "2025-08-08",
  },
  {
    id: 2,
    petName: "Max",
    owner: "Paulo",
    type: "video",
    media: "/uploads/max-brincando.mp4",
    caption: "Max brincando no parque 🐾",
    likes: 35,
    comments: 7,
    createdAt: "2025-08-07",
  },
  // ...adicione mais posts!
];

// ===== Header com botão Home =====
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

// ===== Card do Feed =====
const FeedCard: React.FC<FeedCardProps> = ({ post, onClick }) => {
  return (
    <Box
      className="novidade-card"
      onClick={onClick}
      sx={{
        background: "#fff",
        borderRadius: 3,
        boxShadow: 2,
        cursor: "pointer",
        mb: 3,
        mx: "auto",
        p: 2,
        maxWidth: 370,
        transition: "box-shadow 0.2s, transform 0.15s",
        "&:hover": { boxShadow: 5, transform: "scale(1.015)" },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Nome do pet e tutor */}
      <Typography
        sx={{
          fontWeight: 700,
          fontFamily: "'Orelega One', cursive",
          color: "#d5bb51",
          fontSize: "1.11rem",
          mb: 0.2,
        }}
      >
        {post.petName}
      </Typography>
      <Typography
        sx={{
          color: "#444",
          fontSize: "0.92rem",
          fontStyle: "italic",
          mb: 1,
        }}
      >
        de @{post.owner} — {new Date(post.createdAt).toLocaleDateString()}
      </Typography>
      {/* Mídia */}
      {post.type === "image" ? (
        <img
          src={post.media}
          alt={post.caption}
          style={{
            width: "100%",
            maxHeight: 210,
            borderRadius: 12,
            objectFit: "cover",
            marginBottom: 12,
            background: "#222",
          }}
        />
      ) : (
        <video
          controls
          style={{
            width: "100%",
            maxHeight: 210,
            borderRadius: 12,
            marginBottom: 12,
            background: "#222",
          }}
          poster="/img/video-thumb.jpg"
        >
          <source src={post.media} type="video/mp4" />
          Seu navegador não suporta vídeo.
        </video>
      )}
      {/* Legenda */}
      <Typography
        sx={{
          color: "#333",
          fontSize: "1rem",
          mb: 1,
          textAlign: "center",
        }}
      >
        {post.caption}
      </Typography>
      {/* Curtidas e comentários */}
      <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
        <span>❤️ {post.likes}</span>
        <span>💬 {post.comments}</span>
      </Box>
    </Box>
  );
};

// ===== Página Home com o Feed =====
const HomePage: React.FC = () => {
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
          mt: 5,
          textShadow: "1px 1px 2px #fff9",
        }}
      >
        FEED DOS SHIHTZUS
      </Typography>
      <Typography
        sx={{
          fontFamily: "'Roboto', Arial, sans-serif",
          textAlign: "center",
          color: "#333",
          fontSize: "0.97rem",
          mb: 2.5,
        }}
      >
        Veja as últimas postagens dos tutores e compartilhe momentos do seu pet!
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: 32,
          justifyContent: "center",
          maxWidth: 980,
          mx: "auto",
          mb: 3,
        }}
      >
        {posts.map((post) => (
          <FeedCard
            key={post.id}
            post={post}
            onClick={() => navigate(`/post/${post.id}`)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default HomePage;
