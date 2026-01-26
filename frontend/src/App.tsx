import { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Titlebar } from './components/Titlebar/Titlebar';
import { MarkdownViewer } from './components/Viewer/MarkdownViewer';
import { StatusBar } from './components/StatusBar/StatusBar';
import { SettingsModal } from './components/Settings/SettingsModal';
import { SearchBar } from './components/Search/SearchBar';
import { useMarkdown } from './hooks/useMarkdown';
import { useAppKeyboard } from './hooks/useKeyboard';
import { wails } from './utils/wailsBindings';
import type { RecentFile } from './types';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [recentFiles] = useState<RecentFile[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Prevent default drag and drop behavior that opens files in browser
  useEffect(() => {
    const preventDefaults = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Prevent browser from opening dropped files
    document.addEventListener('dragover', preventDefaults);
    document.addEventListener('drop', preventDefaults);
    document.addEventListener('dragenter', preventDefaults);
    document.addEventListener('dragleave', preventDefaults);

    return () => {
      document.removeEventListener('dragover', preventDefaults);
      document.removeEventListener('drop', preventDefaults);
      document.removeEventListener('dragenter', preventDefaults);
      document.removeEventListener('dragleave', preventDefaults);
    };
  }, []);

  // Apply zoom level
  useEffect(() => {
    document.documentElement.style.setProperty('--zoom-level', `${zoom}%`);
  }, [zoom]);

  const {
    content,
    filePath,
    fileName,
    isModified,
    headings,
    stats,
    openFile,
    openFileByPath,
    saveFile,
    newFile,
  } = useMarkdown();

  // Listen for file drop events
  useEffect(() => {
    const handleFileDrop = (...args: unknown[]) => {
      const filePath = args[0] as string;
      if (filePath && (filePath.endsWith('.md') || filePath.endsWith('.markdown'))) {
        openFileByPath(filePath);
      }
    };

    wails.onEvent('file-dropped', handleFileDrop);

    return () => {
      wails.offEvent('file-dropped');
    };
  }, [openFileByPath]);

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
    } else {
      // Export current content directly
      await wails.exportContentToPDF(content);
    }
  }, [filePath, content]);

  const handleExportHTML = useCallback(async () => {
    await wails.exportToHTML(content);
  }, [content]);

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const handleToggleSettings = useCallback(() => {
    setSettingsOpen(prev => !prev);
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    wails.toggleFullscreen();
    setIsFullscreen(prev => !prev);
  }, []);

  const handleToggleSearch = useCallback(() => {
    setSearchOpen(prev => !prev);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 10, 200));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 10, 50));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoom(100);
  }, []);

  useAppKeyboard({
    onOpen: handleOpen,
    onSave: handleSave,
    onExport: handleExportPDF,
    onToggleSidebar: handleToggleSidebar,
    onToggleSettings: handleToggleSettings,
    onNew: newFile,
    onPrint: handlePrint,
    onToggleFullscreen: handleToggleFullscreen,
    onToggleSearch: handleToggleSearch,
    onZoomIn: handleZoomIn,
    onZoomOut: handleZoomOut,
    onZoomReset: handleZoomReset,
  });

  return (
    <div className="flex flex-col h-screen">
      <Titlebar
        fileName={fileName}
        isModified={isModified}
        onNew={newFile}
        onOpen={handleOpen}
        onSave={handleSave}
        onExportPDF={handleExportPDF}
        onExportHTML={handleExportHTML}
        onOpenSettings={() => setSettingsOpen(true)}
        onToggleSidebar={handleToggleSidebar}
        onPrint={handlePrint}
        onToggleFullscreen={handleToggleFullscreen}
        sidebarOpen={sidebarOpen}
        isFullscreen={isFullscreen}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={handleToggleSidebar}
          headings={headings}
          recentFiles={recentFiles}
        />

        <main className="flex-1 overflow-y-auto main-content relative">
          <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} content={content} />
          <MarkdownViewer content={content} headings={headings} />
        </main>
      </div>

      <StatusBar
        filePath={filePath}
        wordCount={stats.wordCount}
        characterCount={stats.characterCount}
        lineCount={stats.lineCount}
        readingTime={Math.ceil(stats.wordCount / 200)}
        zoom={zoom}
        isModified={isModified}
      />

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
