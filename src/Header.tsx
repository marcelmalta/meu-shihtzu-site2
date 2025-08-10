// src/Header.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PetsIcon from "@mui/icons-material/Pets";

import {
  getActivePet as getActivePetLS,
  clearActivePet,
  setAuthToken,
  type Pet,
} from "./services/api";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [anchorUser, setAnchorUser] = React.useState<null | HTMLElement>(null);
  const [activePet, setActivePet] = React.useState<Pet | null>(getActivePetLS());

  React.useEffect(() => {
    const sync = () => setActivePet(getActivePetLS());
    window.addEventListener("storage", sync);
    const id = setInterval(sync, 1000);
    return () => {
      window.removeEventListener("storage", sync);
      clearInterval(id);
    };
  }, []);

  const go = (to: string) => {
    navigate(to);
    setOpen(false);
    setAnchorUser(null);
  };

  const logout = () => {
    setAuthToken(undefined);
    clearActivePet();
    setAnchorUser(null);
    navigate("/login");
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: 90,
        background: "#111",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        pb: 1.5,
        boxShadow: "0 2px 10px #0003",
        zIndex: 10,
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
    opacity: 0.58,
    zIndex: 1,
    pointerEvents: "none", // <— impede o fundo de bloquear cliques
  }}
/>

      <Button
        onClick={() => navigate("/")}
        sx={{
          position: "relative",
          zIndex: 2,
          color: "#d5bb51",
          fontFamily: "'Orelega One', cursive",
          fontSize: "2rem",
          fontWeight: 700,
          letterSpacing: "2px",
          ml: 2,
          background: "none",
          boxShadow: "none",
          "&:hover": { background: "none", color: "#FFD700" },
        }}
        disableRipple
        aria-label="Ir para a página inicial"
      >
        SHIHTIZUz
      </Button>

      <Stack
        direction="row"
        spacing={1}
        sx={{ position: "absolute", top: 14, right: 16, zIndex: 3 }}
        alignItems="center"
      >
        <Button
          onClick={() =>
            go(activePet ? `/perfil/${activePet._id}` : "/selecionar-pet")
          }
          startIcon={<PetsIcon />}
          sx={{
            display: { xs: "none", sm: "inline-flex" },
            color: "#111",
            bgcolor: "#fff",
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 2,
            "&:hover": { bgcolor: "#f2f2f2" },
          }}
        >
          {activePet ? `Perfil de ${activePet.name}` : "Selecionar pet"}
        </Button>

        <Tooltip title={activePet ? `Conta do pet: ${activePet.name}` : "Selecionar pet"}>
          <IconButton onClick={(e) => setAnchorUser(e.currentTarget)} sx={{ p: 0.5 }}>
            <Avatar
              alt={activePet?.name || "Conta"}
              src={activePet?.avatar || "/img/default-avatar.png"}
              sx={{ width: 40, height: 40, border: "2px solid #fff3" }}
            />
          </IconButton>
        </Tooltip>

        <IconButton
          aria-label="Abrir menu"
          onClick={() => setOpen(true)}
          sx={{ color: "#fff" }}
        >
          <MenuIcon sx={{ fontSize: 36 }} />
        </IconButton>
      </Stack>

      <Menu
        anchorEl={anchorUser}
        open={Boolean(anchorUser)}
        onClose={() => setAnchorUser(null)}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <Box sx={{ px: 2, pt: 1, pb: 1 }}>
          <Typography variant="subtitle2" fontWeight={700}>
            {activePet?.name || "Sem pet selecionado"}
          </Typography>
          {activePet?.bio && (
            <Typography variant="caption" color="text.secondary">
              {activePet.bio}
            </Typography>
          )}
        </Box>
        <Divider />
        <MenuItem
          onClick={() =>
            go(activePet ? `/perfil/${activePet._id}` : "/selecionar-pet")
          }
        >
          Meu perfil
        </MenuItem>
        <MenuItem onClick={() => go("/selecionar-pet")}>Trocar de pet</MenuItem>
        <Divider />
        <MenuItem onClick={logout}>Sair</MenuItem>
      </Menu>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 280 }} role="presentation">
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => go("/")}>
                <ListItemText primary="Início" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() =>
                  go(activePet ? `/perfil/${activePet._id}` : "/selecionar-pet")
                }
              >
                <ListItemText
                  primary={
                    activePet ? `Perfil de ${activePet.name}` : "Selecionar pet"
                  }
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => go("/selecionar-pet")}>
                <ListItemText primary="Trocar de pet" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => go("/sobre")}>
                <ListItemText primary="Sobre" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Header;
