import { useState } from 'react';
import { List, Clock, FileText } from 'lucide-react';
import { TableOfContents } from './TableOfContents';
import type { HeadingItem, RecentFile } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  headings: HeadingItem[];
  recentFiles: RecentFile[];
  onOpenRecentFile?: (path: string) => void;
}

type TabType = 'toc' | 'recent';

export function Sidebar({ isOpen, headings, recentFiles, onOpenRecentFile }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>('toc');

  return (
    <div 
      className={`
        sidebar flex-shrink-0 overflow-hidden transition-[width] duration-200 ease-out
        ${isOpen ? 'w-56' : 'w-0'}
      `}
    >
      <div className="w-56 h-full flex flex-col sidebar">
        <div className="flex border-b sidebar-border">
          <button
            onClick={() => setActiveTab('toc')}
            className={`sidebar-tab ${activeTab === 'toc' ? 'sidebar-tab-active' : 'sidebar-tab-inactive'}`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <List className="w-3.5 h-3.5" />
              Contents
            </span>
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`sidebar-tab ${activeTab === 'recent' ? 'sidebar-tab-active' : 'sidebar-tab-inactive'}`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Recent
            </span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'toc' ? (
            <TableOfContents headings={headings} />
          ) : (
            <div className="py-1">
              {recentFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-zinc-600">
                  <Clock className="w-6 h-6 mb-1.5" />
                  <p className="text-xs">No recent files</p>
                </div>
              ) : (
                <ul>
                  {recentFiles.map((file) => (
                    <li key={file.path}>
                      <button
                        onClick={() => onOpenRecentFile?.(file.path)}
                        className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                          <span className="text-xs text-zinc-300 truncate">{file.name}</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
