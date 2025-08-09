// src/ProfilePage.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid"; // MUI Grid v1
import { useNavigate, useParams } from "react-router-dom";
import FeedCard from "./FeedCard";
import {
  getMyPets,
  getPetById,
  getPostsByPetId,
  createPostForPet,
  setActivePet,
  type Pet,
  type PostDTO,
} from "./services/api";

type FeedPost = {
  id: string;
  petName: string;
  owner?: string;
  type: "image" | "video" | "text";
  media?: string;
  caption?: string;
  createdAt?: string;
};

const ProfilePage: React.FC = () => {
  const { petId } = useParams<{ petId: string }>();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [pet, setPet] = useState<Pet | null>(null);
  const [posts, setPosts] = useState<PostDTO[]>([]);

  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState("");
  const [type, setType] = useState<"image" | "video" | "text">("image");

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!petId) return;
      try {
        setLoading(true);
        // tenta /pets/:id; se não houver no back, cai para /my-pets
        let p: Pet | null = null;
        try {
          const single = await getPetById(petId);
          p = single.data;
        } catch {
          const mine = await getMyPets();
          p = mine.data.find((x) => x._id === petId) || null;
        }
        if (!p) {
          nav("/selecionar-pet", { replace: true });
          return;
        }
        const list = await getPostsByPetId(p._id);
        if (!alive) return;
        setPet(p);
        setActivePet(p);
        setPosts(list.data);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [petId, nav]);

  async function handleCreatePost() {
    if (!pet) return;
    if (!caption.trim() && !media.trim()) return;
    await createPostForPet(pet._id, {
      type,
      media: media.trim() || undefined,
      caption: caption.trim() || undefined,
    });
    const list = await getPostsByPetId(pet._id);
    setPosts(list.data);
    setCaption("");
    setMedia("");
    setType("image");
  }

  const feedPosts: FeedPost[] = useMemo(
    () =>
      posts.map((p0) => ({
        id: p0._id,
        petName: pet?.name || "",
        type: p0.type,
        media: p0.media,
        caption: p0.caption,
        createdAt: p0.createdAt,
      })),
    [posts, pet]
  );

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Typography>Carregando...</Typography>
      </Container>
    );
  }
  if (!pet) return null;

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      {/* Cabeçalho do perfil */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={pet.avatar} sx={{ width: 72, height: 72 }} />
            <Box>
              <Typography variant="h6">{pet.name}</Typography>
              {pet.bio && (
                <Typography variant="body2" color="text.secondary">
                  {pet.bio}
                </Typography>
              )}
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Composer */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Legenda"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Escreva algo..."
                fullWidth
                multiline
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                label="URL da mídia (opcional)"
                value={media}
                onChange={(e) => setMedia(e.target.value)}
                placeholder="https://..."
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Tipo"
                select
                SelectProps={{ native: true }}
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                fullWidth
              >
                <option value="image">image</option>
                <option value="video">video</option>
                <option value="text">text</option>
              </TextField>
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                onClick={handleCreatePost}
                disabled={!caption.trim() && !media.trim()}
              >
                Publicar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Feed */}
      <Stack spacing={2}>
        {feedPosts.map((fp) => (
          // adapte se o FeedCard tiver props diferentes
          <FeedCard key={fp.id} post={fp as any} />
        ))}
        {!feedPosts.length && (
          <Typography color="text.secondary">
            Ainda não há posts para este pet.
          </Typography>
        )}
      </Stack>
    </Container>
  );
};

export default ProfilePage;
