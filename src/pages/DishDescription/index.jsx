import { RxCaretLeft } from "react-icons/rx";
import { useMediaQuery } from 'react-responsive';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

import { ContainerDish, ContentDish } from "./style";
import { NavigationHeader } from '../../components/NavigationHeader';
import { Menu } from "../../components/Menu";
import { ButtonText } from "../../components/ButtonText";
import { Tag } from '../../components/Tag';
import { NumberPicker } from "../../components/NumberPicker";
import { Button } from "../../components/Button";
import { Footer } from '../../components/Footer';

export function DishDescription({ isAdmin }) {
  const isLargeScreen = useMediaQuery({ minWidth: 1024 });

  const [menuVisible, setMenuVisible] = useState(false);
  const [dishData, setDishData] = useState(null);

  const params = useParams();
  const navigate = useNavigate();

  const [number, setNumber] = useState(1);
  const [cartId, setCartId] = useState(null);

  const [loading, setLoading] = useState(false);

  const reloadPage = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    navigate(-1);
  }

  const handleEditDish = () => {
    navigate(`/edit-dish/${params.id}`);
  }

  useEffect(() => {
    const fetchDishData = async () => {
      try {
        const response = await api.get(`/dishes/${params.id}`);
        setDishData(response.data);
      } catch (error) {
        console.error("Ocorreu um erro ao buscar os dados do prato:", error);
      }
    }

    fetchDishData();
  }, [params.id]);

  async function handleInclude() {
    setLoading(true);

    const user = JSON.parse(localStorage.getItem("@foodexplorer:user"));

    try {
      const cartItem = {
        dish_id: dishData.id,
        name: dishData.name,
        quantity: number,
      };

      const response = await api.get('/carts', { params: { created_by: user.id } });
      const cart = response.data[0];

      if (cart) {
        await api.patch(`/carts/${cart.id}`, { cart_items: [cartItem] });
      } else {
        const createResponse = await api.post('/carts', { cart_items: [cartItem], created_by: user.id });
        const createdCart = createResponse.data;

        setCartId(createdCart.id);
      }

      alert('Prato adicionado ao carrinho!');
      reloadPage()
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert('Não foi possível adicionar ao carrinho.');
        console.log('Erro ao adicionar ao carrinho:', error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <ContainerDish>
      {!isLargeScreen && 
        <Menu 
          isAdmin={isAdmin} 
          isDisabled={true} 
          isMenuOpen={menuVisible} 
          setIsMenuOpen={setMenuVisible} 
        />
      }

      <NavigationHeader 
        isAdmin={isAdmin} 
        isDisabled={true} 
        isMenuOpen={menuVisible} 
        setIsMenuOpen={setMenuVisible} 
      />

      {dishData && 
        <main>
          <div>
            <header>
              <ButtonText onClick={handleGoBack}>
                <RxCaretLeft />
                Voltar
              </ButtonText>
            </header>

            <ContentDish>
              <img src={`${api.defaults.baseURL}/files/${dishData.image}`} alt={dishData.name} />

              <div>
                <h1>{dishData.name}</h1>
                <p>{dishData.description}</p>
              
                {dishData.ingredients && 
                  <section>
                    {dishData.ingredients.map(ingredient => (
                      <Tag key={String(ingredient.id)} title={ingredient.name} />
                    ))}
                  </section>
                }

                <div className="actions">
                  {isAdmin ? 
                    <Button 
                      title="Editar Prato" 
                      className="edit" 
                      onClick={handleEditDish}
                      loading={loading}
                    /> : 
                    <>
                      <NumberPicker number={number} setNumber={setNumber} />
                      <Button 
                        title={
                          isLargeScreen ? 
                          `Adicionar ao carrinho • R$ ${(dishData.price * number).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 
                          `Pedido • R$ ${(dishData.price * number).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                        } 
                        className="add"
                        onClick={handleInclude}
                        loading={loading}
                      />
                    </>
                  }
                </div>
              </div>
            </ContentDish>
          </div>
        </main>
      }

      <Footer />
    </ContainerDish>
  );
}
