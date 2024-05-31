import { ContainerInput } from "./style";

export function Input({ icon: Icon, ...rest }) {
  return (
    <ContainerInput>
      {Icon && <Icon size={"2.4rem"} />}
      <input {...rest} />
    </ContainerInput>
  );
}