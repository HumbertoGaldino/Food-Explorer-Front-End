import { useState } from "react";

import { LuPencil } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa";
import { PiCaretRightBold } from "react-icons/pi";
import { api } from '../../services/api';

import { useMediaQuery } from "react-responsive";
import theme from "../../styles/theme";

import { useParams, useNavigate } from 'react-router-dom';

import { ContainerCard, CardTitle, OrderButton } from "./style";
import { NumberPicker } from '../../components/NumberPicker';
import { Button } from "../../components/Button";

export function Food({ data, isAdmin, isFavorite, toggleFavorite, handleDetails, user_id, ...rest }) {
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  const params = useParams();
  const navigate = useNavigate();

  const [number, setNumber] = useState(1);
  const [cartId, setCartId] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleFavorite = async () => {
    try {
      if (isFavorite) {
        toggleFavorite(true, data.id);
      } else {
        toggleFavorite(false, data.id);
      }
    } catch (error) {
      console.log('Erro ao atualizar favoritos:', error);
    }
  };

  function handleEdit() {
    navigate(`/edit-dish/${data.id}`);
  }

  const reloadPage = () => {
    window.location.reload();
  };

  async function handleInclude() {
    setLoading(true);

    try {
      const cartItem = {
        dish_id: data.id,
        name: data.name,
        quantity: number,
      };

      const response = await api.get('/carts', { params: { created_by: user_id } });
      const cart = response.data[0];

      if (cart) {
        await api.patch(`/carts/${cart.id}`, { cart_items: [cartItem] });
      } else {
        const createResponse = await api.post('/carts', { cart_items: [cartItem], created_by: user_id });
        const createdCart = createResponse.data;

        setCartId(createdCart.id);
      }

      alert('Prato adicionado ao carrinho!');
      reloadPage()
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert('Não foi possível adicionar o prato ao carrinho.');
        console.log('Erro ao adicionar ao carrinho:', error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <ContainerCard {...rest} isAdmin={isAdmin}>
      {isAdmin ? (
        <LuPencil size={"2.4rem"} onClick={handleEdit} />
      ) : (
        <FaRegHeart
          size={"2.4rem"}
          fill={isFavorite ? theme.COLORS.GRAY_200 : undefined}
          onClick={handleFavorite}
        />
      )}

      <img 
        src={`${api.defaults.baseURL}/files/${data.image}`} 
        alt="Imagem do prato." 
        onClick={() => handleDetails(data.id)} 
      />
      
      <CardTitle>
        <h2>{data.name}</h2>
        <PiCaretRightBold 
          size={isDesktop ? "2.4rem" : "1.4rem"} 
          onClick={() => handleDetails(data.id)} 
        />
      </CardTitle>
      
      {isDesktop && <p>{data.description}</p>}
      <span>R$ {data.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>

      {!isAdmin && 
        <OrderButton>
          <NumberPicker number={number} setNumber={setNumber} />
          <Button title="Incluir" onClick={handleInclude} loading={loading} />
        </OrderButton>
      }
    </ContainerCard>
  );
}