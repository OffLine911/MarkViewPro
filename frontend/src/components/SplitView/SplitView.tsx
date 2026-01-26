import { useState } from 'react';
import { MarkdownEditor } from '../Editor/MarkdownEditor';
import { MarkdownViewer } from '../Viewer/MarkdownViewer';
import { GripVertical } from 'lucide-react';
import type { HeadingItem } from '../../types';

interface SplitViewProps {
  content: string;
  onChange: (content: string) => void;
  headings: HeadingItem[];
  theme?: 'light' | 'dark';
}

export function SplitView({ content, onChange, headings, theme = 'dark' }: SplitViewProps) {
  const [splitRatio, setSplitRatio] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const container = e.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const newRatio = ((e.clientX - rect.left) / rect.width) * 100;
    
    // Constrain between 20% and 80%
    setSplitRatio(Math.max(20, Math.min(80, newRatio)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div 
      className="flex h-full relative"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Editor Panel */}
      <div 
        className="overflow-hidden border-r border-zinc-700"
        style={{ width: `${splitRatio}%` }}
      >
        <MarkdownEditor content={content} onChange={onChange} theme={theme} />
      </div>

      {/* Resizer */}
      <div
        className={`w-1 bg-zinc-700 hover:bg-blue-500 cursor-col-resize flex items-center justify-center transition-colors ${
          isDragging ? 'bg-blue-500' : ''
        }`}
        onMouseDown={handleMouseDown}
      >
        <GripVertical className="w-4 h-4 text-zinc-500" />
      </div>

      {/* Preview Panel */}
      <div 
        className="overflow-y-auto flex-1"
        style={{ width: `${100 - splitRatio}%` }}
      >
        <MarkdownViewer content={content} headings={headings} />
      </div>
    </div>
  );
}
