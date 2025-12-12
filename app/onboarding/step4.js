import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Step4() {
  const router = useRouter();

  const finish = async () => {
    await AsyncStorage.setItem("onboardingDone", "true");
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/onboarding3.png")}
        style={styles.image}
      />

      <Text style={styles.title}>
        Tariflerini düzenle, koleksiyon oluştur ve kendi lezzet dünyanı kur.
      </Text>

      <TouchableOpacity onPress={finish} style={styles.button}>
        <Text style={styles.buttonText}>Başla</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
  },

  image: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    color: "#1A1A1A",
    marginTop: 24,
    lineHeight: 34,
  },

  button: {
    marginTop: 40,
    paddingVertical: 14,
    paddingHorizontal: 40,
    backgroundColor: "#000",
    borderRadius: 12,

    // iOS shadow
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,

    // Android elevation
    elevation: 5,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
