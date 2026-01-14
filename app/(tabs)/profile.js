import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "@/firebase/firebaseConfig";
import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";

export default function Profile() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  const kategoriler = ["Hepsi", "Ana Yemek", "Çorba", "Tatlı", "Salata", "Genel"];
  const [selectedCategory, setSelectedCategory] = useState("Hepsi");

  // Firebase'den tarifleri çek
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "savedRecipes"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const recipes = [];
      querySnapshot.forEach((doc) => {
        recipes.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setSavedRecipes(recipes);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredRecipes =
    selectedCategory === "Hepsi"
      ? savedRecipes
      : savedRecipes.filter((recipe) => recipe.kategori === selectedCategory);

  const deleteRecipe = async (id) => {
    Alert.alert(
      "Tarifi Sil",
      "Bu tarifi silmek istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "savedRecipes", id));
              Alert.alert("Başarılı", "Tarif silindi");
            } catch (error) {
              console.error("Silme hatası:", error);
              Alert.alert("Hata", "Tarif silinemedi");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF725E" />
        <Text style={styles.loadingText}>Tarifler yükleniyor...</Text>
      </View>
    );
  }

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
          <Text style={styles.statNumber}>
            {savedRecipes.filter(r => r.kategori === "Ana Yemek").length}
          </Text>
          <Text style={styles.statLabel}>Ana Yemek</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>
            {savedRecipes.filter(r => r.kategori === "Tatlı").length}
          </Text>
          <Text style={styles.statLabel}>Tatlı</Text>
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
                <Text style={styles.categoryBadge}>{recipe.kategori}</Text>
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
              {selectedCategory === "Hepsi" 
                ? "Henüz kayıtlı tarif yok.\nAna sayfadan tarif kaydetmeye başlayın!"
                : `Bu kategoride kayıtlı tarif yok`}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
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
    textAlign: "center",
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
    marginBottom: 4,
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
  categoryBadge: {
    fontSize: 11,
    color: "#FF725E",
    backgroundColor: "#fff3e0",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 4,
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
    textAlign: "center",
    lineHeight: 24,
  },
});