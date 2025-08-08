import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";

// Stories mock (adicione ou ajuste para virem da API)
const userAvatar = "/uploads/avatar-mariana.jpg";
const stories = [
  { id: 0, img: "/uploads/luna-banho.jpg", name: "Seu Pet", isAdd: true },
  { id: 1, img: "/uploads/bidu-pose.jpg", name: "Bidu" },
  { id: 2, img: "/uploads/simba-fantasia.jpg", name: "Simba" },
  { id: 3, img: "/uploads/nina-caminha.jpg", name: "Nina" },
  { id: 4, img: "/uploads/bento-lanche.jpg", name: "Bento" },
  { id: 5, img: "/uploads/lilica-bolinha.mp4", name: "Lilica" },
];

const StoriesBar: React.FC = () => (
  <Box sx={{
    display: "flex",
    overflowX: "auto",
    gap: 1,
    px: 1,
    py: 1.2,
    background: "#fff",
    borderBottom: "1px solid #eee",
    mb: 1
  }}>
    {stories.map(story =>
      <Box key={story.id}
        sx={{
          minWidth: 68, maxWidth: 70, flex: "0 0 68px",
          display: "flex", flexDirection: "column", alignItems: "center"
        }}>
        <Box sx={{
          width: 52, height: 52, borderRadius: "50%",
          boxShadow: story.isAdd ? "0 0 0 2px #ff7800" : "0 0 0 2px #ddd",
          border: story.isAdd ? "2px solid #ff7800" : "2px solid #fff",
          overflow: "hidden", mb: 0.3, position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          {story.isAdd ? (
            <>
              <Avatar src={userAvatar} sx={{ width: "100%", height: "100%" }} />
              <Box sx={{
                position: "absolute", bottom: -6, right: -6, bgcolor: "#23272e",
                width: 24, height: 24, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "2.5px solid #fff"
              }}>
                <AddBoxIcon sx={{ color: "#fff", fontSize: 20 }} />
              </Box>
            </>
          ) : (
            <Avatar src={story.img} sx={{ width: "100%", height: "100%" }} />
          )}
        </Box>
        <Typography sx={{
          fontSize: "0.73rem",
          mt: 0.1, color: "#222", textAlign: "center", maxWidth: 58,
          textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"
        }}>
          {story.name}
        </Typography>
      </Box>
    )}
  </Box>
);

export default StoriesBar;
