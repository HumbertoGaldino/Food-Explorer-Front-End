import { FiMinusSquare, FiPlusSquare } from "react-icons/fi";

import { ContainerNumberPicker } from "./style";

export function NumberPicker({ number, setNumber }) {
  const incrementNumberItem = () => {
    setNumber(number + 1);
  };

  const decrementNumberItem = () => {
    if (number > 1) {
      setNumber(number - 1);
    }
  };

  return (
    <ContainerNumberPicker>
      <button onClick={decrementNumberItem}>
        <FiMinusSquare />
      </button>
      <span>{number < 10 ? `0${number}` : number}</span>
      <button onClick={incrementNumberItem}>
        <FiPlusSquare />
      </button>
    </ContainerNumberPicker>
  );
}