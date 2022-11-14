import React, { useEffect, useState } from 'react';
import { Alert, FlatList, View } from 'react-native';
import { OrderCard, OrderProps } from '../../components/OrderCard';
import { Container, Header, Title } from './styles';
import firestore from '@react-native-firebase/firestore'
import { useAuth } from '../../hooks/auth';

export function Orders() {
  
  const {user} = useAuth()
  
  const [orders, setOrders] = useState<OrderProps[]>([]);

  useEffect(() => {
    const subscribe = firestore().collection('orders').where('waiter_id', '==', user?.id)
    .onSnapshot(querySnapshot => {
      const data = querySnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        }
      }) as OrderProps[];
      setOrders(data)
    });

    return () => subscribe()

  } , [])

  function handlePizzaDelivered(id:string) {
    Alert.alert('Pedido ♥', 'Confirmar que a pizza foi entregue na mesa?', [
      {text: 'Sim', onPress: () => {
        firestore().collection('orders').doc(id).update({
          status: 'Entregue'
        })
      }},
      {text: 'Não', style: 'cancel'},
    ])
  }

  return (
    <Container>
      <Header>
        <Title>Pedidos realizados</Title>
      </Header>
     
      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => (
          <OrderCard index={index} data={item}
            disabled={item.status === 'Entregue'}
            onPress={() => handlePizzaDelivered(item.id)}
          ></OrderCard>
        )}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 125, paddingHorizontal: 24}}
        ItemSeparatorComponent={() =>  <View style={{height: 1, width: '100%', backgroundColor:'#DCDCDC'} }></View>}
      ></FlatList>
    </Container>
  );
}