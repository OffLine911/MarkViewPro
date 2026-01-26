import { Eye, Code, Columns } from 'lucide-react';

export type ViewMode = 'preview' | 'editor' | 'split';

interface ViewModeToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewModeToggle({ mode, onChange }: ViewModeToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-zinc-800 rounded-lg p-1">
      <button
        onClick={() => onChange('preview')}
        className={`px-3 py-1.5 rounded flex items-center gap-2 transition-colors ${
          mode === 'preview'
            ? 'bg-zinc-700 text-zinc-100'
            : 'text-zinc-400 hover:text-zinc-200'
        }`}
        title="Preview Only"
      >
        <Eye className="w-4 h-4" />
        <span className="text-sm">Preview</span>
      </button>
      
      <button
        onClick={() => onChange('split')}
        className={`px-3 py-1.5 rounded flex items-center gap-2 transition-colors ${
          mode === 'split'
            ? 'bg-zinc-700 text-zinc-100'
            : 'text-zinc-400 hover:text-zinc-200'
        }`}
        title="Split View"
      >
        <Columns className="w-4 h-4" />
        <span className="text-sm">Split</span>
      </button>
      
      <button
        onClick={() => onChange('editor')}
        className={`px-3 py-1.5 rounded flex items-center gap-2 transition-colors ${
          mode === 'editor'
            ? 'bg-zinc-700 text-zinc-100'
            : 'text-zinc-400 hover:text-zinc-200'
        }`}
        title="Editor Only"
      >
        <Code className="w-4 h-4" />
        <span className="text-sm">Editor</span>
      </button>
    </div>
  );
}
