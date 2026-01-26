import { FileText, FolderOpen, Search, Command, Columns } from 'lucide-react';

interface WelcomeScreenProps {
  onOpenFile: () => void;
  onOpenFolder: () => void;
  onNewFile: () => void;
}

export function WelcomeScreen({ onOpenFile, onOpenFolder, onNewFile }: WelcomeScreenProps) {
  return (
    <div className="flex items-center justify-center h-full bg-zinc-950">
      <div className="text-center space-y-12 px-8 max-w-2xl">
        {/* Logo and Title */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-zinc-100 tracking-tight">
            MarkView<span className="text-cyan-500">Pro</span>
          </h1>
          <p className="text-xl text-zinc-400 font-light">
            Professional Markdown Editor & Viewer
          </p>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <button
            onClick={onOpenFile}
            className="group w-full flex items-center justify-between px-6 py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-cyan-500/50 rounded-lg transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <FileText className="w-5 h-5 text-cyan-500" />
              <span className="text-zinc-200 font-medium">Open File</span>
            </div>
            <kbd className="px-3 py-1 text-xs font-mono bg-zinc-800 text-zinc-400 rounded border border-zinc-700 group-hover:border-cyan-500/50 transition-colors">
              Ctrl+O
            </kbd>
          </button>

          <button
            onClick={onOpenFolder}
            className="group w-full flex items-center justify-between px-6 py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-cyan-500/50 rounded-lg transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <FolderOpen className="w-5 h-5 text-cyan-500" />
              <span className="text-zinc-200 font-medium">Open Folder</span>
            </div>
            <kbd className="px-3 py-1 text-xs font-mono bg-zinc-800 text-zinc-400 rounded border border-zinc-700 group-hover:border-cyan-500/50 transition-colors">
              Ctrl+Shift+O
            </kbd>
          </button>

          <button
            onClick={onNewFile}
            className="group w-full flex items-center justify-between px-6 py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-cyan-500/50 rounded-lg transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <FileText className="w-5 h-5 text-cyan-500" />
              <span className="text-zinc-200 font-medium">New File</span>
            </div>
            <kbd className="px-3 py-1 text-xs font-mono bg-zinc-800 text-zinc-400 rounded border border-zinc-700 group-hover:border-cyan-500/50 transition-colors">
              Ctrl+N
            </kbd>
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-4 pt-8 border-t border-zinc-800">
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-zinc-900/50 transition-colors">
            <Columns className="w-6 h-6 text-cyan-500/70" />
            <span className="text-xs text-zinc-500 font-medium">Split View</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-zinc-900/50 transition-colors">
            <Search className="w-6 h-6 text-cyan-500/70" />
            <span className="text-xs text-zinc-500 font-medium">Search</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-zinc-900/50 transition-colors">
            <Command className="w-6 h-6 text-cyan-500/70" />
            <span className="text-xs text-zinc-500 font-medium">Commands</span>
          </div>
        </div>

        {/* Drop Zone Hint */}
        <div className="pt-4">
          <p className="text-sm text-zinc-600 flex items-center justify-center gap-2">
            <span className="px-2 py-1 bg-zinc-900 rounded text-zinc-500 text-xs font-mono">Drop</span>
            <span>.md files here to open</span>
          </p>
        </div>
      </div>
    </div>
  );
}
