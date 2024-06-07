import { api } from '../../services/api';
import { ContainerFavoriteDishes } from "./style";

export function FavoriteDishes({ data, onRemove }) {
  return (
    <ContainerFavoriteDishes>
      <a href={`/dishes/${data.dish_id}`}>
        <img src={`${api.defaults.baseURL}/files/${data.image}`} alt="Dish image." />
      </a>
      
      <div>
        <a href={`/dishes/${data.dish_id}`}>
          <h2>{data.name}</h2>
        </a>
        <button onClick={() => onRemove(data.id)}>Remover</button>
      </div>
    </ContainerFavoriteDishes>
  );
}
