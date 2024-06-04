import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api'

const AuthContext = createContext({});
import { jwtDecode } from 'jwt-decode';


export const AuthProvider = ({ children }) => {
  const [data, setData] = useState({});
  
  async function signIn({email, password}) {
    try {
        const responseAPI = await api.post('/sessions', {email, password});
        const { user, token } = responseAPI.data;

        localStorage.setItem("@foodexplorer:user", JSON.stringify(user));
        localStorage.setItem("@foodexplorer:token", token);

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        setData({user, token});
    } catch(error) {
        if(error.response) {
            alert(error.response.data.message);
        } else {
            alert("Não foi possível fazer o login!");
        }
    }
  }

  function signOut() {
    localStorage.removeItem("@foodexplorer:token");
    localStorage.removeItem("@foodexplorer:user");

    setData({});
  }

  function isAuthenticated() {
    const user = localStorage.getItem("@foodexplorer:user");

    if (!user) {
      return false;
    }

    const token = localStorage.getItem("@foodexplorer:token");
    const tokenExpiration = jwtDecode(token).exp;
    const currentTime = Math.floor(Date.now() / 1000);

    if (tokenExpiration < currentTime) {
      return false;
    }

    return true;
  }

  async function updateProfile({ user, avatarFile }) {
    try {
      if(avatarFile) {
          const fileUploadForm = new FormData();
          fileUploadForm.append("avatar", avatarFile);

          const response = await api.patch("/users/avatar", fileUploadForm);
          user.avatar = response.data.avatar;
      }

      await api.put("/users", user);
      
      localStorage.setItem("@foodexplorer:user", JSON.stringify(user));

      setData({ user, token: data.token });
      alert("Perfil atualizado");
    } catch(error) {
        if(error.response) {
            alert(error.response.data.message);
        } else {
            alert("Não foi possível atualizar o perfil");
        }
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("@foodexplorer:token");
    const user = localStorage.getItem("@foodexplorer:user");

    if(token && user) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        setData({
            token,
            user: JSON.parse(user)
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut, isAuthenticated, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  return context;
};
