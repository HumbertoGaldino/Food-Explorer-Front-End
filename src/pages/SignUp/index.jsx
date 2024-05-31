import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ContainerRegister, RegisterForm, Logo } from "./style";

import { Section } from '../../components/Section';
import { Input } from '../../components/Input';
import { Button } from "../../components/Button";

import logo from "../../assets/logo.svg";

export function SignUp() {
  // States for form fields and loading status
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = () => {
    if (!name || !email || !password) {
      return alert("Todos os campos devem ser preenchidos!");
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return alert("E-mail inválido! Por favor digite um e-mail válido!");
    }

    if (password.length < 6) {
      return alert("A senha deve conter no mínimo 6 caracteres!");
    }

    setLoading(true);
  };

  return (
    <ContainerRegister>
      <Logo>
        <img src={logo} alt="Logo" />
      </Logo>

      <RegisterForm>
        <h2>Crie sua conta</h2>

        <Section title="Seu nome">
          <Input 
            placeholder="Nome" 
            type="text"
            onChange={(e) => setName(e.target.value)}
          />
        </Section>

        <Section title="Email">
          <Input 
            placeholder="E-mail" 
            type="text"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Section>

        <Section title="Senha">
          <Input 
            placeholder="Senha" 
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Section>

        <Button 
          title="Criar conta" 
          onClick={handleSignUp} 
          loading={loading} 
        />

        <Link to="/">
          Já tenho uma conta
        </Link>
      </RegisterForm>
    </ContainerRegister>
  );
}