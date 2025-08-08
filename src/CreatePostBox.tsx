import React, { useState } from "react";
import { Box, Avatar, TextField, InputAdornment, Button, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

// Simule o avatar do usuário logado
const userAvatar = "/uploads/avatar-mariana.jpg";

const CreatePostBox: React.FC = () => {
  const [postType, setPostType] = useState("geral"); // "geral" ou "perfil"
  const [caption, setCaption] = useState("");

  // Função mock de postagem
  const handlePost = () => {
    // Aqui você decide onde salvar/postar (feed geral ou só perfil)
    if (postType === "geral") {
      // postar no feed geral
    } else {
      // postar só no perfil
    }
    setCaption("");
  };

  return (
    <Box sx={{
      background: "#fff", p: 1.6, borderRadius: 2, mb: 1,
      display: "flex", alignItems: "center", gap: 1, flexDirection: "column"
    }}>
      <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
        <Avatar src={userAvatar} sx={{ width: 44, height: 44, mr: 1 }} />
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="No que você está pensando?"
          value={caption}
          onChange={e => setCaption(e.target.value)}
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
                <Button
                  sx={{
                    bgcolor: "#ff7800", color: "#fff",
                    px: 2, fontWeight: 600, borderRadius: 2, textTransform: "none",
                    ":hover": { bgcolor: "#b25600" }
                  }}
                  onClick={handlePost}
                >
                  Postar
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      {/* NOVO: Seletor de onde o post vai aparecer */}
      <RadioGroup
        row
        value={postType}
        onChange={e => setPostType(e.target.value)}
        sx={{ ml: 7, mt: 0.7 }}
      >
        <FormControlLabel value="geral" control={<Radio sx={{ color: "#ff7800" }} />} label="Feed Geral" />
        <FormControlLabel value="perfil" control={<Radio sx={{ color: "#ff7800" }} />} label="Só no Perfil" />
      </RadioGroup>
    </Box>
  );
};

export default CreatePostBox;
