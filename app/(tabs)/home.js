import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "expo-router";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [tarifler, setTarifler] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      alert("Lütfen malzeme veya yemek adı girin!");
      return;
    }

    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Kullanıcının isteği: "${query}"

Lütfen bu isteğe göre 3 Türk mutfağı tarifi öner. Her tarif için:
- Tarif adı
- Malzemeler (virgülle ayrılmış)
- Yapım süresi (örn: 30 dakika)
- Zorluk seviyesi (Kolay/Orta/Zor)
- Kısa yapılış açıklaması (2-3 adım)

SADECE JSON formatında yanıt ver:
[
  {
    "ad": "Tavuklu Pilav",
    "malzemeler": "tavuk, pirinç, soğan, tereyağı",
    "sure": "30 dakika",
    "zorluk": "Kolay",
    "yapilis": "1. Tavukları haşlayın. 2. Pirinçleri yıkayın. 3. Tüm malzemeleri tencereye koyup pişirin."
  }
]`;

      const result = await model.generateContent(prompt);
      let aiYanit = result.response.text();

      // JSON formatını temizle
      aiYanit = aiYanit.replace(/```json/g, "").replace(/```/g, "").trim();
      const tarifListesi = JSON.parse(aiYanit);
      setTarifler(tarifListesi);
    } catch (error) {
      console.error("AI Hatası:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Hoşgeldin 👋</Text>
          <Text style={styles.subtitle}>{auth.currentUser?.email}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <Text style={styles.searchTitle}>Ne Pişirmek İstersin?</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Örn: Elimde tavuk ve patates var"
            value={query}
            onChangeText={setQuery}
            multiline
          />
        </View>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="sparkles" size={20} color="#fff" />
              <Text style={styles.searchButtonText}>AI ile Tarif Bul</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Loading */}
      {loading && (
        <View style={styles.loadingBox}>
          <Text style={styles.loadingText}>AI tarifler hazırlıyor... ✨</Text>
        </View>
      )}

      {/* Tarifler */}
      {tarifler.length > 0 && (
        <View style={styles.recipesSection}>
          <Text style={styles.recipesTitle}>🍽️ Önerilen Tarifler</Text>
          {tarifler.map((tarif, index) => (
            <View key={index} style={styles.recipeCard}>
              <View style={styles.recipeHeader}>
                <Text style={styles.recipeName}>{tarif.ad}</Text>
                <View style={styles.recipeBadge}>
                  <Text style={styles.recipeBadgeText}>{tarif.zorluk}</Text>
                </View>
              </View>

              <View style={styles.recipeInfo}>
                <View style={styles.infoItem}>
                  <Ionicons name="time-outline" size={16} color="#666" />
                  <Text style={styles.infoText}>{tarif.sure}</Text>
                </View>
              </View>

              <Text style={styles.recipeLabel}>Malzemeler:</Text>
              <Text style={styles.recipeIngredients}>{tarif.malzemeler}</Text>

              <Text style={styles.recipeLabel}>Yapılışı:</Text>
              <Text style={styles.recipeSteps}>{tarif.yapilis}</Text>

              <TouchableOpacity style={styles.saveButton}>
                <Ionicons name="bookmark-outline" size={20} color="#FF725E" />
                <Text style={styles.saveButtonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Empty State */}
      {!loading && tarifler.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="restaurant-outline" size={80} color="#ddd" />
          <Text style={styles.emptyText}>
            Elindeki malzemeleri yaz, AI sana özel tarifler önersin! 🎯
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  logoutBtn: {
    backgroundColor: "#ff4444",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  searchSection: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#1a1a1a",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 100,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#1a1a1a",
    textAlignVertical: "top",
  },
  searchButton: {
    flexDirection: "row",
    backgroundColor: "#FF725E",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    gap: 8,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  loadingBox: {
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  recipesSection: {
    padding: 16,
  },
  recipesTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    color: "#1a1a1a",
  },
  recipeCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  recipeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  recipeName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    flex: 1,
  },
  recipeBadge: {
    backgroundColor: "#fff3e0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  recipeBadgeText: {
    color: "#f57c00",
    fontSize: 12,
    fontWeight: "600",
  },
  recipeInfo: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
  },
  recipeLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a1a",
    marginTop: 12,
    marginBottom: 6,
  },
  recipeIngredients: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  recipeSteps: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FF725E",
  },
  saveButtonText: {
    color: "#FF725E",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
    lineHeight: 24,
  },
});