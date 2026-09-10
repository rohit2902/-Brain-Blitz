import { useRef } from "react";
import { initializeSocketConnection } from "../services/chat.socket.js";
import { sendMessage, getChats, getMessages, deleteChat } from "../services/chat.api.js";
import {
    setChats,
    setCurrentChatId,
    setError,
    setLoading,
    createNewChat,
    addNewMessage,
    updateMessage,
    replaceChatId,
    updateChatList,
    addMessages,
} from "../chat.slice";
import { useDispatch, useSelector } from "react-redux";

export const useChat = () => {
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.chat.isLoading);
    const error = useSelector((state) => state.chat.error);
    const chats = useSelector((state) => state.chat.chats);
    const abortControllerRef = useRef(null);

    async function handleSendMessage({ message, chatId }) {
        dispatch(setLoading(true));
        dispatch(setError(null));

        
        const isNewChat = !chatId;
        let activeChatId = chatId || `temp-${Date.now()}`;
        const tempMessageId = `ai-${Date.now()}`;

        if (isNewChat) {
            const initialTitle = message.length > 30 ? message.slice(0, 30) + "..." : message;
            dispatch(
                createNewChat({
                    chatId: activeChatId,
                    title: initialTitle,
                })
            );
            dispatch(setCurrentChatId(activeChatId));
        }

        
        dispatch(
            addNewMessage({
                chatId: activeChatId,
                content: message,
                role: "user",
            })
        );

       
        dispatch(
            addNewMessage({
                chatId: activeChatId,
                content: "",
                role: "ai",
                messageId: tempMessageId,
            })
        );

        abortControllerRef.current = new AbortController();
        let aiResponse = "";

        try {
            await sendMessage({
                message,
                chatId: isNewChat ? undefined : activeChatId,
                signal: abortControllerRef.current.signal,
                onMeta: ({ chatId: serverChatId, title: serverTitle }) => {
                    if (serverChatId && serverChatId !== activeChatId) {
                        dispatch(
                            replaceChatId({
                                oldChatId: activeChatId,
                                newChatId: serverChatId,
                                title: serverTitle,
                            })
                        );
                        activeChatId = serverChatId;
                    }
                },
                onChunk: (chunk) => {
                    aiResponse += chunk;
                    dispatch(
                        updateMessage({
                            chatId: activeChatId,
                            messageId: tempMessageId,
                            content: aiResponse,
                        })
                    );
                },
            });

           
            try {
                const data = await getChats();
                if (data?.chats) {
                    dispatch(updateChatList(data.chats));
                }
            } catch {
                
            }
        } catch (err) {
            if (err.name === "AbortError") {
              
                return;
            }
            console.error("handleSendMessage error:", err);
            dispatch(
                setError(
                    err?.message || "Failed to get a response. Please try again."
                )
            );
        } finally {
            abortControllerRef.current = null;
            dispatch(setLoading(false));
        }
    }

    function handleStopGeneration() {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        dispatch(setLoading(false));
    }

    async function handleGetChats() {
        dispatch(setLoading(true));
        try {
            const data = await getChats();
            const { chats: serverChats } = data;
            if (serverChats) {
                dispatch(updateChatList(serverChats));
            }
        } catch (err) {
            dispatch(setError(err?.response?.data?.message || err?.message || "Failed to load chat history."));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleOpenChat(chatId, currentChats) {
        const targetChat = (currentChats || chats)[chatId];
        if (!targetChat?.messages || targetChat.messages.length === 0) {
            try {
                const data = await getMessages(chatId);
                const { messages } = data;
                const formattedMessages = messages.map((msg) => ({
                    content: msg.content,
                    role: msg.role,
                }));
                dispatch(addMessages({ chatId, messages: formattedMessages }));
            } catch (err) {
                dispatch(setError(err?.response?.data?.message || err?.message || "Failed to load messages."));
            }
        }
        dispatch(setCurrentChatId(chatId));
    }

    function handleNewChat() {
        dispatch(setCurrentChatId(null));
        dispatch(setError(null));
    }

    async function handleDeleteChat(chatId) {
        try {
            await deleteChat(chatId);
            await handleGetChats();
            dispatch(setCurrentChatId(null));
        } catch (err) {
            dispatch(setError(err?.response?.data?.message || err?.message || "Failed to delete chat."));
        }
    }

    return {
        initializeSocketConnection,
        handleSendMessage,
        handleStopGeneration,
        handleGetChats,
        handleOpenChat,
        handleNewChat,
        handleDeleteChat,
        isLoading,
        error,
    };
};
