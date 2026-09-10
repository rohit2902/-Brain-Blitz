const TypingIndicator = () => {
  return (
    <div className="flex items-start gap-3 message-enter">
      {/* AI Avatar */}
      <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #1B2340, #8B2FC9)' }}>
        <svg width="14" height="14" viewBox="0 0 28 28" fill="none">
          <path
            d="M14 3C8 3 4 7 4 12C4 13.5 4.5 15 5.5 16C4.5 17 4 18.5 4 20C4 24.5 8 27 12 26.5C13 27.5 14.5 28 16 27.5C20 27 22 23.5 21.5 20C23 18.5 24 16.5 24 14C24 8 19.5 3 14 3Z"
            fill="white"
            opacity="0.9"
          />
        </svg>
      </div>

      {/* Typing bubble */}
      <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm"
        style={{ boxShadow: '0 2px 12px rgba(27,35,64,0.06)' }}>
        <div className="flex items-center gap-1.5 h-5">
          <div className="typing-dot w-2 h-2 rounded-full"
            style={{ background: 'linear-gradient(135deg, #FF9F1C, #FF6B00)' }} />
          <div className="typing-dot w-2 h-2 rounded-full"
            style={{ background: 'linear-gradient(135deg, #FF9F1C, #FF6B00)' }} />
          <div className="typing-dot w-2 h-2 rounded-full"
            style={{ background: 'linear-gradient(135deg, #FF9F1C, #FF6B00)' }} />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
