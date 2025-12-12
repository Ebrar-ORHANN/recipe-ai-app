import { StyleSheet, Text, View,Image } from 'react-native'
import React from 'react'

export default function TodaySuggestion() {
  return (
    <View style= {styles.box}>
      <Image 
      source = {{uri: "https://picsum.photos/200" }}
      style={styles.img}
       />
       <View>
        <Text style={styles.title}>Bugünün Önerisi</Text>
        <Text style={styles.desc}>Kremalı Tavuklu Makarna</Text>
        <Text style={styles.details}>Hazırlama: 20 dk</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
      box: {
    flexDirection: "row",
    backgroundColor: "#ffe4d1",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  img: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 15,
  },
  title: { fontSize: 16, fontWeight: "bold" },
  desc: { fontSize: 14, marginTop: 4 },
  details: { color: "#666", marginTop: 4 },
})