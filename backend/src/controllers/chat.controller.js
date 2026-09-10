import {generateResponse ,generateChatTitle} from "../services/Ai.service.js"
import ChatModel from "../models/chat.model.js"
import MessageModel  from "../models/message.model.js"
import { AIMessage } from "@langchain/core/messages"




export async function sendMessage(req, res) { 
    try {
        const { message, chat: chatId } = req.body;

        if (!message || typeof message !== "string" || !message.trim()) {
            return res.status(400).json({ message: "Message content is required" });
        }

        let chat = null;
        const trimmedMessage = message.trim();

        if (chatId) {
            chat = await ChatModel.findOne({ _id: chatId, user: req.user.id });
            if (!chat) {
                return res.status(404).json({ message: "Chat not found" });
            }
        } else {
            const defaultTitle = trimmedMessage.length > 40
                ? trimmedMessage.slice(0, 40) + "..."
                : trimmedMessage;

            chat = await ChatModel.create({
                user: req.user.id,
                title: defaultTitle,
            });


            generateChatTitle(trimmedMessage)
                .then(async (aiTitle) => {
                    if (aiTitle && typeof aiTitle === "string") {
                        await ChatModel.findByIdAndUpdate(chat._id, { title: aiTitle.trim() });
                    }
                })
                .catch((err) => {
                    console.warn("Background chat title generation warning:", err.message);
                });
        }

       
        await MessageModel.create({
            chat: chat._id,
            content: trimmedMessage,
            role: "user",
        });

        // Load recent chat history
        const messages = await MessageModel.find({ chat: chat._id }).sort({ createdAt: 1 });

        // Set streaming headers
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Cache-Control", "no-cache, no-transform");
        res.setHeader("Connection", "keep-alive");
        res.setHeader("X-Accel-Buffering", "no");
        res.setHeader("X-Chat-Id", chat._id.toString());
        res.setHeader("X-Chat-Title", encodeURIComponent(chat.title || ""));

        if (typeof res.flushHeaders === "function") {
            res.flushHeaders();
        }

        let isClientConnected = true;
        req.on("close", () => {
            isClientConnected = false;
        });

        const stream = await generateResponse(messages);

        let aiResponse = "";
        for await (const chunk of stream) {
            if (!isClientConnected) break;
            const text = typeof chunk === "string" ? chunk : (chunk?.content || "");
            if (text) {
                aiResponse += text;
                res.write(text);
                if (typeof res.flush === "function") {
                    res.flush();
                }
            }
        }

        // Persist completed AI response to database
        if (aiResponse.trim()) {
            await MessageModel.create({
                chat: chat._id,
                content: aiResponse,
                role: "ai",
            });
        }

        res.end();
    } catch (error) {
        console.error("sendMessage error:", error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Failed to process message", error: error.message });
        } else {
            res.end();
        }
    }
}

export async function getChats(req, res) {
    const user = req.user

    const chats = await ChatModel.find({ user: user.id })

    res.status(200).json({
        message: "Chats retrieved successfully",
        chats
    })
}


export async function getMessages(req, res) {
    const { chatId } = req.params;

    const chat = await ChatModel.findOne({
        _id: chatId,
        user: req.user.id
    })

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found"
        })
    }

    const messages = await MessageModel.find({
        chat: chatId
    })

    res.status(200).json({
        message: "Messages retrieved successfully",
        messages
    })
}

export async function deleteChat(req, res) {

    const { chatId } = req.params;

    const chat = await ChatModel.findOneAndDelete({
        _id: chatId,
        user: req.user.id
    })


    await MessageModel.deleteMany({
        chat: chatId
    })

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found"
        })
    }

    res.status(200).json({
        message: "Chat deleted successfully"
    })
}

