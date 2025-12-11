import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, {useState} from 'react'
import { useRouter  } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

export default function login() {
const router = useRouter();
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')

const handleLogin = async () => {
  if(!email || !password){
    Alert.alert('Hata', 'Lütfen e-posta ve şifre gir')
    return
  }
  try {
    await signInWithEmailAndPassword (auth,email,password);
    router.replace('/(tabs)/home')

  }
  catch (error){
 Alert.alert('Giriş Başarısız', error.message);
  }
  
}
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GİRİŞ YAP</Text>
      
      <TextInput
        placeholder="E-posta"
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
        style ={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        keyboardType='numeric'
        secureTextEntry={true}
        style ={styles.input}
      />

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </Pressable>

      <Pressable onPress={() => router.push ('/(tabs)/register')}>
        <Text style={styles.link}>Hesabın yok mu? </Text>
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
    backgroundColor: '#ff914d',
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
    color: '#ff914d',
    textAlign: 'center',
    marginTop: 15,
  },
})