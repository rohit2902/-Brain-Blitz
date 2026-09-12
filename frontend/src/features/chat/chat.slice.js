import { createSlice } from '@reduxjs/toolkit';


const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: {},
        currentChatId: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        createNewChat: (state, action) => {
            const { chatId, title } = action.payload;
            state.chats[chatId] = {
                id: chatId,
                title: title || "New Chat",
                messages: [],
                lastUpdated: new Date().toISOString(),
            };
        },
        addNewMessage: (state, action) => {
            const { chatId, content, role, messageId } = action.payload;
            if (!state.chats[chatId]) {
                state.chats[chatId] = {
                    id: chatId,
                    title: "New Chat",
                    messages: [],
                    lastUpdated: new Date().toISOString(),
                };
            }
            state.chats[chatId].messages.push({
                content,
                role,
                ...(messageId ? { messageId } : {}),
            });
        },
        updateMessage: (state, action) => {
            const { chatId, messageId, content } = action.payload;
            const chat = state.chats[chatId];
            if (chat && chat.messages && chat.messages.length > 0) {
                if (messageId) {
                    const msg = chat.messages.find((m) => m.messageId === messageId);
                    if (msg) {
                        msg.content = content;
                        return;
                    }
                }
                // Fallback: update the latest AI message
                for (let i = chat.messages.length - 1; i >= 0; i--) {
                    if (chat.messages[i].role === "ai") {
                        chat.messages[i].content = content;
                        return;
                    }
                }
            }
        },
        replaceChatId: (state, action) => {
            const { oldChatId, newChatId, title } = action.payload;
            if (oldChatId && newChatId && oldChatId !== newChatId && state.chats[oldChatId]) {
                state.chats[newChatId] = {
                    ...state.chats[oldChatId],
                    id: newChatId,
                    ...(title ? { title } : {}),
                };
                delete state.chats[oldChatId];

                if (state.currentChatId === oldChatId) {
                    state.currentChatId = newChatId;
                }
            }
        },
        updateChatTitle: (state, action) => {
            const { chatId, title } = action.payload;
            if (state.chats[chatId] && title) {
                state.chats[chatId].title = title;
            }
        },
        addMessages: (state, action) => {
            const { chatId, messages } = action.payload;
            if (!state.chats[chatId]) {
                state.chats[chatId] = {
                    id: chatId,
                    title: "Chat",
                    messages: [],
                    lastUpdated: new Date().toISOString(),
                };
            }
            state.chats[chatId].messages.push(...messages);
        },
        updateChatList: (state, action) => {
            const serverChats = Array.isArray(action.payload) ? action.payload : [];
            serverChats.forEach((serverChat) => {
                if (state.chats[serverChat._id]) {
                    state.chats[serverChat._id].title = serverChat.title;
                    state.chats[serverChat._id].lastUpdated = serverChat.updatedAt;
                } else {
                    state.chats[serverChat._id] = {
                        id: serverChat._id,
                        title: serverChat.title,
                        messages: [],
                        lastUpdated: serverChat.updatedAt,
                    };
                }
            });
        },
        setChats: (state, action) => {
            const incoming = action.payload || {};
            const merged = {};
            for (const id in incoming) {
                merged[id] = {
                    ...incoming[id],
                    messages: state.chats[id]?.messages?.length
                        ? state.chats[id].messages
                        : (incoming[id].messages || []),
                };
            }
            state.chats = merged;
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const {
    setChats,
    setCurrentChatId,
    setLoading,
    setError,
    createNewChat,
    addNewMessage,
    updateMessage,
    replaceChatId,
    updateChatTitle,
    updateChatList,
    addMessages,
} = chatSlice.actions;
export default chatSlice.reducer;
