// src/LoginPage.tsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Card,
  CardContent,
  Stack,
  Alert,
} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { loginUser, setAuthToken } from "./services/api";

// Header padrão (mantive seu visual)
const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: 110,
        background: "#111",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        pb: 1.2,
      }}
    >
      <img
        src="/img/shih-background.png"
        alt="Shih Tzu background"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.7,
          zIndex: 1,
        }}
      />
      <Typography
        sx={{
          position: "relative",
          zIndex: 2,
          color: "#d5bb51",
          fontFamily: "'Orelega One', cursive",
          fontSize: "1.6rem",
          fontWeight: 700,
          letterSpacing: "2px",
          ml: 2,
        }}
      >
        SHIHTIZUz
      </Typography>
      <IconButton
        sx={{
          position: "absolute",
          top: 16,
          right: 18,
          color: "#fff",
          zIndex: 3,
        }}
        aria-label="menu"
        onClick={() => setOpen(true)}
      >
        <MenuIcon sx={{ fontSize: 32 }} />
      </IconButton>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: { width: 220, bgcolor: "#181818", color: "#fff" },
        }}
      >
        <Box sx={{ mt: 4 }}>
          <List>
            {[
              { label: "Home", route: "/" },
              { label: "Cadastro", route: "/cadastro" },
              { label: "Shop", route: "/shop" },
            ].map((item) => (
              <ListItem disablePadding key={item.label}>
                <ListItemButton
                  onClick={() => {
                    setOpen(false);
                    navigate(item.route);
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontFamily: "'Orelega One', cursive",
                          fontSize: "1.1rem",
                          color: "#FFD700",
                        }}
                      >
                        {item.label}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

// --- Página de Login ---
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    try {
      setSubmitting(true);
      setError("");
      const res = await loginUser(email.trim(), password.trim());
      const token = res.data?.token;
      if (token) setAuthToken(token);
      navigate("/selecionar-pet");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Falha ao fazer login"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh", pb: 2 }}>
      <Header />

      {/* Título */}
      <Typography
        sx={{
          fontFamily: "'Bungee', 'Orelega One', cursive",
          fontWeight: 700,
          textAlign: "center",
          color: "#222",
          fontSize: "2rem",
          letterSpacing: 2,
          mt: 2.2,
          mb: 2,
          textShadow: "2px 2px 4px #8887",
        }}
      >
        LOGIN
      </Typography>

      {/* Formulário */}
      <Card
        sx={{
          width: "92vw",
          maxWidth: 420,
          mx: "auto",
          mb: 2.5,
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Box component="form" onSubmit={onSubmit}>
            <Stack spacing={2}>
              {error && <Alert severity="error">{error}</Alert>}
              <TextField
                label="E-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
              />
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
              >
                {submitting ? "Entrando..." : "Entrar"}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* Botão Esqueceu a Senha */}
      <Typography
        component="a"
        href="#"
        sx={{
          display: "block",
          fontFamily: "'Bungee', 'Orelega One', cursive",
          fontWeight: 700,
          textAlign: "center",
          color: "#222",
          fontSize: "1.25rem",
          letterSpacing: 1,
          mt: 1.5,
          mb: 2,
          textDecoration: "none",
          textShadow: "2px 2px 4px #8887",
          cursor: "pointer",
          transition: "color 0.14s",
          "&:hover": { color: "#b9a342" },
        }}
      >
        ESQUECEU A SENHA
      </Typography>
    </Box>
  );
};

export default LoginPage;
