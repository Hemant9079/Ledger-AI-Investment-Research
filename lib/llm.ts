import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { ChatGroq } from "@langchain/groq";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";

let cachedModel: any = null;

function createGroqModel(): BaseChatModel | null {
  if (!process.env.GROQ_API_KEY) return null;
  try {
    return new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
      temperature: 0.2,
      maxRetries: 1,
    });
  } catch (e) {
    console.error("Failed to initialize ChatGroq:", e);
    return null;
  }
}

function createGeminiModel(): BaseChatModel | null {
  const googleKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (!googleKey) return null;
  try {
    return new ChatGoogleGenerativeAI({
      apiKey: googleKey,
      model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
      temperature: 0.2,
      maxRetries: 1,
    });
  } catch (e) {
    console.error("Failed to initialize ChatGoogleGenerativeAI:", e);
    return null;
  }
}

function createOpenAIModel(): BaseChatModel | null {
  if (!process.env.OPENAI_API_KEY) return null;
  try {
    return new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.2,
      maxRetries: 1,
    });
  } catch (e) {
    console.error("Failed to initialize ChatOpenAI:", e);
    return null;
  }
}

export function getChatModel(): BaseChatModel {
  if (cachedModel) return cachedModel;

  const preferred = (process.env.LLM_PROVIDER || "groq").toLowerCase();

  let primary: BaseChatModel | null = null;
  const backups: BaseChatModel[] = [];

  if (preferred === "gemini") {
    primary = createGeminiModel();
    const groq = createGroqModel();
    const openai = createOpenAIModel();
    if (groq) backups.push(groq);
    if (openai) backups.push(openai);
  } else if (preferred === "openai") {
    primary = createOpenAIModel();
    const groq = createGroqModel();
    const gemini = createGeminiModel();
    if (groq) backups.push(groq);
    if (gemini) backups.push(gemini);
  } else {
    // Default to groq
    primary = createGroqModel();
    const gemini = createGeminiModel();
    const openai = createOpenAIModel();
    if (gemini) backups.push(gemini);
    if (openai) backups.push(openai);
  }

  // If the preferred model wasn't available, pick the first available backup
  if (!primary) {
    if (backups.length > 0) {
      primary = backups.shift()!;
    } else {
      throw new Error(
        "No LLM provider is configured. Please provide GROQ_API_KEY, GOOGLE_API_KEY, or OPENAI_API_KEY in your .env file."
      );
    }
  }

  // Chain fallbacks so that if Groq hits 429 rate limit or error, Gemini or OpenAI automatically responds
  if (backups.length > 0 && typeof (primary as any).withFallbacks === "function") {
    cachedModel = (primary as any).withFallbacks({ fallbacks: backups });
  } else {
    cachedModel = primary;
  }

  return cachedModel;
}
