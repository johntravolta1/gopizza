import React, { useEffect, useState } from 'react';
import { Container,
Content,
Image,
Details,
Name,
Description,
Line,
Identification,
} from './styles';

import { Feather} from '@expo/vector-icons'
import { Alert, TouchableOpacityProps } from 'react-native';
import { useTheme } from 'styled-components';

export type ProductCardProps = {
    id: string;
    photo_url: string;
    name: string;
    description: string;
}

type Props = TouchableOpacityProps & {
    data: ProductCardProps;
}

export function ProductCard({data, ...rest}: Props) {
    const {COLORS} = useTheme()

    return (
    <Container>
        <Content {...rest}>
            <Image source={{uri: data.photo_url}}></Image>
            <Details>
                <Identification>
                    <Name>{data.name}</Name>
                    <Feather name='chevron-right' size={18} color={COLORS.SHAPE}></Feather>
                </Identification>
                <Description>{data.description}</Description>
            </Details>
        </Content>
        <Line></Line>
    </Container>
  );
}