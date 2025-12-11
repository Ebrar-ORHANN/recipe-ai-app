import { View, Text, Image, TouchableOpacity,StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function step2() {
    const router = useRouter();
  return (
     <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Image
        source={require("../../assets/images/onboarding2.png")}
        style={{ width: 250, height: 250 }}
      />

      <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 20 }}>
        Tarif oluşturmayı kolaylaştır!
      </Text>

      <TouchableOpacity
        onPress={() => router.push("/onboarding/step3")}
        style={{ marginTop: 40, padding: 12, backgroundColor: "black", borderRadius: 8 }}
      >
        <Text style={{ color: "white" }}>İleri</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({})