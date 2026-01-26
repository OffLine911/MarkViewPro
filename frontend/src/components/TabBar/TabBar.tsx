import { X } from 'lucide-react';
import type { Tab } from '../../hooks/useTabs';

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string | null;
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
}

export function TabBar({ tabs, activeTabId, onTabClick, onTabClose }: TabBarProps) {
  const handleClose = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    onTabClose(tabId);
  };

  return (
    <div className="flex items-center h-8 bg-zinc-900 border-b border-zinc-800 overflow-x-auto no-scrollbar">
      {tabs.map(tab => (
        <div
          key={tab.id}
          onClick={() => onTabClick(tab.id)}
          className={`
            flex items-center gap-2 px-3 py-1.5 min-w-[120px] max-w-[200px] cursor-pointer
            border-r border-zinc-800 transition-all group relative
            ${tab.id === activeTabId 
              ? 'bg-zinc-800 text-zinc-100 border-b-2 border-b-cyan-500' 
              : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
            }
          `}
        >
          <span className="flex-1 truncate text-xs font-medium">
            {tab.fileName || 'Untitled'}
          </span>
          {tab.isModified && (
            <span 
              className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" 
              title="Modified"
            />
          )}
          <button
            onClick={(e) => handleClose(e, tab.id)}
            className="flex-shrink-0 p-0.5 rounded hover:bg-zinc-700 transition-colors"
            title="Close tab (Ctrl+W)"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
