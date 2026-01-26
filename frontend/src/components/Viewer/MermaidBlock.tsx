import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { useSettings } from '../../hooks/useSettings';
import { AlertTriangle } from 'lucide-react';

interface MermaidBlockProps {
  children: string;
}

let mermaidId = 0;

export function MermaidBlock({ children }: MermaidBlockProps) {
  const { isDark } = useSettings();
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [svg, setSvg] = useState<string>('');
  const idRef = useRef(`mermaid-${mermaidId++}`);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'Inter, system-ui, sans-serif',
    });
  }, [isDark]);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current) return;

      try {
        setError(null);
        const { svg: renderedSvg } = await mermaid.render(idRef.current, children.trim());
        setSvg(renderedSvg);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to render diagram';
        setError(message);
        setSvg('');
      }
    };

    renderDiagram();
  }, [children, isDark]);

  if (error) {
    return (
      <div className="mermaid-error my-4 p-4 rounded-lg border border-red-500/30 bg-red-500/10">
        <div className="flex items-center gap-2 text-red-400 mb-2">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm font-medium">Mermaid Diagram Error</span>
        </div>
        <pre className="text-xs text-red-300 whitespace-pre-wrap overflow-x-auto">{error}</pre>
        <details className="mt-3">
          <summary className="text-xs text-zinc-500 cursor-pointer hover:text-zinc-400">
            Show source
          </summary>
          <pre className="mt-2 p-2 text-xs bg-zinc-900 rounded overflow-x-auto">{children}</pre>
        </details>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mermaid-container my-4 flex justify-center overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
