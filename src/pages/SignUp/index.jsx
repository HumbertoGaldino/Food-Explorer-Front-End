import { useState } from "react";
import { api } from '../../services/api'
import { Link, useNavigate } from "react-router-dom";

import { ContainerRegister, RegisterForm, Logo } from "./style";

import { Section } from '../../components/Section';
import { Input } from '../../components/Input';
import { Button } from "../../components/Button";

import logo from "../../assets/logo.svg";

export function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async () => {
    setLoading(true);
    try {
      await api.post("/users", { name, email, password });
      alert("Usuário cadastrado com sucesso!");
      navigate("/");
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Não foi possível cadastrar.");
      }
    } finally {
      setLoading(false);
    }
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
            onChange={(event) => setName(event.target.value)}
          />
        </Section>

        <Section title="Email">
          <Input 
            placeholder="E-mail" 
            type="text"
            onChange={(event) => setEmail(event.target.value)}
          />
        </Section>

        <Section title="Senha">
          <Input 
            placeholder="Senha" 
            type="password"
            onChange={(event) => setPassword(event.target.value)}
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