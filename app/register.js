import { Pressable, StyleSheet, Text, TextInput, View, Alert} from 'react-native'
import React, {useState} from 'react'
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

export default function register() {
const router = useRouter();

const [name, setName] = useState('')
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')

const handleRegister = async () => {
    if (!email || !password || !name) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldur');
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Başarılı', 'Hesap oluşturuldu');
      router.replace('/(tabs)/home');
    } catch (error) {
      Alert.alert('Kayıt Hatası', error.message);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kayıt Ol</Text>
    
    <TextInput
    placeholder='Ad Soyad'
    value={name}
    onChangeText={setName}
    style ={styles.input}
    />
     <TextInput
    placeholder='E-posta'
    value={email}
    onChangeText={setEmail}
    keyboardType='email-address'
    style={styles.input}
    />
     <TextInput
    
    placeholder='Şifre'
    value={password}
    onChangeText={setPassword}
    secureTextEntry={true}
    keyboardType='numeric'
    style ={styles.input}
    />
    <Pressable style={styles.button} onPress ={handleRegister}>
        <Text style={styles.buttonText}>Hesap Oluştur</Text>
    </Pressable>
    <Pressable onPress={() => router.push ('/login')}>
        <Text style={styles.link}>Zaten bir hesabın var mı?</Text>
    </Pressable>


    </View>
  )
}

const styles = StyleSheet.create({
     container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#FF725E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  link: {
    color: '#000000ff',
    textAlign: 'center',
    marginTop: 15,
  },
})