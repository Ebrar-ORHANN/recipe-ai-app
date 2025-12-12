import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Ionicons } from "@expo/vector-icons";

export default function CategoryItem({ title, icon }) {
  return (
     <View style={styles.box}>
      <Ionicons name={icon} size={28} color="#fff" />
      <Text style={styles.text}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
     box: {
    backgroundColor: "#ff7f50",
    padding: 16,
    borderRadius: 20,
    marginRight: 10,
    alignItems: "center",
  },
  text: { marginTop: 5, color: "#fff", fontWeight: "bold" },
})