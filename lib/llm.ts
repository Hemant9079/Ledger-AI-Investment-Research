
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { ChatGroq } from "@langchain/groq";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";

let cachedModel: BaseChatModel | null = null;

export function getChatModel(): BaseChatModel {
  if (cachedModel) return cachedModel;

  const provider = (process.env.LLM_PROVIDER || "gemini").toLowerCase();

  if (provider === "openai") {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        "LLM_PROVIDER=openai but OPENAI_API_KEY is missing from your environment."
      );
    }
    cachedModel = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: "gpt-4o-mini",
      temperature: 0.2
    });
    return cachedModel;
  }

  if (provider === "groq") {
    if (!process.env.GROQ_API_KEY) {
      throw new Error(
        "LLM_PROVIDER=groq but GROQ_API_KEY is missing from your environment."
      );
    }
    cachedModel = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
      temperature: 0.2
    });
    return cachedModel;
  }

  const googleKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (!googleKey) {
    throw new Error(
      "LLM_PROVIDER=gemini but GOOGLE_API_KEY / GEMINI_API_KEY is missing from your environment."
    );
  }
  cachedModel = new ChatGoogleGenerativeAI({
    apiKey: googleKey,
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    temperature: 0.2
  });
  return cachedModel;
}
