import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },

    title: {
      type: String,
      trim: true,
      default: "New Chat",
      maxlength: 200,
    }

  },
  {
    timestamps: true,
  }
);

// Sort chats by latest activity
chatSchema.index({ user: 1, lastMessageAt: -1 });

const ChatModel = mongoose.model("Chat", chatSchema);

export default ChatModel;