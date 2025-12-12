import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { askGemini } from "../lib/gemini";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  const handleSearch = async () => {
    const prompt = `Kullanıcı yemek tarifi arıyor: ${query}. Ona uygun bir tarif öner.`;

    const response = await askGemini(prompt);

    setAiResponse(response);
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        placeholder="Yemek veya malzeme ara..."
        value={query}
        onChangeText={setQuery}
        style={{
          backgroundColor: "#eee",
          padding: 12,
          borderRadius: 10,
        }}
      />

      <TouchableOpacity
        onPress={handleSearch}
        style={{
          backgroundColor: "orange",
          padding: 12,
          borderRadius: 10,
          marginTop: 10,
        }}
      >
        <Text style={{ textAlign: "center", color: "#fff", fontSize: 16 }}>
          AI ile Ara 🔍
        </Text>
      </TouchableOpacity>

      {aiResponse ? (
        <Text style={{ marginTop: 20, fontSize: 15 }}>{aiResponse}</Text>
      ) : null}
    </View>
  );
}
