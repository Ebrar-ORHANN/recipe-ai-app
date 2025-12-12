import { GoogleGenerativeAI } from "@google/generative-ai";
console.log("ENV KEY:", process.env.EXPO_PUBLIC_GEMINI_KEY);


const genAI = new GoogleGenerativeAI(
  process.env.EXPO_PUBLIC_GEMINI_KEY
);

export const textModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});
