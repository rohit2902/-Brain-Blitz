import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import dotenv from "dotenv";
dotenv.config(); 
import { HumanMessage, SystemMessage, AIMessage, tool, createAgent } from "langchain";
// import { searchInternet } from "./internet.service";

const gemini_model = new ChatGoogleGenerativeAI({
  model: "gemini-3.1-flash-lite", 
  apiKey: process.env.GEMINI_API_KEY ,
  maxRetries: 5,
});





const mistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    temperature: 0,
    apiKey: process.env.MISTRAL_API_KEY
});




export async function generateResponse(messages) {
  const formattedMessages = messages
    .map((msg) => {
      const content = typeof msg.content === "string" ? msg.content.trim() : "";
      if (!content) return null;

      if (msg.role === "user") {
        return new HumanMessage(content);
      }

      if (msg.role === "ai" || msg.role === "assistant") {
        return new AIMessage(content);
      }

      return null;
    })
    .filter(Boolean);

  const responseStream = await gemini_model.stream([
    new SystemMessage(`
      You are a helpful and precise assistant for answering questions.
      If you don't know the answer, say you don't know.
      If the question requires up-to-date information, use the
      "searchInternet" tool to get the latest information from the internet
      and then answer based on the search results.
    `),
    ...formattedMessages,
  ]);

  return responseStream;
}

export async function generateChatTitle(message) {

    const response = await gemini_model.invoke([
        new SystemMessage(`
            You are a helpful assistant that generates concise and descriptive titles for chat conversations.
            
            User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words. The title should be clear, relevant, and engaging, giving users a quick understanding of the chat's topic.    
        `),
        new HumanMessage(`
            Generate a title for a chat conversation based on the following first message:
            "${message}"
            `)
    ])

    return response.text;

}


export async function testAi(prompt) {
    try {

        const response = await gemini_model.invoke(prompt);
        

        console.log("AI Says:", response.content);
        return response.content; 
        
    } catch (error) {
        console.error("❌ AI Service Error:", error.message);
        throw error; 
    }
}