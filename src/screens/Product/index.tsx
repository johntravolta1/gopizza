import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { ButtonBack } from '../../components/ButtonBack';
import { Photo } from '../../components/Photo';
import { Container, Header, Title, DeleteLabel, Upload, PickImageButton,
  MaxCharacters,
  InputGrpoupHeader,
  InputGroup,
  Label,
  Form
} from './styles';
import * as ImagePicker from 'expo-image-picker'
import { InputPrice } from '../../components/InputPrice';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { NavigationHelpersContext, useNavigation, useRoute } from '@react-navigation/native';
import { ProductNavigationProps } from '../../@types/navigation';
import { ProductCardProps } from '../../components/ProductCard';

type PizzaResponse = ProductCardProps & {
  photo_path: string;
  price_sizes: {
    p: string;
    m: string;
    g: string;
  }
}

export function Product() {
  const [photoPath, setPhotoPath] = useState('')
  const [image, setImage] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('');
  const [priceSizeP, setPriceSizeP] = useState('');
  const [priceSizeM, setPriceSizeM] = useState('');
  const [priceSizeG, setPriceSizeG] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const route = useRoute()
  const {id} = route.params as ProductNavigationProps;
  const navigation = useNavigation()

  function handleGoBack() {
    navigation.goBack()
  }

  async function handlePickImage() {
    const {status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if(status === 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4,4]
      })

      if(!result.cancelled) {
        setImage(result.uri)
      }
    }
  }

  async function handleAdd() {
    if(!name.trim()) {
      return Alert.alert('Cadastro', 'Informe o nome da pizza!')
    }
    if(!description.trim()) {
      return Alert.alert('Cadastro', 'Informe a descrição da pizza!')
    }
    if(!image) {
      return Alert.alert('Cadastro', 'Selecione a imagem da pizza')
    }
    if(!priceSizeP || !priceSizeM || !priceSizeG) {
      return Alert.alert('Cadastro', 'Informe o preço de todos tamanhos da pizza')
    }

    setIsLoading(true);

    const fileName = new Date().getTime()
    const reference = storage().ref(`/pizzas/${fileName}.png`)
    await reference.putFile(image)

    const photo_url = await reference.getDownloadURL()

    firestore().collection('pizzas').add({
      name,
      name_insensitive: name.toLowerCase().trim(),
      description,
      price_sizes: {
        p: priceSizeP,
        m: priceSizeM,
        g: priceSizeG
      },
      photo_url,
      photo_path: reference.fullPath,
    })
    .then(() => navigation.navigate('home'))
    .catch((err) => {
      Alert.alert('Cadastro', 'Não foi possível cadastrar a pizza: ' + err)
      setIsLoading(false)
    })

  }

  function handleDelete() {
    firestore().collection('pizzas').doc(id).delete()
    .then(() => {
      storage().ref(photoPath).delete()
      .then(() => navigation.navigate('home'))
    })
  }

  useEffect(()=> {
    if(id) {
      firestore().collection('pizzas').doc(id).get()
      .then(response => {
        const product = response.data() as PizzaResponse

        setName(product.name)
        setImage(product.photo_url)
        setDescription(product.description)
        setPriceSizeP(product.price_sizes.p)
        setPriceSizeM(product.price_sizes.m)
        setPriceSizeG(product.price_sizes.g)
        setPhotoPath(product.photo_path)
      })
    }

  } , [id])

  return (
    <Container beharvior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView showsVerticalScrollIndicator={true}>
        <Header>
          <ButtonBack onPress={handleGoBack}></ButtonBack>

          <Title>Cadastrar</Title>

          { id ?
            <TouchableOpacity onPress={handleDelete}>
            <DeleteLabel>Deletar</DeleteLabel>
          </TouchableOpacity>
          : <View style={{width: 20}}></View>}
        </Header>

        <Upload>
          <Photo uri={image}></Photo>
          { !id && <PickImageButton onPress={handlePickImage} title='Carregar' type='secondary'></PickImageButton>}
        </Upload>
        <Form>
          <InputGroup>
            <Label>Nome</Label>
            <Input onChangeText={setName} value={name}></Input>
          </InputGroup>

          <InputGroup>
            <InputGrpoupHeader>
              <Label>Descrição</Label>
              <MaxCharacters>0 de 60 caracteres</MaxCharacters>
            </InputGrpoupHeader>
            <Input
              multiline
              maxLength={60}
              style={{height: 80}}
              onChangeText={setDescription} value={description}
            ></Input>
          </InputGroup>

          <InputGroup>
            <Label>Tamanhos e preços</Label>
            <InputPrice size='P'  onChangeText={setPriceSizeP} value={priceSizeP}></InputPrice>
            <InputPrice size='M'  onChangeText={setPriceSizeM} value={priceSizeM}></InputPrice>
            <InputPrice size='G'  onChangeText={setPriceSizeG} value={priceSizeG}></InputPrice>
          </InputGroup>

          { !id &&
            <Button
            title='Cadastrar pizza'
            isLoading={isLoading} 
            onPress={handleAdd}
          ></Button>}
        </Form>

        </ScrollView>
    </Container>
  );
}