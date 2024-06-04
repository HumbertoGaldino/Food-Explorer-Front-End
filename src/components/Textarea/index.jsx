import { ContainerTextarea } from "./style"

export function Textarea({ value, ...rest }) {
  return(
    <ContainerTextarea {...rest}>
        {value}
    </ContainerTextarea>
  )
}
