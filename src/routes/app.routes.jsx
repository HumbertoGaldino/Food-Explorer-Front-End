import { Routes, Route } from "react-router-dom";

import { Home } from "../pages/Home";
import { UserFavorites } from "../pages/UserFavorites";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/favorites" element={<UserFavorites />} />
    </Routes>
  );
}