import React, { useState } from "react";
import { Box, Typography, Avatar, Button, Grid, Modal, TextField } from "@mui/material";
import FeedCard from "./FeedCard";
import type { Post } from "./FeedCard";

// Simule os dados do PET do usuário logado
const petProfile = {
  avatar: "/uploads/luna-avatar.jpg",
  name: "Luna",
  bio: "Fofa, adora brincar e tomar banho de sol!",
  album: [
    "/uploads/luna-banho.jpg",
    "/uploads/luna-caminha.jpg",
    "/uploads/luna-fantasia.jpg"
  ]
};

// Simule os posts do PET
const petPosts: Post[] = [
  {
    id: 1,
    petName: "Luna",
    owner: "Mariana", // Só é usado internamente, não exibido no perfil!
    type: "image",
    media: "/uploads/luna-banho.jpg",
    caption: "Hoje foi dia de banho!",
    likes: 22,
    comments: 5,
    createdAt: "2025-08-08",
  },
  // ...outros posts deste pet
];

const ProfilePage: React.FC = () => {
  const [openEdit, setOpenEdit] = useState(false);
  const [bio, setBio] = useState(petProfile.bio);

  return (
    <Box sx={{
      bgcolor: "#f0f2f5",
      minHeight: "100vh",
      pb: 8,
      maxWidth: 500,
      mx: "auto",
      fontFamily: "Arial, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* Header do perfil */}
      <Box sx={{
        background: "#fff",
        p: 3,
        borderBottomLeftRadius: 22,
        borderBottomRightRadius: 22,
        boxShadow: "0 2px 12px #0001",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <Avatar src={petProfile.avatar} sx={{ width: 94, height: 94, mb: 1.5, border: "4px solid #ff7800" }} />
        <Typography sx={{ fontWeight: 700, fontSize: "1.23rem" }}>{petProfile.name}</Typography>
        <Typography sx={{ color: "#222", fontSize: "1rem", mb: 1, textAlign: "center" }}>
          {bio}
        </Typography>
        <Button
          onClick={() => setOpenEdit(true)}
          sx={{ bgcolor: "#ff7800", color: "#fff", fontWeight: 600, px: 2, borderRadius: 2, mb: 1, ":hover": { bgcolor: "#b25600" } }}
        >Editar perfil</Button>
      </Box>

      {/* Modal de edição simples */}
      <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          background: "#fff", p: 3, borderRadius: 4, boxShadow: 6, width: 320
        }}>
          <Typography fontWeight={700} mb={2}>Editar Bio</Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button onClick={() => setOpenEdit(false)} variant="contained" sx={{ bgcolor: "#ff7800", ":hover": { bgcolor: "#b25600" } }}>Salvar</Button>
        </Box>
      </Modal>

      {/* Álbum de fotos do pet */}
      <Box sx={{ background: "#fff", mt: 2, p: 2, borderRadius: 3, mb: 2 }}>
        <Typography fontWeight={700} fontSize="1.1rem" mb={1}>Álbum de Fotos</Typography>
        <Grid container spacing={1}>
          {petProfile.album.map((img, idx) => (
            <Grid item xs={4} key={idx}>
              <Box sx={{
                width: "100%", aspectRatio: "1 / 1", borderRadius: 2, overflow: "hidden", border: "1px solid #eee"
              }}>
                <img src={img} alt={`foto-album-${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Lista dos posts do PET */}
      <Box sx={{ mt: 2 }}>
        <Typography fontWeight={700} fontSize="1.13rem" mb={1} sx={{ px: 1 }}>Minhas Postagens</Typography>
        <Box sx={{
          display: "flex", flexDirection: "column", gap: 2, px: 0.5
        }}>
          {petPosts.map(post => (
            <FeedCard
              key={post.id}
              post={post}
              onClick={() => { /* abrir detalhamento se quiser */ }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
