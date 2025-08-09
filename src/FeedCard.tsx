// src/FeedCard.tsx
import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

type PostType = "image" | "video" | "text";

export interface Post {
  id: string;               // <- string para casar com _id do Mongo
  petName: string;
  owner?: string;
  type: PostType;
  media?: string;           // opcional (para posts de texto)
  caption?: string;
  likes?: number;           // opcional (backend ainda não envia)
  comments?: number;        // opcional
  createdAt?: string;
}

// Avatar default (pode trocar por avatar do pet se quiser)
const userAvatar = "/uploads/avatar-mariana.jpg";

const FeedCard: React.FC<{ post: Post; onClick?: () => void }> = ({
  post,
  onClick,
}) => (
  <Box
    sx={{
      background: "#fff",
      borderRadius: 3,
      boxShadow: 1,
      mb: 0.5,
      pb: 1,
      pt: 1,
      px: 1.2,
      cursor: onClick ? "pointer" : "default",
    }}
    onClick={onClick}
  >
    <Box sx={{ display: "flex", alignItems: "center", mb: 0.7 }}>
      <Avatar src={userAvatar} sx={{ width: 38, height: 38, mr: 1 }} />
      <Box>
        <Typography
          sx={{ fontWeight: 700, fontSize: "0.98rem", color: "#222" }}
        >
          {post.petName}
        </Typography>
        <Typography sx={{ fontSize: "0.81rem", color: "#444" }}>
          {post.owner ? `@${post.owner} • ` : ""}
          {post.createdAt
            ? new Date(post.createdAt).toLocaleDateString("pt-BR")
            : ""}
        </Typography>
      </Box>
      <MoreHorizIcon sx={{ marginLeft: "auto", color: "#888" }} />
    </Box>

    {/* Texto/Legenda */}
    {post.caption && (
      <Typography sx={{ mb: 1, color: "#222", fontSize: "1.03rem" }}>
        {post.caption}
      </Typography>
    )}

    {/* Mídia (imagem/vídeo) */}
    {post.type === "image" && post.media && (
      <img
        src={post.media}
        alt={post.caption || ""}
        style={{
          width: "100%",
          borderRadius: 10,
          maxHeight: 320,
          objectFit: "cover",
          background: "#e7e7e7",
        }}
      />
    )}
    {post.type === "video" && post.media && (
      <video
        controls
        style={{
          width: "100%",
          borderRadius: 10,
          maxHeight: 320,
          background: "#222",
          marginBottom: 2,
          marginTop: 2,
        }}
        poster="/img/video-thumb.jpg"
      >
        <source src={post.media} type="video/mp4" />
        Seu navegador não suporta vídeo.
      </video>
    )}
    {/* Se type === "text", não renderiza mídia */}

    <Box sx={{ display: "flex", gap: 3, mt: 1, ml: 0.7 }}>
      <Typography sx={{ fontSize: "0.96rem" }}>
        ❤️ {post.likes ?? 0}
      </Typography>
      <Typography sx={{ fontSize: "0.96rem" }}>
        💬 {post.comments ?? 0}
      </Typography>
    </Box>
  </Box>
);

export default FeedCard;
