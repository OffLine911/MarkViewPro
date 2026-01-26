export interface Settings {
  theme: 'light' | 'dark' | 'system';
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  sidebarWidth: number;
  showLineNumbers: boolean;
  autoSave: boolean;
  autoSaveDelay: number;
  wordWrap: boolean;
  autoReload: boolean;
  editorTheme: string;
  previewTheme: string;
  syncScroll: boolean;
  spellCheck: boolean;
}

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export interface RecentFile {
  path: string;
  name: string;
  lastOpened: Date;
}

export interface MarkdownState {
  content: string;
  filePath: string | null;
  fileName: string | null;
  isModified: boolean;
  wordCount: number;
  characterCount: number;
  headings: HeadingItem[];
}

export interface AppState {
  sidebarOpen: boolean;
  settingsOpen: boolean;
  activeTab: 'toc' | 'recent';
}
