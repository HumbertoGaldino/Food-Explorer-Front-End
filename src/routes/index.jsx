import { BrowserRouter } from "react-router-dom";
import { useAuth } from '../hooks/auth';

import { AppRoutes } from "./app.routes";
import { AuthRoutes } from "./auth.routes";

export function Routes() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user ? user.is_admin : false;

  const userAuthenticated = isAuthenticated();

  return(
    <BrowserRouter>
        {(user && userAuthenticated) ? <AppRoutes isAdmin={isAdmin} /> : <AuthRoutes />}
    </BrowserRouter>
  )
}