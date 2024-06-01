import { useNavigate } from 'react-router-dom';

import { ContainerMenu } from "./style";

import { NavigationHeader } from '../../components/NavigationHeader';
import { SearchBar } from "../SearchBar";
import { ButtonText } from "../ButtonText";

export function Menu({ isAdmin, isMenuOpen, setIsMenuOpen, setSearch, isDisabled }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  function handleNew() {
    navigate("/create");
  }

  function handleFavorites() {
    navigate("/favorites");
  }

  function handleSignOut() {
    navigate("/");
    signOut();
  }

  return (
    <ContainerMenu isMenuOpen={isMenuOpen}>
      <NavigationHeader isAdmin={isAdmin} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <main>
        <SearchBar isDisabled={isDisabled} setSearch={setSearch} />

        {isAdmin && (
          <ButtonText onClick={handleNew}>
            Adicionar Novo
          </ButtonText>
        )}

        <ButtonText onClick={handleFavorites}>
          Meus Favoritos
        </ButtonText>

        <ButtonText onClick={handleSignOut}>
          Sair
        </ButtonText>
      </main>
    </ContainerMenu>
  );
}
