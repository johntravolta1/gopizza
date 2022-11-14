
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import {KeyboardAvoidingView, Platform} from 'react-native'
import brandImg from '../../assets/brand.png'

import { 
  Container, 
  Content, 
  Title, 
  Brand, 
  ForgotPasswordButton, 
  ForgotPasswordLabel} from './styles';
import { useAuth } from '../../hooks/auth';
import { useState } from 'react';


export function SignIn() {
  const {signIn, isLoging, forgotPassword} = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSignIn() {
    signIn(email, password)
  }

  function handleForgotPassword() {
    forgotPassword(email)
  }

  return (
    <Container>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>  
      <Content>

        <Brand source={brandImg}></Brand>

        <Title>Login</Title>

        <Input
          placeholder='E-mail'
          type='secondary'
          autoCorrect={false}
          autoCapitalize='none'
          onChangeText={setEmail}
        ></Input>

        <Input
          placeholder='Senha'
          type='secondary'
          secureTextEntry
          onChangeText={setPassword}
        ></Input>

        <ForgotPasswordButton onPress={handleForgotPassword}>
          <ForgotPasswordLabel>Esqueci minha senha</ForgotPasswordLabel>
        </ForgotPasswordButton>

        <Button title='Entrar' onPress={handleSignIn} isLoading={isLoging}></Button>
      </Content>
      </KeyboardAvoidingView>
    </Container>
  );
}