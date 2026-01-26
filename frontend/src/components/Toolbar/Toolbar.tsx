import { useState } from 'react';
import {
  FolderOpen,
  Download,
  Sun,
  Moon,
  Settings,
  FilePlus,
  Save,
  FileText,
  FileCode,
  Menu,
} from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

interface ToolbarProps {
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

export function Toolbar({
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
}: ToolbarProps) {
  const { settings, updateSettings, isDark } = useSettings();
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  const toggleTheme = () => {
    const newTheme = settings.theme === 'dark' ? 'light' : settings.theme === 'light' ? 'dark' : isDark ? 'light' : 'dark';
    updateSettings({ theme: newTheme });
  };

  return (
    <div className="toolbar drag">
      <div className="flex items-center gap-1 no-drag">
        <button
          onClick={onToggleSidebar}
          className="btn-icon"
          title={sidebarOpen ? 'Hide sidebar (Ctrl+B)' : 'Show sidebar (Ctrl+B)'}
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

        <button onClick={onNew} className="btn-icon" title="New file (Ctrl+N)">
          <FilePlus className="w-5 h-5" />
        </button>

        <button onClick={onOpen} className="btn-icon" title="Open file (Ctrl+O)">
          <FolderOpen className="w-5 h-5" />
        </button>

        <button onClick={onSave} className="btn-icon" title="Save file (Ctrl+S)">
          <Save className="w-5 h-5" />
        </button>

        <div className="relative">
          <button
            onClick={() => setExportMenuOpen(!exportMenuOpen)}
            className="btn-icon"
            title="Export (Ctrl+E)"
          >
            <Download className="w-5 h-5" />
          </button>

          {exportMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setExportMenuOpen(false)}
              />
              <div className="absolute top-full left-0 mt-1 z-20 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-40 animate-fade-in">
                <button
                  onClick={() => {
                    onExportPDF();
                    setExportMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FileText className="w-4 h-4" />
                  Export as PDF
                </button>
                <button
                  onClick={() => {
                    onExportHTML();
                    setExportMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FileCode className="w-4 h-4" />
                  Export as HTML
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center min-w-0 px-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 truncate">
          <FileText className="w-4 h-4 flex-shrink-0" />
          <span className="truncate font-medium">
            {fileName || 'Untitled'}
          </span>
          {isModified && (
            <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" title="Unsaved changes" />
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 no-drag">
        <button onClick={toggleTheme} className="btn-icon" title="Toggle theme">
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button onClick={onOpenSettings} className="btn-icon" title="Settings (Ctrl+,)">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
