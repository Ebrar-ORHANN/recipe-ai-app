import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import {useRouter} from "expo-router"

export default function step1() {

    const router = useRouter();
  return (
    <View style={styles.container}>
      <Image
        source = {require ("../../assets/images/Gemini_Generated_Image_qctldpqctldpqctl-removebg-preview.png")}
        style={styles.image}
      />
      
      <TouchableOpacity 
      onPress = {() => router.push ("/onboarding/step2")}
      style={styles.button} >
      
       <Text style={styles.button_title}>İleri</Text>
      </TouchableOpacity>
    </View>
        
  )
}

const styles = StyleSheet.create({
  container:
  { flex: 1, alignItems: "center", justifyContent: "center" },
  image:
  { width: 350, height: 350 },
  title:
  { fontSize: 24, fontWeight: "bold", marginTop: 20 },
  button:
  { marginTop: 40, padding: 12, backgroundColor: "black", borderRadius: 8 },
button_title:
  { color: "white" }
})