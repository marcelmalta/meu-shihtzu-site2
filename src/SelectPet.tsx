import { useEffect, useState } from "react";
import {
  Box, Typography, Card, CardActionArea, Avatar, Button,
  Modal, TextField, CircularProgress
} from "@mui/material";
import { Grid2 as Grid } from '@mui/material';
import { useNavigate } from "react-router-dom";

type Pet = {
  _id: string;
  name: string;
  avatar?: string;
  bio?: string;
};

const API = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000";

export default function SelectPet() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Luna");
  const [bio, setBio] = useState("Fofa, adora brincar!");
  const [avatar, setAvatar] = useState("/uploads/luna-avatar.jpg");
  const [error, setError] = useState<string>("");
  const nav = useNavigate();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const loadPets = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API}/api/pets/my-pets`, { headers: authHeaders as any });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setPets(data || []);
    } catch (e: any) {
      setError(e?.message || "Falha ao carregar pets");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      setError("");
      const res = await fetch(`${API}/api/pets/create`, {
        method: "POST",
        headers: authHeaders as any,
        body: JSON.stringify({ name, bio, avatar }),
      });
      if (!res.ok) throw new Error(await res.text());
      await loadPets();
      setOpen(false);
    } catch (e: any) {
      setError(e?.message || "Falha ao criar pet");
    }
  };

  const handleSelect = (pet: Pet) => {
    localStorage.setItem("activePet", JSON.stringify(pet));
    nav(`/perfil/${pet._id}`);
  };

  useEffect(() => {
    loadPets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ maxWidth: 920, mx: "auto", p: 2 }}>
      <Typography variant="h5" fontWeight={800} mb={1}>Selecione seu Pet</Typography>
      <Typography color="text.secondary" mb={2}>
        Escolha um pet para usar no site ou crie um novo.
      </Typography>

      {error && (
        <Typography color="error" mb={2}>{error}</Typography>
      )}

      {loading ? (
        <Box sx={{ display: "grid", placeItems: "center", height: 200 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {pets.map((p) => (
            <Grid xs={6} sm={4} md={3} key={p._id}>
              <Card>
                <CardActionArea
                  onClick={() => handleSelect(p)}
                  sx={{ p: 2, display: "grid", placeItems: "center", gap: 1 }}
                >
                  <Avatar src={p.avatar} sx={{ width: 84, height: 84, border: "3px solid #ff7800" }} />
                  <Typography fontWeight={700}>{p.name}</Typography>
                </CardActionArea>
              </Card>
            </Grid>
          ))}

          {/* Card para criar novo */}
          <Grid xs={6} sm={4} md={3}>
            <Card>
              <CardActionArea
                onClick={() => setOpen(true)}
                sx={{ p: 2, display: "grid", placeItems: "center", gap: 1 }}
              >
                <Avatar sx={{ width: 84, height: 84, bgcolor: "#ff7800" }}>+</Avatar>
                <Typography fontWeight={700}>Adicionar Pet</Typography>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Modal: criar novo pet */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: 380, bgcolor: "#fff", p: 3, borderRadius: 3, boxShadow: 6
        }}>
          <Typography variant="h6" fontWeight={800} mb={2}>Novo Pet</Typography>
          <TextField label="Nome" fullWidth sx={{ mb: 2 }} value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Avatar (URL)" fullWidth sx={{ mb: 2 }} value={avatar} onChange={(e) => setAvatar(e.target.value)} />
          <TextField label="Bio" fullWidth multiline rows={3} sx={{ mb: 2 }} value={bio} onChange={(e) => setBio(e.target.value)} />
          <Button
            fullWidth
            variant="contained"
            onClick={handleCreate}
            sx={{ bgcolor: "#ff7800", ":hover": { bgcolor: "#b25600" }, fontWeight: 700 }}
          >
            Criar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
