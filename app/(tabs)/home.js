import { View, Text, TouchableOpacity } from 'react-native';
import { auth } from "@/firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await signOut (auth);
      router.replace("/login")
    }
    catch(error){
      console.log(error)
    }
  }
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Home Screen</Text>
      <TouchableOpacity
       onPress={handleLogout}
        style={{
          backgroundColor: "orange",
          padding: 15,
          borderRadius: 10,
          marginTop: 20,
        }}>
         <Text style={{ textAlign: "center", color: "white", fontWeight: "bold" }}>
          Çıkış Yap
        </Text>
      </TouchableOpacity>
    </View>
  );
}
