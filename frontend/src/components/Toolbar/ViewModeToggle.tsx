import { Eye, Code, Columns } from 'lucide-react';

export type ViewMode = 'preview' | 'editor' | 'split';

interface ViewModeToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewModeToggle({ mode, onChange }: ViewModeToggleProps) {
  return (
    <div className="flex items-center gap-0.5 bg-zinc-800/90 backdrop-blur-sm rounded-md p-0.5 shadow-lg border border-zinc-700">
      <button
        onClick={() => onChange('preview')}
        className={`px-2 py-1 rounded flex items-center gap-1.5 transition-colors ${
          mode === 'preview'
            ? 'bg-zinc-700 text-zinc-100'
            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50'
        }`}
        title="Preview Only (Ctrl+1)"
      >
        <Eye className="w-3.5 h-3.5" />
        <span className="text-xs font-medium">Preview</span>
      </button>
      
      <button
        onClick={() => onChange('split')}
        className={`px-2 py-1 rounded flex items-center gap-1.5 transition-colors ${
          mode === 'split'
            ? 'bg-zinc-700 text-zinc-100'
            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50'
        }`}
        title="Split View (Ctrl+\)"
      >
        <Columns className="w-3.5 h-3.5" />
        <span className="text-xs font-medium">Split</span>
      </button>
      
      <button
        onClick={() => onChange('editor')}
        className={`px-2 py-1 rounded flex items-center gap-1.5 transition-colors ${
          mode === 'editor'
            ? 'bg-zinc-700 text-zinc-100'
            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50'
        }`}
        title="Editor Only (Ctrl+2)"
      >
        <Code className="w-3.5 h-3.5" />
        <span className="text-xs font-medium">Editor</span>
      </button>
    </div>
  );
}
