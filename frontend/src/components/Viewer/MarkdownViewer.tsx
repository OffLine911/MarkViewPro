import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import { CodeBlock } from './CodeBlock';
import { MermaidDiagram } from './MermaidDiagram';
import { useSettings } from '../../hooks/useSettings';
import { Link } from 'lucide-react';
import type { HeadingItem } from '../../types';
import 'katex/dist/katex.min.css';
import { useState, useCallback, useEffect } from 'react';

interface MarkdownViewerProps {
  content: string;
  headings: HeadingItem[];
}

interface HeadingProps {
  id?: string;
  children: React.ReactNode;
}

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
}

function ContextMenu({ x, y, onClose }: ContextMenuProps) {
  useEffect(() => {
    const handleClick = () => onClose();
    const handleScroll = () => onClose();
    
    document.addEventListener('click', handleClick);
    document.addEventListener('scroll', handleScroll, true);
    
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [onClose]);

  const handleCopy = () => {
    document.execCommand('copy');
    onClose();
  };

  const handleSelectAll = () => {
    const selection = window.getSelection();
    const range = document.createRange();
    const content = document.querySelector('.markdown-body');
    if (content && selection) {
      range.selectNodeContents(content);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    onClose();
  };

  return (
    <div
      className="fixed z-50 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl py-1 min-w-[160px]"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={handleCopy}
        className="w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
      >
        Copy
      </button>
      <button
        onClick={handleSelectAll}
        className="w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
      >
        Select All
      </button>
    </div>
  );
}

function HeadingWithAnchor({ id, children, Tag }: HeadingProps & { Tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' }) {
  return (
    <Tag id={id} className="group relative">
      {children}
      {id && (
        <a
          href={`#${id}`}
          className="heading-anchor"
          aria-label="Link to this heading"
        >
          <Link className="w-4 h-4" />
        </a>
      )}
    </Tag>
  );
}

export function MarkdownViewer({ content, headings }: MarkdownViewerProps) {
  const { settings } = useSettings();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  let headingIndex = 0;

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <>
      <div
        className="markdown-body px-8 py-6 max-w-3xl mx-auto"
        onContextMenu={handleContextMenu}
        style={{
          ['--md-font-size' as string]: `${settings.fontSize}px`,
          ['--md-line-height' as string]: settings.lineHeight,
          fontFamily: settings.fontFamily,
        }}
      >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !className;
            
            if (isInline) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }

            // Convert children to string properly
            let codeString = '';
            if (Array.isArray(children)) {
              codeString = children.map(child => {
                if (typeof child === 'string') return child;
                if (child && typeof child === 'object' && 'props' in child && child.props?.children) {
                  return String(child.props.children);
                }
                return '';
              }).join('');
            } else if (typeof children === 'string') {
              codeString = children;
            } else {
              codeString = String(children);
            }

            // Check if it's a mermaid diagram
            if (match?.[1] === 'mermaid') {
              return <MermaidDiagram chart={codeString.replace(/\n$/, '')} />;
            }

            return (
              <CodeBlock language={match?.[1]}>
                {codeString.replace(/\n$/, '')}
              </CodeBlock>
            );
          },
          h1({ children }) {
            const heading = headings[headingIndex++];
            return <HeadingWithAnchor Tag="h1" id={heading?.id}>{children}</HeadingWithAnchor>;
          },
          h2({ children }) {
            const heading = headings[headingIndex++];
            return <HeadingWithAnchor Tag="h2" id={heading?.id}>{children}</HeadingWithAnchor>;
          },
          h3({ children }) {
            const heading = headings[headingIndex++];
            return <HeadingWithAnchor Tag="h3" id={heading?.id}>{children}</HeadingWithAnchor>;
          },
          h4({ children }) {
            const heading = headings[headingIndex++];
            return <HeadingWithAnchor Tag="h4" id={heading?.id}>{children}</HeadingWithAnchor>;
          },
          h5({ children }) {
            const heading = headings[headingIndex++];
            return <HeadingWithAnchor Tag="h5" id={heading?.id}>{children}</HeadingWithAnchor>;
          },
          h6({ children }) {
            const heading = headings[headingIndex++];
            return <HeadingWithAnchor Tag="h6" id={heading?.id}>{children}</HeadingWithAnchor>;
          },
          a({ href, children }) {
            return (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            );
          },
          table({ children }) {
            return (
              <div className="table-wrapper">
                <table>{children}</table>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
      </div>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}
    </>
  );
}
