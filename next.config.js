const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: [
      "yahoo-finance2",
      "@langchain/core",
      "@langchain/groq",
      "@langchain/openai",
      "@langchain/google-genai",
      "@langchain/langgraph",
      "langchain",
      "groq-sdk",
      "openai"
    ]
  }
};

module.exports = nextConfig;
