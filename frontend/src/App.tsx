import { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Toolbar } from './components/Toolbar/Toolbar';
import { MarkdownViewer } from './components/Viewer/MarkdownViewer';
import { StatusBar } from './components/StatusBar/StatusBar';
import { SettingsModal } from './components/Settings/SettingsModal';
import { useMarkdown } from './hooks/useMarkdown';
import { useAppKeyboard } from './hooks/useKeyboard';
import { wails } from './utils/wailsBindings';
import type { RecentFile } from './types';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [recentFiles] = useState<RecentFile[]>([]);

  const {
    content,
    filePath,
    fileName,
    isModified,
    headings,
    stats,
    openFile,
    saveFile,
    newFile,
  } = useMarkdown();

  const handleOpen = useCallback(async () => {
    await openFile();
  }, [openFile]);

  const handleSave = useCallback(async () => {
    if (filePath) {
      await saveFile();
    }
  }, [filePath, saveFile]);

  const handleExportPDF = useCallback(async () => {
    if (filePath) {
      await wails.exportToPDF(filePath);
    }
  }, [filePath]);

  const handleExportHTML = useCallback(async () => {
    const path = await wails.saveFileDialog(fileName || 'document.html');
    if (path) {
      await wails.exportToHTML(content, path);
    }
  }, [content, fileName]);

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const handleToggleSettings = useCallback(() => {
    setSettingsOpen(prev => !prev);
  }, []);

  useAppKeyboard({
    onOpen: handleOpen,
    onSave: handleSave,
    onExport: handleExportPDF,
    onToggleSidebar: handleToggleSidebar,
    onToggleSettings: handleToggleSettings,
    onNew: newFile,
  });

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <Toolbar
        fileName={fileName}
        isModified={isModified}
        onNew={newFile}
        onOpen={handleOpen}
        onSave={handleSave}
        onExportPDF={handleExportPDF}
        onExportHTML={handleExportHTML}
        onOpenSettings={() => setSettingsOpen(true)}
        onToggleSidebar={handleToggleSidebar}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={handleToggleSidebar}
          headings={headings}
          recentFiles={recentFiles}
        />

        <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
          <MarkdownViewer content={content} headings={headings} />
        </main>
      </div>

      <StatusBar
        filePath={filePath}
        wordCount={stats.wordCount}
        characterCount={stats.characterCount}
        lineCount={stats.lineCount}
        isModified={isModified}
      />

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
