import { useState, useEffect } from 'react';
import { useMediaQuery } from "react-responsive";
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { RxCaretLeft } from "react-icons/rx";
import { ContainerUserFavorites, ContentUserFavorites } from "./style";
import { Menu } from "../../components/Menu";
import { NavigationHeader } from '../../components/NavigationHeader';
import { ButtonText } from "../../components/ButtonText";
import { FavoriteDishes } from '../../components/FavoriteDishes';
import { Footer } from '../../components/Footer';

export function UserFavorites({ isAdmin }) {
  const isDesktopView = useMediaQuery({ minWidth: 1024 });

  const [menuVisible, setMenuVisible] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const response = await api.get("/favorites");
        setFavorites(response.data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };
  
    loadFavorites();
  }, []);  

  const handleRemoveFavorite = async (dishId) => {
    try {
      await api.delete(`/favorites/${dishId}`);
      setFavorites((previousFavorites) =>
        previousFavorites.filter((favorite) => favorite.id !== dishId)
      );
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  return (
    <ContainerUserFavorites>
      {!isDesktopView && 
        <Menu 
          isAdmin={isAdmin} 
          isMenuOpen={menuVisible} 
          setIsMenuOpen={setMenuVisible} 
        />
      }

      <NavigationHeader 
        isAdmin={isAdmin} 
        isMenuOpen={menuVisible} 
        setIsMenuOpen={setMenuVisible} 
      />

      {favorites && 
        <main>
          <div>
            <header>
              <ButtonText onClick={goBack}>
                <RxCaretLeft />
                Voltar
              </ButtonText>
              <h1>Meus Favoritos</h1>
            </header>

            <ContentUserFavorites>
              {favorites.map(favorite => (
                <FavoriteDishes 
                  key={String(favorite.id)}
                  data={favorite}
                  onRemove={handleRemoveFavorite} 
                />
              ))}
            </ContentUserFavorites>
          </div>
        </main>
      }

      <Footer />
    </ContainerUserFavorites>
  );
}
