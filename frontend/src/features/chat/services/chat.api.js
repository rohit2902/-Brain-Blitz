import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "",
    withCredentials: true
});




export const sendMessage = async ({ message, chatId, onChunk, onMeta, signal }) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chats/message` , {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    signal,
    body: JSON.stringify({
      message,
      chat: chatId || undefined,
    }),
  });

  if (!response.ok) {
    let errorMsg = "Failed to send message";
    try {
      const errJson = await response.json();
      if (errJson?.message) {
        errorMsg = errJson.message;
      }
    } catch {
      // response wasn't json
    }
    throw new Error(errorMsg);
  }

  
  const headerChatId = response.headers.get("X-Chat-Id");
  const headerChatTitleRaw = response.headers.get("X-Chat-Title");
  const headerChatTitle = headerChatTitleRaw ? decodeURIComponent(headerChatTitleRaw) : null;

  if (onMeta) {
    onMeta({
      chatId: headerChatId,
      title: headerChatTitle,
    });
  }

  if (!response.body) {
    throw new Error("Streaming is not supported by your browser environment");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullResponse = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      if (chunk) {
        fullResponse += chunk;
        if (onChunk) {
          onChunk(chunk);
        }
      }
    }

    const rest = decoder.decode();
    if (rest) {
      fullResponse += rest;
      if (onChunk) {
        onChunk(rest);
      }
    }
  } finally {
    reader.releaseLock();
  }

  return {
    fullResponse,
    chatId: headerChatId,
    title: headerChatTitle,
  };
};

export const getChats = async () => {
    const response = await api.get("/api/chats")
    return response.data
}

export const getMessages = async (chatId) => {
    const response = await api.get(`/api/chats/${chatId}/messages`)
    return response.data
}

export const deleteChat = async (chatId) => {
    const response = await api.delete(`/api/chats/delete/${chatId}`)
    return response.data
}
