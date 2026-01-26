import { useState } from 'react';
import {
  Minus,
  Square,
  X,
  FolderOpen,
  Download,
  Sun,
  Moon,
  Settings,
  FilePlus,
  Save,
  FileText,
  FileCode,
  PanelLeftClose,
  PanelLeft,
  Copy,
} from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

interface TitlebarProps {
  fileName: string | null;
  isModified: boolean;
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
  onExportPDF: () => void;
  onExportHTML: () => void;
  onOpenSettings: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export function Titlebar({
  fileName,
  isModified,
  onNew,
  onOpen,
  onSave,
  onExportPDF,
  onExportHTML,
  onOpenSettings,
  onToggleSidebar,
  sidebarOpen,
}: TitlebarProps) {
  const { settings, updateSettings, isDark } = useSettings();
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const toggleTheme = () => {
    if (settings.theme === 'dark') {
      updateSettings({ theme: 'light' });
    } else if (settings.theme === 'light') {
      updateSettings({ theme: 'dark' });
    } else {
      updateSettings({ theme: isDark ? 'light' : 'dark' });
    }
  };

  const handleMinimize = () => {
    (window as any).runtime?.WindowMinimise();
  };
  
  const handleMaximize = () => {
    (window as any).runtime?.WindowToggleMaximise();
    setIsMaximized(!isMaximized);
  };
  
  const handleClose = () => {
    (window as any).runtime?.Quit();
  };

  return (
    <div 
      className="flex items-center h-10 px-2 select-none titlebar-bg wails-drag"
    >
      <div className="flex items-center gap-0.5 wails-no-drag">
        <div className="flex items-center gap-1.5 px-2 mr-1">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-cyan-400 to-blue-500" />
          <span className="text-xs font-semibold text-zinc-300 dark:text-zinc-300 titlebar-text">MarkViewPro</span>
        </div>

        <div className="h-4 w-px bg-zinc-700 mx-1" />

        <button
          onClick={onToggleSidebar}
          className="titlebar-btn"
          title={sidebarOpen ? 'Hide sidebar (Ctrl+B)' : 'Show sidebar (Ctrl+B)'}
        >
          {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
        </button>

        <div className="h-4 w-px bg-zinc-700 mx-1" />

        <button onClick={onNew} className="titlebar-btn" title="New (Ctrl+N)">
          <FilePlus className="w-4 h-4" />
        </button>

        <button onClick={onOpen} className="titlebar-btn" title="Open (Ctrl+O)">
          <FolderOpen className="w-4 h-4" />
        </button>

        <button onClick={onSave} className="titlebar-btn" title="Save (Ctrl+S)">
          <Save className="w-4 h-4" />
        </button>

        <div className="relative">
          <button
            onClick={() => setExportMenuOpen(!exportMenuOpen)}
            className="titlebar-btn"
            title="Export (Ctrl+E)"
          >
            <Download className="w-4 h-4" />
          </button>

          {exportMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setExportMenuOpen(false)} />
              <div className="absolute top-full left-0 mt-1 z-20 bg-zinc-800 rounded-md shadow-xl border border-zinc-700 py-1 min-w-36 animate-fade-in">
                <button
                  onClick={() => { onExportPDF(); setExportMenuOpen(false); }}
                  className="dropdown-item"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Export PDF
                </button>
                <button
                  onClick={() => { onExportHTML(); setExportMenuOpen(false); }}
                  className="dropdown-item"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  Export HTML
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center min-w-0">
        <div className="flex items-center gap-2 text-xs text-zinc-400 truncate select-none wails-no-drag">
          <FileText className="w-3.5 h-3.5 flex-shrink-0 text-zinc-500" />
          <span className="truncate font-medium text-zinc-300">
            {fileName || 'Untitled'}
          </span>
          {isModified && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" title="Unsaved changes" />
          )}
        </div>
      </div>

      <div className="flex items-center gap-0.5 wails-no-drag">
        <button onClick={toggleTheme} className="titlebar-btn" title="Toggle theme">
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button onClick={onOpenSettings} className="titlebar-btn" title="Settings (Ctrl+,)">
          <Settings className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-zinc-700 mx-1" />

        <button onClick={handleMinimize} className="window-btn hover:bg-zinc-700" title="Minimize">
          <Minus className="w-4 h-4" />
        </button>

        <button onClick={handleMaximize} className="window-btn hover:bg-zinc-700" title="Maximize">
          {isMaximized ? <Copy className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
        </button>

        <button onClick={handleClose} className="window-btn hover:bg-red-600" title="Close">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
