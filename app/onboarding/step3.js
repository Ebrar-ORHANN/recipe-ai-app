import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Step3() {
  const router = useRouter();

  const finish = async () => {
    await AsyncStorage.setItem("onboardingDone", "true");
    router.replace("/login");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Onboarding 3</Text>

      <TouchableOpacity onPress={finish} style={{ marginTop: 30 }}>
        <Text style={{ color: "blue" }}>Başla</Text>
      </TouchableOpacity>
    </View>
  );
}
