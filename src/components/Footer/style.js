import styled from "styled-components";

export const ContainerFooter = styled.footer`
  grid-area: footer;

  height: 7.7rem;
  width: 100%;
  padding: 2.9rem 2.8rem;

  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
  padding: 1.6rem 2.4rem;
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND_DARK_300};
  border-top: 1px solid ${({ theme }) => theme.COLORS.BORDER};

  @media (min-width: 1024px) {
    padding: 2.4rem 12.3rem;
  }
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;

  > img {
    width: 12.4rem;
  }

  @media (min-width: 1024px) {
    > img {
      width: 18.6rem;
    }
  }
`;

export const Copyright = styled.p`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.COLORS.LIGHT_WHITE};
`;
