import React from 'react';
import { TextInputProps, View } from 'react-native';

import { Container, TypeProps } from './styles';

type Props = TextInputProps & {
    type?: TypeProps;
}

export function Input({type = 'primary', ...rest} : Props) {
  return (
    <Container type={type} {...rest} />
  );
}