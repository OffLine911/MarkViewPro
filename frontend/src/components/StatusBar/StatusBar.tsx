import { FileText, Hash, Type, AlignLeft } from 'lucide-react';

interface StatusBarProps {
  filePath: string | null;
  wordCount: number;
  characterCount: number;
  lineCount: number;
  isModified: boolean;
}

export function StatusBar({
  filePath,
  wordCount,
  characterCount,
  lineCount,
  isModified,
}: StatusBarProps) {
  return (
    <div className="statusbar">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5" title="File path">
          <FileText className="w-3.5 h-3.5" />
          <span className="truncate max-w-xs">
            {filePath || 'No file open'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5" title="Lines">
          <AlignLeft className="w-3.5 h-3.5" />
          <span>{lineCount} lines</span>
        </div>

        <div className="flex items-center gap-1.5" title="Words">
          <Type className="w-3.5 h-3.5" />
          <span>{wordCount} words</span>
        </div>

        <div className="flex items-center gap-1.5" title="Characters">
          <Hash className="w-3.5 h-3.5" />
          <span>{characterCount} chars</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              isModified ? 'bg-amber-500' : 'bg-green-500'
            }`}
          />
          <span>{isModified ? 'Modified' : 'Saved'}</span>
        </div>
      </div>
    </div>
  );
}
