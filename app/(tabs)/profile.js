import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "@/firebase/firebaseConfig";
import { useState, useEffect, useCallback } from "react";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc,
  updateDoc,
  setDoc,
  getDoc 
} from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";

export default function Profile() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Hepsi");
  const [showEditModal, setShowEditModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [editingName, setEditingName] = useState("");
  const [stats, setStats] = useState({
    saved: 0,
    completed: 0,
    favorites: 0
  });

  const user = auth.currentUser;
  const kategoriler = ["Hepsi", "Ana Yemek", "Çorba", "Tatlı", "Salata", "Ara Öğün"];

  // Sayfa her açıldığında tarifleri yenile
  useFocusEffect(
    useCallback(() => {
      loadUserData();
      loadSavedRecipes();
    }, [])
  );

  useEffect(() => {
    loadUserData();
    loadSavedRecipes();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadSavedRecipes();
    setRefreshing(false);
  }, []);

  const loadUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserName(userData.displayName || user.email?.split('@')[0] || "Kullanıcı");
      } else {
        // İlk kez giriş yapıyorsa varsayılan veri oluştur
        const defaultName = user.email?.split('@')[0] || "Kullanıcı";
        await setDoc(doc(db, "users", user.uid), {
          displayName: defaultName,
          email: user.email,
          savedCount: 0,
          completedCount: 0,
          favoritesCount: 0,
          createdAt: new Date()
        });
        setUserName(defaultName);
      }
    } catch (error) {
      console.error("Kullanıcı verileri yüklenirken hata:", error);
    }
  };

  const loadSavedRecipes = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "savedRecipes"),
        where("userId", "==", user.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const recipes = [];
      
      querySnapshot.forEach((doc) => {
        recipes.push({ id: doc.id, ...doc.data() });
      });
      
      // Tarihe göre sırala (en yeni önce)
      recipes.sort((a, b) => {
        const aTime = a.createdAt?.toMillis() || 0;
        const bTime = b.createdAt?.toMillis() || 0;
        return bTime - aTime;
      });
      
      setSavedRecipes(recipes);
      
      // İstatistikleri hesapla
      const completedCount = recipes.filter(r => r.isCompleted).length;
      const favoritesCount = recipes.filter(r => r.isFavorite).length;
      
      setStats({
        saved: recipes.length,
        completed: completedCount,
        favorites: favoritesCount
      });
      
      // İstatistikleri Firestore'da güncelle
      await updateDoc(doc(db, "users", user.uid), {
        savedCount: recipes.length,
        completedCount: completedCount,
        favoritesCount: favoritesCount
      });
      
    } catch (error) {
      console.error("Tarifler yüklenirken hata:", error);
      Alert.alert("Hata", "Tarifler yüklenemedi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecipe = async (recipeId) => {
    Alert.alert(
      "Tarif Silinecek",
      "Bu tarifi silmek istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "savedRecipes", recipeId));
              
              // Listeyi güncelle
              const updatedRecipes = savedRecipes.filter((r) => r.id !== recipeId);
              setSavedRecipes(updatedRecipes);
              
              // İstatistikleri güncelle
              const completedCount = updatedRecipes.filter(r => r.isCompleted).length;
              const favoritesCount = updatedRecipes.filter(r => r.isFavorite).length;
              
              setStats({
                saved: updatedRecipes.length,
                completed: completedCount,
                favorites: favoritesCount
              });
              
              await updateDoc(doc(db, "users", user.uid), {
                savedCount: updatedRecipes.length,
                completedCount: completedCount,
                favoritesCount: favoritesCount
              });
              
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

  const toggleFavorite = async (recipeId) => {
    try {
      const recipe = savedRecipes.find(r => r.id === recipeId);
      const newFavoriteStatus = !recipe.isFavorite;
      
      await updateDoc(doc(db, "savedRecipes", recipeId), {
        isFavorite: newFavoriteStatus
      });
      
      const updatedRecipes = savedRecipes.map(r => 
        r.id === recipeId ? { ...r, isFavorite: newFavoriteStatus } : r
      );
      setSavedRecipes(updatedRecipes);
      
      // Favori sayısını güncelle
      const favoriteCount = updatedRecipes.filter(r => r.isFavorite).length;
      
      setStats(prev => ({ ...prev, favorites: favoriteCount }));
      
      await updateDoc(doc(db, "users", user.uid), {
        favoritesCount: favoriteCount
      });
      
    } catch (error) {
      console.error("Favori güncelleme hatası:", error);
      Alert.alert("Hata", "Favori durumu güncellenemedi");
    }
  };

  const markAsCompleted = async (recipeId) => {
    try {
      const recipe = savedRecipes.find(r => r.id === recipeId);
      const newCompletedStatus = !recipe.isCompleted;
      
      await updateDoc(doc(db, "savedRecipes", recipeId), {
        isCompleted: newCompletedStatus,
        completedAt: newCompletedStatus ? new Date() : null
      });
      
      const updatedRecipes = savedRecipes.map(r => 
        r.id === recipeId ? { ...r, isCompleted: newCompletedStatus } : r
      );
      setSavedRecipes(updatedRecipes);
      
      // Tamamlanan sayısını güncelle
      const completedCount = updatedRecipes.filter(r => r.isCompleted).length;
      
      setStats(prev => ({ ...prev, completed: completedCount }));
      
      await updateDoc(doc(db, "users", user.uid), {
        completedCount: completedCount
      });
      
      Alert.alert(
        "Başarılı", 
        newCompletedStatus ? "Tarif tamamlandı olarak işaretlendi! 🎉" : "Tamamlanmadı olarak işaretlendi"
      );
      
    } catch (error) {
      console.error("Tamamlama durumu güncelleme hatası:", error);
      Alert.alert("Hata", "Durum güncellenemedi");
    }
  };

  const updateUserName = async () => {
    if (!editingName.trim()) {
      Alert.alert("Hata", "İsim boş olamaz");
      return;
    }
    
    try {
      await updateDoc(doc(db, "users", user.uid), {
        displayName: editingName.trim()
      });
      
      setUserName(editingName.trim());
      setShowEditModal(false);
      Alert.alert("Başarılı", "İsim güncellendi");
    } catch (error) {
      console.error("İsim güncelleme hatası:", error);
      Alert.alert("Hata", "İsim güncellenemedi");
    }
  };

  const filteredRecipes = selectedCategory === "Hepsi"
    ? savedRecipes
    : savedRecipes.filter((recipe) => recipe.kategori === selectedCategory);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF725E" />
        <Text style={styles.loadingText}>Tarifler yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#FF725E" />
          </View>
          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{userName}</Text>
              <TouchableOpacity 
                onPress={() => {
                  setEditingName(userName);
                  setShowEditModal(true);
                }}
              >
                <Ionicons name="pencil" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.saved}</Text>
          <Text style={styles.statLabel}>Kayıtlı Tarif</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Yapılan Tarif</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.favorites}</Text>
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
                  selectedCategory === kategori && styles.categoryChipTextActive,
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
                {recipe.isCompleted && (
                  <View style={styles.completedBadge}>
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  </View>
                )}
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
              
              <View style={styles.recipeActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => toggleFavorite(recipe.id)}
                >
                  <Ionicons 
                    name={recipe.isFavorite ? "heart" : "heart-outline"} 
                    size={20} 
                    color={recipe.isFavorite ? "#ff4444" : "#666"} 
                  />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => markAsCompleted(recipe.id)}
                >
                  <Ionicons 
                    name={recipe.isCompleted ? "checkmark-circle" : "checkmark-circle-outline"} 
                    size={20} 
                    color={recipe.isCompleted ? "#4CAF50" : "#666"} 
                  />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => deleteRecipe(recipe.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#ff4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={80} color="#ddd" />
            <Text style={styles.emptyText}>
              {selectedCategory === "Hepsi" 
                ? "Henüz kayıtlı tarif yok" 
                : `Bu kategoride kayıtlı tarif yok`}
            </Text>
            <Text style={styles.emptySubtext}>
              Ana sayfadan tariflerinizi kaydedin
            </Text>
          </View>
        )}
      </View>

      {/* Edit Name Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>İsim Düzenle</Text>
            
            <TextInput
              style={styles.modalInput}
              value={editingName}
              onChangeText={setEditingName}
              placeholder="Yeni isminiz"
              autoFocus
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={updateUserName}
              >
                <Text style={styles.saveButtonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginTop: 12,
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
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
    position: "relative",
  },
  completedBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#fff",
    borderRadius: 10,
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
  recipeActions: {
    flexDirection: "column",
    gap: 8,
  },
  actionButton: {
    padding: 4,
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
  },
  emptySubtext: {
    fontSize: 14,
    color: "#bbb",
    marginTop: 8,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 20,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#FF725E",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});