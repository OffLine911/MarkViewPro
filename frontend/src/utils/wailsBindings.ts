declare global {
  interface Window {
    go?: {
      main?: {
        App?: {
          OpenFile: () => Promise<{ content: string; path: string; name: string }>;
          SaveFile: (path: string, content: string) => Promise<void>;
          ExportToPDF: (path: string) => Promise<void>;
          ExportToHTML: (content: string, path: string) => Promise<void>;
          GetRecentFiles: () => Promise<Array<{ path: string; name: string; lastOpened: string }>>;
          OpenFileDialog: () => Promise<string>;
          SaveFileDialog: (defaultName: string) => Promise<string>;
          ReadFileByPath: (path: string) => Promise<string>;
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

export const wails = {
  async openFile(): Promise<{ content: string; path: string; name: string } | null> {
    try {
      if (window.go?.main?.App?.OpenFile) {
        return await window.go.main.App.OpenFile();
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

  async exportToHTML(content: string, path: string): Promise<boolean> {
    try {
      if (window.go?.main?.App?.ExportToHTML) {
        await window.go.main.App.ExportToHTML(content, path);
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
        return files.map(f => ({
          ...f,
          lastOpened: new Date(f.lastOpened),
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
        const content = await window.go.main.App.ReadFileByPath(path);
        const name = path.split(/[/\\]/).pop() || 'Unknown';
        return { content, path, name };
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
};

export default wails;
