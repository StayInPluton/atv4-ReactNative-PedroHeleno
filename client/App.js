import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StyleSheet, View, FlatList, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Avatar, Input, Icon, Button, ListItem, Text} from "react-native-elements";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {auth, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "firebase/auth"

const API_URL = 'http://localhost:3000';

const firebaseConfig = {
  apiKey: "AIzaSyCixE58l6bCxrn3_qgWdM1iMdWZeRrL8lo",
  authDomain: "aulabasemobile.firebaseapp.com",
  projectId: "aulabasemobile",
  storageBucket: "aulabasemobile.firebasestorage.app",
  messagingSenderId: "696693663088",
  appId: "1:696693663088:web:ac5cf81bc0bcba679fdbb5",
  measurementId: "G-WWXWPF5GDE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


function Tela1({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Usuário logado:", user.email);
        navigation.navigate('Contatos')
      })
      .catch((error) => {
        console.log("Erro:", error.message);
        alert("Erro ao logar")

      });
  };

  return (
    <View style={styles.container}>
      <Text h3 style={{ marginBottom: 20 }}>Login</Text>
      <Avatar
        size={100}
        rounded
        icon={{ name: 'user', type: 'font-awesome', color: '#000' }}
        containerStyle={{ marginBottom: 20 }}
      />
      <Input placeholder='E-mail' leftIcon={<Icon name='email' size={24} color='black' />} value={email} onChangeText={setEmail} />
      <Input placeholder='Senha' leftIcon={<Icon name='lock' size={24} color='black' />} secureTextEntry value={senha} onChangeText={setSenha} />
      <Button title="Login" buttonStyle={styles.button} onPress={handleLogin} />
      <Button title="Cadastrar-se" type="clear" onPress={() => navigation.navigate('CadUsuarios')} />
    </View>
  );
}

function Tela2({ navigation }) {
  const [contatos, setContatos] = useState([]);

  const carregarContatos = () => {
    axios.get(`${API_URL}/contatos`)
      .then(response => setContatos(response.data))
      .catch(error => console.log(error));
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', carregarContatos);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={contatos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ListItem bottomDivider onPress={() => navigation.navigate('AlterContato', { contato: item })}>
            <Icon name="person" />
            <ListItem.Content>
              <ListItem.Title>{item.nome}</ListItem.Title>
              <ListItem.Subtitle>{item.telefone}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        )}
      />
    </View>
  );
}

function Tela3({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const cadastrarUsuario = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Usuário logado:", user.email);
      })
      .catch((error) => {
        console.log("Erro:", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text h4 style={{ marginBottom: 20 }}>Cadastro de Usuário</Text>
      <Input placeholder='E-mail' value={email} onChangeText={setEmail} leftIcon={<Icon name='email' size={24} color='black' />} />
      <Input placeholder='Senha' value={senha} onChangeText={setSenha} secureTextEntry leftIcon={<Icon name='lock' size={24} color='black' />} />
      <Button title="Cadastrar" buttonStyle={styles.button} onPress={cadastrarUsuario} />
    </View>
  );
}

function Tela4({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  const salvarContato = () => {
    axios.post(`${API_URL}/contatos`, { nome, email, telefone })
      .then(() => {
        Alert.alert("Sucesso", "Contato cadastrado!");
        navigation.goBack();
      }).catch(error => console.log(error));
  };

  return (
    <View style={styles.container}>
      <Input placeholder='Nome' value={nome} onChangeText={setNome} leftIcon={<Icon name='user' />} />
      <Input placeholder='E-mail' value={email} onChangeText={setEmail} leftIcon={<Icon name='email' />} />
      <Input placeholder='Telefone' value={telefone} onChangeText={setTelefone} leftIcon={<Icon name='phone' />} />
      <Button title="Salvar" buttonStyle={styles.button} onPress={salvarContato} />
    </View>
  );
}

function Tela5({ route, navigation }) {
  const { contato } = route.params;
  const [nome, setNome] = useState(contato.nome);
  const [email, setEmail] = useState(contato.email);
  const [telefone, setTelefone] = useState(contato.telefone);

  const alterarContato = () => {
    axios.put(`${API_URL}/contatos/${contato.id}`, { nome, email, telefone })
      .then(() => {
        Alert.alert("Sucesso", "Contato alterado!");
        navigation.goBack();
      }).catch(error => console.log(error));
  };

  const excluirContato = () => {
    axios.delete(`${API_URL}/contatos/${contato.id}`)
      .then(() => {
        Alert.alert("Sucesso", "Contato excluído!");
        navigation.goBack();
      }).catch(error => console.log(error));
  };

  return (
    <View style={styles.container}>
      <Input value={nome} onChangeText={setNome} placeholder="Nome" leftIcon={<Icon name="user" />} />
      <Input value={email} onChangeText={setEmail} placeholder="Email" leftIcon={<Icon name="email" />} />
      <Input value={telefone} onChangeText={setTelefone} placeholder="Telefone" leftIcon={<Icon name="phone" />} />
      <Button title="Alterar" buttonStyle={styles.button} onPress={alterarContato} />
      <Button title="Excluir" buttonStyle={[styles.button, { backgroundColor: 'red' }]} onPress={excluirContato} />
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name="Login" component={Tela1} options={{ headerShown: false }} />
        <Stack.Screen
          name="Contatos"
          component={Tela2}
          options={({ navigation }) => ({
            title: "Lista de Contatos",
            headerRight: () => (
              <Icon
                name="add"
                size={28}
                color="black"
                containerStyle={{ marginRight: 15 }}
                onPress={() => navigation.navigate('CadContato')}
              />
            )
          })}
        />
        <Stack.Screen name="CadUsuarios" component={Tela3} options={{ title: 'Cadastro de Usuário' }} />
        <Stack.Screen name="CadContato" component={Tela4} options={{ title: 'Cadastro de Contato' }} />
        <Stack.Screen name="AlterContato" component={Tela5} options={{ title: 'Editar Contato' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: 'gray',
    width: 200,
    marginTop: 10,
    alignSelf: 'center',
  },
});
