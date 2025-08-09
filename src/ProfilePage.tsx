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
  LinearProgress,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid"; // MUI Grid v1
import { useNavigate, useParams } from "react-router-dom";
import FeedCard from "./FeedCard";
import {
  getMyPets,
  getPetById,
  getPostsByPetId,
  createPostForPet,
  uploadMedia,
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
  const [pageError, setPageError] = useState("");

  // composer
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState("");
  const [type, setType] = useState<"image" | "video" | "text">("image");
  const [upLoading, setUpLoading] = useState(false);
  const [upError, setUpError] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!petId) return;
      try {
        setLoading(true);
        setPageError("");

        // tenta /pets/:id; fallback /my-pets
        let p: Pet | null = null;
        try {
          const single = await getPetById(pIdSan(petId));
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
      } catch (e: any) {
        setPageError(e?.response?.data?.message || e?.message || "Falha ao carregar perfil");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [petId, nav]);

  function pIdSan(id: string) {
    // pequena sanitização para evitar espaços/slug acidental
    return id.trim();
  }

  async function handleCreatePost() {
    if (!pet) return;
    if (!caption.trim() && !media.trim()) return;
    try {
      setPosting(true);
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
    } catch (e: any) {
      setPageError(e?.response?.data?.message || e?.message || "Falha ao publicar");
    } finally {
      setPosting(false);
    }
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUpError("");
    setUpLoading(true);
    try {
      // passa o petId para o backend organizar a chave no R2/S3
      const res = await uploadMedia(file, pet?._id);
      const url = res.data.url;
      setMedia(url);
      // define type automaticamente
      if (file.type.startsWith("video/")) setType("video");
      else if (file.type.startsWith("image/")) setType("image");
      else setType("text");
    } catch (err: any) {
      setUpError(err?.response?.data?.message || err?.message || "Falha no upload");
    } finally {
      setUpLoading(false);
      // reseta input pra poder reenviar o mesmo arquivo se quiser
      e.currentTarget.value = "";
    }
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
        {pageError && (
          <Alert sx={{ mt: 2 }} severity="error">
            {pageError}
          </Alert>
        )}
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

      {/* Composer com upload */}
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
                placeholder="Cole uma URL ou envie um arquivo abaixo"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Button
                component="label"
                variant="outlined"
                fullWidth
                disabled={upLoading}
              >
                {upLoading ? "Enviando..." : "Enviar arquivo"}
                <input
                  type="file"
                  hidden
                  onChange={handleFile}
                  accept="image/*,video/*"
                />
              </Button>
            </Grid>

            {upLoading && (
              <Grid item xs={12}>
                <LinearProgress />
              </Grid>
            )}
            {!!upError && (
              <Grid item xs={12}>
                <Alert severity="error">{upError}</Alert>
              </Grid>
            )}

            {/* Preview simples quando houver mídia */}
            {!!media && (
              <Grid item xs={12}>
                {type === "image" ? (
                  <Box
                    component="img"
                    src={media}
                    alt="preview"
                    sx={{ maxWidth: "100%", borderRadius: 2 }}
                  />
                ) : type === "video" ? (
                  <Box
                    component="video"
                    src={media}
                    controls
                    sx={{ width: "100%", borderRadius: 2 }}
                  />
                ) : null}
              </Grid>
            )}

            <Grid item xs={12} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                onClick={handleCreatePost}
                disabled={posting || (!caption.trim() && !media.trim())}
              >
                {posting ? "Publicando..." : "Publicar"}
              </Button>
            </Grid>

            {!!pageError && (
              <Grid item xs={12}>
                <Alert severity="error">{pageError}</Alert>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Feed */}
      <Stack spacing={2}>
        {feedPosts.map((fp) => (
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
