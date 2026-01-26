import { useState, useCallback, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Titlebar } from './components/Titlebar/Titlebar';
import { MarkdownViewer } from './components/Viewer/MarkdownViewer';
import { MarkdownEditor } from './components/Editor/MarkdownEditor';
import { SplitView } from './components/SplitView/SplitView';
import { StatusBar } from './components/StatusBar/StatusBar';
import { SettingsModal } from './components/Settings/SettingsModal';
import { SearchBar } from './components/Search/SearchBar';
import { CommandPalette } from './components/CommandPalette/CommandPalette';
import { ViewModeToggle, ViewMode } from './components/Toolbar/ViewModeToggle';
import { WelcomeScreen } from './components/Welcome/WelcomeScreen';
import { useMarkdown } from './hooks/useMarkdown';
import { useTabs } from './hooks/useTabs';
import { useAppKeyboard } from './hooks/useKeyboard';
import { wails, FileNode } from './utils/wailsBindings';
import type { RecentFile } from './types';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [recentFiles] = useState<RecentFile[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [folderTree, setFolderTree] = useState<FileNode[]>([]);

  const { tabs, activeTab, activeTabId, setActiveTabId, addTab, closeTab, updateTabContent } = useTabs();

  const {
    content,
    filePath,
    isModified,
    openFile,
    saveFile,
    newFile,
    updateContent,
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

  // Handle content changes from editor
  const handleContentChange = useCallback((newContent: string) => {
    if (activeTab) {
      updateTabContent(activeTab.id, newContent);
    } else {
      updateContent(newContent);
    }
  }, [activeTab, updateTabContent, updateContent]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle image paste
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      // Only handle paste if we're in editor or split mode
      if (viewMode === 'preview') return;

      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (!file) continue;

          const reader = new FileReader();
          reader.onload = async (event) => {
            const base64Data = event.target?.result as string;
            const currentPath = activeTab?.filePath || filePath || '';
            const imagePath = await wails.savePastedImage(base64Data, currentPath);
            if (imagePath) {
              const imageMarkdown = `\n![Image](${imagePath})\n`;
              handleContentChange(activeContent + imageMarkdown);
            }
          };
          reader.readAsDataURL(file);
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [activeContent, activeTab, filePath, viewMode, handleContentChange]);

  // Handle drag and drop for files and images
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
          
          // Handle markdown files
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
          // Handle image files
          else if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = async (event) => {
              const base64Data = event.target?.result as string;
              const currentPath = activeTab?.filePath || filePath || '';
              const imagePath = await wails.savePastedImage(base64Data, currentPath);
              if (imagePath) {
                const imageMarkdown = `\n![${file.name}](${imagePath})\n`;
                handleContentChange(activeContent + imageMarkdown);
              }
            };
            reader.readAsDataURL(file);
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
  }, [addTab, closeTab, tabs, activeContent, activeTab, filePath, handleContentChange]);

  // Apply zoom level
  useEffect(() => {
    document.documentElement.style.setProperty('--zoom-level', `${zoom}%`);
  }, [zoom]);

  const handleOpen = useCallback(async () => {
    const result = await openFile();
    if (result) {
      addTab(result.name, result.path, result.content);
    }
  }, [openFile, addTab]);

  const handleOpenFolder = useCallback(async () => {
    const tree = await wails.openFolder();
    if (tree && tree.length > 0) {
      setFolderTree(tree);
      setSidebarOpen(true);
    }
  }, []);

  const handleFileTreeClick = useCallback(async (path: string) => {
    const content = await wails.readFileFromFolder(path);
    if (content) {
      const fileName = path.split('/').pop() || path.split('\\').pop() || 'Untitled';
      addTab(fileName, path, content);
    }
  }, [addTab]);

  const handleNew = useCallback(() => {
    if (tabs.length === 1 && tabs[0].fileName === 'Welcome to MarkView Pro' && !tabs[0].isModified) {
      closeTab(tabs[0].id);
    }
    newFile();
    addTab('New Document', null, '');
  }, [newFile, addTab]);

  const hasOpenFiles = tabs.length > 0;

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

  // Command palette commands
  const commands = useMemo(() => [
    {
      id: 'open-file',
      label: 'Open File',
      description: 'Open a markdown file',
      shortcut: 'Ctrl+O',
      action: handleOpen,
      category: 'File',
    },
    {
      id: 'open-folder',
      label: 'Open Folder',
      description: 'Open a folder as project',
      shortcut: 'Ctrl+Shift+O',
      action: handleOpenFolder,
      category: 'File',
    },
    {
      id: 'new-file',
      label: 'New File',
      description: 'Create a new markdown file',
      shortcut: 'Ctrl+N',
      action: handleNew,
      category: 'File',
    },
    {
      id: 'save',
      label: 'Save',
      description: 'Save current file',
      shortcut: 'Ctrl+S',
      action: handleSave,
      category: 'File',
    },
    {
      id: 'export-pdf',
      label: 'Export to PDF',
      description: 'Export document as PDF',
      shortcut: 'Ctrl+E',
      action: handleExportPDF,
      category: 'Export',
    },
    {
      id: 'export-html',
      label: 'Export to HTML',
      description: 'Export document as HTML',
      action: handleExportHTML,
      category: 'Export',
    },
    {
      id: 'toggle-split',
      label: 'Toggle Split View',
      description: 'Switch to split view mode',
      shortcut: 'Ctrl+\\',
      action: () => setViewMode(prev => prev === 'split' ? 'preview' : 'split'),
      category: 'View',
    },
    {
      id: 'preview-mode',
      label: 'Preview Mode',
      description: 'Switch to preview only mode',
      action: () => setViewMode('preview'),
      category: 'View',
    },
    {
      id: 'editor-mode',
      label: 'Editor Mode',
      description: 'Switch to editor only mode',
      action: () => setViewMode('editor'),
      category: 'View',
    },
    {
      id: 'toggle-sidebar',
      label: 'Toggle Sidebar',
      description: 'Show or hide sidebar',
      shortcut: 'Ctrl+B',
      action: handleToggleSidebar,
      category: 'View',
    },
    {
      id: 'toggle-search',
      label: 'Search in Document',
      description: 'Search for text in current document',
      shortcut: 'Ctrl+F',
      action: handleToggleSearch,
      category: 'View',
    },
    {
      id: 'toggle-fullscreen',
      label: 'Toggle Fullscreen',
      description: 'Enter or exit fullscreen mode',
      shortcut: 'F11',
      action: handleToggleFullscreen,
      category: 'View',
    },
    {
      id: 'zoom-in',
      label: 'Zoom In',
      description: 'Increase zoom level',
      shortcut: 'Ctrl++',
      action: handleZoomIn,
      category: 'View',
    },
    {
      id: 'zoom-out',
      label: 'Zoom Out',
      description: 'Decrease zoom level',
      shortcut: 'Ctrl+-',
      action: handleZoomOut,
      category: 'View',
    },
    {
      id: 'zoom-reset',
      label: 'Reset Zoom',
      description: 'Reset zoom to 100%',
      shortcut: 'Ctrl+0',
      action: handleZoomReset,
      category: 'View',
    },
    {
      id: 'settings',
      label: 'Settings',
      description: 'Open settings',
      action: handleToggleSettings,
      category: 'Other',
    },
    {
      id: 'print',
      label: 'Print',
      description: 'Print document',
      shortcut: 'Ctrl+P',
      action: handlePrint,
      category: 'Other',
    },
  ], [
    handleOpen,
    handleOpenFolder,
    handleNew,
    handleSave,
    handleExportPDF,
    handleExportHTML,
    handleToggleSidebar,
    handleToggleSearch,
    handleToggleFullscreen,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    handleToggleSettings,
    handlePrint,
  ]);

  // Enhanced keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command Palette
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      // Toggle Split View
      if (e.ctrlKey && e.key === '\\') {
        e.preventDefault();
        setViewMode(prev => prev === 'split' ? 'preview' : 'split');
      }
      // Open Folder
      if (e.ctrlKey && e.shiftKey && e.key === 'O') {
        e.preventDefault();
        handleOpenFolder();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleOpenFolder]);

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
            <div className="text-2xl font-semibold text-zinc-100">Drop Files Here</div>
            <div className="text-sm text-zinc-400 mt-2">Supports .md, .markdown, and image files</div>
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
          folderTree={folderTree}
          onFileClick={handleFileTreeClick}
          currentFilePath={activeTab?.filePath || filePath}
        />

        <main className="flex-1 overflow-hidden relative">
          {/* Show Welcome Screen when no files are open */}
          {tabs.length === 0 ? (
            <WelcomeScreen 
              onOpenFile={handleOpen}
              onOpenFolder={handleOpenFolder}
              onNewFile={handleNew}
            />
          ) : (
            <>
              {/* View Mode Toggle - only show when files are open */}
              <div className="absolute top-2 right-2 z-10">
                <ViewModeToggle mode={viewMode} onChange={setViewMode} />
              </div>

              {/* Search Bar */}
              <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} content={activeContent} />

              {/* Content Area */}
              {viewMode === 'preview' && (
                <div className="h-full overflow-y-auto">
                  <MarkdownViewer 
                    key={searchOpen ? 'search-open' : 'search-closed'} 
                    content={activeContent} 
                    headings={activeHeadings} 
                  />
                </div>
              )}

              {viewMode === 'editor' && (
                <div className="h-full">
                  <MarkdownEditor 
                    content={activeContent} 
                    onChange={handleContentChange}
                    theme="dark"
                  />
                </div>
              )}

              {viewMode === 'split' && (
                <SplitView
                  content={activeContent}
                  onChange={handleContentChange}
                  headings={activeHeadings}
                  theme="dark"
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Only show StatusBar when files are open */}
      {tabs.length > 0 && (
        <StatusBar
          filePath={activeTab?.filePath || filePath}
          wordCount={activeStats.wordCount}
          characterCount={activeStats.characterCount}
          lineCount={activeStats.lineCount}
          readingTime={Math.ceil(activeStats.wordCount / 200)}
          zoom={zoom}
          isModified={activeTab?.isModified || isModified}
          viewMode={viewMode}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onZoomReset={handleZoomReset}
        />
      )}

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <CommandPalette 
        isOpen={commandPaletteOpen} 
        onClose={() => setCommandPaletteOpen(false)}
        commands={commands}
      />
    </div>
  );
}
