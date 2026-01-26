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
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1" title="File path">
          <FileText className="w-3 h-3" />
          <span className="truncate max-w-[200px]">
            {filePath ? filePath.split(/[/\\]/).pop() : 'No file open'}
          </span>
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

        <div className="flex items-center gap-1.5">
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
