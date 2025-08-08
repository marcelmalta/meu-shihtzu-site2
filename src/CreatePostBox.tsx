import React from "react";
import { Box, Avatar, TextField, InputAdornment, Button } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

// Simule com o avatar do usuário logado
const userAvatar = "/uploads/avatar-mariana.jpg";

const CreatePostBox: React.FC = () => (
  <Box sx={{
    background: "#fff", p: 1.6, borderRadius: 2, mb: 1,
    display: "flex", alignItems: "center", gap: 1
  }}>
    <Avatar src={userAvatar} sx={{ width: 44, height: 44, mr: 1 }} />
    <TextField
      fullWidth
      variant="outlined"
      size="small"
      placeholder="No que você está pensando?"
      sx={{
        background: "#f0f2f5",
        borderRadius: 4,
        "& .MuiOutlinedInput-root": { border: "none" },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <PhotoCameraIcon sx={{ color: "#ff7800", mr: 0.5 }} />
          </InputAdornment>
        ),
        style: { fontSize: "1rem" },
        endAdornment: (
          <InputAdornment position="end">
            <Button sx={{
              bgcolor: "#1877f2", color: "#fff",
              px: 2, fontWeight: 600, borderRadius: 2, textTransform: "none",
              ":hover": { bgcolor: "#ff7800" }
            }}>
              Postar
            </Button>
          </InputAdornment>
        ),
      }}
    />
  </Box>
);

export default CreatePostBox;
