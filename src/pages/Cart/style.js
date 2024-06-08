import styled from "styled-components";

export const ContainerCart = styled.div`
  width: 100vw;

  display: grid;
  grid-template-rows: 10.4rem auto 7.2rem;
  grid-template-areas:
    "header"
    "main"
    "footer";

  @media (max-width: 768px) {
    grid-template-rows: auto 1fr auto;
  }
`;

export const Main = styled.main`
  width: 100vw;
  height: auto;
  grid-area: main;
  padding: 2.4rem 10rem;

  display: grid;
  grid-template-columns: 2fr 2.5fr;
  margin: 0 auto;

  h2 {
    font-size: 3.2rem;
    line-height: 4.5rem;
    font-weight: 500;
    color: ${({ theme }) => theme.COLORS.WHITE_100};
  }

  .allOrders {
    display: flex;
    flex-direction: column;
    gap: 3.2rem;

    .priceItems {
      font-size: 2rem;
      line-height: 3.2rem;
      font-weight: 500;
    }
  }

  .paymentMethods {
    margin-left: 3rem;

    .paymentBox {
      margin-top: 3.2rem;
      width: 43rem;
      height: auto;
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5rem;
      padding: 1rem;

      .paymentMethods__wrapper {
        display: flex;
        flex-direction: row;
        gap: 1rem;

        button {
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: ${({ theme }) => theme.COLORS.BACKGROUND_DARK_900};
          color: ${({ theme }) => theme.COLORS.WHITE};
          border: 1px solid rgba(255, 255, 255, 0.1);

          &:disabled {
            background: rgba(255, 255, 255, 0.05);
          }
        }
      }

      .paymentForms {
        img {
          width: 20rem;
          height: 20rem;
        }
      }
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 2.4rem;

    h2 {
      font-size: 2.4rem;
      line-height: 3.5rem;
    }

    .paymentMethods {
      margin-left: 0;

      .paymentBox {
        width: 30rem;
        height: 40rem;
        padding: 1rem;

        .paymentMethods__wrapper {
          gap: 1rem;
        }

        .paymentForms {
          img {
            width: 20rem;
            height: 20rem;
          }
        }
      }
    }
  }
`;
