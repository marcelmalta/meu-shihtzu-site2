// src/SelectPet.tsx  (Vite + Axios services, sem process.env, sem fetch)
import { useEffect, useState } from "react";
import {
  Box, Typography, Card, CardActionArea, Avatar, Button,
  Modal, TextField, CircularProgress
} from "@mui/material";
import Grid from "@mui/material/Grid"; // 👈 Grid v1
import { useNavigate } from "react-router-dom";
import {
  getMyPets,
  createPet,
  setActivePet,
  type Pet,
} from "./services/api";

export default function SelectPet() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  const loadPets = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getMyPets();
      setPets(res.data || []);
    } catch (e: any) {
      if (e?.response?.status === 401) {
        localStorage.removeItem("token");
        nav("/login");
        return;
      }
      setError(e?.message || "Falha ao carregar pets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return;
    try {
      setError("");
      const res = await createPet({
        name: name.trim(),
        bio: bio.trim() || undefined,
        avatar: avatar.trim() || undefined,
      });
      setPets((prev) => [res.data, ...prev]);
      setOpen(false);
      setName("");
      setAvatar("");
      setBio("");
    } catch (e: any) {
      setError(e?.message || "Falha ao criar pet");
    }
  };

  const handleSelect = (pet: Pet) => {
    setActivePet(pet);
    nav(`/perfil/${pet._id}`);
  };

  return (
    <Box sx={{ minHeight: "100vh", py: 3 }}>
      <Box sx={{ maxWidth: 1080, mx: "auto", px: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Selecione um pet</Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>
            Criar novo pet
          </Button>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {pets.map((p) => (
              <Grid item xs={6} sm={4} md={3} key={p._id}>
                <Card>
                  <CardActionArea onClick={() => handleSelect(p)}>
                    <Box sx={{ p: 2, display: "flex", alignItems: "center", flexDirection: "column", gap: 1 }}>
                      <Avatar src={p.avatar} sx={{ width: 72, height: 72 }} />
                      <Typography fontWeight={700}>{p.name}</Typography>
                      {p.bio && (
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {p.bio}
                        </Typography>
                      )}
                      <Button variant="contained" fullWidth>
                        Entrar como {p.name}
                      </Button>
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
            {!pets.length && (
              <Grid item xs={12}>
                <Typography color="text.secondary">Você ainda não cadastrou nenhum pet.</Typography>
              </Grid>
            )}
          </Grid>
        )}

        {!!error && (
          <Typography mt={2} color="error">
            {error}
          </Typography>
        )}
      </Box>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90vw", sm: 520 },
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
          }}
        >
          <Typography variant="h6" mb={2}>
            Criar pet
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Nome do pet" value={name} onChange={(e) => setName(e.target.value)} required fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Avatar (URL opcional)" value={avatar} onChange={(e) => setAvatar(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Bio (opcional)" value={bio} onChange={(e) => setBio(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="flex-end">
              <Button onClick={() => setOpen(false)}>Cancelar</Button>
              <Button variant="contained" onClick={handleCreate} sx={{ ml: 1 }}>
                Salvar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
}
