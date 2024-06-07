// Import de estilizações
import { ContainerCartItem } from './style';

import { useState } from 'react';
import { api } from '../../services/api';

export function CartItem({ cart_id, dish_id, quantity, name, price, image }) {
  const [totalPrice, setTotalPrice] = useState(quantity * price);

  const reloadPage = () => {
    window.location.reload();
  };

  const handleDeleteItem = async ()  => {
    await api.delete(`/carts/${cart_id}/item/${dish_id}`);
    reloadPage();
  };

  return (
    <ContainerCartItem>
      <img
        src={`${api.defaults.baseURL}/files/${image}`} alt={name}
      />

      <div className='cartDetails'>
        <div className='details'>
          <h3>{quantity} x {name}</h3>
          <span>
            R$ {totalPrice.toFixed(2)}
          </span>
        </div>

        <button className='deleteButton' onClick={handleDeleteItem}>
          Excluir
        </button>
      </div>
    </ContainerCartItem>
  );
}
