import { Routes, Route } from "react-router-dom";

import { Home } from "../pages/Home";
import { UserFavorites } from "../pages/UserFavorites";
import { DishDescription } from "../pages/DishDescription";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/favorites" element={<UserFavorites />} />
      <Route path="/dishes/:id" element={<DishDescription />} />
    </Routes>
  );
}