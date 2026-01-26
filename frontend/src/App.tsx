import { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Titlebar } from './components/Titlebar/Titlebar';
import { TabBar } from './components/TabBar/TabBar';
import { MarkdownViewer } from './components/Viewer/MarkdownViewer';
import { StatusBar } from './components/StatusBar/StatusBar';
import { SettingsModal } from './components/Settings/SettingsModal';
import { SearchBar } from './components/Search/SearchBar';
import { useMarkdown } from './hooks/useMarkdown';
import { useTabs } from './hooks/useTabs';
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
  const [isDragging, setIsDragging] = useState(false);

  const { tabs, activeTab, activeTabId, setActiveTabId, addTab, closeTab } = useTabs();

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

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle drag and drop
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.clientX === 0 && e.clientY === 0) {
        setIsDragging(false);
      }
    };

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (file.name.endsWith('.md') || file.name.endsWith('.markdown')) {
            const reader = new FileReader();
            reader.onload = async (event) => {
              const content = event.target?.result as string;
              if (content) {
                addTab(file.name, null, content);
              }
            };
            reader.readAsText(file);
          }
        }
      }
    };

    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('drop', handleDrop);

    return () => {
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('drop', handleDrop);
    };
  }, [addTab]);

  // Apply zoom level
  useEffect(() => {
    document.documentElement.style.setProperty('--zoom-level', `${zoom}%`);
  }, [zoom]);

  const handleOpen = useCallback(async () => {
    const result = await openFile();
    if (result) {
      addTab(fileName || 'Untitled', filePath, content);
    }
  }, [openFile, addTab, fileName, filePath, content]);

  const handleNew = useCallback(() => {
    newFile();
    addTab('New Document', null, '');
  }, [newFile, addTab]);

  const handleSave = useCallback(async () => {
    if (filePath) {
      await saveFile();
    }
  }, [filePath, saveFile]);

  const handleExportPDF = useCallback(async () => {
    if (filePath) {
      await wails.exportToPDF(filePath);
    } else {
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
    onNew: handleNew,
    onPrint: handlePrint,
    onToggleFullscreen: handleToggleFullscreen,
    onToggleSearch: handleToggleSearch,
    onZoomIn: handleZoomIn,
    onZoomOut: handleZoomOut,
    onZoomReset: handleZoomReset,
  });

  return (
    <div className="flex flex-col h-screen">
      {isDragging && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-sm pointer-events-none">
          <div className="text-center">
            <div className="text-6xl mb-4">📄</div>
            <div className="text-2xl font-semibold text-zinc-100">Drop Markdown Files Here</div>
            <div className="text-sm text-zinc-400 mt-2">Supports .md and .markdown files</div>
          </div>
        </div>
      )}

      <Titlebar
        fileName={fileName}
        isModified={isModified}
        onNew={handleNew}
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

      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onTabClick={setActiveTabId}
        onTabClose={closeTab}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={handleToggleSidebar}
          headings={headings}
          recentFiles={recentFiles}
        />

        <main className="flex-1 overflow-y-auto main-content relative">
          <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} content={activeTab?.content || content} />
          <MarkdownViewer content={activeTab?.content || content} headings={headings} />
        </main>
      </div>

      <StatusBar
        filePath={activeTab?.filePath || filePath}
        wordCount={stats.wordCount}
        characterCount={stats.characterCount}
        lineCount={stats.lineCount}
        readingTime={Math.ceil(stats.wordCount / 200)}
        zoom={zoom}
        isModified={activeTab?.isModified || isModified}
      />

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
