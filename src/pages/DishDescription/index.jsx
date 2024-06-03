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

export function DishDescription({ isAdmin, userId }) {
  const isLargeScreen = useMediaQuery({ minWidth: 1024 });

  const [menuVisible, setMenuVisible] = useState(false);
  const [dishData, setDishData] = useState(null);

  const params = useParams();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [cartId, setCartId] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleGoBack = () => {
    navigate(-1);
  }

  const handleEditDish = () => {
    navigate(`/edit/${params.id}`);
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

  const handleAddToCart = async () => {
    setLoading(true);

    try {
      const cartItem = {
        dish_id: dishData.id,
        name: dishData.name,
        quantity,
      };

      const response = await api.get('/carts', { params: { created_by: userId } });
      const userCart = response.data[0];

      if (userCart) {
        await api.patch(`/carts/${userCart.id}`, { cart_items: [cartItem] });
      } else {
        const createResponse = await api.post('/carts', { cart_items: [cartItem], created_by: userId });
        const newCart = createResponse.data;

        setCartId(newCart.id);
      }

      alert('Prato adicionado ao carrinho!');
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert('Falha ao adicionar o prato ao carrinho.');
        console.error('Erro ao adicionar ao carrinho:', error);
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
                      title="Edit Dish" 
                      className="edit" 
                      onClick={handleEditDish}
                      loading={loading}
                    /> : 
                    <>
                      <NumberPicker quantity={quantity} setQuantity={setQuantity} />
                      <Button 
                        title={
                          isLargeScreen ? 
                          `Adicionar ao carrinho • R$ ${(dishData.price * quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 
                          `Pedido • R$ ${(dishData.price * quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                        } 
                        className="add"
                        onClick={handleAddToCart}
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
