import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import NewsPage from "./NewsPage";
import CadastroPage from "./CadastroPage";
import LoginPage from "./LoginPage";
import ShopPage from "./ShopPage";
import ProfilePage from "./ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/noticia/:id" element={<NewsPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/perfil/:petId" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;