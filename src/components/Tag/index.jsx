import { ContainerTag } from "./style";

export function Tag({ title, ...rest }) {
    return (
      <ContainerTag {...rest}>
        {title}
      </ContainerTag>
    );
  }