import { Routes, Route } from "react-router-dom";

import { Home } from "../pages/Home";
import { UserFavorites } from "../pages/UserFavorites";
import { DishDescription } from "../pages/DishDescription";
import { NewDish } from "../pages/NewDish";
import { Cart } from '../pages/Cart'
import { EditDish } from "../pages/EditDish";

export function AppRoutes({ isAdmin, user }) {
  return (
    <Routes>
      <Route path="/" element={<Home isAdmin={isAdmin}/>} />
      <Route path="/favorites" element={<UserFavorites isAdmin={isAdmin}/>} />
      <Route path="/dishes/:id" element={<DishDescription isAdmin={isAdmin}/>} />
      <Route path="/new" element={<NewDish isAdmin={isAdmin}/>} />
      <Route path="/cart" element={<Cart isAdmin={isAdmin} user={user}/>} />
      <Route path="/edit-dish/:id" element={<EditDish isAdmin={isAdmin} />} />
    </Routes>
  );
}