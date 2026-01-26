import { useState, useCallback, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Titlebar } from './components/Titlebar/Titlebar';
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
  const [sidebarOpen, setSidebarOpen] = useState(false); // Changed to false - collapsed by default
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
    openFile,
    saveFile,
    newFile,
  } = useMarkdown();

  // Extract headings from active tab content
  const activeContent = activeTab?.content || content;
  const activeHeadings = useMemo(() => {
    const lines = activeContent.split('\n');
    const headings: Array<{ id: string; text: string; level: number }> = [];
    
    lines.forEach((line, index) => {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        headings.push({ id, text, level });
      }
    });
    
    return headings;
  }, [activeContent]);

  // Calculate stats for active tab
  const activeStats = useMemo(() => {
    const wordCount = activeContent
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`[^`]+`/g, '')
      .replace(/[#*_\[\]()]/g, '')
      .trim()
      .split(/\s+/)
      .filter(word => word.length > 0).length;
    
    const characterCount = activeContent.replace(/\s/g, '').length;
    const lineCount = activeContent.split('\n').length;
    
    return { wordCount, characterCount, lineCount };
  }, [activeContent]);

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
        // If this is the welcome tab and it's not modified, close it before adding new files
        if (tabs.length === 1 && tabs[0].fileName === 'Welcome to MarkView Pro' && !tabs[0].isModified) {
          closeTab(tabs[0].id);
        }

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
  }, [addTab, closeTab, tabs]);

  // Apply zoom level
  useEffect(() => {
    document.documentElement.style.setProperty('--zoom-level', `${zoom}%`);
  }, [zoom]);

  const handleOpen = useCallback(async () => {
    const result = await openFile();
    if (result) {
      // If this is the welcome tab and it's not modified, replace it
      if (tabs.length === 1 && tabs[0].fileName === 'Welcome to MarkView Pro' && !tabs[0].isModified) {
        closeTab(tabs[0].id);
      }
      addTab(fileName || 'Untitled', filePath, content);
    }
  }, [openFile, addTab, closeTab, tabs, fileName, filePath, content]);

  const handleNew = useCallback(() => {
    // If this is the welcome tab and it's not modified, replace it
    if (tabs.length === 1 && tabs[0].fileName === 'Welcome to MarkView Pro' && !tabs[0].isModified) {
      closeTab(tabs[0].id);
    }
    newFile();
    addTab('New Document', null, '');
  }, [newFile, addTab, closeTab, tabs]);

  // Check if we have any real files open (not just welcome screen)
  const hasOpenFiles = tabs.length > 1 || (tabs.length === 1 && tabs[0].fileName !== 'Welcome to MarkView Pro');

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
        hasOpenFiles={hasOpenFiles}
        tabs={tabs}
        activeTabId={activeTabId}
        onTabClick={setActiveTabId}
        onTabClose={closeTab}
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

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={handleToggleSidebar}
          headings={activeHeadings}
          recentFiles={recentFiles}
        />

        <main className="flex-1 overflow-y-auto main-content relative">
          <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} content={activeContent} />
          <MarkdownViewer key={searchOpen ? 'search-open' : 'search-closed'} content={activeContent} headings={activeHeadings} />
        </main>
      </div>

      <StatusBar
        filePath={activeTab?.filePath || filePath}
        wordCount={activeStats.wordCount}
        characterCount={activeStats.characterCount}
        lineCount={activeStats.lineCount}
        readingTime={Math.ceil(activeStats.wordCount / 200)}
        zoom={zoom}
        isModified={activeTab?.isModified || isModified}
      />

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
