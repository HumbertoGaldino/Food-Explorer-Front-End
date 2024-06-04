import { FiPlus, FiX } from "react-icons/fi";
import { ContainerFoodItem } from "./style";

export function FoodItem({ isNew, value, onClick, ...rest }) {
  return (
    <ContainerFoodItem isNew={isNew}>
      <input type="text" value={value} readOnly={!isNew} {...rest} />

      <button
        type="button"
        onClick={onClick}
        className={isNew ? "add-button" : "remove-button"}
      >
        {isNew ? <FiPlus /> : <FiX />}
      </button>
    </ContainerFoodItem>
  );
}
