import React from 'react';
import { Container,
Input,
Button,
InputArea,
ButtonClear,
} from './styles';
import {Feather} from '@expo/vector-icons'
import { useTheme } from 'styled-components';
import { TextInputProps } from 'react-native';

type Props = TextInputProps & {
    onSearch: () => void;
    onClear: () => void;
}

export function Search({onSearch,onClear, ...rest}: Props) {

    const {COLORS} = useTheme();
  return (
    <Container>
        <InputArea>
            <Input placeholder='pesquisar...' {...rest}></Input>
            <ButtonClear onPress={onClear}>
                <Feather name='x' size={16}></Feather>
            </ButtonClear>
        </InputArea>

        <Button onPress={onSearch}>
            <Feather name='search' size={16} color={COLORS.TITLE}></Feather>
        </Button>

    </Container>
  );
}