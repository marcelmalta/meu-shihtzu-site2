import React from "react";
import { Box } from "@mui/material";
import TopBar from "./TopBar";
import StoriesBar from "./StoriesBar";
import CreatePostBox from "./CreatePostBox";
import FeedCard from "./FeedCard";
import type { Post } from "./FeedCard";
import BottomNavBar from "./BottomNavBar";
import { useNavigate } from "react-router-dom";

// Array de posts (mock; pode vir da API depois)
const posts: Post[] = [
  {
    id: 1,
    petName: "Luna",
    owner: "Mariana",
    type: "image",
    media: "/uploads/luna-banho.jpg",
    caption: "Hoje foi dia de banho!",
    likes: 22,
    comments: 5,
    createdAt: "2025-08-08",
  },
  {
    id: 2,
    petName: "Max",
    owner: "Paulo",
    type: "video",
    media: "/uploads/max-brincando.mp4",
    caption: "Max brincando no parque 🐾",
    likes: 35,
    comments: 7,
    createdAt: "2025-08-07",
  },
  {
    id: 3,
    petName: "Bidu",
    owner: "Roberta",
    type: "image",
    media: "/uploads/bidu-pose.jpg",
    caption: "Bidu ama posar pra foto!",
    likes: 17,
    comments: 2,
    createdAt: "2025-08-06",
  },
  {
    id: 4,
    petName: "Mel",
    owner: "Lucas",
    type: "video",
    media: "/uploads/mel-correndo.mp4",
    caption: "Correndo pela casa depois do banho 😂",
    likes: 48,
    comments: 10,
    createdAt: "2025-08-05",
  },
  {
    id: 5,
    petName: "Simba",
    owner: "Ana",
    type: "image",
    media: "/uploads/simba-fantasia.jpg",
    caption: "Fantasia nova pro Simba 🦁",
    likes: 29,
    comments: 8,
    createdAt: "2025-08-04",
  },
  {
    id: 6,
    petName: "Zoe",
    owner: "Carlos",
    type: "image",
    media: "/uploads/zoe-sol.jpg",
    caption: "Tomando solzinho da manhã 😎",
    likes: 12,
    comments: 1,
    createdAt: "2025-08-03",
  },
  {
    id: 7,
    petName: "Dudu",
    owner: "Priscila",
    type: "video",
    media: "/uploads/dudu-truques.mp4",
    caption: "Dudu aprendendo novos truques!",
    likes: 54,
    comments: 14,
    createdAt: "2025-08-02",
  },
  {
    id: 8,
    petName: "Nina",
    owner: "Vitor",
    type: "image",
    media: "/uploads/nina-caminha.jpg",
    caption: "Descansando depois do passeio.",
    likes: 21,
    comments: 3,
    createdAt: "2025-08-02",
  },
  {
    id: 9,
    petName: "Bento",
    owner: "Camila",
    type: "image",
    media: "/uploads/bento-lanche.jpg",
    caption: "Olha a carinha pedindo petisco 😍",
    likes: 33,
    comments: 12,
    createdAt: "2025-08-01",
  },
  {
    id: 10,
    petName: "Lilica",
    owner: "Fernanda",
    type: "video",
    media: "/uploads/lilica-bolinha.mp4",
    caption: "Brincando de pegar bolinha, não cansa nunca!",
    likes: 61,
    comments: 20,
    createdAt: "2025-07-31",
  },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{
      bgcolor: "#f0f2f5",
      minHeight: "100vh",
      pb: 8,
      maxWidth: 500,
      mx: "auto",
      fontFamily: "Arial, 'Segoe UI', Roboto, sans-serif"
    }}>
      <TopBar />
      <StoriesBar />
      <CreatePostBox />
      <Box sx={{
        display: "flex", flexDirection: "column", gap: 2, px: 0.5
      }}>
        {posts.map(post => (
          <FeedCard
            key={post.id}
            post={post}
            onClick={() => navigate(`/post/${post.id}`)}
          />
        ))}
      </Box>
      <BottomNavBar />
    </Box>
  );
};

export default HomePage;
