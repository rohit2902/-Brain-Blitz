const SUGGESTIONS = [
  { icon: '💡', text: 'Explain how neural networks work', label: 'Science' },
  { icon: '💻', text: 'Write a Python function to sort a list of dicts', label: 'Code' },
  { icon: '✍️', text: 'Write a professional email declining a meeting', label: 'Writing' },
  { icon: '🌍', text: "What are today's most important AI developments?", label: 'Research' },
];

const EmptyState = ({ onSuggestionClick }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-12 text-center">
      {/* Logo + Heading */}
      <div className="mb-8">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center shadow-sm"
          style={{ background: 'linear-gradient(135deg, #FF9F1C, #FF6B00)' }}>
          <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
            <path
              d="M14 3C8 3 4 7 4 12C4 13.5 4.5 15 5.5 16C4.5 17 4 18.5 4 20C4 24.5 8 27 12 26.5C13 27.5 14.5 28 16 27.5C20 27 22 23.5 21.5 20C23 18.5 24 16.5 24 14C24 8 19.5 3 14 3Z"
              fill="white"
            />
            <line x1="14" y1="7" x2="14" y2="24" stroke="rgba(255,159,28,0.6)" strokeWidth="1.5" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-[#1B2340] mb-2">
          Ask anything
        </h2>
        <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
          Get intelligent, clear answers powered by AI. Start a conversation or pick a suggestion below.
        </p>
      </div>

      {/* Suggestion cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
        {SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            onClick={() => onSuggestionClick(s.text)}
            className="group text-left bg-white border border-slate-100 rounded-xl p-4 hover:border-[#F97316]/30 hover:shadow-md transition-all duration-200 cursor-pointer"
            style={{ boxShadow: '0 2px 8px rgba(27,35,64,0.05)' }}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl leading-none mt-0.5">{s.icon}</span>
              <div>
                <span className="text-xs font-medium text-[#F97316] mb-1 block">{s.label}</span>
                <span className="text-sm text-[#1B2340] leading-snug group-hover:text-[#F97316] transition-colors">
                  {s.text}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;
