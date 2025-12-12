import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "@/firebase/firebaseConfig";
import { useState, useEffect } from "react";

export default function Profile() {
  const [savedRecipes, setSavedRecipes] = useState([
    // Örnek veri - Gerçek uygulamada Firebase'den gelecek
    {
      id: 1,
      ad: "Tavuklu Pilav",
      sure: "30 dakika",
      zorluk: "Kolay",
      kategori: "Ana Yemek",
    },
    {
      id: 2,
      ad: "Mercimek Çorbası",
      sure: "25 dakika",
      zorluk: "Çok Kolay",
      kategori: "Çorba",
    },
    {
      id: 3,
      ad: "Karnıyarık",
      sure: "60 dakika",
      zorluk: "Orta",
      kategori: "Ana Yemek",
    },
  ]);

  const user = auth.currentUser;

  const kategoriler = ["Hepsi", "Ana Yemek", "Çorba", "Tatlı", "Salata"];
  const [selectedCategory, setSelectedCategory] = useState("Hepsi");

  const filteredRecipes =
    selectedCategory === "Hepsi"
      ? savedRecipes
      : savedRecipes.filter((recipe) => recipe.kategori === selectedCategory);

  const deleteRecipe = (id) => {
    setSavedRecipes(savedRecipes.filter((recipe) => recipe.id !== id));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#FF725E" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user?.displayName || "Kullanıcı"}
            </Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{savedRecipes.length}</Text>
          <Text style={styles.statLabel}>Kayıtlı Tarif</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Yapılan Tarif</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Favoriler</Text>
        </View>
      </View>

      {/* Category Filter */}
      <View style={styles.filterSection}>
        <Text style={styles.sectionTitle}>Tariflerim</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {kategoriler.map((kategori) => (
            <TouchableOpacity
              key={kategori}
              style={[
                styles.categoryChip,
                selectedCategory === kategori && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(kategori)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === kategori &&
                    styles.categoryChipTextActive,
                ]}
              >
                {kategori}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Saved Recipes */}
      <View style={styles.recipesContainer}>
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <View key={recipe.id} style={styles.recipeCard}>
              <View style={styles.recipeImagePlaceholder}>
                <Ionicons name="restaurant" size={40} color="#FF725E" />
              </View>
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeName}>{recipe.ad}</Text>
                <View style={styles.recipeDetails}>
                  <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={14} color="#666" />
                    <Text style={styles.detailText}>{recipe.sure}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="bar-chart-outline" size={14} color="#666" />
                    <Text style={styles.detailText}>{recipe.zorluk}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteRecipe(recipe.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#ff4444" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={80} color="#ddd" />
            <Text style={styles.emptyText}>
              Bu kategoride kayıtlı tarif yok
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 60,
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff3e0",
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FF725E",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#e0e0e0",
  },
  filterSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  categoryScroll: {
    marginTop: 8,
  },
  categoryChip: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryChipActive: {
    backgroundColor: "#FF725E",
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  categoryChipTextActive: {
    color: "#fff",
  },
  recipesContainer: {
    padding: 16,
    paddingTop: 0,
  },
  recipeCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  recipeImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: "#fff3e0",
    justifyContent: "center",
    alignItems: "center",
  },
  recipeInfo: {
    flex: 1,
    marginLeft: 16,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  recipeDetails: {
    flexDirection: "row",
    gap: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: "#666",
  },
  deleteButton: {
    padding: 8,
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
    marginTop: 16,
  },
});
