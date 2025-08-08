import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import Header from "./Header"; // Agora importa do novo arquivo

// ===== Tipos TypeScript =====
type PostType = "image" | "video";

interface Comment {
  id: number;
  author: string;
  text: string;
}

interface Post {
  id: number;
  petName: string;
  owner: string;
  type: PostType;
  media: string;
  caption: string;
  likes: number;
  comments: Comment[];
  createdAt: string;
}

// ===== Simulação de posts =====
const posts: Post[] = [
  {
    id: 1,
    petName: "Luna",
    owner: "Mariana",
    type: "image",
    media: "/uploads/luna-banho.jpg",
    caption: "Hoje foi dia de banho!",
    likes: 22,
    comments: [
      { id: 1, author: "Paulo", text: "Ficou linda!" },
      { id: 2, author: "Juliana", text: "Que fofura 🐶" },
    ],
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
    comments: [{ id: 1, author: "Mariana", text: "Adorei!" }],
    createdAt: "2025-08-07",
  },
  // ...adicione mais posts se quiser
];

const PostPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  // Procura o post pelo id na lista mock
  const post = posts.find((p) => p.id === Number(id));

  if (!post)
    return (
      <Box sx={{ p: 6 }}>
        <Typography>Postagem não encontrada.</Typography>
        <Button onClick={() => navigate("/")}>Voltar para o feed</Button>
      </Box>
    );

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh", pb: 3 }}>
      <Header />
      <Box
        sx={{
          maxWidth: 540,
          mx: "auto",
          mt: 6,
          p: 3,
          background: "#f9f9f9",
          borderRadius: 4,
          boxShadow: 2,
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontFamily: "'Orelega One', cursive",
            color: "#d5bb51",
            fontSize: "1.29rem",
            mb: 1,
          }}
        >
          {post.petName}
        </Typography>
        <Typography
          sx={{
            color: "#444",
            fontSize: "0.97rem",
            fontStyle: "italic",
            mb: 1,
          }}
        >
          de @{post.owner} — {new Date(post.createdAt).toLocaleDateString()}
        </Typography>

        {post.type === "image" ? (
          <img
            src={post.media}
            alt={post.caption}
            style={{
              width: "100%",
              maxHeight: 320,
              borderRadius: 12,
              objectFit: "cover",
              marginBottom: 18,
              background: "#222",
            }}
          />
        ) : (
          <video
            controls
            style={{
              width: "100%",
              maxHeight: 320,
              borderRadius: 12,
              marginBottom: 18,
              background: "#222",
            }}
            poster="/img/video-thumb.jpg"
          >
            <source src={post.media} type="video/mp4" />
            Seu navegador não suporta vídeo.
          </video>
        )}

        <Typography
          sx={{
            color: "#333",
            fontSize: "1.09rem",
            mb: 1.7,
            textAlign: "center",
          }}
        >
          {post.caption}
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mt: 1, mb: 2 }}>
          <span>❤️ {post.likes}</span>
          <span>💬 {post.comments.length}</span>
        </Box>

        <Typography
          sx={{
            fontWeight: 700,
            mt: 2,
            mb: 1,
            color: "#111",
            fontSize: "1rem",
          }}
        >
          Comentários
        </Typography>
        {post.comments.length === 0 && (
          <Typography sx={{ color: "#888", fontSize: "0.98rem" }}>
            Nenhum comentário ainda.
          </Typography>
        )}
        {post.comments.map((c) => (
          <Box
            key={c.id}
            sx={{
              background: "#fff",
              borderRadius: 2,
              p: 1.3,
              mb: 1,
              boxShadow: 1,
            }}
          >
            <strong>@{c.author}:</strong> {c.text}
          </Box>
        ))}

        <Button sx={{ mt: 3 }} onClick={() => navigate("/")}>
          Voltar ao feed
        </Button>
      </Box>
    </Box>
  );
};

export default PostPage;
