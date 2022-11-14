import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { Button } from '../../components/Button';
import { ButtonBack } from '../../components/ButtonBack';
import { Input } from '../../components/Input';
import { RadioButton } from '../../components/RadioButton';
import { PIZZA_TYPES } from '../../utils/pizzaTypes';
import { Container, Form, Header, Photo, Sizes,
Title, Label, FormRow, Price, InputGroup, ContentScroll
} from './styles';
import firestore from '@react-native-firebase/firestore'
import { OrderNavigationProps, ProductNavigationProps } from '../../@types/navigation';
import { ProductCardProps } from '../../components/ProductCard';
import { useAuth } from '../../hooks/auth';

type PizzaResponse = ProductCardProps & {
  price_sizes: {
    [key: string]: number
  }
}


export function Order() {

  const {user} = useAuth()

  const [size, setSize]  = useState('');
  const navigation = useNavigation()
  const route = useRoute()
  const {id} = route.params as OrderNavigationProps;
  const [pizza, setPizza] = useState<PizzaResponse>({} as PizzaResponse)
  const [quantity, setQuantity] = useState(1);
  const [tableNumber, setTableNumber] = useState('0');
  const [sendingOrder, setSendingOrder] = useState(false)
  
  const amount = size ? pizza.price_sizes[size] * quantity : '0,00';

  function handleGoBack() {
    navigation.goBack()
  }

  function handleOrder() {
    if(!size) { return Alert.alert('Pedido', 'Informe o tamanho da pizza!')}
    if(!tableNumber) { return Alert.alert('Pedido', 'Informe o número da mesa!')}
    if(!quantity) { return Alert.alert('Pedido', 'Informe a quantidade!')}

    setSendingOrder(true)

    firestore().collection('orders').add({
      quantity,
      amount,
      pizza: pizza.name,
      size,
      table_number: tableNumber,
      waiter_id: user?.id,
      image: pizza.photo_url,
      status: 'Preparando'
    })
    .then(() => navigation.navigate('home'))
    .catch((error) => {
      Alert.alert('Erro!', 'Não foi possível realizar o pedido')
      console.log(error)
      setSendingOrder(false);
    })

  }
  useEffect(() => {
    if(id) {
      firestore().collection('pizzas').doc(id).get()
      .then(response => setPizza(response.data() as PizzaResponse))
      .catch((error) => Alert.alert('Pedido', 'Não foi possível carregar o produto:' + error))
    }
  }, [])

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ContentScroll>
        <Header>
            <ButtonBack onPress={handleGoBack} style={{marginBottom: 108}}></ButtonBack>
        </Header>
        <Photo source={{uri: pizza.photo_url}}></Photo>
        <Form>  
          <Title>{pizza.name}</Title>
          <Label>Selecione um tamanho</Label>
          <Sizes>
            {PIZZA_TYPES.map(item => (
              <RadioButton key={item.id} selected={size===item.id} title={item.name} onPress={() => setSize(item.id)}></RadioButton>
            ))}
          </Sizes>

          <FormRow>
            <InputGroup>
              <Label>Número da mesa</Label>
              <Input keyboardType='numeric' onChangeText={setTableNumber}></Input>
            </InputGroup>
            <InputGroup>
              <Label>Quantidade</Label>
              <Input keyboardType='numeric' onChangeText={(value) => setQuantity(Number(value))}></Input>
            </InputGroup>
          </FormRow>

          <Price>Valor de R${amount}</Price>

          <Button
            title='Confirmar o pedido'
            onPress={handleOrder}
            isLoading={sendingOrder}
          ></Button>
        </Form>
        </ContentScroll>
    </Container>
  );
}