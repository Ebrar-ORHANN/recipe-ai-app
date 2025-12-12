import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Step2() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/onboarding2.png")}
        style={styles.image}
      />

      <Text style={styles.title}>
        Ne pişireceğini bilmiyor musun? ChefMate malzemelere göre anında tarif önerir.
      </Text>

      <TouchableOpacity
        onPress={() => router.push("/onboarding/step4")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>İleri</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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

    // Gölge (iOS)
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,

    // Android gölge
    elevation: 5,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
