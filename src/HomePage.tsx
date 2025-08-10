// src/HomePage.tsx
import React from "react";
import { Box, Alert, CircularProgress, Paper, Avatar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import TopBar from "./TopBar";
import StoriesBar from "./StoriesBar";
import FeedCard from "./FeedCard";
import type { Post } from "./FeedCard";
import BottomNavBar from "./BottomNavBar";
import { getPosts } from "./services/api";

// ====== CreatePostBox simples (abre login se não autenticado) ======
const CreatePostBox: React.FC<{ onCreate?: () => void }> = ({ onCreate }) => {
  const navigate = useNavigate();
  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 1.2,
        py: 1,
        borderRadius: 3,
        mx: 1,
        mb: 1,
        border: "1px solid #eee",
        background: "#fff",
        cursor: "pointer",
      }}
      onClick={() => (onCreate ? onCreate() : navigate("/login"))}
      aria-label="Criar nova postagem (requer login)"
    >
      <Avatar src="/uploads/avatar-mariana.jpg" sx={{ width: 36, height: 36 }} />
      <Box
        sx={{
          flex: 1,
          borderRadius: 999,
          border: "1px solid #e5e7eb",
          px: 1.6,
          py: 1,
          color: "#6b7280",
          fontSize: "0.95rem",
          background: "#f9fafb",
        }}
      >
        Compartilhe algo do seu pet...
      </Box>
    </Paper>
  );
};

// ====== Fallback local (mock) ======
const fallbackPosts: Post[] = [
  {
    id: "1",
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
    id: "2",
    petName: "Max",
    owner: "Paulo",
    type: "video",
    media: "/uploads/max-brincando.mp4",
    caption: "Max brincando no parque 🐾",
    likes: 35,
    comments: 7,
    createdAt: "2025-08-07",
  },
];

const mapApiToPosts = (rows: any[]): Post[] =>
  (rows ?? []).map((r) => ({
    id: String(r.id ?? r._id ?? Math.random().toString(36).slice(2, 10)),
    petName: r.petName ?? r.pet?.name ?? "Pet",
    owner: r.owner ?? r.user?.username,
    type: (r.type as Post["type"]) ?? (r.media ? "image" : "text"),
    media: r.media,
    caption: r.caption ?? r.text ?? "",
    likes: r.likes ?? 0,
    comments: r.commentsCount ?? r.comments ?? 0,
    createdAt: r.createdAt,
  }));

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [posts, setPosts] = React.useState<Post[]>([]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPosts();
        const mapped = mapApiToPosts(data);
        if (!cancelled) {
          setPosts(mapped.length ? mapped : fallbackPosts);
        }
      } catch {
        if (!cancelled) {
          setPosts(fallbackPosts);
          setError("Não foi possível carregar do servidor. Exibindo posts de exemplo.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Box
      sx={{
        bgcolor: "#f0f2f5",
        minHeight: "100vh",
        pb: 8,
        maxWidth: 500,
        mx: "auto",
        fontFamily: "Arial, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <TopBar />
      <StoriesBar />
      <CreatePostBox onCreate={() => navigate("/login")} />

      {error && (
        <Alert severity="warning" sx={{ mx: 1, mb: 1, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, px: 0.5 }}>
          {posts.map((post) => (
            <FeedCard key={post.id} post={post} onClick={() => navigate(`/noticia/${post.id}`)} />
          ))}
          {posts.length === 0 && (
            <Box sx={{ textAlign: "center", color: "#555", py: 4 }}>
              <Typography variant="body1">Sem posts por aqui ainda.</Typography>
            </Box>
          )}
        </Box>
      )}

      <BottomNavBar />
    </Box>
  );
};

export default HomePage;
