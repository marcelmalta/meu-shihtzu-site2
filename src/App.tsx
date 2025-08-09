import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import NewsPage from "./NewsPage";
import CadastroPage from "./CadastroPage";
import LoginPage from "./LoginPage";
import ShopPage from "./ShopPage";
import ProfilePage from "./ProfilePage";

// 👇 adições
import ProtectedRoute from "./ProtectedRoute";
import SelectPet from "./SelectPet";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/noticia/:id" element={<NewsPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/shop" element={<ShopPage />} />

        {/* nova página para escolher/criar pet (precisa estar logado) */}
        <Route
          path="/selecionar-pet"
          element={
            <ProtectedRoute>
              <SelectPet />
            </ProtectedRoute>
          }
        />

        {/* perfil do pet — já existia, só protegi */}
        <Route
          path="/perfil/:petId"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
