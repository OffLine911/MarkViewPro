import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

interface CodeBlockProps {
  language?: string;
  children: string;
}

export function CodeBlock({ language, children }: CodeBlockProps) {
  const { settings } = useSettings();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative group">
      <div className="absolute right-2 top-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        {language && (
          <span className="px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 bg-zinc-800 rounded">
            {language}
          </span>
        )}
        <button
          onClick={handleCopy}
          className="p-1 text-zinc-500 bg-zinc-800 hover:bg-zinc-700 hover:text-zinc-300 rounded transition-colors"
          title="Copy code"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || 'text'}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: '0.375rem',
          fontSize: '13px',
          padding: '0.75rem 1rem',
          background: '#09090b',
        }}
        showLineNumbers={settings.showLineNumbers}
        lineNumberStyle={{
          minWidth: '2em',
          paddingRight: '1em',
          color: '#3f3f46',
          userSelect: 'none',
        }}
        wrapLines={settings.wordWrap}
        wrapLongLines={settings.wordWrap}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
