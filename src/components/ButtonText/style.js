import styled from "styled-components";

export const ContainerButtonText = styled.button`
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  font-size: 2.4rem;
  line-height: 140%;
  background: transparent;
  border: none;

  color: ${({ theme }) => theme.COLORS.GRAY_200};

  display: flex;
  align-items: center;

  > svg {
    font-size: 3.2rem;
    color: ${({ theme }) => theme.COLORS.WHITE};
  }

  @media (min-width: 1024px) {
    font-weight: 700;
  }
`;
