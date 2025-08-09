// src/SelectPet.tsx
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Modal,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid"; // MUI Grid v1
import { useNavigate } from "react-router-dom";
import {
  getMyPets,
  createPet,
  setActivePet,
  type Pet,
} from "./services/api";

const SelectPet: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // modal criar
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");

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
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Selecione um pet</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Criar novo pet
        </Button>
      </Stack>

      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {pets.map((p) => (
            <Grid item xs={12} sm={6} md={4} key={p._id}>
              <Card>
                <CardActionArea onClick={() => handleSelect(p)}>
                  <CardContent>
                    <Stack alignItems="center" spacing={1.5}>
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
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
          {!pets.length && (
            <Grid item xs={12}>
              <Typography color="text.secondary">
                Você ainda não cadastrou nenhum pet.
              </Typography>
            </Grid>
          )}
        </Grid>
      )}

      {!!error && (
        <Typography mt={2} color="error">
          {error}
        </Typography>
      )}

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
          <Stack spacing={2}>
            <TextField
              label="Nome do pet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Avatar (URL opcional)"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              fullWidth
            />
            <TextField
              label="Bio (opcional)"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              fullWidth
            />
            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              <Button onClick={() => setOpen(false)}>Cancelar</Button>
              <Button variant="contained" onClick={handleCreate}>
                Salvar
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </Container>
  );
};

export default SelectPet;
