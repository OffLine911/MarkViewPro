import { X, RotateCcw, Monitor, Sun, Moon } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings, resetSettings } = useSettings();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl w-full max-w-md mx-4 animate-fade-in">
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-100">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-5 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2">
              Theme
            </label>
            <div className="flex gap-1.5">
              {[
                { value: 'light', icon: Sun, label: 'Light' },
                { value: 'dark', icon: Moon, label: 'Dark' },
                { value: 'system', icon: Monitor, label: 'System' },
              ].map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => updateSettings({ theme: value as 'light' | 'dark' | 'system' })}
                  className={`
                    flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded text-xs font-medium transition-all
                    ${settings.theme === value
                      ? 'bg-cyan-600 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                    }
                  `}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2">
              Font Size: {settings.fontSize}px
            </label>
            <input
              type="range"
              min="12"
              max="22"
              value={settings.fontSize}
              onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-zinc-600 mt-1">
              <span>12</span>
              <span>22</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2">
              Line Height: {settings.lineHeight}
            </label>
            <input
              type="range"
              min="1.4"
              max="2.0"
              step="0.1"
              value={settings.lineHeight}
              onChange={(e) => updateSettings({ lineHeight: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-zinc-600 mt-1">
              <span>Compact</span>
              <span>Relaxed</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2">
              Font Family
            </label>
            <select
              value={settings.fontFamily}
              onChange={(e) => updateSettings({ fontFamily: e.target.value })}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-xs text-zinc-200 focus:ring-1 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="Inter">Inter</option>
              <option value="system-ui">System Default</option>
              <option value="Georgia">Georgia</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-zinc-400">
              Options
            </label>

            <label className="flex items-center justify-between p-2.5 bg-zinc-800/50 rounded cursor-pointer hover:bg-zinc-800 transition-colors">
              <span className="text-xs text-zinc-300">Line numbers in code</span>
              <input
                type="checkbox"
                checked={settings.showLineNumbers}
                onChange={(e) => updateSettings({ showLineNumbers: e.target.checked })}
                className="w-4 h-4 text-cyan-500 bg-zinc-700 border-zinc-600 rounded focus:ring-cyan-500"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 bg-zinc-800/50 rounded cursor-pointer hover:bg-zinc-800 transition-colors">
              <span className="text-xs text-zinc-300">Word wrap</span>
              <input
                type="checkbox"
                checked={settings.wordWrap}
                onChange={(e) => updateSettings({ wordWrap: e.target.checked })}
                className="w-4 h-4 text-cyan-500 bg-zinc-700 border-zinc-600 rounded focus:ring-cyan-500"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 bg-zinc-800/50 rounded cursor-pointer hover:bg-zinc-800 transition-colors">
              <span className="text-xs text-zinc-300">Auto-reload on file change</span>
              <input
                type="checkbox"
                checked={settings.autoReload}
                onChange={(e) => updateSettings({ autoReload: e.target.checked })}
                className="w-4 h-4 text-cyan-500 bg-zinc-700 border-zinc-600 rounded focus:ring-cyan-500"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 bg-zinc-800/50 rounded cursor-pointer hover:bg-zinc-800 transition-colors">
              <span className="text-xs text-zinc-300">Auto-save</span>
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => updateSettings({ autoSave: e.target.checked })}
                className="w-4 h-4 text-cyan-500 bg-zinc-700 border-zinc-600 rounded focus:ring-cyan-500"
              />
            </label>

            {settings.autoSave && (
              <div className="pl-2.5">
                <label className="block text-xs font-medium text-zinc-400 mb-2">
                  Auto-save delay: {settings.autoSaveDelay / 1000}s
                </label>
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  step="1000"
                  value={settings.autoSaveDelay}
                  onChange={(e) => updateSettings({ autoSaveDelay: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] text-zinc-600 mt-1">
                  <span>1s</span>
                  <span>10s</span>
                </div>
              </div>
            )}

            <label className="flex items-center justify-between p-2.5 bg-zinc-800/50 rounded cursor-pointer hover:bg-zinc-800 transition-colors">
              <span className="text-xs text-zinc-300">Sync scroll (split view)</span>
              <input
                type="checkbox"
                checked={settings.syncScroll}
                onChange={(e) => updateSettings({ syncScroll: e.target.checked })}
                className="w-4 h-4 text-cyan-500 bg-zinc-700 border-zinc-600 rounded focus:ring-cyan-500"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 bg-zinc-800/50 rounded cursor-pointer hover:bg-zinc-800 transition-colors">
              <span className="text-xs text-zinc-300">Spell check</span>
              <input
                type="checkbox"
                checked={settings.spellCheck}
                onChange={(e) => updateSettings({ spellCheck: e.target.checked })}
                className="w-4 h-4 text-cyan-500 bg-zinc-700 border-zinc-600 rounded focus:ring-cyan-500"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 bg-zinc-800/50 rounded cursor-pointer hover:bg-zinc-800 transition-colors">
              <div className="flex flex-col">
                <span className="text-xs text-zinc-300">Open files in new tab</span>
                <span className="text-[10px] text-zinc-500">When disabled, opens files in new window</span>
              </div>
              <input
                type="checkbox"
                checked={settings.openInNewTab}
                onChange={(e) => updateSettings({ openInNewTab: e.target.checked })}
                className="w-4 h-4 text-cyan-500 bg-zinc-700 border-zinc-600 rounded focus:ring-cyan-500"
              />
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800 bg-zinc-900/50 rounded-b-lg">
          <button
            onClick={resetSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>

          <button onClick={onClose} className="btn-primary">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
