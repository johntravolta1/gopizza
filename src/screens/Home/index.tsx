import React, { useCallback, useEffect, useState } from 'react';
import { Container, Header,
Greeting,
GreetingEmoji,
GreetingText,
MenuHeader,
MenuItensNumber,
Title,
NewProductButton
} from './styles';
import happyEmoji from '../../assets/happy.png'
import { FlatList, TouchableOpacity } from 'react-native';
import {MaterialIcons} from '@expo/vector-icons'
import { useTheme } from 'styled-components';
import { Search } from '../../components/Search';
import { ProductCard, ProductCardProps } from '../../components/ProductCard';
import { Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/auth';

export function Home() {
  const {COLORS} = useTheme()
  const [pizzas, setPizzas] = useState<ProductCardProps[]>([])
  const [search, setSearch] = useState('')
  const {navigate} = useNavigation()

  const { signOut, user} = useAuth()
  function fetchPizzas(value:string) {
      const formattedValue = value.toLowerCase().trim()

      firestore().collection('pizzas').orderBy('name_insensitive').startAt(formattedValue).endAt(`${formattedValue}\uf8ff`).get()
      .then(response => {
          const data = response.docs.map(doc => {
              return {
                  id: doc.id,
                  ...doc.data()
              }
          }) as ProductCardProps[]

          setPizzas(data)
      })
      .catch(() => Alert.alert('Consulta', 'Não foi possível realizar a consulta'))
      

  }

  function handleSearch() {
    fetchPizzas(search)
  }

  function handleSearchClear() {
    setSearch('')
    fetchPizzas('')
  }

  function handleOpen(id:string) {
    const route = user?.isAdmin ? 'product' : 'order';
    navigate(route, {id});
  }

  function handleAdd() {
    navigate('product', {});
  }

  useFocusEffect(useCallback(() => {
      fetchPizzas('')
  } , []));

  return (
    <Container>
      <Header>
        <Greeting>
          <GreetingEmoji source={happyEmoji}></GreetingEmoji>
          <GreetingText>Olá, Admin</GreetingText>
        </Greeting>
          <TouchableOpacity onPress={signOut}>
            <MaterialIcons name='logout' color={COLORS.TITLE} size={24}></MaterialIcons>
          </TouchableOpacity>
      </Header> 
      <Search 
        value={search}
        onChangeText={setSearch}
        onSearch={handleSearch} 
        onClear={handleSearchClear}
      ></Search>

      <MenuHeader>
        <Title>Cardápio</Title>
        <MenuItensNumber>{pizzas.length} pizzas</MenuItensNumber>
      </MenuHeader> 

      <FlatList
        data={pizzas}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ProductCard 
            data={item}
            onPress={() => handleOpen(item.id)}
          ></ProductCard>
          )}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 125,
          marginHorizontal: 24
        }}
      ></FlatList>
      {
        user?.isAdmin &&
        <NewProductButton title='Cadastrar' type='secondary' onPress={handleAdd}></NewProductButton>
      }
    </Container>
  );
}