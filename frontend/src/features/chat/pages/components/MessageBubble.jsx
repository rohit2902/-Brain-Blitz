import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check } from 'lucide-react';

// Code block with copy button
const CodeBlock = ({ children, ...props }) => {
  const [copied, setCopied] = useState(false);
  const codeString = String(children).replace(/\n$/, '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  return (
    <div className="relative group my-2">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity
                   bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white
                   rounded-md px-2 py-1 text-xs flex items-center gap-1 cursor-pointer z-10"
        title={copied ? 'Copied!' : 'Copy code'}
        aria-label={copied ? 'Copied' : 'Copy code'}
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre style={{
        background: '#1B2340',
        color: '#e2e8f0',
        padding: '1rem',
        borderRadius: '10px',
        overflowX: 'auto',
        margin: 0,
        fontSize: '0.82em',
        lineHeight: 1.6,
      }}>
        <code {...props}>{children}</code>
      </pre>
    </div>
  );
};

// Markdown components for AI messages
const markdownComponents = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-2 list-disc pl-5 space-y-1">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 list-decimal pl-5 space-y-1">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  h1: ({ children }) => <h1 className="text-base font-semibold text-[#1B2340] mt-3 mb-1">{children}</h1>,
  h2: ({ children }) => <h2 className="text-sm font-semibold text-[#1B2340] mt-3 mb-1">{children}</h2>,
  h3: ({ children }) => <h3 className="text-sm font-semibold text-[#1B2340] mt-2 mb-1">{children}</h3>,
  strong: ({ children }) => <strong className="font-semibold text-[#1B2340]">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="text-[#F97316] underline hover:text-[#FF6B00]">
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-[#F97316] pl-3 text-slate-500 italic my-2">
      {children}
    </blockquote>
  ),
  code: ({ inline, children, ...props }) => {
    if (inline) {
      return (
        <code className="bg-slate-100 text-[#C81E78] px-1.5 py-0.5 rounded text-[0.82em] font-mono">
          {children}
        </code>
      );
    }
    return <CodeBlock {...props}>{children}</CodeBlock>;
  },
  pre: ({ children }) => <>{children}</>,
  hr: () => <hr className="border-slate-200 my-3" />,
  table: ({ children }) => (
    <div className="overflow-x-auto my-2">
      <table className="text-sm border-collapse w-full">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="bg-slate-50 border border-slate-200 px-3 py-1.5 text-left font-semibold text-[#1B2340] text-xs">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-slate-200 px-3 py-1.5 text-sm">{children}</td>
  ),
};

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end message-enter">
        <div
          className="max-w-[78%] px-4 py-3 rounded-2xl rounded-br-none text-white text-sm md:text-base leading-relaxed shadow-sm"
          style={{ background: 'linear-gradient(135deg, #FF9F1C, #FF6B00)' }}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
      </div>
    );
  }

  // AI message
  return (
    <div className="flex items-start gap-3 message-enter">
      {/* AI Avatar */}
      <div
        className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center mt-0.5"
        style={{ background: 'linear-gradient(135deg, #1B2340, #8B2FC9)' }}
      >
        <svg width="14" height="14" viewBox="0 0 28 28" fill="none">
          <path
            d="M14 3C8 3 4 7 4 12C4 13.5 4.5 15 5.5 16C4.5 17 4 18.5 4 20C4 24.5 8 27 12 26.5C13 27.5 14.5 28 16 27.5C20 27 22 23.5 21.5 20C23 18.5 24 16.5 24 14C24 8 19.5 3 14 3Z"
            fill="white" opacity="0.9"
          />
        </svg>
      </div>

      {/* AI bubble */}
      <div
        className="max-w-[80%] bg-white border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3 text-sm md:text-base text-[#1B2340] leading-relaxed"
        style={{ boxShadow: '0 2px 12px rgba(27,35,64,0.07)' }}
      >
        <div className="ai-prose">
          {message.content ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {message.content}
            </ReactMarkdown>
          ) : (
            <div className="flex items-center gap-1.5 py-1 px-0.5">
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
