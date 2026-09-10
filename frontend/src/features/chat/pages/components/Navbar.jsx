import { Menu } from 'lucide-react';

const Navbar = ({ user, onMenuToggle }) => {
  return (
    <header className="h-14 bg-white border-b border-slate-100 px-4 flex items-center justify-between md:hidden"
      style={{ boxShadow: '0 1px 8px rgba(27,35,64,0.06)' }}>
      {/* Hamburger */}
      <button
        onClick={onMenuToggle}
        className="p-2 rounded-lg text-slate-500 hover:text-[#1B2340] hover:bg-slate-50 transition cursor-pointer"
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Brand */}
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #FF9F1C, #FF6B00)' }}
        >
          <svg width="12" height="12" viewBox="0 0 28 28" fill="none">
            <path
              d="M14 3C8 3 4 7 4 12C4 13.5 4.5 15 5.5 16C4.5 17 4 18.5 4 20C4 24.5 8 27 12 26.5C13 27.5 14.5 28 16 27.5C20 27 22 23.5 21.5 20C23 18.5 24 16.5 24 14C24 8 19.5 3 14 3Z"
              fill="white"
            />
          </svg>
        </div>
        <span className="font-semibold text-[#1B2340] text-sm">Brain Blitz</span>
      </div>

      {/* User avatar */}
      {user ? (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
          style={{ background: 'linear-gradient(135deg, #1B2340, #8B2FC9)' }}
        >
          {(user.username || user.email || 'U').charAt(0).toUpperCase()}
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full bg-slate-100" />
      )}
    </header>
  );
};

export default Navbar;