import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Send, AlertCircle, RefreshCw, Square } from "lucide-react";
import { useChat } from "../hook/useChat.js";
import { useAuth } from "../../auth/hook/useAuth.js";
import Sidebar from "./components/Sidebar.jsx";
import Navbar from "./components/Navbar.jsx";
import MessageBubble from "./components/MessageBubble.jsx";
import TypingIndicator from "./components/TypingIndicator.jsx";
import EmptyState from "./components/EmptyState.jsx";

const Dashboard = () => {
  const { handleLogout } = useAuth();
  const {
    initializeSocketConnection,
    handleSendMessage,
    handleStopGeneration,
    handleGetChats,
    handleOpenChat,
    handleNewChat,
    handleDeleteChat,
    isLoading,
    error,
  } = useChat();

  const [chatInput, setChatInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lastFailedMessage, setLastFailedMessage] = useState(null);

  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const user = useSelector((state) => state.auth.user);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, currentChatId, isLoading]);

  useEffect(() => {
    initializeSocketConnection();
    handleGetChats();
   
  }, []);

  const currentMessages = chats[currentChatId]?.messages ?? [];
  const hasMessages = currentMessages.length > 0;

  const submitMessage = async (messageText) => {
    const trimmed = messageText.trim();

    if (!trimmed || isLoading) return;

    setLastFailedMessage(trimmed);
    setChatInput("");

    try {
      await handleSendMessage({
        message: trimmed,
        chatId: currentChatId,
      });
    } finally {
      inputRef.current?.focus();
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    submitMessage(chatInput);
  };

  const handleSuggestionClick = (text) => {
    submitMessage(text);
  };

  const handleRetry = () => {
    if (lastFailedMessage) {
      submitMessage(lastFailedMessage);
    }
  };

  const handleSelectChat = (chatId) => {
    handleOpenChat(chatId, chats);
    setSidebarOpen(false);
  };

  const handleNew = () => {
    handleNewChat();
    setSidebarOpen(false);
    inputRef.current?.focus();
  };

  const handleDelete = (chatId) => {
    handleDeleteChat(chatId);
  };

  const handleKeyDown = (e) => {
    
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitMessage(chatInput);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Navbar */}
      <Navbar user={user} onMenuToggle={() => setSidebarOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        {/* ── Desktop Sidebar ─────────────────────────────── */}
        <div className="hidden md:block w-64 shrink-0 h-full">
          <Sidebar
            chats={chats}
            currentChatId={currentChatId}
            user={user}
            onSelectChat={handleSelectChat}
            onNewChat={handleNew}
            onLogout={handleLogout}
            onDeleteChat={handleDelete}
          />
        </div>

        {/* ── Mobile Sidebar Overlay ───────────────────────── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="absolute inset-0 bg-[#1B2340]/30 backdrop-blur-sm" />
          </div>
        )}
        <div
          className={`fixed top-0 left-0 h-full w-72 z-50 transition-transform duration-300 ease-in-out md:hidden
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <Sidebar
            chats={chats}
            currentChatId={currentChatId}
            user={user}
            onSelectChat={handleSelectChat}
            onNewChat={handleNew}
            onLogout={handleLogout}
            onDeleteChat={handleDelete}
          />
        </div>

        {/* ── Main chat area ───────────────────────────────── */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto px-4 py-6 h-full">
              {!hasMessages ? (
                <EmptyState onSuggestionClick={handleSuggestionClick} />
              ) : (
                <div className="space-y-5 pb-6">
                  {currentMessages.map((message, index) => (
                    <MessageBubble key={index} message={message} />
                  ))}
                  {isLoading &&
                    currentMessages.length > 0 &&
                    currentMessages[currentMessages.length - 1]?.role !==
                      "ai" && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </div>
              )}
              {/* If loading but no messages yet (first message in new chat) */}
              {isLoading && !hasMessages && (
                <div className="mt-4">
                  <TypingIndicator />
                </div>
              )}
            </div>
          </div>

          {/* ── Error Banner ──────────────────────────────── */}
          {error && (
            <div className="px-4 pb-2 max-w-2xl mx-auto w-full">
              <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 text-sm text-rose-600">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span className="flex-1">{error}</span>
                {lastFailedMessage && (
                  <button
                    onClick={handleRetry}
                    className="flex items-center gap-1 text-rose-500 hover:text-rose-700 font-medium shrink-0 cursor-pointer transition"
                  >
                    <RefreshCw size={13} />
                    Retry
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── Input Area ───────────────────────────────── */}
          <div className="px-4 pb-4 pt-2">
            <div className="max-w-2xl mx-auto">
              <form
                onSubmit={handleSubmitForm}
                className="flex items-end gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm transition focus-within:border-[#F97316]/50 focus-within:shadow-md"
                style={{ boxShadow: "0 2px 12px rgba(27,35,64,0.06)" }}
              >
                <textarea
                  ref={inputRef}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything… (Enter to send, Shift+Enter for new line)"
                  rows={1}
                  disabled={isLoading}
                  className="flex-1 resize-none bg-transparent text-[#1B2340] text-sm placeholder-slate-400 outline-none leading-relaxed disabled:opacity-50"
                  style={{ maxHeight: "120px", overflowY: "auto" }}
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height =
                      Math.min(e.target.scrollHeight, 120) + "px";
                  }}
                  aria-label="Chat message input"
                />
                {isLoading ? (
                  <button
                    type="button"
                    onClick={handleStopGeneration}
                    className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white transition cursor-pointer hover:opacity-90 bg-rose-500 shadow-sm"
                    aria-label="Stop generation"
                    title="Stop generation"
                  >
                    <Square size={13} fill="currentColor" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:opacity-90"
                    style={{
                      background: "linear-gradient(135deg, #FF9F1C, #FF6B00)",
                    }}
                    aria-label="Send message"
                  >
                    <Send size={15} />
                  </button>
                )}
              </form>
              <p className="text-center text-xs text-slate-300 mt-2">
                Brain Blitz AI ·
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
