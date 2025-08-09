// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./HomePage";
import NewsPage from "./NewsPage";
import CadastroPage from "./CadastroPage";
import LoginPage from "./LoginPage";
import ShopPage from "./ShopPage";
import ProfilePage from "./ProfilePage";

// protegidas
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

        {/* grupo protegido por token */}
        <Route element={<ProtectedRoute />}>
          <Route path="/selecionar-pet" element={<SelectPet />} />
          <Route path="/perfil/:petId" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
