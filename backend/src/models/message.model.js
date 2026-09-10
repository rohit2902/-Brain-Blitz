import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: [true, "Chat is required"],
      index: true,
    },

    role: {
      type: String,
      enum: ["user", "ai"],
      required: true,
    },

    content: {
      type: String,
      required: [true, "Message content is required"],
      
    }
  },
  {
    timestamps: true,
  }
);

// Messages appear in chronological order
messageSchema.index({ chat: 1, createdAt: 1 });

const MessageModel = mongoose.model("Message", messageSchema);

export default MessageModel;