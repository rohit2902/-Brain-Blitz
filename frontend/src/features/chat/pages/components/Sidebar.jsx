import { Plus, MessageSquare, LogOut, Trash2 } from 'lucide-react';

const Sidebar = ({ chats, currentChatId, user, onSelectChat, onNewChat, onLogout, onDeleteChat }) => {
  const chatList = Object.values(chats);

  return (
    <aside
      className="h-full flex flex-col bg-white border-r border-slate-100"
      style={{ boxShadow: '2px 0 12px rgba(27,35,64,0.04)' }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5 mb-5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #FF9F1C, #FF6B00)' }}
          >
            <svg width="16" height="16" viewBox="0 0 28 28" fill="none">
              <path
                d="M14 3C8 3 4 7 4 12C4 13.5 4.5 15 5.5 16C4.5 17 4 18.5 4 20C4 24.5 8 27 12 26.5C13 27.5 14.5 28 16 27.5C20 27 22 23.5 21.5 20C23 18.5 24 16.5 24 14C24 8 19.5 3 14 3Z"
                fill="white"
              />
            </svg>
          </div>
          <span className="text-[#1B2340] font-semibold text-base tracking-tight">Brain Blitz</span>
        </div>

        {/* New Chat button */}
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-medium transition hover:opacity-90 cursor-pointer shadow-sm"
          style={{ background: 'linear-gradient(135deg, #FF9F1C, #FF6B00)' }}
        >
          <Plus size={15} />
          New Chat
        </button>
      </div>

      {/* Chat history */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {chatList.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare size={24} className="mx-auto mb-2 text-slate-300" />
            <p className="text-xs text-slate-400">No chats yet.<br />Start a conversation!</p>
          </div>
        ) : (
          chatList.map((chat) => {
            const isActive = chat.id === currentChatId;
            return (
              <div key={chat.id} className="group flex items-center gap-1">
                <button
                  onClick={() => onSelectChat(chat.id)}
                  className={`flex-1 text-left rounded-xl px-3 py-2.5 text-sm transition-all duration-150 truncate cursor-pointer
                    ${isActive
                      ? 'bg-[#FFF4E8] text-[#FF6B00] font-medium'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-[#1B2340]'
                    }`}
                >
                  <span className="truncate block">{chat.title || 'Untitled Chat'}</span>
                </button>
                {/* Delete button — appears on hover */}
                <button
                  onClick={() => onDeleteChat(chat.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-300 hover:text-rose-400 hover:bg-rose-50 transition-all cursor-pointer shrink-0"
                  aria-label="Delete chat"
                  title="Delete chat"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* User info + Logout */}
      <div className="px-4 py-4 border-t border-slate-100">
        {user && (
          <div className="flex items-center gap-3 mb-3 px-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
              style={{ background: 'linear-gradient(135deg, #1B2340, #8B2FC9)' }}
            >
              {(user.username || user.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#1B2340] truncate">{user.username || 'User'}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-rose-500 hover:bg-rose-50 transition-all duration-150 cursor-pointer"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;