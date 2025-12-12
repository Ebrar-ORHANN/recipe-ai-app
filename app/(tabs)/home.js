import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "expo-router";

import SearchBar from "@/components/SearchBar";
import CategoryItem from "@/components/CategoryItem";

import TodaySuggestion from "@/components/TodaySuggestion";

export default function Home() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  return (
    <ScrollView style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.title}>Hoşgeldin 👋</Text>
      <Text style={styles.subtitle}>
        {auth.currentUser?.email}
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
      <SearchBar />
      <TodaySuggestion />
      <Text style = {styles.sectionTitle}>Kategoriler</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <CategoryItem title = "Tatlılar" icon = "ice-cream-outline"/>
        <CategoryItem title="Çorbalar" icon="restaurant-outline"/>
        <CategoryItem title="Et Yemekleri" icon="flame-outline"/>
        <CategoryItem title="Hamur İşleri" icon="pizza-outline"/>

      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
  header: { marginTop: 40, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: "bold" },
  subtitle: { fontSize: 16, color: "#444" },
  logoutBtn: {
    position: "absolute",
    right: 0,
    top: 10,
    backgroundColor: "tomato",
    padding: 10,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 10,
  },
});