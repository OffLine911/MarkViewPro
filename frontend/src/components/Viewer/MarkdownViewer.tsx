import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { CodeBlock } from './CodeBlock';
import { useSettings } from '../../hooks/useSettings';
import type { HeadingItem } from '../../types';

interface MarkdownViewerProps {
  content: string;
  headings: HeadingItem[];
}

export function MarkdownViewer({ content, headings }: MarkdownViewerProps) {
  const { settings } = useSettings();
  let headingIndex = 0;

  return (
    <div
      className="markdown-body px-8 py-6 max-w-3xl mx-auto"
      style={{
        ['--md-font-size' as string]: `${settings.fontSize}px`,
        ['--md-line-height' as string]: settings.lineHeight,
        fontFamily: settings.fontFamily,
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && !className;
            
            if (isInline) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }

            return (
              <CodeBlock language={match?.[1]}>
                {String(children).replace(/\n$/, '')}
              </CodeBlock>
            );
          },
          h1({ children }) {
            const heading = headings[headingIndex++];
            return <h1 id={heading?.id}>{children}</h1>;
          },
          h2({ children }) {
            const heading = headings[headingIndex++];
            return <h2 id={heading?.id}>{children}</h2>;
          },
          h3({ children }) {
            const heading = headings[headingIndex++];
            return <h3 id={heading?.id}>{children}</h3>;
          },
          h4({ children }) {
            const heading = headings[headingIndex++];
            return <h4 id={heading?.id}>{children}</h4>;
          },
          h5({ children }) {
            const heading = headings[headingIndex++];
            return <h5 id={heading?.id}>{children}</h5>;
          },
          h6({ children }) {
            const heading = headings[headingIndex++];
            return <h6 id={heading?.id}>{children}</h6>;
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
              <div className="overflow-x-auto rounded border border-zinc-800">
                <table>{children}</table>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
