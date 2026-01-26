import { useEffect, useRef, useState } from 'react';

interface MermaidDiagramProps {
  chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [mermaidLoaded, setMermaidLoaded] = useState(false);

  useEffect(() => {
    // Lazy load mermaid only when needed
    import('mermaid').then((mermaidModule) => {
      const mermaid = mermaidModule.default;
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'loose',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      });
      setMermaidLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!mermaidLoaded) return;

    const renderDiagram = async () => {
      if (!ref.current || !chart) return;

      try {
        const mermaidModule = await import('mermaid');
        const mermaid = mermaidModule.default;
        setError('');
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        setSvg(svg);
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError(err instanceof Error ? err.message : 'Failed to render diagram');
      }
    };

    renderDiagram();
  }, [chart, mermaidLoaded]);

  if (!mermaidLoaded) {
    return (
      <div className="flex items-center justify-center p-8 bg-zinc-900/50 rounded-lg border border-zinc-800">
        <span className="text-zinc-400 text-sm">Loading diagram...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-700 rounded text-red-400 text-sm">
        <strong>Mermaid Error:</strong> {error}
      </div>
    );
  }

  return (
    <div 
      ref={ref} 
      className="mermaid-diagram flex justify-center my-4 p-4 bg-zinc-900/50 rounded-lg overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
