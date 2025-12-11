import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import {useRouter} from "expo-router"

export default function step1() {

    const router = useRouter();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Image
        source = {require ("../../assets/images/onbording1.png")}
        style={{ width: 250, height: 250 }}
      />
      <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 20 }}> HOŞGELDİNİZ </Text>
      <TouchableOpacity 
      onPress = {() => router.push ("/onboarding/step2")}
      style={{ marginTop: 40, padding: 12, backgroundColor: "black", borderRadius: 8 }} >
      
       <Text style={{ color: "white" }}>İleri</Text>
      </TouchableOpacity>
    </View>
        
  )
}

const styles = StyleSheet.create({})