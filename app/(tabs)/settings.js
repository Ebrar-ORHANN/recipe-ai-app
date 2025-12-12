import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';
import { useRouter } from 'expo-router';

export default function Settings() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/login');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ayarlar</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hesap</Text>
        
        <TouchableOpacity style={styles.item}>
          <Ionicons name="person-outline" size={24} color="#666" />
          <Text style={styles.itemText}>Profil Bilgileri</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <Ionicons name="lock-closed-outline" size={24} color="#666" />
          <Text style={styles.itemText}>Şifre Değiştir</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Uygulama</Text>
        
        <TouchableOpacity style={styles.item}>
          <Ionicons name="notifications-outline" size={24} color="#666" />
          <Text style={styles.itemText}>Bildirimler</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <Ionicons name="moon-outline" size={24} color="#666" />
          <Text style={styles.itemText}>Tema</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Destek</Text>
        
        <TouchableOpacity style={styles.item}>
          <Ionicons name="help-circle-outline" size={24} color="#666" />
          <Text style={styles.itemText}>Yardım</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <Ionicons name="document-text-outline" size={24} color="#666" />
          <Text style={styles.itemText}>Gizlilik Politikası</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#ff4444" />
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Versiyon 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  section: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 30,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff4444',
    marginLeft: 8,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    marginTop: 30,
    marginBottom: 40,
  },
});