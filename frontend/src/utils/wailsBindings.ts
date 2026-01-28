declare global {
  interface Window {
    go?: {
      main?: {
        App?: {
          OpenFile: () => Promise<{ content: string; path: string; name: string }>;
          SaveFile: (path: string, content: string) => Promise<void>;
          SaveFileAs: (content: string) => Promise<string>;
          ExportToPDF: (path: string) => Promise<void>;
          ExportContentToPDF: (content: string) => Promise<void>;
          ExportToHTML: (content: string) => Promise<void>;
          GetRecentFiles: () => Promise<Array<{ path: string; name: string; accessedAt: string }>>;
          OpenFileDialog: () => Promise<string>;
          SaveFileDialog: (defaultName: string) => Promise<string>;
          ReadFileByPath: (path: string) => Promise<{ content: string; path: string; name: string }>;
          ToggleFullscreen: () => void;
          OpenFolder: () => Promise<FileNode[]>;
          GetFolderTree: (path: string) => Promise<FileNode[]>;
          ReadFileFromFolder: (path: string) => Promise<string>;
          SavePastedImage: (base64Data: string, documentPath: string) => Promise<string>;
          CopyImageToAssets: (sourcePath: string, documentPath: string) => Promise<string>;
          GetInitialFile: () => Promise<string>;
          GetSettings: () => Promise<BackendSettings>;
          UpdateSettings: (settings: BackendSettings) => Promise<void>;
          StartWatching: (path: string) => Promise<void>;
          StopWatching: () => Promise<void>;
        };
      };
    };
    runtime?: {
      EventsOn: (eventName: string, callback: (...args: unknown[]) => void) => void;
      EventsOff: (eventName: string) => void;
      EventsEmit: (eventName: string, ...args: unknown[]) => void;
      WindowMinimise: () => void;
      WindowMaximise: () => void;
      WindowUnmaximise: () => void;
      WindowToggleMaximise: () => void;
      WindowClose: () => void;
      Quit: () => void;
    };
  }
}

export interface BackendSettings {
  theme: string;
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  editorTheme: string;
  previewTheme: string;
  autoSave: boolean;
  autoSaveDelay: number;
  autoReload: boolean;
  syncScroll: boolean;
  showLineNumbers: boolean;
  wordWrap: boolean;
  spellCheck: boolean;
  openInNewTab: boolean;
}

export interface FileNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileNode[];
}

export const wails = {
  async openFile(): Promise<{ content: string; path: string; name: string } | null> {
    try {
      if (window.go?.main?.App?.OpenFile) {
        const result = await window.go.main.App.OpenFile();
        if (!result) return null;
        return result as { content: string; path: string; name: string };
      }
      return null;
    } catch (error) {
      console.error('Failed to open file:', error);
      return null;
    }
  },

  async saveFile(path: string, content: string): Promise<boolean> {
    try {
      if (window.go?.main?.App?.SaveFile) {
        await window.go.main.App.SaveFile(path, content);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to save file:', error);
      return false;
    }
  },

  async saveFileAs(content: string): Promise<string | null> {
    try {
      if (window.go?.main?.App?.SaveFileAs) {
        const path = await window.go.main.App.SaveFileAs(content);
        return path || null;
      }
      return null;
    } catch (error) {
      console.error('Failed to save file as:', error);
      return null;
    }
  },

  async exportToPDF(path: string): Promise<boolean> {
    try {
      if (window.go?.main?.App?.ExportToPDF) {
        await window.go.main.App.ExportToPDF(path);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to export to PDF:', error);
      return false;
    }
  },

  async exportContentToPDF(content: string): Promise<boolean> {
    try {
      if (window.go?.main?.App?.ExportContentToPDF) {
        await window.go.main.App.ExportContentToPDF(content);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to export content to PDF:', error);
      return false;
    }
  },

  async exportToHTML(content: string): Promise<boolean> {
    try {
      if (window.go?.main?.App?.ExportToHTML) {
        await window.go.main.App.ExportToHTML(content);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to export to HTML:', error);
      return false;
    }
  },

  async getRecentFiles(): Promise<Array<{ path: string; name: string; lastOpened: Date }>> {
    try {
      if (window.go?.main?.App?.GetRecentFiles) {
        const files = await window.go.main.App.GetRecentFiles();
        return files.map((f: any) => ({
          path: f.path,
          name: f.name,
          lastOpened: new Date(f.accessedAt || f.lastOpened),
        }));
      }
      return [];
    } catch (error) {
      console.error('Failed to get recent files:', error);
      return [];
    }
  },

  async openFileDialog(): Promise<string | null> {
    try {
      if (window.go?.main?.App?.OpenFileDialog) {
        return await window.go.main.App.OpenFileDialog();
      }
      return null;
    } catch (error) {
      console.error('Failed to open file dialog:', error);
      return null;
    }
  },

  async saveFileDialog(defaultName: string): Promise<string | null> {
    try {
      if (window.go?.main?.App?.SaveFileDialog) {
        return await window.go.main.App.SaveFileDialog(defaultName);
      }
      return null;
    } catch (error) {
      console.error('Failed to open save dialog:', error);
      return null;
    }
  },

  async readFileByPath(path: string): Promise<{ content: string; path: string; name: string } | null> {
    try {
      if (window.go?.main?.App?.ReadFileByPath) {
        const result = await window.go.main.App.ReadFileByPath(path);
        if (!result) return null;
        return result as { content: string; path: string; name: string };
      }
      return null;
    } catch (error) {
      console.error('Failed to read file:', error);
      return null;
    }
  },

  onEvent(eventName: string, callback: (...args: unknown[]) => void): void {
    window.runtime?.EventsOn(eventName, callback);
  },

  offEvent(eventName: string): void {
    window.runtime?.EventsOff(eventName);
  },

  emit(eventName: string, ...args: unknown[]): void {
    window.runtime?.EventsEmit(eventName, ...args);
  },

  minimize(): void {
    window.runtime?.WindowMinimise();
  },

  maximize(): void {
    window.runtime?.WindowToggleMaximise();
  },

  close(): void {
    window.runtime?.WindowClose();
  },

  quit(): void {
    window.runtime?.Quit();
  },

  toggleFullscreen(): void {
    if (window.go?.main?.App?.ToggleFullscreen) {
      window.go.main.App.ToggleFullscreen();
    }
  },

  async openFolder(): Promise<FileNode[]> {
    try {
      if (window.go?.main?.App?.OpenFolder) {
        return await window.go.main.App.OpenFolder() || [];
      }
      return [];
    } catch (error) {
      console.error('Failed to open folder:', error);
      return [];
    }
  },

  async getFolderTree(path: string): Promise<FileNode[]> {
    try {
      if (window.go?.main?.App?.GetFolderTree) {
        return await window.go.main.App.GetFolderTree(path) || [];
      }
      return [];
    } catch (error) {
      console.error('Failed to get folder tree:', error);
      return [];
    }
  },

  async readFileFromFolder(path: string): Promise<string | null> {
    try {
      if (window.go?.main?.App?.ReadFileFromFolder) {
        return await window.go.main.App.ReadFileFromFolder(path);
      }
      return null;
    } catch (error) {
      console.error('Failed to read file from folder:', error);
      return null;
    }
  },

  async savePastedImage(base64Data: string, documentPath: string): Promise<string | null> {
    try {
      if (window.go?.main?.App?.SavePastedImage) {
        return await window.go.main.App.SavePastedImage(base64Data, documentPath);
      }
      return null;
    } catch (error) {
      console.error('Failed to save pasted image:', error);
      return null;
    }
  },

  async copyImageToAssets(sourcePath: string, documentPath: string): Promise<string | null> {
    try {
      if (window.go?.main?.App?.CopyImageToAssets) {
        return await window.go.main.App.CopyImageToAssets(sourcePath, documentPath);
      }
      return null;
    } catch (error) {
      console.error('Failed to copy image to assets:', error);
      return null;
    }
  },

  async getInitialFile(): Promise<string | null> {
    try {
      if (window.go?.main?.App?.GetInitialFile) {
        const path = await window.go.main.App.GetInitialFile();
        return path || null;
      }
      return null;
    } catch (error) {
      console.error('Failed to get initial file:', error);
      return null;
    }
  },

  async getSettings(): Promise<BackendSettings | null> {
    try {
      if (window.go?.main?.App?.GetSettings) {
        return await window.go.main.App.GetSettings();
      }
      return null;
    } catch (error) {
      console.error('Failed to get settings:', error);
      return null;
    }
  },

  async updateSettings(settings: BackendSettings): Promise<boolean> {
    try {
      if (window.go?.main?.App?.UpdateSettings) {
        await window.go.main.App.UpdateSettings(settings);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update settings:', error);
      return false;
    }
  },

  async startWatching(path: string): Promise<boolean> {
    try {
      if (window.go?.main?.App?.StartWatching) {
        await window.go.main.App.StartWatching(path);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to start watching:', error);
      return false;
    }
  },

  stopWatching(): void {
    try {
      if (window.go?.main?.App?.StopWatching) {
        window.go.main.App.StopWatching();
      }
    } catch (error) {
      console.error('Failed to stop watching:', error);
    }
  },
};

export default wails;
