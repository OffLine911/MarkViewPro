import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import { CodeBlock } from './CodeBlock';
import { useSettings } from '../../hooks/useSettings';
import { Link } from 'lucide-react';
import type { HeadingItem } from '../../types';
import 'katex/dist/katex.min.css';

interface MarkdownViewerProps {
  content: string;
  headings: HeadingItem[];
}

interface HeadingProps {
  id?: string;
  children: React.ReactNode;
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

            const codeString = Array.isArray(children) 
              ? children.join('') 
              : typeof children === 'string' 
                ? children 
                : String(children);

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
  );
}
