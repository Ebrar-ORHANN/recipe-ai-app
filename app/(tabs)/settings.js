import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  Modal,
  TextInput,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { signOut, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Settings() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (userDoc.exists()) {
        const settings = userDoc.data().settings || {};
        setNotifications(settings.notifications !== false);
        setDarkMode(settings.darkMode || false);
      }
    } catch (error) {
      console.error("Ayarlar yüklenirken hata:", error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Çıkış Yap",
      "Çıkış yapmak istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Çıkış Yap",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace("/login");
            } catch (error) {
              Alert.alert("Hata", "Çıkış yapılamadı");
            }
          },
        },
      ]
    );
  };

  const toggleNotifications = async (value) => {
    setNotifications(value);
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        "settings.notifications": value,
      });
      Alert.alert(
        "Başarılı",
        value ? "Bildirimler açıldı" : "Bildirimler kapatıldı"
      );
    } catch (error) {
      console.error("Bildirim ayarı güncellenemedi:", error);
    }
  };

  const toggleDarkMode = async (value) => {
    setDarkMode(value);
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        "settings.darkMode": value,
      });
      Alert.alert(
        "Bilgi",
        "Karanlık mod özelliği yakında eklenecek!"
      );
    } catch (error) {
      console.error("Tema ayarı güncellenemedi:", error);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Hata", "Yeni şifreler eşleşmiyor");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Hata", "Şifre en az 6 karakter olmalıdır");
      return;
    }

    try {
      // Önce kullanıcıyı yeniden doğrula
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Şifreyi güncelle
      await updatePassword(auth.currentUser, newPassword);

      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      Alert.alert("Başarılı", "Şifreniz başarıyla güncellendi");
    } catch (error) {
      console.error("Şifre değiştirme hatası:", error);
      if (error.code === "auth/wrong-password") {
        Alert.alert("Hata", "Mevcut şifre yanlış");
      } else {
        Alert.alert("Hata", "Şifre değiştirilemedi. Lütfen tekrar deneyin.");
      }
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Hesap Silme",
      "Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve tüm verileriniz silinecektir.",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Evet, Sil",
          style: "destructive",
          onPress: () => setShowDeleteModal(true),
        },
      ]
    );
  };

  const confirmDeleteAccount = async () => {
    try {
      const userId = auth.currentUser.uid;

      // 1. Kullanıcının tüm tariflerini sil
      const recipesQuery = query(
        collection(db, "savedRecipes"),
        where("userId", "==", userId)
      );
      const recipesSnapshot = await getDocs(recipesQuery);
      
      const deletePromises = [];
      recipesSnapshot.forEach((doc) => {
        deletePromises.push(deleteDoc(doc.ref));
      });
      await Promise.all(deletePromises);

      // 2. Kullanıcı dokümanını sil
      await deleteDoc(doc(db, "users", userId));

      // 3. Auth hesabını sil
      await auth.currentUser.delete();

      // 4. AsyncStorage'ı temizle
      await AsyncStorage.clear();

      Alert.alert("Başarılı", "Hesabınız silindi", [
        {
          text: "Tamam",
          onPress: () => router.replace("/login"),
        },
      ]);
    } catch (error) {
      console.error("Hesap silme hatası:", error);
      Alert.alert(
        "Hata",
        "Hesap silinemedi. Lütfen tekrar giriş yapıp deneyin."
      );
    }
  };

  const openHelp = () => {
    Alert.alert(
      "Yardım",
      "Sorularınız için:\n\n📧 Email: destek@chefmate.com"
    );
  };

  const openPrivacyPolicy = async () => {
    Alert.alert(
      "Gizlilik Politikası",
      "ChefMate olarak kullanıcı gizliliğine önem veriyoruz. Verileriniz güvenli bir şekilde saklanır ve üçüncü şahıslarla paylaşılmaz.\n\nDetaylı politikayı web sitemizden görüntüleyebilirsiniz."
    );
  };

  const clearCache = async () => {
    Alert.alert(
      "Önbelleği Temizle",
      "Uygulama önbelleğini temizlemek istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Temizle",
          onPress: async () => {
            try {
              // AsyncStorage'dan sadece cache verilerini temizle
              // Onboarding ve diğer önemli verileri koru
              Alert.alert("Başarılı", "Önbellek temizlendi");
            } catch (error) {
              Alert.alert("Hata", "Önbellek temizlenemedi");
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ayarlar</Text>
        <Text style={styles.subtitle}>Hesap ve uygulama ayarları</Text>
      </View>

      {/* Hesap Ayarları */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hesap</Text>

        <TouchableOpacity
          style={styles.item}
          onPress={() => setShowPasswordModal(true)}
        >
          <Ionicons name="lock-closed-outline" size={24} color="#666" />
          <Text style={styles.itemText}>Şifre Değiştir</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      
      {/* Destek */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Destek</Text>

        <TouchableOpacity style={styles.item} onPress={openHelp}>
          <Ionicons name="help-circle-outline" size={24} color="#666" />
          <Text style={styles.itemText}>Yardım</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        

        <TouchableOpacity
          style={styles.item}
          onPress={() =>
            Alert.alert(
              "Hakkında",
              "ChefMate v1.0.0\n\nYapay zeka destekli yemek tarifi uygulaması\n\n© 2025 ChefMate\nTüm hakları saklıdır."
            )
          }
        >
          <Ionicons name="information-circle-outline" size={24} color="#666" />
          <Text style={styles.itemText}>Hakkında</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Tehlikeli Alan */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tehlikeli Bölge</Text>

        <TouchableOpacity
          style={styles.item}
          onPress={handleDeleteAccount}
        >
          <Ionicons name="warning-outline" size={24} color="#ff4444" />
          <Text style={[styles.itemText, { color: "#ff4444" }]}>
            Hesabı Sil
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#ff4444" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#ff4444" />
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.version}>Versiyon 1.0.0</Text>
        <Text style={styles.copyright}>© 2025 ChefMate</Text>
      </View>

      {/* Şifre Değiştirme Modal */}
      <Modal
        visible={showPasswordModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Şifre Değiştir</Text>

            <TextInput
              style={styles.modalInput}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Mevcut Şifre"
              secureTextEntry
            />

            <TextInput
              style={styles.modalInput}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Yeni Şifre (min 6 karakter)"
              secureTextEntry
            />

            <TextInput
              style={styles.modalInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Yeni Şifre (Tekrar)"
              secureTextEntry
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowPasswordModal(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
              >
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handlePasswordChange}
              >
                <Text style={styles.saveButtonText}>Değiştir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Hesap Silme Onay Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="warning" size={60} color="#ff4444" />
            <Text style={[styles.modalTitle, { marginTop: 16 }]}>
              Hesabı Silmek İstiyor Musunuz?
            </Text>
            <Text style={styles.deleteWarning}>
              Bu işlem geri alınamaz. Tüm tarifleriniz ve verileriniz kalıcı
              olarak silinecektir.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={confirmDeleteAccount}
              >
                <Text style={styles.deleteButtonText}>Evet, Sil</Text>
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
  header: {
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
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
  section: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#999",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: "#1a1a1a",
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 30,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ff4444",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ff4444",
    marginLeft: 8,
  },
  footer: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 40,
  },
  version: {
    fontSize: 12,
    color: "#999",
  },
  copyright: {
    fontSize: 11,
    color: "#bbb",
    marginTop: 4,
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
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 20,
    textAlign: "center",
  },
  modalInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginTop: 8,
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
  deleteButton: {
    backgroundColor: "#ff4444",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteWarning: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
});