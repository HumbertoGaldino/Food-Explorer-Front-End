import { useState } from 'react';
import { Link } from "react-router-dom";
import { useAuth } from '../../hooks/auth';

import { ContainerLogin, LoginForm, Logo } from "./styles";
import { Section } from '../../components/Section';
import { Input } from '../../components/Input';
import { Button } from "../../components/Button";

import logo from "../../assets/logo.svg";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();

  function handleSignIn() {
    setLoading(true);

    signIn({ email, password }).finally(() => setLoading(false));
  }

  return (
    <ContainerLogin>
      <Logo>
        <img src={logo} alt="Logo" />
      </Logo>

      <LoginForm>
        <h2>Faça seu login</h2>

        <Section title="Email">
          <Input 
            placeholder="E-mail" 
            type="text"
            onChange={e => setEmail(e.target.value)}
          />
        </Section>

        <Section title="Senha">
          <Input 
            placeholder="Senha" 
            type="password"
            onChange={e => setPassword(e.target.value)}
          />
        </Section>

        <Button title="Entrar" onClick={handleSignIn} loading={loading} />

        <Link to="/register">
          Criar uma conta
        </Link>
      </LoginForm>
    </ContainerLogin>
  );
}