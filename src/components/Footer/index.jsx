import { ContainerFooter, Logo, Copyright } from "./style";
import logoFooter from "../../assets/footer-logo.svg";

export function Footer() {
  return (
    <ContainerFooter>
      <Logo>
        <img src={logoFooter} alt="Logo" />
      </Logo>

      <Copyright>
        © 2024 - All rights reserved.
      </Copyright>
    </ContainerFooter>
  );
}
