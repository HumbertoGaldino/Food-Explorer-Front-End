import { FaSearch } from "react-icons/fa";
import { ContainerSearchBar } from "./style";

import { Input } from "../../components/Input";

export function SearchBar({ setSearch, isDisabled }) {
  return (
    <ContainerSearchBar>
      <Input
        disabled={isDisabled}
        icon={FaSearch}
        placeholder="Busque por pratos ou ingredientes"
        onChange={(event) => setSearch(event.target.value)}
      />
    </ContainerSearchBar>
  );
}