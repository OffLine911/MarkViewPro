import { useEffect, useCallback } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboard(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    for (const shortcut of shortcuts) {
      const ctrlMatch = shortcut.ctrl ? (event.ctrlKey || event.metaKey) : !event.ctrlKey && !event.metaKey;
      const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
      const altMatch = shortcut.alt ? event.altKey : !event.altKey;
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

      if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
        event.preventDefault();
        shortcut.action();
        return;
      }
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return shortcuts;
}

export function useAppKeyboard({
  onOpen,
  onSave,
  onExport,
  onToggleSidebar,
  onToggleSettings,
  onNew,
}: {
  onOpen: () => void;
  onSave: () => void;
  onExport: () => void;
  onToggleSidebar: () => void;
  onToggleSettings: () => void;
  onNew: () => void;
}) {
  const shortcuts: KeyboardShortcut[] = [
    { key: 'o', ctrl: true, action: onOpen, description: 'Open file' },
    { key: 's', ctrl: true, action: onSave, description: 'Save file' },
    { key: 'e', ctrl: true, action: onExport, description: 'Export' },
    { key: 'b', ctrl: true, action: onToggleSidebar, description: 'Toggle sidebar' },
    { key: ',', ctrl: true, action: onToggleSettings, description: 'Open settings' },
    { key: 'n', ctrl: true, action: onNew, description: 'New file' },
  ];

  return useKeyboard(shortcuts);
}
