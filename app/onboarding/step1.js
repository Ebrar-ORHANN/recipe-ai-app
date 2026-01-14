import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import {useRouter} from "expo-router"

export default function step1() {

    const router = useRouter();
  return (
    <View style={styles.container}>
      <Image
        source = {require ("../../assets/images/ChatGPT Image 14 Oca 2026 19_17_30-Photoroom.png")}
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
  {
     flex: 1, alignItems: "center", justifyContent: "center" },
  image:
  { width: 350, height: 350 },
  title:
  { fontSize: 24, fontWeight: "bold", marginTop: 20 },
  button:
  { marginTop: 40,
    paddingVertical: 14,
    paddingHorizontal: 40,
    backgroundColor: "#000",
    borderRadius: 12,

    // iOS Shadow
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,

    // Android Shadow
    elevation: 4,
    },
button_title:
  {color: "white",
    fontSize: 16,
    fontWeight: "600",
  }
})