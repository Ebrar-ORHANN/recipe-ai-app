import Constants from 'expo-constants';

// API key'i expo-constants üzerinden al
const API_KEY = Constants.expoConfig?.extra?.geminiApiKey;

console.log("API Key loaded:", API_KEY ? "✅ Var" : "❌ Yok");

export const generateRecipe = async (query) => {
  try {
    if (!API_KEY) {
      console.error("⚠️ GEMINI_API_KEY bulunamadı!");
      return [];
    }

    const prompt = `
    Kullanıcının isteği: "${query}"

    3 tane Türk mutfağı tarifi öner.
    Sadece aşağıdaki JSON formatında cevap ver (Markdown, code block veya açıklama yazma, sadece saf JSON):

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

    console.log("🔍 API'ye istek gönderiliyor (Model: gemini-2.5-flash)...");

    // ✅ LİSTENDEN ALDIĞIMIZ KESİN MODEL İSMİ:
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ API Hatası:", errorData);
      throw new Error(errorData.error?.message || "API isteği başarısız");
    }

    const data = await response.json();
    console.log("✅ CEVAP GELDİ");

    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.warn("⚠️ API'den metin gelmedi");
      return [];
    }

    // Temizlik: Markdown bloklarını (```json ... ```) kaldır
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    // Güvenlik: Sadece [ ve ] arasındaki JSON kısmını al
    const startIndex = text.indexOf("[");
    const endIndex = text.lastIndexOf("]");
    if (startIndex !== -1 && endIndex !== -1) {
        text = text.substring(startIndex, endIndex + 1);
    }

    try {
        const tarifler = JSON.parse(text);
        console.log(`📋 ${tarifler.length} adet tarif oluşturuldu.`);
        return tarifler;
    } catch (e) {
        console.error("JSON Parse Hatası:", e);
        console.log("Hatalı Metin:", text);
        return [];
    }

  } catch (error) {
    console.error("❌ Gemini Fetch Hatası:", error.message);
    return [];
  }
};