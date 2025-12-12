import { textModel, visionModel } from "./gemini";

export async function aiCreateRecipe(prompt) {
  const result = await textModel.generateContent(
    `Bana detaylı bir yemek tarifi ver. Kullanıcı mesajı: ${prompt}`
  );
  return result.response.text();
}
export async function aiRecipeByIngredients(ingredients) {
  const result = await textModel.generateContent(
    `Aşağıdaki malzemelerle yapılabilecek 3 yemek öner:
     Malzemeler: ${ingredients}.
     Her yemek için malzeme listesi + yapılış adımı ver.`
  );
  return result.response.text();
}
export async function aiRecipeFromPhoto(base64Image) {
  const result = await visionModel.generateContent([
    "Bu fotoğraftaki yemeği tanı ve bir tarif öner.",
    {
      inlineData: {
        data: base64Image,
        mimeType: "image/jpeg",
      }
    }
  ]);
  return result.response.text();
}
export async function aiWeeklyPlan() {
  const result = await textModel.generateContent(
    `7 günlük sağlıklı yemek planı oluştur.
     Her gün: kahvaltı + öğle + akşam yemeği + ara öğün.`
  );
  return result.response.text();
}
export async function aiWeeklyPlan() {
  const result = await textModel.generateContent(
    `7 günlük sağlıklı yemek planı oluştur.
     Her gün: kahvaltı + öğle + akşam yemeği + ara öğün.`
  );
  return result.response.text();
}
