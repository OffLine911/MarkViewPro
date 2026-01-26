import { FileText, Hash, Type, AlignLeft, Clock, ZoomIn, ZoomOut, Eye, Code, Columns } from 'lucide-react';
import type { ViewMode } from '../Toolbar/ViewModeToggle';

interface StatusBarProps {
  filePath: string | null;
  wordCount: number;
  characterCount: number;
  lineCount: number;
  readingTime: number;
  zoom: number;
  isModified: boolean;
  viewMode?: ViewMode;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
}

export function StatusBar({
  filePath,
  wordCount,
  characterCount,
  lineCount,
  readingTime,
  zoom,
  isModified,
  viewMode = 'preview',
  onZoomIn,
  onZoomOut,
  onZoomReset,
}: StatusBarProps) {
  const viewModeIcons = {
    preview: <Eye className="w-3 h-3" />,
    editor: <Code className="w-3 h-3" />,
    split: <Columns className="w-3 h-3" />,
  };

  const viewModeLabels = {
    preview: 'Preview',
    editor: 'Editor',
    split: 'Split',
  };

  return (
    <div className="statusbar">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1" title="File path">
          <FileText className="w-3 h-3" />
          <span className="truncate max-w-[200px]">
            {filePath ? filePath.split(/[/\\]/).pop() : 'No file open'}
          </span>
        </div>

        <div className="flex items-center gap-1" title="View mode">
          {viewModeIcons[viewMode]}
          <span>{viewModeLabels[viewMode]}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1" title="Lines">
          <AlignLeft className="w-3 h-3" />
          <span>{lineCount}</span>
        </div>

        <div className="flex items-center gap-1" title="Words">
          <Type className="w-3 h-3" />
          <span>{wordCount}</span>
        </div>

        <div className="flex items-center gap-1" title="Characters">
          <Hash className="w-3 h-3" />
          <span>{characterCount}</span>
        </div>

        <div className="flex items-center gap-1" title="Reading time (200 words/min)">
          <Clock className="w-3 h-3" />
          <span>{readingTime} min</span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 border-l border-zinc-800 pl-3">
          <button
            onClick={onZoomOut}
            className="p-0.5 hover:bg-zinc-800 rounded transition-colors"
            title="Zoom Out (Ctrl+-)"
          >
            <ZoomOut className="w-3 h-3" />
          </button>
          <button
            onClick={onZoomReset}
            className="px-1.5 py-0.5 hover:bg-zinc-800 rounded transition-colors min-w-[40px] text-center"
            title="Reset Zoom (Ctrl+0)"
          >
            {zoom}%
          </button>
          <button
            onClick={onZoomIn}
            className="p-0.5 hover:bg-zinc-800 rounded transition-colors"
            title="Zoom In (Ctrl++)"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 border-l border-zinc-800 pl-3">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isModified ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
          />
          <span>{isModified ? 'Modified' : 'Saved'}</span>
        </div>
      </div>
    </div>
  );
}
