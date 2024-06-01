import { ContainerButtonText } from "./style";

export function ButtonText({ children, onClick }) {
    return (
      <ContainerButtonText 
      type="button" 
      onClick={onClick}>
        {children}
      </ContainerButtonText>
    );
}