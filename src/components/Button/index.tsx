import React from 'react';
import { Container, Title, Load, TypeProps } from './styles';
import {  TouchableOpacityProps, TouchableWithoutFeedback, View } from 'react-native';

interface Props extends TouchableOpacityProps {
  title: string;
  type?: TypeProps;
  isLoading?: boolean;
}

export function Button({title, type = 'primary', isLoading = false, ...rest} : Props) {
  return (
      <Container type={type} disabled={isLoading} {...rest}>
        {isLoading ? <Load/> : <Title>{title}</Title>}
      </Container>
  );
}