export const generateRecipe = async (query) => {
  try {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_KEY;

    const prompt = `
Kullanıcının isteği: "${query}"

3 tane Türk mutfağı tarifi öner.
Sadece aşağıdaki JSON formatında cevap ver:

[
  {
    "ad": "string",
    "malzemeler": "string",
    "sure": "string",
    "zorluk": "string",
    "yapilis": "string"
  }
]
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" +
        apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("GELEN CEVAP:", data);

    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) return [];

    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(text);
  } catch (error) {
    console.error("❌ Gemini Fetch Hatası:", error);
    return [];
  }
};
