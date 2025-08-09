import React, { useState } from "react";
import { Box, Typography, Avatar, Button, Modal, TextField } from "@mui/material";
import Grid from "@mui/material/Grid"; // 👈 Grid v1 estável
import FeedCard from "./FeedCard";
import type { Post } from "./FeedCard";

type AlbumPhoto = { url: string; dataUpload: string };

type PetProfile = {
  avatar: string;
  name: string;
  bio: string;
  lastNameEdit: string;
  album: AlbumPhoto[];
  posts: Post[];
};

const today = new Date().toISOString().slice(0, 10);

const petProfile: PetProfile = {
  avatar: "/uploads/luna-avatar.jpg",
  name: "Luna",
  bio: "Fofa, adora brincar e tomar banho de sol!",
  lastNameEdit: "2025-07-25",
  album: [
    { url: "/uploads/luna-banho.jpg", dataUpload: today },
    { url: "/uploads/luna-caminha.jpg", dataUpload: today },
    { url: "/uploads/luna-fantasia.jpg", dataUpload: "2025-07-25" }
  ],
  posts: [
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
    }
  ]
};

const ProfilePage: React.FC = () => {
  const [openEdit, setOpenEdit] = useState(false);
  const [bio, setBio] = useState(petProfile.bio);
  const [petName, setPetName] = useState(petProfile.name);
  const [album, setAlbum] = useState<AlbumPhoto[]>(petProfile.album);

  const lastEdit = new Date(petProfile.lastNameEdit);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - lastEdit.getTime()) / (1000 * 60 * 60 * 24));
  const canEditName = diffDays >= 15;

  const fotosHoje = album.filter(f => f.dataUpload === today).length;
  const canAddPhoto = fotosHoje < 2;

  const handleAddPhoto = () => {
    if (!canAddPhoto) return;
    setAlbum([...album, { url: "/uploads/novafoto.jpg", dataUpload: today }]);
  };

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
        <Typography sx={{ fontWeight: 700, fontSize: "1.23rem" }}>{petName}</Typography>
        <Typography sx={{ color: "#222", fontSize: "1rem", mb: 1, textAlign: "center" }}>
          {bio}
        </Typography>
        <Button
          onClick={() => setOpenEdit(true)}
          sx={{ bgcolor: "#ff7800", color: "#fff", fontWeight: 600, px: 2, borderRadius: 2, mb: 1, ":hover": { bgcolor: "#b25600" } }}
        >Editar perfil</Button>
      </Box>

      {/* Modal de edição completa */}
      <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          background: "#fff", p: 3, borderRadius: 4, boxShadow: 6, width: 320
        }}>
          <Typography fontWeight={700} mb={2}>Editar Perfil</Typography>
          <TextField
            fullWidth
            label="Nome do Pet"
            value={petName}
            onChange={e => setPetName(e.target.value)}
            sx={{ mb: 2 }}
            disabled={!canEditName}
          />
          {!canEditName && (
            <Typography sx={{ color: "red", mb: 1, fontSize: "0.85rem" }}>
              Só é possível editar o nome novamente em {15 - diffDays} dias.
            </Typography>
          )}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button onClick={() => setOpenEdit(false)} variant="contained" sx={{ bgcolor: "#ff7800", ":hover": { bgcolor: "#b25600" } }}>Salvar</Button>
        </Box>
      </Modal>

      {/* Álbum de fotos do pet */}
      <Box sx={{ background: "#fff", mt: 2, p: 2, borderRadius: 3, mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography fontWeight={700} fontSize="1.1rem">Álbum de Fotos</Typography>
          <Button
            size="small"
            disabled={!canAddPhoto}
            onClick={handleAddPhoto}
            sx={{ bgcolor: "#ff7800", color: "#fff", ":hover": { bgcolor: "#b25600" }, minWidth: 0, px: 1, fontSize: "0.88rem" }}
          >
            Adicionar Foto
          </Button>
        </Box>
        {!canAddPhoto && (
          <Typography sx={{ color: "red", mb: 1, fontSize: "0.85rem" }}>
            Só é possível adicionar 2 fotos por dia no álbum.
          </Typography>
        )}
        <Grid container spacing={1}>
          {album.map((img, idx) => (
            <Grid item xs={4} key={idx}>
              <Box sx={{
                width: "100%", aspectRatio: "1 / 1", borderRadius: 2, overflow: "hidden", border: "1px solid #eee"
              }}>
                <img src={img.url} alt={`foto-album-${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
          {petProfile.posts.map(post => (
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
